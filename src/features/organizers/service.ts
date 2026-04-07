
import { getPayloadClient } from '@/lib/payload-client'
import { cache } from 'react'

export const getOrganizers = cache(async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
        collection: 'organizers',
        depth: 2,
    })
    return docs
})
