import { getPayloadClient } from '@/lib/payload-client'

export async function getOrganizerInquiries(userId: number) {
    const payload = await getPayloadClient()

    // 1. Fetch all entities owned by the user
    const [places, events] = await Promise.all([
        payload.find({
            collection: 'places',
            where: { owner: { equals: userId } },
            pagination: false,
            depth: 0,
        }),
        payload.find({
            collection: 'events',
            where: { owner: { equals: userId } },
            pagination: false,
            depth: 0,
        }),
    ])

    const sourceIds = [
        ...places.docs.map(doc => String(doc.id)),
        ...events.docs.map(doc => String(doc.id)),
    ]

    if (sourceIds.length === 0) {
        return []
    }

    // 2. Fetch inquiries for these entities
    const inquiries = await payload.find({
        collection: 'inquiries',
        where: {
            sourceId: {
                in: sourceIds,
            },
        },
        sort: '-createdAt',
    })

    // 3. Enhance inquiries with source details manually since sourceId is text, not strict relationship
    // We want to know WHAT the user signed up for.
    const enhancedInquiries = inquiries.docs.map((inquiry) => {
        let sourceName = 'Nieznane źródło'

        if (inquiry.sourceType === 'places') {
            const place = places.docs.find(p => String(p.id) === inquiry.sourceId)
            if (place) sourceName = place.name
        } else if (inquiry.sourceType === 'events') {
            const event = events.docs.find(e => String(e.id) === inquiry.sourceId)
            if (event) sourceName = event.title
        }

        return {
            ...inquiry,
            sourceName
        }
    })

    return enhancedInquiries
}
