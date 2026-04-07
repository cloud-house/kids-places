
import { getPayloadClient } from '@/lib/payload-client'
import { cache } from 'react'

export const getPageBySlug = cache(async (slug: string) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'pages',
        where: {
            slug: { equals: slug },
            status: { equals: 'published' }
        },
        limit: 1,
        depth: 2
    })
    return docs[0] || null
})
