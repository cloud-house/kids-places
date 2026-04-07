import { z } from 'zod'

const envSchema = z.object({
    // Server
    NEXT_PUBLIC_SERVER_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    // Payload CMS
    PAYLOAD_SECRET: z.string().min(32, 'PAYLOAD_SECRET must be at least 32 characters'),

    // Database
    DATABASE_URI: z.string().min(1, 'DATABASE_URI is required'),

    // Stripe
    STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),

    // Resend (email)
    RESEND_API_KEY: z.string().startsWith('re_'),

    // S3 Storage
    S3_BUCKET: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_REGION: z.string().min(1),
    S3_ENDPOINT: z.string().url(),

    // Apify
    APIFY_API_TOKEN: z.string().min(1),

    // Admin
    ADMIN_API_KEY: z.string().min(32, 'ADMIN_API_KEY must be at least 32 characters'),

    // Analytics (optional)
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),
})

type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
    const result = envSchema.safeParse(process.env)

    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        const messages = Object.entries(errors)
            .map(([key, msgs]) => `  ${key}: ${msgs?.join(', ')}`)
            .join('\n')

        throw new Error(`Invalid environment variables:\n${messages}`)
    }

    return result.data
}

// Validate at module load time — fail fast on startup
export const env = validateEnv()
