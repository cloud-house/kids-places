import { NextRequest, NextResponse } from 'next/server'
import { BRAND_CONFIG } from '@/lib/config'

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q')
    if (!q) {
        return NextResponse.json({ error: 'Missing query parameter q' }, { status: 400 })
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
    const response = await fetch(url, {
        headers: {
            'User-Agent': `KidsPlacesApp/1.0 (${BRAND_CONFIG.contactEmail})`,
        },
    })

    if (!response.ok) {
        return NextResponse.json({ error: 'Geocoding request failed' }, { status: 502 })
    }

    const data = await response.json()
    return NextResponse.json(data)
}
