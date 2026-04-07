import type { CollectionConfig } from 'payload'
import { formatSlug } from '../../lib/utils/formatSlug'

export const AttributeGroups: CollectionConfig = {
    slug: 'attribute-groups',
    admin: {
        useAsTitle: 'name',
        group: 'Taksonomia',
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
                        if (data && 'name' in data && data.name) return formatSlug(data.name as string);
                        return value;
                    },
                ],
            },
        },
        {
            name: 'order',
            type: 'number',
            defaultValue: 100,
            admin: {
                description: 'Kolejność wyświetlania (niższa liczba = wyżej)',
                position: 'sidebar',
            },
        },
    ],
}
