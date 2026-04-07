import type { CollectionConfig } from 'payload'

import { ensureSlug } from '../hooks/ensureSlug'

export const Posts: CollectionConfig = {
    slug: 'posts',
    admin: {
        useAsTitle: 'title',
        group: 'Blog',
        defaultColumns: ['title', 'category', 'updatedAt'],
    },
    versions: {
        drafts: true,
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
            name: 'heroImage',
            type: 'relationship',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'post-categories',
            required: true,
        },
        {
            name: 'excerpt',
            type: 'textarea',
            required: true,
            admin: {
                description: 'Krótki opis widoczny na liście artykułów.',
            },
        },
        {
            name: 'content',
            type: 'blocks',
            required: true,
            blocks: [
                {
                    slug: 'richText',
                    fields: [
                        {
                            name: 'content',
                            type: 'richText',
                            required: true,
                        },
                    ],
                },
                {
                    slug: 'banner',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'description',
                            type: 'textarea',
                        },
                        {
                            name: 'link',
                            type: 'text',
                            required: true,
                        },
                        {
                            name: 'buttonLabel',
                            type: 'text',
                            defaultValue: 'Dowiedz się więcej',
                        },
                        {
                            name: 'style',
                            type: 'select',
                            defaultValue: 'rose',
                            options: [
                                { label: 'Różowy', value: 'rose' },
                                { label: 'Niebieski', value: 'blue' },
                                { label: 'Ciemny', value: 'dark' },
                            ],
                        },
                    ],
                },
                {
                    slug: 'relatedItems',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            defaultValue: 'Polecane miejsca i wydarzenia',
                        },
                        {
                            name: 'items',
                            type: 'relationship',
                            relationTo: ['places', 'events'],
                            hasMany: true,
                            required: true,
                        },
                    ],
                },
            ],
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
                beforeValidate: [ensureSlug('title')],
            },
        },

        {
            name: 'publishedDate',
            type: 'date',
            admin: {
                position: 'sidebar',
            },
            hooks: {
                beforeChange: [
                    ({ data, value }) => {
                        if (data?._status === 'published' && !value) {
                            return new Date();
                        }
                        return value;
                    },
                ],
            },
        },
    ],
}
