import { Payload, Where } from 'payload'
import { EMAIL_TEMPLATES, TemplateKey } from './email-templates'
import { buildUnsubscribeUrl } from './unsubscribe'

export const sendMailing = async (payload: Payload, mailingId: string | number) => {
    const mailing = await payload.findByID({
        collection: 'mailings',
        id: mailingId,
    })

    if (!mailing || mailing.status !== 'sent') return

    const templateKey = (mailing.template as TemplateKey) || 'custom'
    const template = EMAIL_TEMPLATES[templateKey]

    // Base query logic
    const baseWhere: Where = {
        email: { exists: true },
        emailOptOut: { not_equals: true },
        ...(templateKey === 'partnership_offer' ? { owner: { exists: false } } : {}),
    }

    let recipients: (number | import('../payload-types').Place)[] = []

    if (mailing.recipientsType === 'individual') {
        recipients = mailing.recipients || []
    } else if (mailing.recipientsType === 'city' && mailing.city) {
        const cityId = typeof mailing.city === 'object' ? mailing.city.id : mailing.city
        const places = await payload.find({
            collection: 'places',
            where: {
                ...baseWhere,
                city: { equals: cityId },
            },
            limit: 1000,
        })
        recipients = places.docs
    } else if (mailing.recipientsType === 'category' && mailing.category) {
        const categoryId = typeof mailing.category === 'object' ? mailing.category.id : mailing.category
        const places = await payload.find({
            collection: 'places',
            where: {
                ...baseWhere,
                category: { equals: categoryId },
            },
            limit: 1000,
        })
        recipients = places.docs
    }

    payload.logger.info(`Sending mailing to ${recipients.length} recipients.`)

    for (const recipient of recipients) {
        const place = typeof recipient === 'object' ? recipient : await payload.findByID({ collection: 'places', id: recipient })
        
        // Skip claimed places for partnership_offer
        if (templateKey === 'partnership_offer' && place?.owner) {
            payload.logger.info(`Skipping place ${place.id} because it already has an owner.`)
            continue
        }

        // Skip already contacted places for partnership_offer (anti-duplicate guard)
        if (templateKey === 'partnership_offer' && place?.crmStatus && place.crmStatus !== 'new') {
            payload.logger.info(`Skipping place ${place.id} — already contacted (crmStatus: ${place.crmStatus}).`)
            continue
        }

        if (place?.email) {
            // Skip places that opted out (applies to individually-selected recipients)
            if (place.emailOptOut) {
                payload.logger.info(`Skipping place ${place.id} — opted out of marketing emails.`)
                continue
            }

            try {
                // Ensure content is handled if it's rich text JSON or string
                // Note: Lexical rich text needs an HTML converter hook ideally.
                const customMessage = typeof mailing.content === 'string'
                    ? mailing.content
                    : (mailing.content ? '[Treść widoczna w panelu (RichText object)]' : undefined)

                const htmlContent = template.getHtml({
                    placeName: place.name || 'Partnerze',
                    customMessage,
                    unsubscribeUrl: buildUnsubscribeUrl(place.id),
                })

                await payload.sendEmail({
                    to: place.email,
                    subject: template.getSubject(mailing.subject ?? undefined),
                    html: htmlContent,
                })
                
                // Update last contacted
                await payload.update({
                    collection: 'places',
                    id: place.id,
                    data: {
                        lastContacted: new Date().toISOString(),
                        crmStatus: 'contacted',
                    },
                })
            } catch (err) {
                payload.logger.error(`Błąd wysyłki do ${place.email}: ${err}`)
            }
        }
    }

    // Update mailing sentAt
    await payload.update({
        collection: 'mailings',
        id: mailingId,
        data: {
            sentAt: new Date().toISOString(),
        },
    })
}
