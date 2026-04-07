import { CollectionConfig } from 'payload';
import { ensureSlug } from '../hooks/ensureSlug';

export const Cities: CollectionConfig = {
    slug: 'cities',
    admin: {
        useAsTitle: 'name',
        group: 'Konfiguracja',
        defaultColumns: ['name', 'slug', 'isPopular', 'count'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'slug',
            type: 'text',
            admin: {
                position: 'sidebar',
            },
            hooks: {
                beforeValidate: [ensureSlug('name')],
            },
        },
        {
            name: 'isPopular',
            type: 'checkbox',
            label: 'Popularne miasto (wyświetlane na górze list)',
            defaultValue: false,
        },
    ],
}
