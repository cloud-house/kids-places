import { getPayloadClient } from '@/lib/payload-client'
import { cache } from 'react'
import { Where } from 'payload'

export const getCategories = cache(async (scope?: 'all' | 'place' | 'event', featuredOnly?: boolean) => {
    const payload = await getPayloadClient()

    // Build where clause
    const where: Where = {}

    // Add scope filter if provided
    if (scope && scope !== 'all') {
        where.scopes = { in: [scope] }
    }

    // Add featured filter if requested
    if (featuredOnly) {
        where.isFeatured = { equals: true }
    }

    const { docs } = await payload.find({
        collection: 'categories',
        where: Object.keys(where).length > 0 ? where : {},
        depth: 1,
        pagination: false,
    })
    return docs
})

export const getCategoryBySlug = cache(async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'categories',
        where: {
            slug: { equals: slug }
        },
        limit: 1,
        depth: 1
    })
    return docs[0] || null
})
