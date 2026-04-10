import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPayloadClient } from '@/lib/payload-client';
import { revalidatePath } from 'next/cache';
import type { Payload } from 'payload';
import { Organizer } from '@/payload-types';

/** Syncs premium status from organizer to all their places. */
async function syncPlacesPremium(payload: Payload, organizerId: number, premiumExpiresAt: string | null) {
    const places = await payload.find({
        collection: 'places',
        where: { organizer: { equals: organizerId } },
        limit: 100,
        depth: 0,
    });
    for (const place of places.docs) {
        await payload.update({
            collection: 'places',
            id: place.id,
            data: {
                plan: premiumExpiresAt ? 'premium' : 'free',
                premiumExpiresAt: premiumExpiresAt ?? undefined,
            },
            overrideAccess: true,
            context: { skipRevalidation: true },
        });
    }
    payload.logger.info(`[stripe/webhook] Synced premium to ${places.docs.length} places for organizer ${organizerId}`);
}

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

                        const expiresAt = baseDate.toISOString();
                        await payload.update({
                            collection: 'organizers',
                            id: organizerId,
                            data: {
                                stripeCustomerId: session.customer as string,
                                premiumExpiresAt: expiresAt,
                                plan: planId,
                                collectionMethod: 'send_invoice',
                            },
                        });
                        await syncPlacesPremium(payload, organizerId, expiresAt);
                    } else if (session.mode === 'subscription' && session.subscription) {
                        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as unknown as StripeSubscriptionExt;
                        const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
                        await payload.update({
                            collection: 'organizers',
                            id: organizerId,
                            data: {
                                stripeCustomerId: session.customer as string,
                                stripeSubscriptionId: session.subscription as string,
                                stripeSubscriptionStatus: subscription.status as Organizer['stripeSubscriptionStatus'],
                                premiumExpiresAt: expiresAt,
                                plan: planId,
                                collectionMethod: 'charge_automatically',
                            },
                        });
                        await syncPlacesPremium(payload, organizerId, expiresAt);
                    }

                    // Revalidate dashboard
                    revalidatePath('/moje-konto', 'page');
                    payload.logger.info(`Webhook: Checkout session completed for organizer ${organizerId}. Plan: ${planId}`);
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
                    await syncPlacesPremium(payload, organizers.docs[0].id, updateData.premiumExpiresAt ?? null);

                    // Revalidate dashboard
                    revalidatePath('/moje-konto', 'page');
                    payload.logger.info(`Webhook: Subscription updated for customer ${customerId}. Plan: ${updateData.plan}`);
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
                        },
                    });
                    // Places keep their premiumExpiresAt until it naturally expires
                }
                break;
            }

            case 'invoice.payment_succeeded': {
                // Invoicing is now handled manually or by external systems
                break;
            }

            default:
                payload.logger.warn(`Webhook: Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        payload.logger.error({ err: error }, 'Error processing webhook');
        return NextResponse.json({ error: 'Error processing webhook' }, { status: 500 });
    }
}
