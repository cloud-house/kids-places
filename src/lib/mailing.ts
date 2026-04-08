import { Payload, Where } from 'payload'
import { EMAIL_TEMPLATES, TemplateKey } from './email-templates'
import { buildUnsubscribeUrl } from './unsubscribe'
import { Mailing, Place } from '../payload-types'

export const sendMailing = async (payload: Payload, mailingId: string | number, doc?: Partial<Mailing>) => {
    payload.logger.info(`[Mailing] Starting mailing for ID: ${mailingId}`)

    let mailing = doc;
    if (!mailing) {
        mailing = await payload.findByID({
            collection: 'mailings',
            id: mailingId,
            depth: 2,
        })
    }

    if (!mailing) {
        payload.logger.error(`[Mailing] Mailing not found for ID: ${mailingId}`)
        return
    }

    if (mailing.status !== 'sent') {
        payload.logger.info(`[Mailing] Skipping — status is '${mailing.status}', not 'sent'`)
        return
    }

    // Check if already sent to avoid double execution
    if (mailing.sentAt) {
        payload.logger.info(`[Mailing] Skipping — already sent at ${mailing.sentAt}`)
        return
    }

    const templateKey = (mailing.template as TemplateKey) || 'custom'
    const template = EMAIL_TEMPLATES[templateKey]

    if (!template) {
        payload.logger.error(`[Mailing] Template '${templateKey}' not found!`)
        return
    }

    // Base query logic for bulk recipients
    const baseWhere: Where = {
        email: { exists: true },
        emailOptOut: { not_equals: true },
        ...(templateKey === 'partnership_offer' ? { owner: { exists: false } } : {}),
    }

    let recipients: (number | Place)[] = []

    try {
        if (mailing.recipientsType === 'individual') {
            payload.logger.info(`[Mailing] Loading individual recipients for mailing ${mailingId}`)

            if (!mailing.recipients || (mailing.recipients.length > 0 && typeof mailing.recipients[0] !== 'object')) {
                const fullMailing = await payload.findByID({
                    collection: 'mailings',
                    id: mailingId,
                    depth: 2,
                })
                recipients = fullMailing.recipients || []
            } else {
                recipients = mailing.recipients || []
            }
        } else if (mailing.recipientsType === 'city' && mailing.city) {
            const cityId = typeof mailing.city === 'object' ? mailing.city.id : mailing.city
            payload.logger.info(`[Mailing] Searching for recipients in city ${cityId}`)
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
            payload.logger.info(`[Mailing] Searching for recipients in category ${categoryId}`)
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
    } catch (err) {
        payload.logger.error(`[Mailing] Error identifying recipients: ${err}`)
        return
    }

    payload.logger.info(`[Mailing] Found ${recipients.length} recipients.`)

    let successCount = 0;
    let failCount = 0;

    for (const recipient of recipients) {
        try {
            const place = typeof recipient === 'object' ? recipient : await payload.findByID({ collection: 'places', id: recipient })

            if (!place) {
                payload.logger.warn(`[Mailing] Place not found for recipient ID: ${recipient}`)
                continue
            }

            // Skip claimed places for partnership_offer template
            if (templateKey === 'partnership_offer' && place.owner) {
                payload.logger.info(`[Mailing] Skipping place ${place.id} — already has an owner.`)
                continue
            }

            // Skip already contacted places for partnership_offer template
            if (templateKey === 'partnership_offer' && place.crmStatus && place.crmStatus !== 'new') {
                payload.logger.info(`[Mailing] Skipping place ${place.id} — status ${place.crmStatus}.`)
                continue
            }

            if (!place.email) {
                payload.logger.info(`[Mailing] Skipping place ${place.id} — no email.`)
                continue
            }

            if (place.emailOptOut) {
                payload.logger.info(`[Mailing] Skipping place ${place.id} — opted out.`)
                continue
            }

            // Prepare content
            const customMessage = typeof mailing.content === 'string'
                ? mailing.content
                : (mailing.content ? '[Rich editor content was sent]' : undefined)

            const htmlContent = template.getHtml({
                placeName: place.name || 'Partnerze',
                customMessage,
                unsubscribeUrl: buildUnsubscribeUrl(place.id),
            })

            payload.logger.info(`[Mailing] Sending to ${place.email}...`)
            await payload.sendEmail({
                to: place.email,
                subject: template.getSubject(mailing.subject ?? undefined),
                html: htmlContent,
            })

            // Update last contacted date
            await payload.update({
                collection: 'places',
                id: place.id,
                data: {
                    lastContacted: new Date().toISOString(),
                    crmStatus: 'contacted',
                },
            })
            successCount++;
        } catch (err) {
            payload.logger.error(`[Mailing] Send error to ${recipient}: ${err}`)
            failCount++;
        }
    }

    // Update mailing sentAt
    payload.logger.info(`[Mailing] Finished processing. Success: ${successCount}, Failed: ${failCount}. Updating sentAt for mailing ${mailingId}`)
    try {
        await payload.update({
            collection: 'mailings',
            id: mailingId,
            data: {
                sentAt: new Date().toISOString(),
            },
        })
        payload.logger.info(`[Mailing] Done. sentAt updated for mailing ${mailingId}`)
    } catch (err) {
        payload.logger.error(`[Mailing] ERROR updating sentAt for mailing ${mailingId}: ${err}`)
    }
}



