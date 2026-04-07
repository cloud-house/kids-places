import type { CollectionConfig } from 'payload'
import { formatSlug } from '../../lib/utils/formatSlug'

export const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: 'title',
        group: 'Taksonomia',
    },
    access: {
        read: () => true,
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
                beforeValidate: [
                    ({ value, data }) => {
                        if (typeof value === 'string' && value) return formatSlug(value);
                        if (data && 'title' in data && data.title) return formatSlug(data.title as string);
                        return value;
                    },
                ],
            },
        },
        {
            name: 'icon',
            type: 'text', // Storing icon name for Lucide
            required: true,
            label: 'Lucide Icon Name',
        },
        {
            name: 'color',
            type: 'text', // Tailwind classes
            required: true,
        },
        {
            name: 'scopes',
            type: 'select',
            required: true,
            hasMany: true,
            defaultValue: ['place'],
            options: [
                { label: 'Places', value: 'place' },
                { label: 'Events', value: 'event' },
            ],
        },
        {
            name: 'isFeatured',
            type: 'checkbox',
            label: 'Wyróżniona kategoria',
            defaultValue: false,
            admin: {
                description: 'Kategorie wyróżnione są wyświetlane na stronie głównej',
                position: 'sidebar',
            },
        },
    ],
}
