# Kids Places — Claude Code Instructions

## Project Overview

Kids Places is a Next.js 15 + Payload CMS 3 directory platform for children's places and events in Poland. Parents browse places (playrooms, parks, pools) and events. Organizers manage listings via a dedicated dashboard. Monetization through Stripe-powered premium plans.

- **Frontend**: Next.js 15 App Router, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend/CMS**: Payload CMS 3.0 (Local API inside Next.js)
- **Database**: PostgreSQL (Supabase)
- **Storage**: S3-compatible (Supabase Storage)
- **Payments**: Stripe
- **Email**: Resend

## Key Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm test         # Playwright E2E tests
pnpm test:unit    # Vitest unit tests
pnpm generate:types  # Regenerate payload-types.ts after collection changes
pnpm seed         # Seed database with core + mock data
```

## Critical Rules

### 1. Always Use Payload API — Never Direct SQL

All data operations MUST go through Payload Local API or REST API. Direct SQL bypasses version tables (`_places_v`), hooks (geocoding, plan sync, media cleanup), and draft/publish state.

```typescript
// ❌ NEVER
await db.query("UPDATE places SET email = $1 WHERE id = $2", [email, id])

// ✅ ALWAYS
await payload.update({ collection: 'places', id, data: { email } })
```

See `.agent/rules/payload-api-only.md` for details.

### 2. Environment Variables — Fail Fast, No Fallbacks

Use `src/env.ts` (Zod-validated) for all env access. Never use `|| ''` or `|| 'default'` fallbacks.

```typescript
// ❌ NEVER
apiKey: process.env.MY_KEY || ''

// ✅ ALWAYS
import { env } from '@/env'
apiKey: env.MY_KEY
```

See `.agent/rules/env-validation.md` for details.

### 3. Proxy Third-Party APIs Through Next.js Routes

Never call external APIs from client components when:
- The request requires a `User-Agent` header (e.g., Nominatim)
- The request uses an API token (e.g., Apify, Stripe)

Create a `/api/...` route handler and call that instead. Use `Authorization: Bearer <token>` headers, never `?token=` query params.

See `.agent/rules/third-party-api-proxy.md` for details.

### 4. TypeScript — No `any`, Minimize `as unknown as`

`strict: true` is enabled. Use `unknown` + type guards instead of `any`. Avoid `as unknown as X` — fix the root type instead (e.g., fix return types of utility functions).

See `.agent/rules/no-any.md` for details.

### 5. Icons — Lucide React Only

Use `lucide-react` for all icons. Standard sizes: `size={16}` for indicators, `size={14}` for inline text, `size={48}` for fallback placeholders. Always add `aria-hidden="true"` to decorative icons.

See `.agent/rules/lucide-icons.md` for details.

### 6. Payload Hooks Best Practices

Wrap hook logic in `try/catch`, use `req.payload.logger`. On delete, cascade to related media and child records.

See `.agent/rules/payload-hooks.md` for details.

## Project Structure

```
src/
├── app/
│   ├── (frontend)/          # Public-facing Next.js pages
│   └── (payload)/           # Payload admin + API routes
├── collections/             # Payload collection definitions
│   ├── Content/             # Places, Events, Pages, Organizers
│   ├── Membership/          # Users, PricingPlans
│   ├── Taxonomy/            # Categories, Cities, Attributes
│   ├── Interactions/        # Inquiries, Reviews, ClaimRequests
│   └── hooks/               # Shared Payload hooks
├── features/                # Domain-driven feature modules
│   ├── places/              # Place listing, cards, service
│   ├── events/              # Event listing, cards, service
│   ├── auth/                # Login, register
│   ├── account/             # Organizer dashboard, forms
│   └── favorites/           # Client-side favorites
├── components/              # Shared UI components
├── lib/                     # Config, utilities, payload-client
├── scripts/                 # Seed scripts
└── env.ts                   # Zod env validation (fail-fast)
```

## Important Gotchas

- **Payload versions**: `payload.update()` writes to both `places` and `_places_v`. Direct SQL only writes to `places` — versioned data will be stale.
- **Production REST API**: Always use `https://www.kids-places.pl` (with `www`). Non-www redirects break cookie-based auth.
- **`payload-types.ts`**: Auto-generated — never edit manually. Regenerate with `pnpm generate:types` after changing collections.
- **ISR revalidation**: List pages (`/miejsca`, `/wydarzenia`) revalidate every 1–2 hours. After bulk data changes, trigger revalidation manually via `revalidatePath`.
- **Draft places**: Created via Apify import as `draft: true`. Must be published manually in Payload admin before they appear on the site.

## Further Documentation

- `.agent/rules/` — Detailed coding rules
- `documentation/architecture.md` — System architecture and data model
- `documentation/business_rules.md` — Account types, permissions, pricing plans
