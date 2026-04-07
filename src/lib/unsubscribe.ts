import crypto from 'crypto'
import { BRAND_CONFIG } from './config'

function getSecret(): string {
    return process.env.PAYLOAD_SECRET || ''
}

export function generateUnsubscribeToken(placeId: number | string): string {
    return crypto
        .createHmac('sha256', getSecret())
        .update(String(placeId))
        .digest('hex')
}

export function verifyUnsubscribeToken(placeId: number | string, token: string): boolean {
    const expected = generateUnsubscribeToken(placeId)
    try {
        return crypto.timingSafeEqual(
            Buffer.from(expected, 'hex'),
            Buffer.from(token, 'hex')
        )
    } catch {
        return false
    }
}

export function buildUnsubscribeUrl(placeId: number | string): string {
    const token = generateUnsubscribeToken(placeId)
    return `${BRAND_CONFIG.url}/api/unsubscribe?id=${placeId}&token=${token}`
}
