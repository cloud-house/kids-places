import type { CollectionConfig } from 'payload'
import { formatSlug } from '../../lib/utils/formatSlug'

export const PostCategories: CollectionConfig = {
    slug: 'post-categories',
    admin: {
        useAsTitle: 'title',
        group: 'Blog',
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
    ],
}
