import { getPayloadClient } from '@/lib/payload-client'
import { cache } from 'react'

export const getAttributes = cache(async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'attributes',
        depth: 2,
        pagination: false,
    })
    return docs
})
