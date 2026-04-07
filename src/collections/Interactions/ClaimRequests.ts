import type { CollectionConfig } from 'payload'

export const ClaimRequests: CollectionConfig = {
    slug: 'claim-requests',
    admin: {
        useAsTitle: 'id',
        group: 'Biznes',
    },
    access: {
        read: ({ req: { user } }) => {
            if (!user) return false
            if (user.roles?.includes('admin')) return true
            return {
                user: {
                    equals: user.id
                }
            }
        },
        create: () => true,
        update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
        delete: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    },
    hooks: {
        beforeChange: [
            async ({ req, data, operation }) => {
                if (operation !== 'create') return data

                const placeId = data.place
                if (!placeId) return data

                const existing = await req.payload.find({
                    collection: 'claim-requests',
                    where: {
                        and: [
                            { place: { equals: placeId } },
                            { status: { equals: 'pending' } },
                            { expiresAt: { greater_than: new Date().toISOString() } },
                        ],
                    },
                    limit: 1,
                })

                if (existing.docs.length > 0) {
                    throw new Error('Dla tego miejsca istnieje już aktywne zgłoszenie przejęcia.')
                }

                return data
            },
        ],
    },
    fields: [
        {
            name: 'place',
            type: 'relationship',
            relationTo: 'places',
            required: true,
            index: true,
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: false, // Could be unauthenticated request? No, usually authenticated.
        },
        {
            name: 'email',
            type: 'email',
            required: true,
        },
        {
            name: 'token',
            type: 'text',
            required: true,
            index: true,
        },
        {
            name: 'status',
            type: 'select',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Verified', value: 'verified' },
                { label: 'Expired', value: 'expired' },
            ],
            defaultValue: 'pending',
            required: true,
        },
        {
            name: 'expiresAt',
            type: 'date',
            required: true,
        },
    ],
}
