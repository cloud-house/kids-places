import type { CollectionConfig } from 'payload'

import { ensureUniqueSlug } from '../hooks/ensureUniqueSlug'
import { populateOwner } from '../hooks/populateOwner'
import { checkPlanLimits } from '../hooks/checkPlanLimits'
import { revalidateCollection, revalidateDelete } from '../hooks/revalidate'
import { geocodePlace } from '../hooks/geocodePlace'
import { clearEmptyDate } from '../hooks/clearEmptyDate'

export const Places: CollectionConfig = {
    slug: 'places',
    admin: {
        useAsTitle: 'name',
        group: 'Ogłoszenia',
        components: {
            beforeListTable: [
                '@/app/(payload)/admin/components/ImportPlacesButton#ImportPlacesButton',
            ],
        },
    },
    versions: {
        drafts: true,
    },
    hooks: {
        beforeChange: [
            populateOwner,
            checkPlanLimits('maxPlaces'),
            geocodePlace,
        ],
        beforeDelete: [
            async ({ req, id }) => {
                const { payload } = req

                // Run all cleanup operations in parallel to save time
                await Promise.all([
                    // 1. Delete related Claim Requests
                    payload.delete({
                        collection: 'claim-requests',
                        depth: 0,
                        where: {
                            place: { equals: id },
                        },
                    }),

                    // 2. Delete related Reviews
                    payload.delete({
                        collection: 'reviews',
                        depth: 0,
                        where: {
                            place: { equals: id },
                        },
                    }),

                    // 3. Clear place in Events
                    payload.update({
                        collection: 'events',
                        depth: 0,
                        where: {
                            place: { equals: id },
                        },
                        data: {
                            place: null,
                        },
                    }),

                    // 4. Delete related Tickets
                    payload.delete({
                        collection: 'tickets',
                        depth: 0,
                        where: {
                            place: { equals: id },
                        },
                    }),
                ])
            },
        ],
        afterChange: [revalidateCollection('/miejsca')],
        afterDelete: [
            revalidateDelete('/miejsca'),
            async ({ req, doc }) => {
                const deleteMedia = async (id: string | number) => {
                    try {
                        await req.payload.delete({
                            collection: 'media',
                            id,
                            depth: 0,
                        })
                    } catch (error) {
                        req.payload.logger.error(`Błąd podczas usuwania mediów o ID ${id}: ${error}`)
                    }
                }

                // Delete media in the background so the user doesn't wait for S3/file system operations
                if (doc.logo) {
                    const logoId = typeof doc.logo === 'object' ? doc.logo.id : doc.logo
                    deleteMedia(logoId)
                }

                if (doc.gallery && Array.isArray(doc.gallery)) {
                    doc.gallery.forEach((item: { image?: number | { id: number } | null }) => {
                        const id = typeof item.image === 'object' ? item.image?.id : item.image
                        if (id) deleteMedia(id)
                    })
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
            name: 'name',
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
                beforeValidate: [ensureUniqueSlug('name')],
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
            name: 'premiumExpiresAt',
            type: 'date',
            admin: {
                position: 'sidebar',
                readOnly: true,
                description: 'Premium aktywne do tej daty. Przy subskrypcji aktualizowane automatycznie po każdym odnowieniu.',
                date: { displayFormat: 'dd.MM.yyyy HH:mm' },
            },
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
            required: false,
            admin: {
                description: 'Opcjonalny organizator/marka zarządzająca tym miejscem.',
            },
        },
        {
            name: 'shortDescription',
            type: 'textarea',
            required: false,
            label: 'Short Description',
        },
        {
            name: 'longDescription',
            type: 'richText',
            label: 'Long Description (Premium)',
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
            name: 'storyBlocks',
            type: 'blocks',
            label: 'Historia miejsca (Premium)',
            admin: {
                description: 'Układaj bloki treści — tekst, zdjęcia, galerie. Widoczne tylko dla kont Premium.',
            },
            blocks: [
                {
                    slug: 'storyText',
                    labels: { singular: 'Tekst', plural: 'Bloki tekstu' },
                    fields: [
                        {
                            name: 'content',
                            type: 'richText',
                            required: true,
                        },
                    ],
                },
                {
                    slug: 'storyImage',
                    labels: { singular: 'Zdjęcie', plural: 'Zdjęcia' },
                    fields: [
                        {
                            name: 'image',
                            type: 'upload',
                            relationTo: 'media',
                            required: true,
                        },
                        {
                            name: 'caption',
                            type: 'text',
                            label: 'Podpis',
                        },
                        {
                            name: 'size',
                            type: 'select',
                            label: 'Rozmiar',
                            defaultValue: 'full',
                            options: [
                                { label: 'Pełna szerokość', value: 'full' },
                                { label: 'Wyśrodkowane (max 800px)', value: 'centered' },
                            ],
                        },
                    ],
                },
                {
                    slug: 'storyGallery',
                    labels: { singular: 'Galeria', plural: 'Galerie' },
                    fields: [
                        {
                            name: 'images',
                            type: 'array',
                            label: 'Zdjęcia',
                            minRows: 2,
                            fields: [
                                {
                                    name: 'image',
                                    type: 'upload',
                                    relationTo: 'media',
                                    required: true,
                                },
                            ],
                        },
                        {
                            name: 'caption',
                            type: 'text',
                            label: 'Podpis galerii',
                        },
                    ],
                },
            ],
        },

        {
            name: 'street',
            type: 'text',
        },
        {
            name: 'postalCode',
            type: 'text',
        },
        {
            name: 'city',
            type: 'relationship',
            relationTo: 'cities',
            required: true,
            index: true,
        },
        {
            name: 'countryCode',
            type: 'text',
        },
        {
            name: 'latitude',
            type: 'number',
        },
        {
            name: 'longitude',
            type: 'number',
        },
        {
            name: 'phoneNumber',
            type: 'text',
            label: 'Phone Number',
        },
        {
            name: 'email',
            type: 'text',
            label: 'Email Address',
        },
        {
            name: 'socialLinks',
            type: 'array',
            label: 'Social Links (Premium)',
            fields: [
                {
                    name: 'platform',
                    type: 'select',
                    options: ['Facebook', 'Instagram', 'Website', 'TikTok'],
                },
                {
                    name: 'url',
                    type: 'text',
                },
            ],
        },

        {
            name: 'rating',
            type: 'number',
            min: 0,
            max: 5,
            defaultValue: 0,
            admin: {
                readOnly: true,
            }
        },
        {
            name: 'reviewCount',
            type: 'number',
            defaultValue: 0,
            admin: {
                readOnly: true,
            }
        },

        {
            name: 'owner',
            type: 'relationship',
            relationTo: 'users',
            required: false, // Optional for imported places
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
        {
            name: 'isFree',
            type: 'checkbox',
            label: 'Bezpłatne wejście',
            defaultValue: false,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'tickets',
            type: 'relationship',
            relationTo: 'tickets',
            hasMany: true,
            label: 'Cennik / Bilety / Karnety',
            filterOptions: ({ id }) => {
                return {
                    place: {
                        equals: id,
                    },
                }
            },
            admin: {
                condition: (data) => !data.isFree,
                description: 'Zdefiniuj dostępne rodzaje biletów i karnetów dla tego miejsca.',
            },
        },
        {
            name: 'openingHours',
            type: 'array',
            label: 'Godziny otwarcia',
            fields: [
                {
                    name: 'day',
                    type: 'select',
                    options: [
                        { label: 'Poniedziałek', value: 'monday' },
                        { label: 'Wtorek', value: 'tuesday' },
                        { label: 'Środa', value: 'wednesday' },
                        { label: 'Czwartek', value: 'thursday' },
                        { label: 'Piątek', value: 'friday' },
                        { label: 'Sobota', value: 'saturday' },
                        { label: 'Niedziela', value: 'sunday' },
                    ],
                    required: true,
                },
                {
                    name: 'hours',
                    type: 'text',
                    required: true,
                    admin: {
                        placeholder: 'np. 08:00 - 16:00 lub Zamknięte',
                    },
                },
            ],
        },
        {
            name: 'affiliateBookingLink',
            type: 'text',
            label: 'Link partnerski (np. Booking.com)',
            admin: {
                description: 'Jeśli podasz ten link, na karcie obiektu pojawi się przycisk "Zarezerwuj pobyt"',
                position: 'sidebar',
            },
        },
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'CRM',
                    fields: [
                        {
                            name: 'crmStatus',
                            type: 'select',
                            label: 'Status CRM',
                            options: [
                                { label: 'Nowy (Lead)', value: 'new' },
                                { label: 'Skontaktowano', value: 'contacted' },
                                { label: 'Zainteresowany', value: 'interested' },
                                { label: 'Odrzucił', value: 'rejected' },
                                { label: 'Partner (Aktywny)', value: 'active' },
                            ],
                            defaultValue: 'new',
                        },
                        {
                            name: 'crmNotes',
                            type: 'textarea',
                            label: 'Notatki CRM',
                        },
                        {
                            name: 'lastContacted',
                            type: 'date',
                            label: 'Ostatni kontakt',
                            hooks: {
                                beforeValidate: [clearEmptyDate],
                            },
                        },
                        {
                            name: 'emailOptOut',
                            type: 'checkbox',
                            label: 'Opt-out z mailingów',
                            defaultValue: false,
                            admin: {
                                description: 'Zaznacz, aby nie wysyłać więcej wiadomości marketingowych do tego miejsca.',
                            },
                        },
                    ],
                },
            ],
        },
    ],
}
