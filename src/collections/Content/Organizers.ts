import type { CollectionConfig } from 'payload'
import { ensureUniqueSlug } from '../hooks/ensureUniqueSlug'
import { syncUserPlan } from '../hooks/syncUserPlan'
import { clearEmptyDate } from '../hooks/clearEmptyDate'

export const Organizers: CollectionConfig = {
    slug: 'organizers',
    admin: {
        useAsTitle: 'name',
        group: 'Biznes',
    },
    access: {
        read: () => true,
        update: ({ req: { user } }) => {
            if (!user) return false
            if (user.roles?.includes('admin')) return true
            return {
                owner: {
                    equals: user.id,
                },
            }
        },
        delete: ({ req: { user } }) => {
            if (!user) return false
            if (user.roles?.includes('admin')) return true
            return {
                owner: {
                    equals: user.id,
                },
            }
        },
    },
    hooks: {
        afterChange: [syncUserPlan],
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'owner',
            type: 'relationship',
            relationTo: 'users',
            required: false,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                position: 'sidebar',
            },
            hooks: {
                beforeValidate: [ensureUniqueSlug('name')],
            },
        },
        {
            name: 'email',
            type: 'text',
        },
        {
            name: 'phone',
            type: 'text',
        },
        {
            name: 'website',
            type: 'text',
        },
        {
            name: 'plan',
            type: 'relationship',
            relationTo: 'pricing-plans',
            required: false,
            admin: {
                position: 'sidebar',
            },
        },
        {
            label: 'Dane do faktury',
            type: 'collapsible',
            admin: {
                position: 'sidebar',
            },
            fields: [
                {
                    name: 'billing',
                    type: 'group',
                    label: 'Dane firmowe',
                    fields: [
                        {
                            name: 'companyName',
                            type: 'text',
                            label: 'Nazwa firmy',
                        },
                        {
                            name: 'nip',
                            type: 'text',
                            label: 'NIP',
                        },
                        {
                            name: 'address',
                            type: 'text',
                            label: 'Ulica i numer',
                        },
                        {
                            name: 'city',
                            type: 'text',
                            label: 'Miasto',
                        },
                        {
                            name: 'postalCode',
                            type: 'text',
                            label: 'Kod pocztowy',
                        },
                    ],
                },
            ],
        },
        {
            name: 'stripeCustomerId',
            type: 'text',
            admin: {
                position: 'sidebar',
                hidden: true,
            },
        },
        {
            name: 'stripeSubscriptionId',
            type: 'text',
            admin: {
                position: 'sidebar',
                hidden: true,
            },
        },
        {
            name: 'stripeSubscriptionStatus',
            type: 'select',
            options: [
                { label: 'Aktywna', value: 'active' },
                { label: 'Okres próbny', value: 'trialing' },
                { label: 'Niekompletna', value: 'incomplete' },
                { label: 'Niekompletna wygasła', value: 'incomplete_expired' },
                { label: 'Zaległa', value: 'past_due' },
                { label: 'Anulowana', value: 'canceled' },
                { label: 'Nieopłacona', value: 'unpaid' },
                { label: 'Wstrzymana', value: 'paused' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'premiumExpiresAt',
            type: 'date',
            label: 'Data wygaśnięcia Premium',
            hooks: {
                beforeValidate: [clearEmptyDate],
            },
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'collectionMethod',
            type: 'select',
            label: 'Metoda płatności',
            defaultValue: 'send_invoice',
            options: [
                { label: 'Automatyczna (Karta)', value: 'charge_automatically' },
                { label: 'Manualna (Faktura)', value: 'send_invoice' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
    ],
}
