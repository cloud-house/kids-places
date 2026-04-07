import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from "@payloadcms/email-resend";
import { s3Storage } from "@payloadcms/storage-s3";
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

if (!process.env.PAYLOAD_SECRET) throw new Error('Missing required env: PAYLOAD_SECRET')
if (!process.env.DATABASE_URI) throw new Error('Missing required env: DATABASE_URI')

import { Users } from './collections/Membership/Users'
import { Media } from './collections/Media/Media'
import { Categories } from './collections/Taxonomy/Categories'
import { Cities } from './collections/Taxonomy/Cities'
import { Places } from './collections/Content/Places'
import { PricingPlans } from './collections/Membership/PricingPlans'
import { Events } from './collections/Content/Events'
import { Organizers } from './collections/Content/Organizers'
import { Inquiries } from './collections/Interactions/Inquiries'
import { ClaimRequests } from './collections/Interactions/ClaimRequests'
import { Reviews } from './collections/Interactions/Reviews'
import { AttributeGroups } from './collections/Taxonomy/AttributeGroups'
import { Attributes } from './collections/Taxonomy/Attributes'
import { Pages } from './collections/Content/Pages'
import { Posts } from './collections/Blog/Posts'
import { PostCategories } from './collections/Taxonomy/PostCategories'
import { NewsletterSubscriptions } from './collections/Interactions/NewsletterSubscriptions'
import { Mailings } from './collections/Interactions/Mailings'
import { Tickets } from './collections/Content/Tickets'
import { BRAND_CONFIG } from './lib/config'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: Users.slug,
    },
    collections: [
        Users,
        Media,
        Categories,
        Cities,
        Places,
        PricingPlans,
        Events,
        Organizers,
        Inquiries,
        ClaimRequests,
        Reviews,
        AttributeGroups,
        Attributes,
        Pages,
        Posts,
        PostCategories,
        NewsletterSubscriptions,
        Mailings,
        Tickets,
    ],
    editor: lexicalEditor({}),
    secret: process.env.PAYLOAD_SECRET!,
    typescript: {
        outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
    db: postgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URI!,
        },
        push: false, // Turn off automatic schema push to use migrations instead
    }),
    sharp,
    email: resendAdapter({
        defaultFromAddress: BRAND_CONFIG.defaultFromAddress,
        defaultFromName: BRAND_CONFIG.defaultFromName,
        apiKey: process.env.RESEND_API_KEY!,
    }),
    plugins: [
        s3Storage({
            collections: {
                media: {
                    prefix: "media",
                },
            },
            bucket: process.env.S3_BUCKET!,
            config: {
                forcePathStyle: true, // Important for using Supabase
                credentials: {
                    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
                },
                region: process.env.S3_REGION,
                endpoint: process.env.S3_ENDPOINT,
            },
        }),
    ],
})
