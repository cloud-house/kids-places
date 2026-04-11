'use server';

import { getPayloadClient } from '@/lib/payload-client';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { Place, Event, Organizer } from '@/payload-types';
import { stringToLexical } from '@/components/RichText/utils';
import { placeSchema, type PlaceSchema } from '../places/schemas';
import { eventSchema, type EventSchema } from '../events/schemas';
import { organizerSchema, type OrganizerSchema } from './schemas';
import { getOrCreateCity } from '@/lib/utils/getOrCreateCity';
import { formatSlug } from '@/lib/utils/formatSlug';


// Place Actions
export async function createPlaceAction(data: PlaceSchema) {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const validatedData = placeSchema.parse(data);

        const cityId = await getOrCreateCity(validatedData.city, payload);

        // Find user's organizer
        const organizers = await payload.find({
            collection: 'organizers',
            where: {
                owner: { equals: user.id }
            },
            limit: 1,
        });

        const organizerId = organizers.docs.length > 0 ? organizers.docs[0].id : undefined;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { website, facebook, instagram, tiktok, tickets, storyBlocks: _storyBlocks, ...restData } = validatedData;

        const socialLinks: NonNullable<Place['socialLinks']> = [];
        if (website) socialLinks.push({ platform: 'Website', url: website });
        if (facebook) socialLinks.push({ platform: 'Facebook', url: facebook });
        if (instagram) socialLinks.push({ platform: 'Instagram', url: instagram });
        if (tiktok) socialLinks.push({ platform: 'TikTok', url: tiktok });

        const placeData: Partial<Place> = {
            ...restData,
            category: parseInt(validatedData.category),
            latitude: validatedData.latitude,
            longitude: validatedData.longitude,
            longDescription: typeof validatedData.longDescription === 'string'
                ? stringToLexical(validatedData.longDescription)
                : (validatedData.longDescription as Place['longDescription']),
            logo: validatedData.logo
                ? (typeof validatedData.logo === 'string' ? parseInt(validatedData.logo) : validatedData.logo)
                : null,
            socialLinks,
            city: cityId,
            owner: user.id,
            organizer: organizerId,
            features: validatedData.features?.map(f => ({
                attribute: typeof f.attribute === 'string' ? parseInt(f.attribute) : f.attribute,
                value: f.value
            })) || [],
            gallery: validatedData.gallery?.map(id => ({
                image: typeof id === 'string' ? parseInt(id) : id
            })),
            _status: validatedData._status || 'published',
        }

        const newPlace = await payload.create({
            collection: 'places',
            data: placeData as Place,
            draft: false,
        });

        // Create tickets and link to place
        if (tickets && tickets.length > 0) {
            const ticketIds = await Promise.all(
                tickets.map(async (t) => {
                    const ticket = await payload.create({
                        collection: 'tickets',
                        data: {
                            ...t,
                            place: newPlace.id,
                            owner: user.id,
                        },
                    });
                    return ticket.id;
                })
            );

            // Update place with ticket IDs
            await payload.update({
                collection: 'places',
                id: newPlace.id,
                data: {
                    tickets: ticketIds,
                },
            });
        }

        revalidatePath('/moje-konto');
        return { success: true, message: 'Miejsce zostało utworzone pomyślnie.' };
    } catch (error: unknown) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : 'Wystąpił błąd podczas tworzenia miejsca.' };
    }
}

