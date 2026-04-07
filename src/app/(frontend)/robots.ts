import { MetadataRoute } from 'next';
import { BRAND_CONFIG } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api', '/moje-konto'],
        },
        sitemap: `${BRAND_CONFIG.url}/sitemap.xml`,
    };
}
