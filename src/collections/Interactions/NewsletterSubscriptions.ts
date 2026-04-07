import { CollectionConfig } from 'payload'

export const NewsletterSubscriptions: CollectionConfig = {
    slug: 'newsletter-subscriptions',
    admin: {
        useAsTitle: 'email',
        defaultColumns: ['email', 'name', 'status', 'createdAt'],
    },
    access: {
        read: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
        create: () => true,
        update: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
        delete: ({ req: { user } }) => Boolean(user && user.roles?.includes('admin')),
    },
    fields: [
        {
            name: 'email',
            type: 'email',
            required: true,
            unique: true,
        },
        {
            name: 'name',
            type: 'text',
        },
        {
            name: 'city',
            type: 'text',
        },
        {
            name: 'consent',
            type: 'checkbox',
            required: true,
            admin: {
                description: 'Zgoda na otrzymywanie newslettera',
            },
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'active',
            options: [
                { label: 'Aktywny', value: 'active' },
                { label: 'Wypisany', value: 'unsubscribed' },
            ],
        },
    ],
}
