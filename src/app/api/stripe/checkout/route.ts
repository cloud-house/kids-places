import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPayloadClient } from '@/lib/payload-client';
import { headers } from 'next/headers';
import { PricingPlan } from '@/payload-types';

interface ExtendedPricingPlan extends PricingPlan {
    stripePriceId_annual_recurring?: string | null;
    stripePriceId_annual_onetime?: string | null;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

export async function POST(req: NextRequest) {
    try {
        const payload = await getPayloadClient();
        const { user } = await payload.auth({ headers: await headers() });

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only organizers can purchase plans
        if (!user.roles?.includes('organizer') && !user.roles?.includes('admin')) {
            return NextResponse.json({ error: 'Tylko organizatorzy mogą zakupić plan Premium.' }, { status: 403 });
        }

        const { planId, mode, listingId, listingType, interval } = await req.json();

        if (!planId) {
            return NextResponse.json({ error: 'Missing planId' }, { status: 400 });
        }

        const isRecurring = mode === 'recurring';

        // Fetch user's organizer in parallel with plan
        const [plan, organizers] = await Promise.all([
            payload.find({
                collection: 'pricing-plans',
                where: { id: { equals: planId } },
                limit: 1,
            }).then(res => res.docs[0]),
            payload.find({
                collection: 'organizers',
                where: { owner: { equals: user.id } },
                limit: 1,
            }),
        ]);

        const organizer = organizers.docs[0];

        if (!plan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        if (!organizer) {
            return NextResponse.json({ error: 'Nie znaleziono profilu organizatora. Uzupełnij dane profilu.' }, { status: 404 });
        }

        // Block duplicate subscriptions on Organizer
        if (isRecurring && organizer.stripeSubscriptionStatus === 'active' && organizer.stripeSubscriptionId) {
            return NextResponse.json({
                error: 'Twoja organizacja ma już aktywną subskrypcję. Przejdź do Faktur i Płatności, aby zarządzać planem.'
            }, { status: 400 });
        }

        const isAnnual = interval === 'year';
        const pricingPlan = plan as ExtendedPricingPlan;
        const stripePriceId = isAnnual
            ? (isRecurring ? pricingPlan.stripePriceId_annual_recurring : pricingPlan.stripePriceId_annual_onetime)
            : (isRecurring ? pricingPlan.stripePriceId_recurring : pricingPlan.stripePriceId_onetime);

        if (!stripePriceId) {
            return NextResponse.json({ error: 'Price not configured for this mode' }, { status: 400 });
        }

        const isSubscription = isRecurring;

        let customerId = organizer.stripeCustomerId;

        // If organization doesn't have a Stripe Customer ID, create one
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: organizer.name,
                metadata: {
                    userId: user.id.toString(),
                    organizerId: organizer.id.toString(),
                },
            });
            customerId = customer.id;

            // Save the new customer ID to the organizer record
            await payload.update({
                collection: 'organizers',
                id: organizer.id,
                data: {
                    stripeCustomerId: customerId,
                },
            });
        }

        const checkoutConfig: Stripe.Checkout.SessionCreateParams = {
            customer: customerId,
            mode: isSubscription ? 'subscription' : 'payment',
            payment_method_types: isSubscription ? ['card'] : ['card', 'blik', 'p24'],
            line_items: [
                {
                    price: stripePriceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/moje-konto?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/moje-konto?canceled=true`,
            metadata: {
                userId: user.id.toString(),
                organizerId: organizer.id.toString(),
                sourceListingId: listingId || '',
                sourceListingType: listingType || '',
                planId: planId.toString(),
                mode: mode,
                interval: interval || 'month',
            },
        };

        // If it's a subscription, anchor it to the user
        if (isSubscription) {
            const subscriptionData: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
                metadata: {
                    userId: user.id.toString(),
                }
            };

            // Anchoring: If user has a future premiumExpiresAt, set it as trial_end
            if (organizer.premiumExpiresAt) {
                const expiryDate = new Date(organizer.premiumExpiresAt);
                const now = new Date();
                if (expiryDate > now) {
                    subscriptionData.trial_end = Math.floor(expiryDate.getTime() / 1000);
                }
            }

            checkoutConfig.subscription_data = subscriptionData;
        }

        const session = await stripe.checkout.sessions.create(checkoutConfig);

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 });
    }
}
