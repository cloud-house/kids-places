'use server';

import { getPayloadClient } from '@/lib/payload-client';
import { resend } from '@/lib/resend';
import * as z from 'zod';

const newsletterSchema = z.object({
    email: z.string().email({ message: 'Niepoprawny adres email' }),
    name: z.string().optional(),
    city: z.string().optional(),
    consent: z.boolean().refine(val => val === true, {
        message: 'Musisz wyrazić zgodę na przetwarzanie danych',
    }),
});

export async function subscribeToNewsletterAction(formData: FormData) {
    const payload = await getPayloadClient();

    const data = {
        email: formData.get('email') as string,
        name: formData.get('name') as string,
        city: formData.get('city') as string,
        consent: formData.get('consent') === 'on',
    };

    try {
        const validatedData = newsletterSchema.parse(data);

        // 1. Save to Payload
        await payload.create({
            collection: 'newsletter-subscriptions',
            data: {
                email: validatedData.email,
                name: validatedData.name,
                city: validatedData.city,
                consent: validatedData.consent,
                status: 'active',
            },
        });

        // 2. Add to Resend (if Audience ID is provided)
        if (process.env.RESEND_AUDIENCE_ID) {
            try {
                await resend.contacts.create({
                    email: validatedData.email,
                    firstName: validatedData.name,
                    audienceId: process.env.RESEND_AUDIENCE_ID,
                    properties: {
                        city: validatedData.city || null,
                    },
                });
            } catch (resendError) {
                console.error('Resend error:', resendError);
                // We don't fail the whole action if Resend fails,
                // as the subscription is already saved in Payload.
            }
        }

        return { success: true, message: 'Dziękujemy za zapisanie się do newslettera!' };
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }

        // Handle unique constraint error for email
        if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'ValidationError') {
            return { success: false, error: 'Ten adres email jest już zapisany w naszej bazie.' };
        }

        console.error('Newsletter error:', error);
        return { success: false, error: 'Wystąpił błąd podczas zapisywania. Spróbuj ponownie później.' };
    }
}