export async function updatePlaceAction(id: number, data: PlaceSchema) {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const validatedData = placeSchema.parse(data);

        const place = await payload.findByID({
            collection: 'places',
            id,
            depth: 0,
        });

        const isAdmin = user.roles?.includes('admin');
        if (!place || (!isAdmin && (typeof place.owner === 'object' ? place.owner?.id : place.owner) !== user.id)) {
            return { success: false, error: 'Nie masz uprawnień do edycji tego miejsca.' };
        }

        const cityId = await getOrCreateCity(validatedData.city, payload);

        // Find user's organizer
        const organizers = await payload.find({
            collection: 'organizers',
            where: {
                owner: { equals: user.id }
            },
            limit: 1,
        });

        const organizerId = organizers.docs.length > 0 ? organizers.docs[0].id : undefined;

        const { website, facebook, instagram, tiktok, tickets, storyBlocks: storyBlocksRaw, ...restData } = validatedData;

        const socialLinks: NonNullable<Place['socialLinks']> = [];
        if (website) socialLinks.push({ platform: 'Website', url: website });
        if (facebook) socialLinks.push({ platform: 'Facebook', url: facebook });
        if (instagram) socialLinks.push({ platform: 'Instagram', url: instagram });
        if (tiktok) socialLinks.push({ platform: 'TikTok', url: tiktok });

        // Transform description for Payload (Lexical)
        const longDescription = typeof validatedData.longDescription === 'string'
            ? stringToLexical(validatedData.longDescription)
            : (validatedData.longDescription as Place['longDescription']);

        type PlaceStoryBlock = NonNullable<Place['storyBlocks']>[number];
        const storyBlocks = storyBlocksRaw?.map((block): PlaceStoryBlock => {
            if (block.blockType === 'storyText') {
                return {
                    blockType: 'storyText',
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    content: block.content as any,
                    id: block.id,
                }
            }
            if (block.blockType === 'storyImage') {
                return {
                    blockType: 'storyImage',
                    image: block.image != null ? (typeof block.image === 'string' ? parseInt(block.image) : block.image) : 0,
                    caption: block.caption,
                    size: block.size,
                    id: block.id,
                }
            }
            return {
                blockType: 'storyGallery',
                images: block.images?.map(img => ({
                    image: typeof img.image === 'string' ? parseInt(img.image) : img.image,
                })),
                caption: block.caption,
                id: block.id,
            }
        }) ?? undefined;

        const updateData: Partial<Place> = {
            ...restData,
            category: parseInt(validatedData.category),
            longDescription,
            logo: validatedData.logo
                ? (typeof validatedData.logo === 'string' ? parseInt(validatedData.logo) : validatedData.logo)
                : null,
            socialLinks,
            city: cityId,
            organizer: organizerId,
            features: validatedData.features?.map(f => ({
                attribute: typeof f.attribute === 'string' ? parseInt(f.attribute) : f.attribute,
                value: f.value
            })) || [],
            gallery: validatedData.gallery?.map(id => ({
                image: typeof id === 'string' ? parseInt(id) : id
            })),
            storyBlocks,
            _status: validatedData._status || 'published',
        }

        await payload.update({
            collection: 'places',
            id,
            data: updateData,
            draft: false,
        });

        // Sync tickets
        // For simplicity: delete existing tickets for this place and create new ones
        // In a real production app, we would want to keep existing ones if they haven't changed
        await payload.delete({
            collection: 'tickets',
            where: {
                place: { equals: id },
            },
        });

        if (tickets && tickets.length > 0) {
            const ticketIds = await Promise.all(
                tickets.map(async (t) => {
                    const ticket = await payload.create({
                        collection: 'tickets',
                        data: {
                            ...t,
                            place: id,
                            owner: user.id,
                        },
                    });
                    return ticket.id;
                })
            );

            await payload.update({
                collection: 'places',
                id,
                data: {
                    tickets: ticketIds,
                },
            });
        }

        revalidatePath('/moje-konto');
        return { success: true, message: 'Miejsce zostało zaktualizowane.' };
    } catch (error: unknown) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : 'Wystąpił błąd podczas aktualizacji miejsca.' };
    }
}

export async function deletePlaceAction(id: number) {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: 'Unauthorized' };

    const isAdmin = user.roles?.includes('admin');
    try {
        const place = await payload.findByID({
            collection: 'places',
            id,
            depth: 0,
        });

        if (!place || (!isAdmin && (typeof place.owner === 'object' ? place.owner?.id : place.owner) !== user.id)) {
            return { success: false, error: 'Nie masz uprawnień do usunięcia tego miejsca.' };
        }

        await payload.delete({
            collection: 'places',
            id,
            user,
        });

        revalidatePath('/moje-konto');
        return { success: true, message: 'Usunięto pomyślnie.' };
    } catch (error: unknown) {
        console.error('Delete place error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Błąd podczas usuwania miejsca.' };
    }
}

