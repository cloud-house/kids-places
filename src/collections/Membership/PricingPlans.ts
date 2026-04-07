import type { CollectionConfig } from 'payload'

export const PricingPlans: CollectionConfig = {
    slug: 'pricing-plans',
    admin: {
        useAsTitle: 'name',
        group: 'Biznes',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'stripePriceId_recurring',
            type: 'text',
            admin: {
                description: 'ID Ceny REKURENCYJNEJ ze Stripe (np. price_12345)',
            },
        },
        {
            name: 'stripePriceId_onetime',
            type: 'text',
            admin: {
                description: 'ID Ceny JEDNORAZOWEJ ze Stripe (np. price_54321)',
            },
        },
        {
            name: 'stripePriceId_annual_recurring',
            type: 'text',
            admin: {
                description: 'ID Ceny REKURENCYJNEJ rocznej ze Stripe',
            },
        },
        {
            name: 'stripePriceId_annual_onetime',
            type: 'text',
            admin: {
                description: 'ID Ceny JEDNORAZOWEJ rocznej ze Stripe',
            },
        },
        {
            name: 'planPrice_recurring',
            type: 'number',
            required: true,
            admin: {
                description: 'Cena miesięczna w PLN (wersja subskrypcyjna)',
            },
        },
        {
            name: 'planPrice_onetime',
            type: 'number',
            required: true,
            admin: {
                description: 'Cena jednorazowa w PLN (wersja na 1 miesiąc)',
            },
        },
        {
            name: 'planPrice_annual_recurring',
            type: 'number',
            admin: {
                description: 'Cena roczna w PLN (wersja subskrypcyjna)',
            },
        },
        {
            name: 'planPrice_annual_onetime',
            type: 'number',
            admin: {
                description: 'Cena roczna w PLN (wersja na 1 rok)',
            },
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
        },
        {
            name: 'features',
            type: 'array',
            fields: [
                {
                    name: 'feature',
                    type: 'text',
                },
            ],
        },
        {
            name: 'maxPlaces',
            type: 'number',
            required: true,
            defaultValue: 1,
            label: 'Maximum Places',
        },
        {
            name: 'maxEvents',
            type: 'number',
            required: true,
            defaultValue: 0,
            label: 'Maximum Events',
        },

        {
            name: 'isPremium',
            type: 'checkbox',
            defaultValue: false,
            label: 'Plan Premium',
            admin: {
                description: 'Zaznacz, jeśli ten plan daje dostęp do funkcji Premium. Używane przez system do synchronizacji statusu miejsc i wydarzeń.',
            },
        },
        {
            name: 'isFeatured',
            type: 'checkbox',
            defaultValue: false,
        },
        {
            name: 'buttonText',
            type: 'text',
            defaultValue: 'Wybierz',
        },
    ],
}
