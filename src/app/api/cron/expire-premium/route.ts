import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const payload = await getPayloadClient()
        const now = new Date()

        // Find the free plan
        const { docs: freePlans } = await payload.find({
            collection: 'pricing-plans',
            where: { isPremium: { equals: false } },
            limit: 1,
        })

        if (freePlans.length === 0) {
            payload.logger.error('[ExpirePremium] Nie znaleziono planu Free w bazie.')
            return NextResponse.json({ error: 'Nie znaleziono planu Free.' }, { status: 500 })
        }

        const freePlanId = freePlans[0].id

        // Find organizers whose premium has expired and who don't have an active Stripe subscription.
        // Active Stripe subscriptions are managed via webhooks — we skip them here.
        const { docs: expiredOrganizers } = await payload.find({
            collection: 'organizers',
            where: {
                and: [
                    { premiumExpiresAt: { less_than: now.toISOString() } },
                    {
                        or: [
                            { stripeSubscriptionStatus: { exists: false } },
                            { stripeSubscriptionStatus: { not_in: ['active', 'trialing'] } },
                        ],
                    },
                ],
            },
            depth: 1,
            limit: 100,
        })

        payload.logger.info(`[ExpirePremium] Znaleziono ${expiredOrganizers.length} organizatorów z wygasłym Premium.`)

        const orgResults = await Promise.allSettled(
            expiredOrganizers.map(async (org) => {
                const currentPlanId = typeof org.plan === 'object' ? org.plan?.id : org.plan

                // Skip if already on free plan (nothing to do)
                if (currentPlanId === freePlanId || !currentPlanId) return

                payload.logger.info(`[ExpirePremium] Downgrade organizer: ${org.name} (ID: ${org.id})`)

                await payload.update({
                    collection: 'organizers',
                    id: org.id,
                    data: { plan: freePlanId },
                    overrideAccess: true,
                })
                // syncUserPlan hook fires automatically and propagates 'free'
                // to all places and events linked to this organizer
            })
        )

        // Also expire places with a direct premiumExpiresAt (e.g. imported places, demo premium).
        const { docs: expiredPlaces } = await payload.find({
            collection: 'places',
            where: {
                and: [
                    { plan: { equals: 'premium' } },
                    { premiumExpiresAt: { less_than: now.toISOString() } },
                ],
            },
            limit: 200,
            depth: 1,
        })

        payload.logger.info(`[ExpirePremium] Znaleziono ${expiredPlaces.length} miejsc z wygasłym Premium.`)

        const placeResults = await Promise.allSettled(
            expiredPlaces.map(async (place) => {
                // Skip if organizer has an active Stripe subscription — renewal webhook may be delayed
                const org = typeof place.organizer === 'object' ? place.organizer : null
                if (org && (org.stripeSubscriptionStatus === 'active' || org.stripeSubscriptionStatus === 'trialing')) {
                    payload.logger.info(`[ExpirePremium] Skip place ${place.id} — organizer has active subscription`)
                    return
                }
                payload.logger.info(`[ExpirePremium] Downgrade place: ${place.name} (ID: ${place.id})`)
                await payload.update({
                    collection: 'places',
                    id: place.id,
                    data: { plan: 'free' },
                    overrideAccess: true,
                    context: { skipRevalidation: true },
                })
            })
        )

        const downgraded = orgResults.filter((r) => r.status === 'fulfilled').length
        const failed = orgResults.filter((r) => r.status === 'rejected').length
        const placesDowngraded = placeResults.filter((r) => r.status === 'fulfilled').length
        const placesFailed = placeResults.filter((r) => r.status === 'rejected').length

        return NextResponse.json({
            organizers: { checked: expiredOrganizers.length, downgraded, failed },
            places: { checked: expiredPlaces.length, downgraded: placesDowngraded, failed: placesFailed },
        })
    } catch (error) {
        console.error('[ExpirePremium] Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
