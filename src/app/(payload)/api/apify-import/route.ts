import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const POST = async (req: NextRequest) => {
    const payload = await getPayload({ config })
    
    try {
        const { query, cityId, categoryId, maxResults = 20 } = await req.json()
        
        if (!query || !cityId || !categoryId) {
            return NextResponse.json({ error: 'Brak wymaganych danych (query, cityId, categoryId)' }, { status: 400 })
        }

        const apiKey = process.env.APIFY_API_TOKEN
        if (!apiKey) {
            return NextResponse.json({ 
                error: 'Brak klucza APIFY_API_TOKEN w pliku .env' 
            }, { status: 500 })
        }

        // We use popular actor: compass/crawler-google-places
        const actId = 'compass~crawler-google-places'

        // 1. Fetch city name to refine the search string
        const city = await payload.findByID({
            collection: 'cities',
            id: cityId,
        })
        const cityName = city?.name || ''
        
        // 2. Build more specific search string
        const searchString = `${query}${cityName ? `, ${cityName}` : ''}, Polska`
        
        // Apify Input structure for compass/crawler-google-places
        const apifyInput = {
            searchStringsArray: [searchString],
            maxCrawledPlacesPerSearch: maxResults,
            language: 'pl',
            countryCode: 'pl',
            scrapeContacts: true, // Key feature for CRM
            proxyConfig: {
                useApifyProxy: true,
            },
        }

        const response = await fetch(`https://api.apify.com/v2/acts/${actId}/runs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(apifyInput),
        })

        if (!response.ok) {
            const errData = await response.text()
            payload.logger.error(`Apify Start Error: ${errData}`)
            return NextResponse.json({ error: 'Nie udało się uruchomić procesu Apify' }, { status: 500 })
        }

        const data = await response.json()
        const runId = data.data.id

        // Store the city and category in our db/cache to know what to assign, 
        // or just return and have frontend pass it during status check
        
        return NextResponse.json({ runId, cityId, categoryId })

    } catch (err) {
        payload.logger.error(`Import Error: ${err}`)
        return NextResponse.json({ error: 'Wystąpił nieoczekiwany błąd serwera' }, { status: 500 })
    }
}
