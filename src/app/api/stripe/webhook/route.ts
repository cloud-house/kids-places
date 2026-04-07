import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPayloadClient } from '@/lib/payload-client';
import { revalidatePath } from 'next/cache';
import { Organizer } from '@/payload-types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

interface StripeSubscriptionExt extends Stripe.Subscription {
    current_period_end: number;
}


export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`Webhook signature verification failed: ${message}`);
        return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
    }

    const payload = await getPayloadClient();

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const organizerIdStr = session.metadata?.organizerId;
                const planIdStr = session.metadata?.planId;

                if (organizerIdStr) {
                    const organizerId = Number(organizerIdStr);
                    const planId = planIdStr ? Number(planIdStr) : null;

                    if (session.mode === 'payment') {
                        // One-time payment: stack 30 days onto existing premium or start from now
                        const existingOrg = await payload.findByID({
                            collection: 'organizers',
                            id: organizerId,
                        });

                        let baseDate = new Date();
                        if (existingOrg.premiumExpiresAt) {
                            const existingExpiry = new Date(existingOrg.premiumExpiresAt);
                            if (existingExpiry > baseDate) {
                                baseDate = existingExpiry;
                            }
                        }

                        const interval = session.metadata?.interval || 'month';
                        if (interval === 'year') {
                            baseDate.setFullYear(baseDate.getFullYear() + 1);
                        } else {
                            baseDate.setMonth(baseDate.getMonth() + 1);
                        }

                        await payload.update({
                            collection: 'organizers',
                            id: organizerId,
                            data: {
                                stripeCustomerId: session.customer as string,
                                premiumExpiresAt: baseDate.toISOString(),
                                plan: planId,
                                collectionMethod: 'send_invoice',
                            },
                        });
                    } else if (session.mode === 'subscription' && session.subscription) {
                        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as unknown as StripeSubscriptionExt;
                        await payload.update({
                            collection: 'organizers',
                            id: organizerId,
                            data: {
                                stripeCustomerId: session.customer as string,
                                stripeSubscriptionId: session.subscription as string,
                                stripeSubscriptionStatus: subscription.status as Organizer['stripeSubscriptionStatus'],
                                premiumExpiresAt: new Date(subscription.current_period_end * 1000).toISOString(),
                                plan: planId,
                                collectionMethod: 'charge_automatically',
                            },
                        });
                    }

                    // Revalidate dashboard
                    revalidatePath('/moje-konto', 'page');
                    console.log(`✅ Webhook: Checkout session completed for organizer ${organizerId}. Plan: ${planId}`);
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;
                const priceId = subscription.items.data[0]?.price.id;

                const organizers = await payload.find({
                    collection: 'organizers',
                    where: { stripeCustomerId: { equals: customerId } },
                });

                if (organizers.docs.length > 0) {
                    const subscriptionExt = subscription as unknown as StripeSubscriptionExt;
                    const updateData: Partial<Organizer> = {
                        stripeSubscriptionStatus: subscriptionExt.status as Organizer['stripeSubscriptionStatus'],
                        stripeSubscriptionId: subscriptionExt.id,
                        premiumExpiresAt: new Date(subscriptionExt.current_period_end * 1000).toISOString(),
                    };

                    // Try to find the plan by price ID to sync it correctly
                    if (priceId) {
                        const plans = await payload.find({
                            collection: 'pricing-plans',
                            where: {
                                or: [
                                    { stripePriceId_recurring: { equals: priceId } },
                                    { stripePriceId_onetime: { equals: priceId } },
                                    { stripePriceId_annual_recurring: { equals: priceId } },
                                    { stripePriceId_annual_onetime: { equals: priceId } },
                                ],
                            },
                            limit: 1,
                        });

                        if (plans.docs.length > 0) {
                            updateData.plan = plans.docs[0].id as unknown as number;
                        }
                    }

                    await payload.update({
                        collection: 'organizers',
                        id: organizers.docs[0].id,
                        data: updateData,
                    });

                    // Revalidate dashboard
                    revalidatePath('/moje-konto', 'page');
                    console.log(`✅ Webhook: Subscription updated for customer ${customerId}. Plan: ${updateData.plan}`);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const customerId = subscription.customer as string;

                const organizers = await payload.find({
                    collection: 'organizers',
                    where: { stripeCustomerId: { equals: customerId } },
                });

                if (organizers.docs.length > 0) {
                    await payload.update({
                        collection: 'organizers',
                        id: organizers.docs[0].id,
                        data: {
                            stripeSubscriptionStatus: 'canceled',
                            stripeSubscriptionId: null,
                            // We do NOT clear the plan here to allow access until premiumExpiresAt
                        },
                    });
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                // Invoicing is now handled manually or by external systems
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
    }
}
