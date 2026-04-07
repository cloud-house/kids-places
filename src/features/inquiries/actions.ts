'use server'

import { getPayloadClient } from '@/lib/payload-client'
import { z } from 'zod'

const createInquirySchema = z.object({
    name: z.string().min(1, 'To pole jest wymagane'),
    email: z.string().email('Nieprawidłowy adres email'),
    phone: z.string().optional(),
    message: z.string().min(1, 'To pole jest wymagane'),
    sourceType: z.enum(['places', 'events']),
    sourceId: z.string().min(1, 'To pole jest wymagane'),
})

export async function createInquiryAction(data: z.infer<typeof createInquirySchema>) {
    const result = createInquirySchema.safeParse(data)

    if (!result.success) {
        return {
            success: false,
            error: 'Nieprawidłowe dane formularza',
        }
    }

    try {
        const payload = await getPayloadClient()

        // 1. Create the Inquiry in DB
        await payload.create({
            collection: 'inquiries',
            data: {
                ...result.data,
                status: 'new',
            },
        })

        // 2. Fetch the Source (Place/Event/Class) to find the Owner
        let organizerEmail: string | undefined;
        let organizerName: string | undefined;
        let sourceName: string | undefined;

        try {
            // Helper to get owner ID from a source doc
            const getOwnerId = (doc: Record<string, unknown> | null) => {
                if (!doc) return null;
                // Direct owner
                if (doc.owner) {
                    const owner = doc.owner;
                    return typeof owner === 'object' && owner !== null ? (owner as { id: string | number }).id as string : owner as string;
                }
                // Or via organizer relation (for events/places sometimes)
                if (doc.organizer) {
                    const org = doc.organizer;
                    if (typeof org === 'object' && org !== null && 'owner' in org) {
                        const owner = (org as { owner: unknown }).owner;
                        return typeof owner === 'object' && owner !== null ? (owner as { id: string | number }).id as string : owner as string;
                    }
                }
                return null;
            }

            const collection = data.sourceType as 'places' | 'events';
            const sourceDoc = await payload.findByID({
                collection,
                id: data.sourceId,
                depth: 2, // Load relations to find owner
            });

            if (sourceDoc) {
                const doc = sourceDoc as { name?: string; title?: string };
                sourceName = doc.name || doc.title;
                const ownerId = getOwnerId(sourceDoc as unknown as Record<string, unknown>);

                if (ownerId) {
                    const owner = await payload.findByID({
                        collection: 'users',
                        id: ownerId,
                    });
                    if (owner) {
                        organizerEmail = owner.email;
                        organizerName = owner.name;
                    }
                }
            }

            // 3. Send Email (Fire and forget style, don't fail action if email fails)
            if (organizerEmail) {
                const { resend } = await import('@/lib/resend');
                const { NewInquiryEmail } = await import('@/emails/NewInquiryEmail');
                const { BRAND_CONFIG } = await import('@/lib/config');

                await resend.emails.send({
                    from: BRAND_CONFIG.defaultFromAddress,
                    to: organizerEmail,
                    replyTo: data.email,
                    subject: `Nowe zapytanie: ${sourceName}`,
                    react: NewInquiryEmail({
                        organizerName,
                        sourceName: sourceName || 'Twojej oferty',
                        sourceType: data.sourceType,
                        inquirerName: data.name,
                        inquirerEmail: data.email,
                        inquirerPhone: data.phone,
                        message: data.message,
                        dashboardUrl: `${BRAND_CONFIG.url}/moje-konto?tab=registrations`
                    })
                });
                console.log(`Inquiry notification sent to ${organizerEmail}`);
            } else {
                console.warn('Could not determine organizer email for inquiry notification');
            }

        } catch (emailError) {
            console.error('Failed to send inquiry notification email:', emailError);
            // We do NOT return success: false here, because the inquiry WAS created in DB.
        }

        return {
            success: true,
            message: 'Twoje zgłoszenie zostało wysłane pomyślnie!',
        }
    } catch (error) {
        console.error('Error creating inquiry:', error)
        return {
            success: false,
            error: 'Wystąpił błąd podczas wysyłania zgłoszenia. Spróbuj ponownie później.',
        }
    }
}
