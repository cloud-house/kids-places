import React from 'react';
import { getPricingPlans } from '../service';
import { getPayloadClient } from '@/lib/payload-client';
import { headers } from 'next/headers';
import { PricingContent } from './PricingContent';

export const Pricing = async () => {
    const plans = await getPricingPlans();
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    return <PricingContent plans={plans} isLoggedIn={!!user} />;
};
