# Rule: Validate Environment Variables at Startup

All required environment variables must be validated at module load time using `src/env.ts`. The app should fail immediately with a clear error if any variable is missing or malformed — not silently use empty strings or defaults.

## Why?

Silent fallbacks (`|| ''`, `|| 'secret'`) cause hard-to-debug runtime failures. A startup crash with a clear message is far better than a live app silently broken.

## Usage

Import `env` from `src/env.ts` for typed, validated access to env vars:

```typescript
import { env } from '@/env'

const client = new S3Client({
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    },
})
```

## Adding New Variables

Add the variable to the Zod schema in `src/env.ts`, then add it to `.env.example`:

```typescript
// src/env.ts
const envSchema = z.object({
    // ...existing vars
    MY_NEW_API_KEY: z.string().min(1),
})
```

## What NOT to do

### ❌ Bad — silent fallback hides missing config
```typescript
apiKey: process.env.MY_API_KEY || '',
secret: process.env.PAYLOAD_SECRET || 'fallback-secret',
```

### ✅ Good — fail fast, fail loud
```typescript
import { env } from '@/env'
apiKey: env.MY_API_KEY,
```
