import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload-client'
import { sendMailing } from '@/lib/mailing'

export const maxDuration = 300

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const { mailingId } = body
    if (!mailingId) {
        return NextResponse.json({ error: 'Missing mailingId' }, { status: 400 })
    }

    const payload = await getPayloadClient()
    try {
        payload.logger.info(`[Mailing Send] Starting send for mailingId: ${mailingId}`)
        await sendMailing(payload, mailingId)
        payload.logger.info(`[Mailing Send] Completed for mailingId: ${mailingId}`)
        return NextResponse.json({ ok: true })
    } catch (err) {
        payload.logger.error(`[Mailing Send] Failed for mailingId: ${mailingId}: ${err}`)
        return NextResponse.json({ error: 'Send failed' }, { status: 500 })
    }
}
