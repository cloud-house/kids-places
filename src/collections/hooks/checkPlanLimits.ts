import { CollectionBeforeChangeHook } from 'payload'
import { PricingPlan, Config } from '../../payload-types'

export const checkPlanLimits = (limitField: 'maxPlaces' | 'maxEvents'): CollectionBeforeChangeHook =>
    async ({ req, operation, collection }) => {
        if (operation !== 'create') return
        if (!req.user) return

        // Bypass check for admins
        if (req.user.roles?.includes('admin')) return

        // Fetch organizer to check plan limits
        const organizers = await req.payload.find({
            collection: 'organizers',
            where: {
                owner: { equals: req.user.id },
            },
            limit: 1,
            depth: 1,
        })

        const organizer = organizers.docs[0];

        // If no organizer found (shouldn't happen for valid users creating content), default to free limits
        const plan = organizer?.plan as PricingPlan | null | undefined
        const isPaidPlan = plan?.isPremium === true
        const expiryDate = organizer?.premiumExpiresAt ? new Date(organizer.premiumExpiresAt) : null
        const isExpired = expiryDate ? expiryDate < new Date() : false

        // Determine effective limit
        let limit = plan?.[limitField] ?? (limitField === 'maxPlaces' ? 1 : 0)

        // If plan is paid but expired, revert to free limits. 
        if (isPaidPlan && isExpired) {
            limit = limitField === 'maxPlaces' ? 1 : 0
        }

        if (limit === -1) return // Unlimited

        const { totalDocs } = await req.payload.count({
            collection: collection.slug as keyof Config['collections'],
            where: {
                owner: { equals: req.user.id }
            }
        })

        if (totalDocs >= limit) {
            throw new Error(`Osiągnięto limit dla Twojego planu (${limit}).`)
        }
    }
