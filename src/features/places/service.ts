
import { getPayloadClient } from '@/lib/payload-client'
import { buildCommonWhere } from '@/lib/utils/payload'
import { cache } from 'react'

export const getPlaces = cache(async (options?: {
    limit?: number;
    page?: number;
    categorySlug?: string;
    q?: string;
    city?: string;
    sort?: string;
    attributes?: Record<string, string>;
    isPoland?: boolean;
}) => {
    const { limit = 12, page = 1, sort = '-createdAt' } = options || {}
    const payload = await getPayloadClient()

    const where = buildCommonWhere({
        ...(options || {}),
        searchFields: ['name', 'shortDescription'],
        cityFields: ['city.name', 'city.slug']
    });

    where._status = { equals: 'published' }

    const { docs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = await payload.find({
        collection: 'places',
        limit,
        page,
        where,
        sort: ['-plan', ...(Array.isArray(sort) ? sort : [sort])],
        depth: 2,
    })

    return { docs, totalPages, page, hasNextPage, hasPrevPage, nextPage, prevPage }
})

export const getFeaturedPlaces = cache(async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'places',
        where: {
            _status: { equals: 'published' },
        },
        sort: ['-plan', '-createdAt'],
        limit: 4,
        depth: 2,
    })
    return docs
})

export const getPlaceBySlug = cache(async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'places',
        where: {
            slug: { equals: slug },
            _status: { equals: 'published' }
        },
        limit: 1,
        depth: 2
    })
    return docs[0] || null
})

export const getPlacesByIds = cache(async (ids: (string | number)[]) => {
    if (!ids || ids.length === 0) return []
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'places',
        where: {
            id: { in: ids },
            _status: { equals: 'published' },
        },
        depth: 2,
    })
    return docs
})
