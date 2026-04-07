import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getPayloadClient } from '@/lib/payload-client';
import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface CheckoutPageProps {
    searchParams: Promise<{
        planId?: string;
        mode?: string;
        interval?: string;
    }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
    const { planId, mode, interval } = await searchParams;
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) {
        redirect(`/login?redirect=/checkout?planId=${planId}&mode=${mode}&interval=${interval}`);
    }

    if (!user.roles?.includes('organizer') && !user.roles?.includes('admin')) {
        return (
            <div className="flex-grow w-full bg-gray-50 flex items-center justify-center p-6 py-20">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
                    <h1 className="text-xl font-bold mb-4">Dostęp tylko dla organizatorów</h1>
                    <p className="text-gray-500 mb-6">Zaloguj się jako organizator, aby zakupić plan.</p>
                </div>
            </div>
        );
    }

    if (!planId) {
        redirect('/dla-biznesu/cennik-premium');
    }

    // Fetch plan details
    const plan = await payload.findByID({
        collection: 'pricing-plans',
        id: Number(planId),
    });

    if (!plan) {
        notFound();
    }

    // Fetch organizer
    const organizers = await payload.find({
        collection: 'organizers',
        where: {
            owner: { equals: user.id },
        },
        limit: 1,
    });

    const organizer = organizers.docs[0];

    if (!organizer) {
        return (
            <div className="flex-grow w-full bg-gray-50 flex items-center justify-center p-6 py-20">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md">
                    <h1 className="text-xl font-bold mb-4">Brak profilu organizatora</h1>
                    <p className="text-gray-500 mb-6">Uzupełnij swój profil, aby kontynuować.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow w-full bg-gray-50 pb-24 pt-8">
            <div className="max-w-7xl mx-auto px-6">
                <Breadcrumbs
                    items={[
                        { label: 'Dla Biznesu', href: '/dla-biznesu' },
                        { label: 'Cennik Premium', href: '/dla-biznesu/cennik-premium' },
                        { label: 'Podsumowanie' }
                    ]}
                    className="mb-8"
                />

                <h1 className="text-3xl font-black text-gray-900 mb-8">Podsumowanie zamówienia</h1>

                <CheckoutForm
                    plan={plan}
                    organizer={organizer}
                    mode={mode as 'recurring' | 'onetime' || 'recurring'}
                    interval={interval as 'month' | 'year' || 'month'}
                />
            </div>
        </div>
    );
}
