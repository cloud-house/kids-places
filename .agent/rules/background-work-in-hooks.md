# Rule: Background Work in Payload Hooks — Use a Dedicated Endpoint

## Problem

Payload `afterChange` hooks run inside the same serverless function invocation as the admin HTTP request. Two common mistakes:

1. **Awaiting long-running work** (e.g., `await sendMailing(...)`) — blocks the admin UI for the entire duration
2. **Fire-and-forget async** (e.g., `sendMailing(...).catch(...)` without await) — Vercel kills pending async code once the HTTP response is sent

Both patterns fail: the first gives terrible UX, the second silently drops work.

## Solution

For any work that takes more than ~500ms, create a **dedicated route handler** and call it via `fetch` (no await) from the hook.

```typescript
// ❌ NEVER — blocks admin UI
afterChange: [async ({ doc, req }) => {
    await doHeavyWork(req.payload, doc.id)
}]

// ❌ NEVER — killed by Vercel after response
afterChange: [({ doc, req }) => {
    doHeavyWork(req.payload, doc.id).catch(...)
}]

// ✅ CORRECT — dispatches to a separate serverless function
afterChange: [({ doc, req }) => {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.kids-places.pl'
    fetch(`${baseUrl}/api/your-background-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: doc.id }),
    }).catch(err => req.payload.logger.error(`Trigger failed: ${err}`))
    // No await — intentional. The HTTP request is dispatched at the network level
    // and lands in a separate serverless function with its own lifecycle.
}]
```

## Dedicated Endpoint Pattern

```typescript
// src/app/api/your-background-job/route.ts
export const maxDuration = 300  // Up to 300s, independent of the originating request

export async function POST(req: NextRequest) {
    // Auth check
    const authHeader = req.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await req.json()
    const payload = await getPayloadClient()
    await doHeavyWork(payload, id)
    return NextResponse.json({ ok: true })
}
```

Also add to `vercel.json`:
```json
"functions": {
    "src/app/api/your-background-job/route.ts": { "maxDuration": 300 }
}
```

## Why the Fetch Trick Works

The `fetch(url)` call initiates a TCP connection and dispatches an HTTP request at the OS/network level. The target serverless function receives and starts processing the request independently, even if the originating function is immediately killed after returning its response. These are two separate invocations with separate lifecycles.

## Idempotency

Background jobs triggered this way should be idempotent — add a guard at the start checking whether work was already done (e.g., `if (doc.sentAt) return`), since the endpoint could theoretically be called twice.
