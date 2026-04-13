import { Payload } from 'payload'
import { EMAIL_TEMPLATES, TemplateKey } from './email-templates'
import { buildUnsubscribeUrl } from './unsubscribe'
import { BRAND_CONFIG } from './config'
import { Place } from '../payload-types'

export type SendMailingOptions = {
    placeIds: number[]
    templateKey: TemplateKey
    subject?: string
    customMessage?: string
}

export const sendMailing = async (payload: Payload, options: SendMailingOptions) => {
    const { placeIds, templateKey, subject, customMessage } = options

    payload.logger.info(`[Mailing] Starting — template: ${templateKey}, recipients: ${placeIds.length}`)

    const template = EMAIL_TEMPLATES[templateKey]
    if (!template) {
        payload.logger.error(`[Mailing] Template '${templateKey}' not found!`)
        return
    }

    let places: Place[] = []
    try {
        const result = await payload.find({
            collection: 'places',
            where: { id: { in: placeIds } },
            limit: placeIds.length,
            depth: 0,
        })
        places = result.docs
    } catch (err) {
        payload.logger.error(`[Mailing] Error loading places: ${err}`)
        return
    }

    payload.logger.info(`[Mailing] Loaded ${places.length} places.`)

    let successCount = 0
    let failCount = 0
    const skipped = { has_owner: 0, already_contacted: 0, no_email: 0, opted_out: 0 }

    for (const place of places) {
        try {
            if (!place || typeof place !== 'object') {
                payload.logger.warn(`[Mailing] Skipping invalid place: ${JSON.stringify(place)}`)
                continue
            }

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

            payload.logger.info(`[Mailing] Preparing HTML for ${place.email} (ID: ${place.id})...`)
            
            const htmlContent = template.getHtml({
                placeName: place.name || 'Partnerze',
                customMessage,
                unsubscribeUrl: buildUnsubscribeUrl(place.id),
                placeUrl: place.slug ? `${BRAND_CONFIG.url}/miejsca/${place.slug}` : undefined,
            })

            const finalSubject = template.getSubject(subject)
            payload.logger.info(`[Mailing] Sending to ${place.email} with subject: ${finalSubject}`)

            await payload.sendEmail({
                to: place.email,
                subject: finalSubject,
                html: htmlContent,
            })
            successCount++

            // Update CRM status — best-effort
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
        } catch (err: any) {
            payload.logger.error(`[Mailing] Send error for place ${place.id} (${place.email}): ${err?.message || err}`)
            failCount++
        }
    }

    payload.logger.info(
        `[Mailing] Done. Sent: ${successCount}, Failed: ${failCount}, ` +
        `Skipped: ${skipped.already_contacted} already_contacted, ${skipped.has_owner} has_owner, ` +
        `${skipped.no_email} no_email, ${skipped.opted_out} opted_out`
    )
}
