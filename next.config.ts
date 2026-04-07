import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Support for newer Next.js versions
  serverActions: {
    bodySizeLimit: "10mb",
  },
  // Support for older Next.js versions or specific configurations
  experimental: {
    // @ts-ignore
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [new URL(process.env.S3_ENDPOINT || "http://localhost:3000")]
  },
  async redirects() {
    return [
      {
        source: '/cennik',
        destination: '/dla-biznesu/cennik-premium',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
