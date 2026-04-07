import { NextRequest } from 'next/server'

/**
 * Verifies the API key from the request headers
 * @param request - Next.js request object
 * @returns true if API key is valid
 * @throws Error if API key is missing or invalid
 */
export function verifyApiKey(request: NextRequest): boolean {
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.ADMIN_API_KEY

    if (!expectedKey) {
        console.error('[API Auth] ADMIN_API_KEY not configured in environment variables')
        throw new Error('Server configuration error')
    }

    if (!apiKey) {
        console.warn('[API Auth] Missing API key in request')
        throw new Error('Missing API key')
    }

    if (apiKey !== expectedKey) {
        console.warn('[API Auth] Invalid API key attempt')
        throw new Error('Invalid API key')
    }

    return true
}
