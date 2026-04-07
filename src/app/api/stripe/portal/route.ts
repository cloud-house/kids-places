import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getPayloadClient } from '@/lib/payload-client';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
});

export async function POST() {
    try {
        const payload = await getPayloadClient();
        const { user } = await payload.auth({ headers: await headers() });

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch organizer to get stripeCustomerId
        const organizers = await payload.find({
            collection: 'organizers',
            where: {
                owner: { equals: user.id },
            },
            limit: 1,
        });

        const organizer = organizers.docs[0];

        if (!organizer || !organizer.stripeCustomerId) {
            return NextResponse.json({ error: 'Nie masz jeszcze historii płatności.' }, { status: 400 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: organizer.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/moje-konto`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Portal Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}
