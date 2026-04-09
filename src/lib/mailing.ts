import { Payload, Where } from 'payload'
import { EMAIL_TEMPLATES, TemplateKey } from './email-templates'
import { buildUnsubscribeUrl } from './unsubscribe'
import { BRAND_CONFIG } from './config'
import { Place } from '../payload-types'

export const sendMailing = async (payload: Payload, mailingId: string | number) => {
    payload.logger.info(`[Mailing] Starting mailing for ID: ${mailingId}`)

    const mailing = await payload.findByID({
        collection: 'mailings',
        id: mailingId,
        depth: 2,
    })

    if (!mailing) {
        payload.logger.error(`[Mailing] Mailing not found for ID: ${mailingId}`)
        return
    }

    if (mailing.status !== 'sent') {
        payload.logger.info(`[Mailing] Skipping — status is '${mailing.status}', not 'sent'`)
        return
    }

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

    // Set sentAt immediately so the admin UI shows it right away
    await payload.update({
        collection: 'mailings',
        id: mailingId,
        data: { sentAt: new Date().toISOString() },
        overrideAccess: true,
    })

    // Base query — for partnership_offer exclude already claimed places
    const baseWhere: Where = {
        email: { exists: true },
        emailOptOut: { not_equals: true },
        ...(templateKey === 'partnership_offer' ? { owner: { exists: false } } : {}),
    }

    let recipients: Place[] = []

    try {
        if (mailing.recipientsType === 'individual') {
            payload.logger.info(`[Mailing] Loading individual recipients`)
            const fullMailing = await payload.findByID({ collection: 'mailings', id: mailingId, depth: 2 })
            recipients = (fullMailing.recipients?.filter(r => typeof r === 'object') ?? []) as Place[]
        } else if (mailing.recipientsType === 'city' && mailing.city) {
            const cityId = typeof mailing.city === 'object' ? mailing.city.id : mailing.city
            payload.logger.info(`[Mailing] Searching for recipients in city ${cityId}`)
            const places = await payload.find({ collection: 'places', where: { ...baseWhere, city: { equals: cityId } }, limit: 1000 })
            recipients = places.docs
        } else if (mailing.recipientsType === 'category' && mailing.category) {
            const categoryId = typeof mailing.category === 'object' ? mailing.category.id : mailing.category
            payload.logger.info(`[Mailing] Searching for recipients in category ${categoryId}`)
            const places = await payload.find({ collection: 'places', where: { ...baseWhere, category: { equals: categoryId } }, limit: 1000 })
            recipients = places.docs
        }
    } catch (err) {
        payload.logger.error(`[Mailing] Error identifying recipients: ${err}`)
        return
    }

    payload.logger.info(`[Mailing] Found ${recipients.length} candidates.`)

    let successCount = 0
    let failCount = 0
    const skipped = { has_owner: 0, already_contacted: 0, no_email: 0, opted_out: 0 }

    for (const place of recipients) {
        try {
            if (!place || typeof place !== 'object') continue

            if (templateKey === 'partnership_offer' && place.owner) {
                skipped.has_owner++
                continue
            }

            if (templateKey === 'partnership_offer' && place.crmStatus && place.crmStatus !== 'new') {
                skipped.already_contacted++
                continue
            }

            if (!place.email) {
                skipped.no_email++
                continue
            }

            if (place.emailOptOut) {
                skipped.opted_out++
                continue
            }

            const customMessage = typeof mailing.content === 'string'
                ? mailing.content
                : (mailing.content ? '[Rich editor content was sent]' : undefined)

            const htmlContent = template.getHtml({
                placeName: place.name || 'Partnerze',
                customMessage,
                unsubscribeUrl: buildUnsubscribeUrl(place.id),
                placeUrl: place.slug ? `${BRAND_CONFIG.url}/miejsca/${place.slug}` : undefined,
            })

            payload.logger.info(`[Mailing] Sending to ${place.email}...`)
            await payload.sendEmail({
                to: place.email,
                subject: template.getSubject(mailing.subject ?? undefined),
                html: htmlContent,
            })
            successCount++

            // Update CRM status — best-effort, skip revalidation to avoid slowdown
            try {
                await payload.update({
                    collection: 'places',
                    id: place.id,
                    data: { lastContacted: new Date().toISOString(), crmStatus: 'contacted' },
                    overrideAccess: true,
                    context: { skipRevalidation: true },
                })
            } catch (crmErr) {
                payload.logger.warn(`[Mailing] Failed to update CRM for place ${place.id}: ${crmErr}`)
            }
        } catch (err) {
            payload.logger.error(`[Mailing] Send error for place ${place.id}: ${err}`)
            failCount++
        }
    }

    payload.logger.info(
        `[Mailing] Done. Sent: ${successCount}, Failed: ${failCount}, ` +
        `Skipped: ${skipped.already_contacted} already_contacted, ${skipped.has_owner} has_owner, ` +
        `${skipped.no_email} no_email, ${skipped.opted_out} opted_out`
    )
}
