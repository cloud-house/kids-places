import { MetadataRoute } from 'next';
import { BRAND_CONFIG } from '@/lib/config';
import { getPayloadClient } from '@/lib/payload-client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const payload = await getPayloadClient();

    // Static routes
    const staticRoutes = [
        '',
        '/miejsca',
        '/wydarzenia',
        '/kontakt',
        '/dla-biznesu/cennik-premium',
        '/blog',
    ].map((route) => ({
        url: `${BRAND_CONFIG.url}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Places
    const places = await payload.find({
        collection: 'places',
        limit: 1000,
        select: { slug: true, updatedAt: true },
    });

    const placeRoutes = places.docs.map((doc) => ({
        url: `${BRAND_CONFIG.url}/miejsca/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    // Dynamic Events
    const events = await payload.find({
        collection: 'events',
        limit: 1000,
        select: { slug: true, updatedAt: true },
    });

    const eventRoutes = events.docs.map((doc) => ({
        url: `${BRAND_CONFIG.url}/wydarzenia/${doc.slug}`,
        lastModified: new Date(doc.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...placeRoutes, ...eventRoutes];
}
