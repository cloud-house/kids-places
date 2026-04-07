import { NextRequest, NextResponse } from 'next/server'
import { getPayload, Where } from 'payload'
import config from '@/payload.config'

export const GET = async (req: NextRequest) => {
    const payload = await getPayload({ config })
    
    try {
        const url = new URL(req.url)
        const runId = url.searchParams.get('runId')
        const cityIdParam = url.searchParams.get('cityId')
        const categoryIdParam = url.searchParams.get('categoryId')

        if (!runId || !cityIdParam || !categoryIdParam) {
            return NextResponse.json({ error: 'Brakujących parametrów (runId, cityId, categoryId)' }, { status: 400 })
        }

        const cityId = Number(cityIdParam)
        const categoryId = Number(categoryIdParam)

        const apiKey = process.env.APIFY_API_TOKEN
        if (!apiKey) {
            return NextResponse.json({ error: 'Brak klucza APIFY_API_TOKEN' }, { status: 500 })
        }

        // 1. Check Run Status
        const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`)
        if (!statusRes.ok) {
            return NextResponse.json({ error: 'Błąd sprawdzania statusu Apify' }, { status: 500 })
        }
        
        const statusData = await statusRes.json()
        const status = statusData.data.status
        const datasetId = statusData.data.defaultDatasetId

        // If not finished, return current status
        if (status !== 'SUCCEEDED') {
            return NextResponse.json({ status })
        }

        // 2. Fetch Dataset if Succeeded
        const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiKey}`)
        if (!datasetRes.ok) {
            return NextResponse.json({ error: 'Błąd pobierania wyników (dataset) z Apify' }, { status: 500 })
        }

        const items = await datasetRes.json()
        const results = []

        // 3. Import logic
        for (const placeData of items) {
            if (!placeData.title) continue

            // Safeguard: Skip records that are clearly not in Poland or don't match the city context
            const isPoland = placeData.countryCode?.toLowerCase() === 'pl' || 
                             placeData.address?.toLowerCase().includes('polska') ||
                             placeData.address?.toLowerCase().includes('poland')
            
            if (!isPoland && placeData.countryCode) {
                payload.logger.warn(`Skipping import for ${placeData.title}: result is outside of Poland (${placeData.countryCode})`)
                continue
            }

            // Determine contact info & details early for duplicate check
            const phone = placeData.phoneUnformatted || placeData.phone || undefined
            let email = undefined
            if (placeData.emails && Array.isArray(placeData.emails) && placeData.emails.length > 0) {
                email = placeData.emails[0]
            }
            const postalCode = placeData.postalCode || undefined

            // Prevent duplicates (by name+city OR by email)
            const duplicateFilters: Where[] = [
                {
                    and: [
                        { name: { equals: placeData.title } },
                        { city: { equals: cityId } },
                    ],
                },
            ]

            if (email) {
                duplicateFilters.push({ email: { equals: email } })
            }

            const existing = await payload.find({
                collection: 'places',
                where: {
                    or: duplicateFilters,
                },
            })

            if (existing.docs.length > 0) {
                results.push({ name: placeData.title, status: 'skipped (exists)' })
                continue
            }

            try {
                // Construct social links
                const socialLinks: { platform: 'Website' | 'Facebook' | 'Instagram' | 'TikTok', url: string }[] = []
                if (placeData.website) {
                    socialLinks.push({ platform: 'Website', url: placeData.website })
                }
                if (placeData.facebook) {
                    socialLinks.push({ platform: 'Facebook', url: placeData.facebook })
                }
                if (placeData.instagram) {
                    socialLinks.push({ platform: 'Instagram', url: placeData.instagram })
                }
                // Try to download logo/image
                let logoId: number | undefined = undefined
                const imageUrl = placeData.imageUrl || placeData.thumbnailUrl
                if (imageUrl) {
                    try {
                        const imgRes = await fetch(imageUrl)
                        if (imgRes.ok) {
                            const contentType = imgRes.headers.get('content-type') || 'image/jpeg'
                            const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'
                            const buffer = Buffer.from(await imgRes.arrayBuffer())
                            const fileName = `${placeData.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}_logo.${ext}`

                            const media = await payload.create({
                                collection: 'media',
                                data: {
                                    alt: placeData.title,
                                },
                                file: {
                                    data: buffer,
                                    name: fileName,
                                    mimetype: contentType,
                                    size: buffer.length,
                                },
                            })
                            logoId = media.id
                        }
                    } catch (imgErr) {
                        payload.logger.warn(`Could not download logo for ${placeData.title}: ${imgErr}`)
                    }
                }

                const newPlace = await payload.create({
                    collection: 'places',
                    data: {
                        name: placeData.title,
                        street: placeData.street || placeData.address || '',
                        postalCode: postalCode,
                        city: cityId,
                        category: categoryId,
                        latitude: placeData.location?.lat,
                        longitude: placeData.location?.lng,
                        phoneNumber: phone,
                        email: email,
                        crmStatus: 'new',
                        socialLinks: socialLinks.length > 0 ? socialLinks : undefined,
                        logo: logoId,
                    },
                    draft: true,
                })
                results.push({ name: placeData.title, status: 'imported', id: newPlace.id })
            } catch (err) {
                payload.logger.error(`Import Error for ${placeData.title}: ${err}`)
                results.push({ name: placeData.title, status: 'error' })
            }
        }

        return NextResponse.json({ status: 'SUCCEEDED', results })

    } catch (err) {
        payload.logger.error(`Apify Status Error: ${err}`)
        return NextResponse.json({ error: 'Nieoczekiwany błąd serwera' }, { status: 500 })
    }
}
