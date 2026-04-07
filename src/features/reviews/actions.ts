'use server';

import { getPayloadClient } from '@/lib/payload-client';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ActionResponse, handleActionError, MESSAGES } from '@/lib/utils/actions';

export async function addReviewAction(data: {
    placeId: number
    rating: number
    content: string
}, locale: 'pl' | 'en' | 'de' = 'pl'): Promise<ActionResponse> {
    const payload = await getPayloadClient()
    const { user } = await payload.auth({ headers: await headers() })

    if (!user) {
        return { success: false, error: MESSAGES[locale].unauthorized }
    }

    try {
        // Check if user already reviewed this place (optional constraint, good for UX)
        const existingReviews = await payload.find({
            collection: 'reviews',
            where: {
                and: [
                    { place: { equals: data.placeId } },
                    { user: { equals: user.id } }
                ]
            }
        })

        if (existingReviews.totalDocs > 0) {
            const errorMsg = locale === 'pl' ? 'Dodałeś już opinię dla tego miejsca.' : 'You have already reviewed this place.';
            return { success: false, error: errorMsg }
        }

        await payload.create({
            collection: 'reviews',
            data: {
                place: data.placeId,
                user: user.id,
                rating: data.rating,
                content: data.content,
                status: 'published',
            },
        })

        // Recalculate average rating for the place
        const { docs: allReviews } = await payload.find({
            collection: 'reviews',
            where: {
                and: [
                    { place: { equals: data.placeId } },
                    { status: { equals: 'published' } }
                ]
            },
            limit: 1000,
        })

        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length

        // Update the place
        const place = await payload.update({
            collection: 'places',
            id: data.placeId,
            data: {
                rating: Number(avgRating.toFixed(1)),
                reviewCount: allReviews.length,
            },
        })

        if (place && 'slug' in place) {
            revalidatePath(`/miejsca/${place.slug}`)
        }
        revalidatePath('/')

        return { success: true, message: MESSAGES[locale].success }
    } catch (error) {
        return handleActionError(error, locale)
    }
}

export async function replyToReviewAction(reviewId: number, replyContent: string, locale: 'pl' | 'en' | 'de' = 'pl'): Promise<ActionResponse> {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: MESSAGES[locale].unauthorized };

    try {
        // Verify ownership of the place related to the review
        const review = await payload.findByID({ collection: 'reviews', id: reviewId, depth: 1 });
        if (!review) return { success: false, error: MESSAGES[locale].notFound };

        const place = typeof review.place === 'object' ? review.place : null;
        if (!place || !place.owner || (typeof place.owner === 'object' ? place.owner.id : place.owner) !== user.id) {
            if (!user.roles?.includes('admin')) {
                return { success: false, error: MESSAGES[locale].forbidden };
            }
        }

        await payload.update({
            collection: 'reviews',
            id: reviewId,
            data: {
                reply: replyContent,
                replyDate: new Date().toISOString(),
            },
        });

        revalidatePath('/moje-konto');
        if (place && 'slug' in place) {
            revalidatePath(`/miejsca/${place.slug}`)
        }

        return { success: true, message: MESSAGES[locale].success };
    } catch (error) {
        return handleActionError(error, locale);
    }
}

export async function updateReviewAction(reviewId: number, content: string, rating: number, locale: 'pl' | 'en' | 'de' = 'pl'): Promise<ActionResponse> {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: MESSAGES[locale].unauthorized };

    try {
        const review = await payload.findByID({ collection: 'reviews', id: reviewId });

        if ((typeof review.user === 'object' ? review.user.id : review.user) !== user.id) {
            return { success: false, error: MESSAGES[locale].forbidden };
        }

        await payload.update({
            collection: 'reviews',
            id: reviewId,
            data: {
                content,
                rating,
            },
        });

        revalidatePath('/moje-konto');
        return { success: true, message: MESSAGES[locale].success };
    } catch (error) {
        return handleActionError(error, locale);
    }
}

export async function deleteReviewAction(reviewId: number, locale: 'pl' | 'en' | 'de' = 'pl'): Promise<ActionResponse> {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: MESSAGES[locale].unauthorized };

    try {
        const review = await payload.findByID({ collection: 'reviews', id: reviewId });

        if ((typeof review.user === 'object' ? review.user.id : review.user) !== user.id) {
            return { success: false, error: MESSAGES[locale].forbidden };
        }

        await payload.delete({
            collection: 'reviews',
            id: reviewId,
        });

        revalidatePath('/moje-konto');
        return { success: true, message: MESSAGES[locale].success };
    } catch (error) {
        return handleActionError(error, locale);
    }
}

export async function getOrganizerReviewsAction() {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return [];

    try {
        // 1. Find all places owned by user
        const places = await payload.find({
            collection: 'places',
            where: { owner: { equals: user.id } },
            limit: 100,
        });

        const placeIds = places.docs.map(p => p.id);

        if (placeIds.length === 0) return [];

        // 2. Find reviews for these places
        const reviews = await payload.find({
            collection: 'reviews',
            where: {
                place: { in: placeIds }
            },
            depth: 2, // Load user and place details
            sort: '-createdAt',
        });

        return reviews.docs;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getParentReviewsAction() {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return [];

    try {
        const reviews = await payload.find({
            collection: 'reviews',
            where: {
                user: { equals: user.id }
            },
            depth: 2,
            sort: '-createdAt',
        });

        return reviews.docs;
    } catch (error) {
        console.error(error);
        return [];
    }
}
