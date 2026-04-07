import type { CollectionAfterChangeHook } from 'payload'
import { formatSlug } from '../../lib/utils/formatSlug'

export const createDefaultOrganizer: CollectionAfterChangeHook = async ({
    doc,
    req,
}) => {
    // Run on creation or update if role changed to organizer
    const isOrganizer = doc.roles?.includes('organizer')
    if (!isOrganizer) return

    const { payload } = req

    try {
        // Check if organizer already exists (paranoia check)
        const existing = await payload.find({
            collection: 'organizers',
            where: {
                owner: { equals: doc.id },
            },
            limit: 1,
        })

        if (existing.docs.length > 0) return

        // Create default organizer
        const orgName = doc.organizerName || `Organizacja ${doc.name || ''}`.trim()

        await payload.create({
            collection: 'organizers',
            data: {
                name: orgName,
                owner: doc.id,
                slug: formatSlug(orgName),
                email: doc.email,
            },
            req, // Reuse req for context
        })

        req.payload.logger.info(`Created default organizer for user ${doc.email}`)
    } catch (error) {
        req.payload.logger.error({ err: error }, 'Failed to create default organizer')
    }
}
