
import { getPayloadClient } from '@/lib/payload-client'
import { buildCommonWhere } from '@/lib/utils/payload'
import { cache } from 'react'

export const getEvents = cache(async (options?: {
    limit?: number;
    page?: number;
    categorySlug?: string;
    q?: string;
    city?: string;
    sort?: string;
    attributes?: Record<string, string>;
}) => {
    const { limit = 12, page = 1, sort = 'startDate' } = options || {}
    const payload = await getPayloadClient()

    const where = buildCommonWhere({
        ...(options || {}),
        searchFields: ['title', 'description'],
        cityFields: ['place.city.name', 'place.city.slug']
    });

    // Add event specific filters
    where.startDate = { greater_than_equal: new Date().toISOString() }
    where._status = { equals: 'published' }

    const { docs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = await payload.find({
        collection: 'events',
        limit,
        page,
        where,
        sort: ['-plan', ...(Array.isArray(sort) ? sort : [sort])],
        depth: 2,
    })
    return { docs, totalPages, page, hasNextPage, hasPrevPage, nextPage, prevPage }
})

export const getEventBySlug = cache(async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'events',
        where: {
            slug: { equals: slug },
            _status: { equals: 'published' }
        },
        limit: 1,
        depth: 2
    })
    return docs[0] || null
})

export const getEventsForPlace = cache(async (placeId: string | number) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'events',
        where: {
            place: { equals: placeId },
            _status: { equals: 'published' },
            startDate: { greater_than_equal: new Date().toISOString() }
        },
        sort: 'startDate',
        depth: 1
    })
    return docs
})

export const getEventsByIds = cache(async (ids: (string | number)[]) => {
    if (!ids || ids.length === 0) return []
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'events',
        where: {
            id: { in: ids },
            _status: { equals: 'published' },
        },
        depth: 2,
    })
    return docs
})
