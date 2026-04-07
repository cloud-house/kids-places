'use server';

import { getPayloadClient } from '@/lib/payload-client';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const billingSchema = z.object({
    companyName: z.string().optional(),
    nip: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
});

export type BillingSchema = z.infer<typeof billingSchema>;

export async function updateOrganizerBillingAction(organizerId: number, data: BillingSchema) {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    if (!user) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const validatedData = billingSchema.parse(data);

        // Verify ownership
        const organizer = await payload.findByID({
            collection: 'organizers',
            id: organizerId,
            depth: 0,
        });

        const isAdmin = user.roles?.includes('admin');
        if (!organizer || (!isAdmin && (typeof organizer.owner === 'object' ? organizer.owner?.id : organizer.owner) !== user.id)) {
            return { success: false, error: 'Brak uprawnień.' };
        }

        await payload.update({
            collection: 'organizers',
            id: organizerId,
            data: {
                billing: validatedData,
            },
        });

        revalidatePath('/checkout');
        return { success: true };
    } catch (error) {
        console.error('Update billing error:', error);
        return { success: false, error: 'Błąd aktualizacji danych.' };
    }
}
