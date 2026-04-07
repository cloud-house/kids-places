import { getPayloadClient } from '@/lib/payload-client';
import { cache } from 'react';

export const getCities = cache(async () => {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
        collection: 'cities',
        sort: '-isPopular name', // Popular first, then alphabetical
        limit: 100, // Should be enough for now
        pagination: false,
    });
    return docs;
});
