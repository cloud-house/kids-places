'use server'

import { getPayloadClient } from '@/lib/payload-client'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import { BRAND_CONFIG } from '@/lib/config'
import { ActionResponse, handleActionError } from '@/lib/utils/actions'

import { Resend } from 'resend'
import { ClaimRequestEmail } from '@/emails/ClaimRequestEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendClaimEmail(email: string, token: string, placeName: string) {
    const claimUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/claim/verify/${token}`

    try {
        await resend.emails.send({
            from: `${BRAND_CONFIG.defaultFromName} <${BRAND_CONFIG.defaultFromAddress}>`,
            to: email,
            subject: `Potwierdź przejęcie miejsca: ${placeName}`,
            react: ClaimRequestEmail({ placeName, url: claimUrl }),
        })
    } catch (error) {
        console.error('Failed to send claim email:', error)
        // Ensure we don't block the flow, but logging is important
    }
}

export async function requestClaimAction(placeId: number): Promise<ActionResponse> {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: await headers() })
    try {
        const place = await payload.findByID({
            collection: 'places',
            id: placeId,
        })

        if (!place) {
            return { success: false, error: 'Miejsce nie istnieje.' }
        }

        if (!place.email) {
            return { success: false, error: 'To miejsce nie ma przypisanego adresu e-mail. Skontaktuj się z administracją.' }
        }

        const defaultOrganizer = await payload.find({
            collection: 'organizers',
            where: { name: { equals: BRAND_CONFIG.defaultOrganizerName } },
            limit: 1,
        })

        const defaultOrgId = defaultOrganizer.docs[0]?.id

        const isClaimable = !place.organizer || (
            typeof place.organizer === 'object'
                ? place.organizer.id === defaultOrgId
                : place.organizer === defaultOrgId
        )

        if (!isClaimable) {
            return { success: false, error: 'To miejsce jest już zarządzane przez innego właściciela.' }
        }

        const token = crypto.randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        await payload.create({
            collection: 'claim-requests',
            data: {
                place: placeId,
                user: user?.id || null,
                email: place.email,
                token,
                status: 'pending',
                expiresAt: expiresAt.toISOString(),
            },
        })

        await sendClaimEmail(place.email, token, place.name)

        return { success: true, message: `Wysłano link weryfikacyjny na adres ${place.email}` }
    } catch (error) {
        return handleActionError(error)
    }
}

export async function getClaimRequestAction(token: string): Promise<ActionResponse & { data?: { id: number; placeName: string; placeId: number; email: string } }> {
    const payload = await getPayloadClient()

    try {
        const requests = await payload.find({
            collection: 'claim-requests',
            where: {
                token: { equals: token },
            },
            depth: 1,
        })

        if (requests.docs.length === 0) {
            return { success: false, error: 'Link jest nieprawidłowy.' }
        }

        const request = requests.docs[0]
        const isExpired = new Date(request.expiresAt) < new Date()

        if (isExpired) {
            return { success: false, error: 'Tego linku wygasł.', status: 400 }
        }

        if (request.status !== 'pending') {
            return { success: false, error: 'To zgłoszenie zostało już przetworzone.', status: 400 }
        }

        return {
            success: true,
            data: {
                id: request.id,
                placeName: typeof request.place === 'object' ? request.place.name : 'Miejsce',
                placeId: typeof request.place === 'object' ? request.place.id : request.place,
                email: request.email,
            }
        }
    } catch (error) {
        return handleActionError(error)
    }
}

export async function verifyClaimAction(token: string): Promise<ActionResponse> {
    const payload = await getPayloadClient()
    const { user: currentUser } = await payload.auth({ headers: await headers() })

    if (!currentUser) {
        return { success: false, error: 'Musisz być zalogowany, aby dokończyć przejmowanie miejsca.', status: 401 }
    }

    try {
        // Find pending request
        const requests = await payload.find({
            collection: 'claim-requests',
            where: {
                token: { equals: token },
                status: { equals: 'pending' },
                expiresAt: { greater_than: new Date().toISOString() },
            },
            depth: 1,
        })

        if (requests.docs.length === 0) {
            return { success: false, error: 'Link jest nieprawidłowy lub wygasł.' }
        }

        const request = requests.docs[0]
        const placeId = typeof request.place === 'object' ? request.place.id : request.place
        const userId = currentUser.id

        // 1. Check if user already has an organizer profile
        let organizerId: number | undefined

        const userOrganizers = await payload.find({
            collection: 'organizers',
            where: { owner: { equals: userId } },
            limit: 1,
        })

        if (userOrganizers.docs.length > 0) {
            organizerId = userOrganizers.docs[0].id
        } else {
            // Create new organizer
            const placeName = typeof request.place === 'object' ? request.place.name : 'Mój Organizator'
            const organizerName = placeName || currentUser.name || 'Mój Organizator'


            const org = await payload.create({
                collection: 'organizers',
                data: {
                    name: organizerName,
                    owner: userId,
                    slug: organizerName, // Hook will format it
                },
                draft: false,
            })
            organizerId = org.id
        }

        // 2. Update Place owner/organizer
        await payload.update({
            collection: 'places',
            id: placeId,
            data: {
                organizer: organizerId,
                owner: userId,
            },
        })

        // 3. Mark request verified
        await payload.update({
            collection: 'claim-requests',
            id: request.id,
            data: {
                status: 'verified',
                user: userId,
            },
        })


        // Revalidate place page
        const placeForReval = await payload.findByID({ collection: 'places', id: placeId, depth: 0 })
        if (placeForReval && placeForReval.slug) {
            revalidatePath(`/miejsca/${placeForReval.slug}`)
        }

        return { success: true, message: 'Pomyślnie przejęto miejsce!' }
    } catch (error) {
        return handleActionError(error)
    }
}
