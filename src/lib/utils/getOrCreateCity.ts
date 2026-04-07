import { Payload } from 'payload';
import { getPayloadClient } from '@/lib/payload-client';
import { formatSlug } from './formatSlug';

/**
 * Finds a city by name (case-insensitive) or creates a new one.
 * Returns the City ID.
 */
export async function getOrCreateCity(cityName: string, payloadInstance?: Payload): Promise<number> {
    if (!cityName) throw new Error('City name is required');

    const payload = payloadInstance || await getPayloadClient();
    const cleanName = cityName.trim();
    // Simple normalization for slug
    const slug = formatSlug(cleanName);

    // Try to find existing city by slug first (most reliable)
    const existingCitiesBySlug = await payload.find({
        collection: 'cities',
        where: {
            slug: { equals: slug },
        },
        limit: 1,
        depth: 0,
    });

    if (existingCitiesBySlug.docs.length > 0) {
        return existingCitiesBySlug.docs[0].id;
    }

    // Create new city
    try {
        const newCity = await payload.create({
            collection: 'cities',
            data: {
                name: cleanName, // Use original casing for display
                slug: slug,
                isPopular: false,
            },
        });
        return newCity.id;
    } catch (error) {
        // Handle race condition where city might have been created in parallel
        const existingAfterError = await payload.find({
            collection: 'cities',
            where: {
                slug: { equals: slug },
            },
            limit: 1,
            depth: 0,
        });
        if (existingAfterError.docs.length > 0) {
            return existingAfterError.docs[0].id;
        }
        throw error;
    }
}
