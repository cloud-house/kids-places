import type { CollectionConfig } from 'payload'

import { ensureUniqueSlug } from '../hooks/ensureUniqueSlug'
import { populateOwner } from '../hooks/populateOwner'
import { checkPlanLimits } from '../hooks/checkPlanLimits'
import { revalidateCollection } from '../hooks/revalidate'
import { clearEmptyDate } from '../hooks/clearEmptyDate'

export const Events: CollectionConfig = {
    slug: 'events',
    admin: {
        useAsTitle: 'title',
        group: 'Ogłoszenia',
    },
    versions: {
        drafts: true,
    },
    hooks: {
        beforeChange: [
            populateOwner,
            checkPlanLimits('maxEvents'),
        ],
        afterChange: [revalidateCollection('/wydarzenia')],
        afterDelete: [
            async ({ req, doc }) => {
                const deleteMedia = async (id: string | number) => {
                    try {
                        await req.payload.delete({
                            collection: 'media',
                            id,
                        })
                    } catch (error) {
                        req.payload.logger.error(`Błąd podczas usuwania mediów o ID ${id}: ${error}`)
                    }
                }

                if (doc.logo) {
                    await deleteMedia(typeof doc.logo === 'object' ? doc.logo.id : doc.logo)
                }

                if (doc.gallery && Array.isArray(doc.gallery)) {
                    await Promise.all(
                        doc.gallery.map((item: { image?: number | { id: number } | null }) => {
                            const id = typeof item.image === 'object' ? item.image?.id : item.image
                            if (id) return deleteMedia(id)
                            return null
                        })
                    )
                }
            },
        ],
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
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
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
                beforeValidate: [ensureUniqueSlug('title')],
            },
        },
        {
            name: 'plan',
            type: 'select',
            options: [
                { label: 'Free', value: 'free' },
                { label: 'Premium', value: 'premium' },
            ],
            defaultValue: 'free',
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
        },

        {
            name: 'startDate',
            type: 'date',
            required: true,
            admin: {
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
            hooks: {
                beforeValidate: [clearEmptyDate],
            },
        },
        {
            name: 'endDate',
            type: 'date',
            admin: {
                position: 'sidebar',
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
            hooks: {
                beforeValidate: [clearEmptyDate],
            },
        },
        {
            name: 'recurrence',
            type: 'group',
            label: 'Cykliczność (Opcjonalnie)',
            fields: [
                {
                    name: 'isRecurring',
                    type: 'checkbox',
                    label: 'Wydarzenie cykliczne',
                    defaultValue: false,
                },
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'frequency',
                            type: 'select',
                            label: 'Częstotliwość',
                            defaultValue: 'weekly',
                            options: [
                                { label: 'Codziennie', value: 'daily' },
                                { label: 'Co tydzień', value: 'weekly' },
                                { label: 'Co miesiąc', value: 'monthly' },
                            ],
                            admin: {
                                condition: (data, siblingData) => siblingData?.isRecurring,
                                width: '50%',
                            },
                        },
                        {
                            name: 'interval',
                            type: 'number',
                            label: 'Interwał (np. co 2 tygodnie)',
                            defaultValue: 1,
                            min: 1,
                            admin: {
                                condition: (data, siblingData) => siblingData?.isRecurring,
                                width: '50%',
                            },
                        },
                    ],
                },
                {
                    name: 'daysOfWeek',
                    type: 'select',
                    label: 'Dni tygodnia',
                    hasMany: true,
                    options: [
                        { label: 'Poniedziałek', value: 'monday' },
                        { label: 'Wtorek', value: 'tuesday' },
                        { label: 'Środa', value: 'wednesday' },
                        { label: 'Czwartek', value: 'thursday' },
                        { label: 'Piątek', value: 'friday' },
                        { label: 'Sobota', value: 'saturday' },
                        { label: 'Niedziela', value: 'sunday' },
                    ],
                    admin: {
                        condition: (data, siblingData) => siblingData?.isRecurring && siblingData?.frequency === 'weekly',
                    },
                },
                {
                    name: 'recurrenceEndDate',
                    type: 'date',
                    label: 'Data końcowa cyklu',
                    admin: {
                        condition: (data, siblingData) => siblingData?.isRecurring,
                        date: {
                            pickerAppearance: 'dayOnly',
                        },
                    },
                    hooks: {
                        beforeValidate: [clearEmptyDate],
                    },
                },
            ],
        },
        {
            name: 'isFree',
            type: 'checkbox',
            label: 'Wydarzenie bezpłatne',
            defaultValue: true,
        },
        {
            name: 'tickets',
            type: 'relationship',
            relationTo: 'tickets',
            hasMany: true,
            label: 'Bilety',
            filterOptions: ({ id }) => {
                return {
                    event: {
                        equals: id,
                    },
                }
            },
            admin: {
                condition: (data) => !data.isFree,
                description: 'Wybierz lub utwórz bilety dla tego wydarzenia.',
            },
        },
        {
            name: 'ageRange',
            type: 'text',
            label: 'Age Range (e.g. "3-5 lat")',
        },
        {
            name: 'place',
            type: 'relationship',
            relationTo: 'places',
            label: 'Related Place (Optional)',
            index: true,
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'categories',
            required: true,
        },
        {
            name: 'organizer',
            type: 'relationship',
            relationTo: 'organizers',
            required: true,
        },
        {
            name: 'logo',
            type: 'upload',
            relationTo: 'media',
            required: false,
            label: 'Logo',
        },
        {
            name: 'gallery',
            type: 'array',
            label: 'Gallery (Premium)',
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media',
                },
            ],
        },
        {
            name: 'description',
            type: 'richText',
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
            name: 'features',
            type: 'array',
            label: 'Amenities & Features',
            fields: [
                {
                    name: 'attribute',
                    type: 'relationship',
                    relationTo: 'attributes',
                    required: true,
                },
                {
                    name: 'value',
                    type: 'text',
                    required: true,
                },
            ],
        },
    ],
}
