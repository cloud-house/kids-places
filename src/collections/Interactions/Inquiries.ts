import type { CollectionConfig } from 'payload'

export const Inquiries: CollectionConfig = {
    slug: 'inquiries',
    admin: {
        useAsTitle: 'email',
        group: 'Biznes',
        defaultColumns: ['name', 'email', 'status', 'createdAt'],
    },
    access: {
        create: () => true,
        read: ({ req: { user } }) => {
            if (!user) return false
            if (user.roles?.includes('admin')) return true
            return false // For now, only admin. Later can be specific organizers.
        },
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Imię i nazwisko',
        },
        {
            name: 'email',
            type: 'text',
            required: true,
            label: 'Adres e-mail',
        },
        {
            name: 'phone',
            type: 'text',
            label: 'Numer telefonu',
        },
        {
            name: 'message',
            type: 'textarea',
            required: true,
            label: 'Wiadomość',
        },
        {
            name: 'sourceType',
            type: 'select',
            required: true,
            options: [
                { label: 'Miejsce', value: 'places' },
                { label: 'Wydarzenie', value: 'events' },
            ],
        },
        {
            name: 'sourceId',
            type: 'text',
            required: true,
            label: 'ID źródła (Miejsce/Event)',
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'new',
            required: true,
            options: [
                { label: 'Nowe', value: 'new' },
                { label: 'W kontakcie', value: 'contacted' },
                { label: 'Zapisano', value: 'enrolled' },
                { label: 'Odrzucono', value: 'rejected' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
    ],
}
