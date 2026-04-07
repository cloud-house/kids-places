import { getPayloadClient } from '@/lib/payload-client';
import { PricingPlan } from '@/payload-types';

export async function getPricingPlans(): Promise<PricingPlan[]> {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: 'pricing-plans',
        sort: 'planPrice_recurring',
    });
    return docs;
}

export async function getPricingPlanByName(name: string): Promise<PricingPlan | null> {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: 'pricing-plans',
        where: {
            name: { equals: name }
        },
        limit: 1,
    });
    return docs[0] || null;
}
