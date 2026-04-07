import type { CollectionConfig } from 'payload'
import { formatSlug } from '../../lib/utils/formatSlug'

export const Attributes: CollectionConfig = {
    slug: 'attributes',
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
            name: 'type',
            type: 'select',
            required: true,
            options: [
                { label: 'Text', value: 'text' },
                { label: 'Select', value: 'select' },
                { label: 'Multi-select', value: 'multi-select' },
                { label: 'Boolean', value: 'boolean' },
                { label: 'Range', value: 'range' },
            ],
        },
        {
            name: 'options',
            type: 'array',
            label: 'Options (for Select/Multi-select)',
            admin: {
                condition: (data) => data.type === 'select' || data.type === 'multi-select',
            },
            fields: [
                {
                    name: 'label',
                    type: 'text',
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
            name: 'group',
            type: 'relationship',
            relationTo: 'attribute-groups',
            required: true,
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'categories',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: true,
            label: 'Applicable Categories',
        },
        {
            name: 'order',
            type: 'number',
            defaultValue: 100,
            admin: {
                description: 'Kolejność wyświetlania wewnątrz grupy',
                position: 'sidebar',
            },
        },
    ],
}
