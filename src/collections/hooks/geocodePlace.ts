import { CollectionBeforeChangeHook } from 'payload'
import { BRAND_CONFIG } from '@/lib/config'

/**
 * Hook to automatically geocode a place's address (street + city) 
 * if coordinates are missing.
 */
export const geocodePlace: CollectionBeforeChangeHook = async ({
    data,
    req,
}) => {
    // Only geocode if coordinates are missing and we have enough address info
    if (data.latitude && data.longitude) {
        return data
    }

    const { street, city } = data
    if (!city) {
        return data
    }

    try {
        let cityName = ''

        // If city is a relationship (ID), fetch the city document to get its name
        if (typeof city === 'string' || typeof city === 'number') {
            const cityDoc = await req.payload.findByID({
                collection: 'cities',
                id: city,
                depth: 0,
            })
            cityName = cityDoc?.name || ''
        } else if (typeof city === 'object' && 'name' in city) {
            cityName = city.name as string
        }

        if (!cityName) return data

        const query = `${street ? `${street}, ` : ''}${cityName}, Poland`

        req.payload.logger.info(`Geocoding address: ${query}`)

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query
            )}&limit=1`,
            {
                headers: {
                    'User-Agent': `KidsPlacesApp/1.0 (${process.env.CONTACT_EMAIL || BRAND_CONFIG.contactEmail})`,
                },
                signal: controller.signal,
            }
        )

        clearTimeout(timeout)

        const results = await response.json()

        if (results && results.length > 0) {
            const { lat, lon } = results[0]
            data.latitude = parseFloat(lat)
            data.longitude = parseFloat(lon)
            req.payload.logger.info(`Geocoding success: ${lat}, ${lon}`)
        } else {
            req.payload.logger.warn(`Geocoding failed for: ${query}`)
        }
    } catch (error) {
        req.payload.logger.error(`Geocoding error: ${error instanceof Error ? error.message : String(error)}`)
    }

    return data
}
