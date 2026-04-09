import type { CollectionConfig, Access, CollectionAfterChangeHook } from 'payload'
import { sendMailing } from '../../lib/mailing'

export const Mailings: CollectionConfig = {
    slug: 'mailings',
    admin: {
        useAsTitle: 'subject',
        group: 'CRM',
        defaultColumns: ['subject', 'status', 'sentAt'],
    },
    access: {
        read: (({ req: { user } }) => !!user) as Access,
        create: (({ req: { user } }) => !!(user && user.roles?.includes('admin'))) as Access,
        update: (({ req: { user } }) => !!(user && user.roles?.includes('admin'))) as Access,
        delete: (({ req: { user } }) => !!(user && user.roles?.includes('admin'))) as Access,
    },
    fields: [
        {
            name: 'template',
            type: 'select',
            label: 'Szablon wiadomości',
            defaultValue: 'custom',
            options: [
                { label: 'Własna treść (CMS)', value: 'custom' },
                { label: 'Propozycja współpracy (dla nowych)', value: 'partnership_offer' },
                { label: 'Prośba o aktualizację (dla obecnych)', value: 'update_request' },
            ],
            admin: {
                description: 'Wybierz jeden z przygotowanych szablonów trzymanych w kodzie lub wpisz własny tekst.',
            }
        },
        {
            name: 'subject',
            type: 'text',
            required: false,
            label: 'Temat wiadomości (dla własnej treści)',
            admin: {
                condition: (data: Partial<import('../../payload-types').Mailing>) => data.template === 'custom',
            }
        },
        {
            name: 'content',
            type: 'richText',
            required: false,
            label: 'Treść wiadomości (dla własnej treści)',
            admin: {
                condition: (data: Partial<import('../../payload-types').Mailing>) => data.template === 'custom',
            }
        },
        {
            name: 'recipientsType',
            type: 'select',
            defaultValue: 'individual',
            options: [
                { label: 'Indywidualne miejsca', value: 'individual' },
                { label: 'Wszystkie miejsca w mieście', value: 'city' },
                { label: 'Wszystkie miejsca w kategorii', value: 'category' },
            ],
            admin: {
                description: 'Wybierz grupę docelową wysyłki.',
            },
        },
        {
            name: 'recipients',
            type: 'relationship',
            relationTo: 'places',
            hasMany: true,
            admin: {
                condition: (data: Partial<import('../../payload-types').Mailing>) => data.recipientsType === 'individual',
            },
        },
        {
            name: 'city',
            type: 'relationship',
            relationTo: 'cities',
            admin: {
                condition: (data: Partial<import('../../payload-types').Mailing>) => data.recipientsType === 'city',
            },
        },
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'categories',
            admin: {
                condition: (data: Partial<import('../../payload-types').Mailing>) => data.recipientsType === 'category',
            },
        },
        {
            name: 'status',
            type: 'select',
            defaultValue: 'draft',
            options: [
                { label: 'Szkic', value: 'draft' },
                { label: 'Wysłano', value: 'sent' },
            ],
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'sentAt',
            type: 'date',
            admin: {
                position: 'sidebar',
                readOnly: true,
            },
        },
    ],
    hooks: {
        afterChange: [
            (async ({ doc, previousDoc, req }: Parameters<CollectionAfterChangeHook>[0]) => {
                if (doc.status === 'sent' && previousDoc.status !== 'sent') {
                    req.payload.logger.info(`[Mailing Hook] Triggering sendMailing for ID: ${doc.id}`)
                    try {
                        await sendMailing(req.payload, doc.id)
                    } catch (err) {
                        req.payload.logger.error(`[Mailing Hook] Error during sendMailing: ${err}`)
                    }
                }
            }) as CollectionAfterChangeHook,
        ],
    },
}
