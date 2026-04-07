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

        const results = await Promise.allSettled(
            expiredOrganizers.map(async (org) => {
                const currentPlanId = typeof org.plan === 'object' ? org.plan?.id : org.plan

                // Skip if already on free plan (nothing to do)
                if (currentPlanId === freePlanId || !currentPlanId) return

                payload.logger.info(`[ExpirePremium] Downgrade: ${org.name} (ID: ${org.id})`)

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

        const downgraded = results.filter((r) => r.status === 'fulfilled').length
        const failed = results.filter((r) => r.status === 'rejected').length

        return NextResponse.json({
            checked: expiredOrganizers.length,
            downgraded,
            failed,
        })
    } catch (error) {
        console.error('[ExpirePremium] Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
