import { CollectionAfterChangeHook, Where } from 'payload'
import { Place, Event, Organizer } from '@/payload-types'

export const syncUserPlan: CollectionAfterChangeHook = async ({ req, doc, previousDoc, operation }) => {
    // This hook now works with the Organizers collection
    const org = doc as Organizer;

    // Only proceed if the plan has changed
    const planId = typeof org.plan === 'object' ? org.plan?.id : org.plan;
    const previousPlanId = typeof previousDoc?.plan === 'object' ? previousDoc?.plan?.id : previousDoc?.plan;

    if (operation === 'update' && planId === previousPlanId) {
        return doc;
    }

    try {
        let isPremium = false;
        if (planId) {
            const pricingPlan = await req.payload.findByID({
                collection: 'pricing-plans',
                id: planId,
            });
            isPremium = pricingPlan?.isPremium === true;
        }

        const newPlanStatus: 'free' | 'premium' = isPremium ? 'premium' : 'free';

        // Update all items linked to this organizer
        const whereClause: Where = {
            organizer: { equals: org.id }
        };

        req.payload.logger.info({ msg: `[SyncPlan] Syncing plan "${newPlanStatus}" for organization "${org.name}" (ID: ${org.id}) to all linked items.` });

        // Update all related collections
        await Promise.all([
            req.payload.update({
                collection: 'places',
                where: whereClause,
                data: { plan: newPlanStatus } as unknown as Partial<Place>,
            }),
            req.payload.update({
                collection: 'events',
                where: whereClause,
                data: { plan: newPlanStatus } as unknown as Partial<Event>,
            }),
        ]);

    } catch (error) {
        req.payload.logger.error({ err: error, msg: `[SyncPlan] Error syncing plan for organization ${org.name}` });
    }

    return doc;
}
