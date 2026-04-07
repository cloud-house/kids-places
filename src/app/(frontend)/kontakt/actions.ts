'use server';

import { getPayloadClient } from '@/lib/payload-client';

export async function sendContactMessageAction(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;
    const subject = formData.get('subject') as string;

    if (!name || !email || !message) {
        return { success: false, error: 'Proszę wypełnić wszystkie wymagane pola.' };
    }

    try {
        const payload = await getPayloadClient();

        await payload.sendEmail({
            to: 'kontakt@kids-places.pl',
            subject: `Nowa wiadomość kontaktowa: ${subject || 'Kontakt ze strony'}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #e11d48;">Nowa wiadomość z formularza kontaktowego</h2>
                    <p><strong>Od:</strong> ${name} &lt;${email}&gt;</p>
                    <p><strong>Temat:</strong> ${subject || 'Brak tematu'}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Treść wiadomości:</strong></p>
                    <div style="background: #f9f9f9; padding: 20px; border-radius: 10px;">
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `,
        });

        return { success: true, message: 'Twoja wiadomość została wysłana. Dziękujemy!' };
    } catch (error) {
        console.error('Error sending contact message:', error);
        return { success: false, error: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.' };
    }
}
