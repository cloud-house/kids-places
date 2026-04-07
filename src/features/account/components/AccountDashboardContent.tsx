import React from 'react';
import { getPayloadClient } from '@/lib/payload-client';
import { getAttributes } from '@/features/attributes/service';
import { getCategories } from '@/features/categories/service';
import { getOrganizerReviewsAction, getParentReviewsAction } from '@/features/reviews/actions';
import { getOrganizerInquiries } from '@/features/inquiries/service';
import { ManageAccountContent } from './ManageAccountContent';
import { PricingPlan, Place, Event, Category, Review, Organizer, User } from '@/payload-types';

interface AccountDashboardContentProps {
    userId: number;
    userName: string;
    userRoles: string[];
}

export const AccountDashboardContent = async ({ userId, userRoles }: AccountDashboardContentProps) => {
    const payload = await getPayloadClient();

    // Fetch user details
    const fullUser = await payload.findByID({
        collection: 'users',
        id: userId,
    });

    // Determine reviews mode
    const isOrganizer = userRoles?.includes('organizer') || userRoles?.includes('admin');
    const reviewsPromise = isOrganizer ? getOrganizerReviewsAction() : getParentReviewsAction();

    // Fetch user's places and events
    const [{ docs: places }, { docs: events }, categories, reviews, attributes, inquiries, organizerRes] = await Promise.all([
        payload.find({
            collection: 'places',
            where: { owner: { equals: userId } },
            depth: 1,
        }),
        payload.find({
            collection: 'events',
            where: { owner: { equals: userId } },
            depth: 1,
        }),
        getCategories(),
        reviewsPromise,
        getAttributes(),
        isOrganizer ? getOrganizerInquiries(userId) : Promise.resolve([]),
        isOrganizer ? payload.find({
            collection: 'organizers',
            where: { owner: { equals: userId } },
            depth: 1, // To get plan details
            limit: 1,
        }) : Promise.resolve({ docs: [] }),
    ]);

    const organizer = organizerRes.docs[0] as Organizer | undefined;
    const plan = organizer?.plan as PricingPlan | null | undefined;

    const planLimits = {
        maxPlaces: plan?.maxPlaces ?? 1,
        maxEvents: plan?.maxEvents ?? 1,
    };

    return (
        <ManageAccountContent
            user={fullUser as User}
            places={places as Place[]}
            events={events as Event[]}
            categories={categories as Category[]}
            attributes={attributes}
            planLimits={planLimits}
            reviews={reviews as Review[]}
            reviewsMode={isOrganizer ? 'organizer' : 'parent'}
            inquiries={inquiries}
            planName={plan?.name}
            organizer={organizer}
        />
    );
};
