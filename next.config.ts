import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [new URL(process.env.S3_ENDPOINT!)],
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
