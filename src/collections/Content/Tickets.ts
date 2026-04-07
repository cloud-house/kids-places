import type { CollectionConfig } from 'payload'
import { populateOwner } from '../hooks/populateOwner'

export const Tickets: CollectionConfig = {
    slug: 'tickets',
    admin: {
        useAsTitle: 'name',
        group: 'Sprzedaż / Rezerwacje',
    },
    hooks: {
        beforeChange: [populateOwner],
    },
    access: {
        read: () => true,
        create: ({ req: { user } }) => !!user,
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
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Nazwa biletu / karnetu',
        },
        {
            name: 'price',
            type: 'number',
            required: true,
            min: 0,
            label: 'Cena (PLN)',
        },
        {
            name: 'description',
            type: 'text',
            label: 'Opis (opcjonalnie)',
        },
        {
            name: 'type',
            type: 'select',
            defaultValue: 'one-time',
            options: [
                { label: 'Bilet jednorazowy', value: 'one-time' },
                { label: 'Karnet (liczba wejść)', value: 'pass' },
                { label: 'Subskrypcja / Członkostwo', value: 'membership' },
            ],
            label: 'Typ produktu',
        },
        {
            name: 'entries',
            type: 'number',
            defaultValue: 1,
            min: 1,
            admin: {
                condition: (data) => data.type === 'pass',
            },
            label: 'Liczba wejść',
        },
        {
            type: 'row',
            fields: [
                {
                    name: 'validityValue',
                    type: 'number',
                    label: 'Ważność (wartość)',
                },
                {
                    name: 'validityUnit',
                    type: 'select',
                    defaultValue: 'days',
                    options: [
                        { label: 'Dni', value: 'days' },
                        { label: 'Miesiące', value: 'months' },
                        { label: 'Lat', value: 'years' },
                    ],
                    label: 'Jednostka',
                },
            ],
            admin: {
                condition: (data) => data.type === 'pass' || data.type === 'membership',
            },
        },
        {
            name: 'limit',
            type: 'number',
            label: 'Limit miejsc / sztuk',
            admin: {
                description: 'Opcjonalny limit dostępności tego rodzaju biletu.',
            },
        },
        {
            name: 'event',
            type: 'relationship',
            relationTo: 'events',
            label: 'Powiązane Wydarzenie',
            index: true,
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'place',
            type: 'relationship',
            relationTo: 'places',
            label: 'Powiązane Miejsce',
            index: true,
            admin: {
                position: 'sidebar',
            }
        },
        {
            name: 'owner',
            type: 'relationship',
            relationTo: 'users',
            required: false,
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
        },
    ],
}
