import { FieldHook, Where } from 'payload'
import { formatSlug } from '../../lib/utils/formatSlug'

export const ensureUniqueSlug = (field: string): FieldHook =>
    async ({ value, originalDoc, data, req, collection }) => {
        // 1. Determine the candidate slug
        let candidateSlug = ''

        if (typeof value === 'string' && value) {
            candidateSlug = formatSlug(value)
        } else if (value && typeof value === 'object' && 'pl' in value) {
            candidateSlug = formatSlug(value.pl as string)
        } else if (data && field in data && data[field]) {
            if (typeof data[field] === 'string') {
                candidateSlug = formatSlug(data[field])
            } else if (typeof data[field] === 'object' && data[field] && 'pl' in data[field]) {
                candidateSlug = formatSlug(data[field].pl as string)
            }
        } else {
            // If no value and no source field data, keep existing or return undefined
            return value
        }

        // 2. Check for existence in DB
        // We need to query the collection to see if this slug exists
        if (collection) {
            const query: Where = {
                slug: {
                    equals: candidateSlug,
                },
            }

            // Exclude current document if updating
            if (originalDoc?.id) {
                query.id = {
                    not_equals: originalDoc.id,
                }
            }

            const existing = await req.payload.find({
                collection: collection.slug,
                where: query,
                limit: 1, // We only need to know if at least one exists
            })

            // 3. If exists, append timestamp
            if (existing.totalDocs > 0) {
                candidateSlug = `${candidateSlug}-${Date.now()}`
            }
        }

        return candidateSlug
    }
