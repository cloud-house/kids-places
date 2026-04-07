import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
    slug: 'reviews',
    admin: {
        useAsTitle: 'content',
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => {
            return Boolean(user)
        },
        update: ({ req: { user } }) => {
            if (!user) return false
            if (user.roles?.includes('admin')) return true
            // Organizers can update reviews (field-level access restricts them to reply only)
            if (user.roles?.includes('organizer')) return true
            // Parents can only update their own reviews
            return { user: { equals: user.id } }
        },
        delete: ({ req: { user } }) => {
            if (user?.roles?.includes('admin')) return true
            return {
                'user': {
                    equals: user?.id
                }
            }
        }
    },
    fields: [
        {
            name: 'place',
            type: 'relationship',
            relationTo: 'places',
            required: true,
            index: true,
            access: {
                update: () => false,
            }
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: true,
            access: {
                update: () => false,
            },
            defaultValue: ({ req: { user } }) => user?.id,
        },
        {
            name: 'rating',
            type: 'number',
            required: true,
            min: 1,
            max: 5,
            access: {
                update: ({ req: { user }, doc }) => {
                    if (!user) return false
                    if (user.roles?.includes('admin')) return true
                    const authorId = typeof doc?.user === 'object' ? (doc.user as { id: number }).id : doc?.user
                    return user.id === authorId
                }
            }
        },
        {
            name: 'content',
            type: 'textarea',
            required: true,
            access: {
                update: ({ req: { user }, doc }) => {
                    if (!user) return false
                    if (user.roles?.includes('admin')) return true
                    const authorId = typeof doc?.user === 'object' ? (doc.user as { id: number }).id : doc?.user
                    return user.id === authorId
                }
            }
        },
        {
            name: 'reply',
            type: 'textarea',
            label: 'Odpowiedź organizatora',
            access: {
                update: async ({ req, doc }) => {
                    const user = req.user
                    if (!user) return false
                    if (user.roles?.includes('admin')) return true
                    const placeId = typeof doc?.place === 'object' ? (doc.place as { id: number }).id : doc?.place
                    if (!placeId) return false
                    const place = await req.payload.findByID({ collection: 'places', id: placeId, depth: 0 })
                    const ownerId = typeof place?.owner === 'object' ? (place.owner as { id: number }).id : place?.owner
                    return ownerId === user.id
                }
            }
        },
        {
            name: 'replyDate',
            type: 'date',
            access: {
                update: async ({ req, doc }) => {
                    const user = req.user
                    if (!user) return false
                    if (user.roles?.includes('admin')) return true
                    const placeId = typeof doc?.place === 'object' ? (doc.place as { id: number }).id : doc?.place
                    if (!placeId) return false
                    const place = await req.payload.findByID({ collection: 'places', id: placeId, depth: 0 })
                    const ownerId = typeof place?.owner === 'object' ? (place.owner as { id: number }).id : place?.owner
                    return ownerId === user.id
                }
            }
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'published',
            options: [
                { label: 'Opublikowane', value: 'published' },
                { label: 'Oczekujące', value: 'pending' },
                { label: 'Odrzucone', value: 'rejected' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
    ],
}
