# Rule: Proxy Third-Party API Calls Through Next.js

Never call external APIs directly from browser-side code when the request requires headers that browsers restrict (e.g., `User-Agent`) or when API tokens must stay server-side.

## Why?

- Browsers silently ignore or block certain headers (`User-Agent`, `Authorization` in some contexts)
- API tokens in client-side code are visible to anyone in DevTools
- Nominatim (OpenStreetMap) requires a valid `User-Agent` or requests are rejected

## Pattern

Create a Next.js API route that proxies the request server-side:

```typescript
// src/app/api/geocode/route.ts
export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q')
    const response = await fetch(`https://nominatim.openstreetmap.org/search?...${q}`, {
        headers: { 'User-Agent': 'MyApp/1.0 (contact@example.com)' },
    })
    return NextResponse.json(await response.json())
}
```

```typescript
// In client component
const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`)
```

## API Token Security

Always use `Authorization: Bearer <token>` headers, never `?token=<value>` query params — query params appear in server logs and browser history.

### ❌ Bad
```typescript
fetch(`https://api.apify.com/v2/acts/${actId}/runs?token=${apiKey}`)
```

### ✅ Good
```typescript
fetch(`https://api.apify.com/v2/acts/${actId}/runs`, {
    headers: { 'Authorization': `Bearer ${apiKey}` },
})
```
