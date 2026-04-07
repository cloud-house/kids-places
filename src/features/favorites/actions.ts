'use server';

import { getEventsByIds } from '@/features/events/service';
import { getPlacesByIds } from '@/features/places/service';

export async function getFavoritesData(ids: {
    placeIds: (string | number)[],
    eventIds: (string | number)[]
}) {
    const [places, events] = await Promise.all([
        getPlacesByIds(ids.placeIds),
        getEventsByIds(ids.eventIds)
    ]);

    return { places, events };
}