// Event Actions
export async function createEventAction(data: EventSchema) {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const validatedData = eventSchema.parse(data);

        const startDateIso = new Date(validatedData.startDate).toISOString();
        const endDateIso = validatedData.endDate ? new Date(validatedData.endDate).toISOString() : undefined;

        // Find user's organizer
        const organizers = await payload.find({
            collection: 'organizers',
            where: {
                owner: { equals: user.id }
            },
            limit: 1,
        });

        if (organizers.docs.length === 0) {
            return { success: false, error: 'Musisz posiadać profil organizatora, aby dodać wydarzenie.' };
        }

        const organizerId = organizers.docs[0].id;

        const { tickets, ...restEventData } = validatedData;

        const newEvent = await payload.create({
            collection: 'events',
            data: {
                ...restEventData,
                slug: formatSlug(validatedData.title),
                organizer: organizerId,
                startDate: startDateIso,
                endDate: endDateIso,
                category: parseInt(validatedData.category),
                tickets: [], // Initially empty
                place: validatedData.place ? parseInt(validatedData.place) : undefined,
                logo: validatedData.logo
                    ? (typeof validatedData.logo === 'string' ? parseInt(validatedData.logo) : (validatedData.logo as number))
                    : undefined,
                description: typeof validatedData.description === 'string'
                    ? stringToLexical(validatedData.description)
                    : validatedData.description,
                owner: user.id,
                features: validatedData.features?.map(f => ({
                    attribute: typeof f.attribute === 'string' ? parseInt(f.attribute) : f.attribute,
                    value: f.value
                })) || [],
                gallery: validatedData.gallery?.map(id => ({
                    image: typeof id === 'string' ? parseInt(id) : id
                })),
                _status: validatedData._status || 'published',
            } as Omit<Event, 'id' | 'updatedAt' | 'createdAt'>,
            draft: false,
        });

        // Create tickets and link to event
        if (tickets && tickets.length > 0) {
            const ticketIds = await Promise.all(
                tickets.map(async (t) => {
                    const ticket = await payload.create({
                        collection: 'tickets',
                        data: {
                            ...t,
                            event: newEvent.id,
                            owner: user.id,
                        },
                    });
                    return ticket.id;
                })
            );

            await payload.update({
                collection: 'events',
                id: newEvent.id,
                data: {
                    tickets: ticketIds,
                },
            });
        }

        revalidatePath('/moje-konto');
        return { success: true, message: 'Wydarzenie zostało utworzone.' };
    } catch (error: unknown) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : 'Wystąpił błąd podczas tworzenia wydarzenia.' };
    }
}

export async function updateEventAction(id: number, data: EventSchema) {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const validatedData = eventSchema.parse(data);

        const event = await payload.findByID({
            collection: 'events',
            id,
            depth: 0,
        });

        const isAdmin = user.roles?.includes('admin');
        if (!event || (!isAdmin && (typeof event.owner === 'object' ? event.owner?.id : event.owner) !== user.id)) {
            return { success: false, error: 'Nie masz uprawnień do edycji tego wydarzenia.' };
        }

        const startDateIso = new Date(validatedData.startDate).toISOString();
        const endDateIso = validatedData.endDate ? new Date(validatedData.endDate).toISOString() : undefined;

        // Find user's organizer
        const organizers = await payload.find({
            collection: 'organizers',
            where: {
                owner: { equals: user.id }
            },
            limit: 1,
        });

        const organizerId = organizers.docs.length > 0 ? organizers.docs[0].id : undefined;

        const { tickets, ...restEventUpdateData } = validatedData;

        await payload.update({
            collection: 'events',
            id,
            data: {
                ...restEventUpdateData,
                slug: formatSlug(validatedData.title),
                organizer: organizerId,
                startDate: startDateIso,
                endDate: endDateIso,
                place: validatedData.place ? parseInt(validatedData.place) : undefined,
                logo: validatedData.logo
                    ? (typeof validatedData.logo === 'string' ? parseInt(validatedData.logo) : (validatedData.logo as number))
                    : undefined,
                description: typeof validatedData.description === 'string'
                    ? stringToLexical(validatedData.description)
                    : validatedData.description,
                category: parseInt(validatedData.category),
                tickets: [], // Will be synced below
                features: validatedData.features?.map(f => ({
                    attribute: typeof f.attribute === 'string' ? parseInt(f.attribute) : f.attribute,
                    value: f.value
                })) || [],
                gallery: validatedData.gallery?.map(id => ({
                    image: typeof id === 'string' ? parseInt(id) : id
                })),
                _status: validatedData._status || 'published',
            } as Partial<Event>,
            draft: false,
        });

        // Sync tickets
        await payload.delete({
            collection: 'tickets',
            where: {
                event: { equals: id },
            },
        });

        if (tickets && tickets.length > 0) {
            const ticketIds = await Promise.all(
                tickets.map(async (t) => {
                    const ticket = await payload.create({
                        collection: 'tickets',
                        data: {
                            ...t,
                            event: id,
                            owner: user.id,
                        },
                    });
                    return ticket.id;
                })
            );

            await payload.update({
                collection: 'events',
                id,
                data: {
                    tickets: ticketIds,
                },
            });
        }

        revalidatePath('/moje-konto');
        return { success: true, message: 'Wydarzenie zostało zaktualizowane.' };
    } catch (error: unknown) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : 'Wystąpił błąd podczas aktualizacji wydarzenia.' };
    }
}

