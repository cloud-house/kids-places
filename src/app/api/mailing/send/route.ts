import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'
import { sendMailing, SendMailingOptions } from '@/lib/mailing'
import { TemplateKey } from '@/lib/email-templates'

export const maxDuration = 300

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { placeIds, templateKey, subject, customMessage } = body

    if (!Array.isArray(placeIds) || placeIds.length === 0) {
        return NextResponse.json({ error: 'Missing or empty placeIds' }, { status: 400 })
    }
    if (!templateKey) {
        return NextResponse.json({ error: 'Missing templateKey' }, { status: 400 })
    }

    const options: SendMailingOptions = {
        placeIds: placeIds.map(Number),
        templateKey: templateKey as TemplateKey,
        subject,
        customMessage,
    }

    const payload = await getPayloadClient()
    try {
        payload.logger.info(`[Mailing Send] Starting — ${placeIds.length} places, template: ${templateKey}`)
        await sendMailing(payload, options)
        payload.logger.info(`[Mailing Send] Completed`)
        return NextResponse.json({ ok: true })
    } catch (err) {
        payload.logger.error(`[Mailing Send] Failed: ${err}`)
        return NextResponse.json({ error: 'Send failed' }, { status: 500 })
    }
}
