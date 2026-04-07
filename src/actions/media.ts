'use server'

import { getPayloadClient } from '@/lib/payload-client'
import { headers } from 'next/headers'

export async function uploadMediaAction(formData: FormData) {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
        return { success: false, error: 'Musisz być zalogowany' }
    }

    const file = formData.get('file') as File
    if (!file) {
        return { success: false, error: 'Brak pliku' }
    }

    try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const media = await payload.create({
            collection: 'media',
            data: {
                alt: file.name,
            },
            file: {
                data: buffer,
                mimetype: file.type,
                name: file.name,
                size: file.size,
            },
        })

        return { success: true, id: media.id, url: media.url }
    } catch (error: unknown) {
        console.error('Error uploading media:', error)
        return { success: false, error: 'Błąd przesyłania pliku: ' + (error instanceof Error ? error.message : String(error)) }
    }
}

export async function getMediaAction(id: string | number) {
    const payload = await getPayloadClient()

    try {
        const media = await payload.findByID({
            collection: 'media',
            id: id,
        })

        return { success: true, url: media.url }
    } catch (error) {
        console.error('Error fetching media:', error)
        return { success: false, error: 'Błąd pobierania mediów' }
    }
}