export async function deleteEventAction(id: number) {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: 'Unauthorized' };

    const isAdmin = user.roles?.includes('admin');
    try {
        const event = await payload.findByID({
            collection: 'events',
            id,
            depth: 0,
        });

        if (!event || (!isAdmin && (typeof event.owner === 'object' ? event.owner?.id : event.owner) !== user.id)) {
            return { success: false, error: 'Nie masz uprawnień do usunięcia tego wydarzenia.' };
        }

        await payload.delete({
            collection: 'events',
            id,
            user,
        });

        revalidatePath('/moje-konto');
        return { success: true, message: 'Wydarzenie zostało usunięte.' };
    } catch (error: unknown) {
        console.error('Delete event error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Błąd podczas usuwania wydarzenia.' };
    }
}

export async function updateUserAction(formData: FormData) {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const name = formData.get('name') as string;
        const surname = formData.get('surname') as string;

        await payload.update({
            collection: 'users',
            id: user.id,
            data: {
                name,
                surname,
            },
        });

        revalidatePath('/moje-konto');
        return { success: true, message: 'Profil został zaktualizowany.' };
    } catch (error: unknown) {
        console.error(error);
        return { success: false, error: 'Błąd podczas aktualizacji profilu.' };
    }
}


// Pricing Actions
export async function getPremiumPlanAction() {
    const payload = await getPayloadClient();
    try {
        const { docs } = await payload.find({
            collection: 'pricing-plans',
            where: {
                isPremium: { equals: true }
            },
            limit: 1,
        });

        if (docs.length === 0) {
            return { success: false, error: 'Nie znaleziono planu Premium.' };
        }

        return { success: true, plan: docs[0] };
    } catch (error: unknown) {
        console.error('Error fetching premium plan:', error);
        return { success: false, error: 'Błąd podczas pobierania konfiguracji planu.' };
    }
}

// Downgrade to Free Plan
export async function downgradeToFreeAction() {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        // Find the Free plan
        const { docs: freePlans } = await payload.find({
            collection: 'pricing-plans',
            where: {
                planPrice_recurring: { equals: 0 }
            },
            limit: 1,
        });

        if (freePlans.length === 0) {
            return { success: false, error: 'Nie znaleziono planu Free.' };
        }

        const freePlan = freePlans[0];

        // Find the organization for this user (assume first one for now)
        const organizers = await payload.find({
            collection: 'organizers',
            where: {
                owner: { equals: user.id }
            },
            limit: 1,
        });

        if (organizers.docs.length === 0) {
            return { success: false, error: 'Nie znaleziono Twojej organizacji.' };
        }

        const org = organizers.docs[0];

        // If organization has an active Stripe subscription, cancel it
        if (org.stripeSubscriptionId) {
            const Stripe = (await import('stripe')).default;
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
                apiVersion: '2025-12-15.clover',
            });

            try {
                await stripe.subscriptions.cancel(org.stripeSubscriptionId);
            } catch (stripeError) {
                console.error('Error canceling Stripe subscription:', stripeError);
                // Continue anyway - subscription might already be canceled
            }
        }

        // Update organization to Free plan
        await payload.update({
            collection: 'organizers',
            id: org.id,
            data: {
                plan: freePlan.id,
                stripeSubscriptionId: null,
                stripeSubscriptionStatus: null,
                premiumExpiresAt: null,
            } as Partial<Organizer>, // Cast because of complex relationship type in Payload sometimes
        });

        revalidatePath('/moje-konto');
        return { success: true, message: 'Twój plan został zmieniony na Free.' };
    } catch (error: unknown) {
        console.error('Error downgrading to free:', error);
        return { success: false, error: 'Błąd podczas zmiany planu.' };
    }
}

// Organizer Actions
export async function updateOrganizerAction(id: number, data: OrganizerSchema) {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) return { success: false, error: 'Unauthorized' };

    try {
        const validatedData = organizerSchema.parse(data);

        const organizer = await payload.findByID({
            collection: 'organizers',
            id,
            depth: 0,
        });

        const isAdmin = user.roles?.includes('admin');
        if (!organizer || (!isAdmin && (typeof organizer.owner === 'object' ? organizer.owner?.id : organizer.owner) !== user.id)) {
            return { success: false, error: 'Nie masz uprawnień do edycji tego profilu.' };
        }

        const updateData: Partial<Organizer> = {
            ...validatedData,
            billing: validatedData.billing,
        };

        // Also update slug if name changed
        if (validatedData.name !== organizer.name) {
            updateData.slug = formatSlug(validatedData.name);
        }

        await payload.update({
            collection: 'organizers',
            id,
            data: updateData,
            draft: false,
        });

        revalidatePath('/moje-konto');
        return { success: true, message: 'Profil organizacji został zaktualizowany.' };
    } catch (error: unknown) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : 'Wystąpił błąd podczas aktualizacji profilu.' };
    }
}
