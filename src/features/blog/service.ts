
import { getPayloadClient } from '@/lib/payload-client'
import { cache } from 'react'
import { Where } from 'payload'

export const getPosts = cache(async (options?: {
    limit?: number;
    page?: number;
    categorySlug?: string;
    sort?: string;
}) => {
    const { limit = 10, page = 1, sort = '-createdAt', categorySlug } = options || {}
    const payload = await getPayloadClient()

    const where: Where = {
        _status: {
            equals: 'published',
        },
    }

    if (categorySlug) {
        where['category.slug'] = { equals: categorySlug }
    }

    const { docs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } = await payload.find({
        collection: 'posts',
        limit,
        page,
        where,
        sort,
        depth: 2,
    })

    return { docs, totalPages, page, hasNextPage, hasPrevPage, nextPage, prevPage }
})

export const getPostBySlug = cache(async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'posts',
        where: {
            slug: { equals: slug },
            _status: { equals: 'published' }
        },
        limit: 1,
        depth: 2
    })
    return docs[0] || null
})

export const getPostCategories = cache(async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'post-categories',
        depth: 1,
        pagination: false,
    })
    return docs
})
