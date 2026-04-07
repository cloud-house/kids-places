import { NextRequest, NextResponse } from 'next/server';
import { getPayloadClient } from '@/lib/payload-client';
import { render } from '@react-email/components';
import React from 'react';
import { PaymentReminderEmail } from '@/emails/PaymentReminderEmail';

export async function GET(req: NextRequest) {
    // Basic security check - you can set CRON_SECRET in environment variables
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const payload = await getPayloadClient();

        // We want to send reminders 3 days before expiry
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);

        // Start of the target day
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        // End of the target day
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Find users whose premium expires in 3 days and who paid via BLIK
        // Find organizers whose premium expires in 3 days and who paid via BLIK (manual invoice)
        const organizers = await payload.find({
            collection: 'organizers',
            where: {
                and: [
                    {
                        premiumExpiresAt: {
                            greater_than_equal: startOfDay.toISOString(),
                        },
                    },
                    {
                        premiumExpiresAt: {
                            less_than_equal: endOfDay.toISOString(),
                        },
                    },
                    {
                        collectionMethod: {
                            equals: 'send_invoice',
                        },
                    },
                ],
            },
            depth: 1, // Ensure we get owner details
        });

        payload.logger.info(`Found ${organizers.docs.length} organizers to send BLIK reminders to.`);

        const results = await Promise.allSettled(
            organizers.docs.map(async (org) => {
                const expiryDateStr = org.premiumExpiresAt
                    ? new Date(org.premiumExpiresAt).toLocaleDateString('pl-PL')
                    : 'wkrótce';

                const owner = typeof org.owner === 'object' ? org.owner : null;
                const email = org.email || (owner ? owner.email : null);
                const name = org.name || (owner ? owner.name : 'Użytkowniku');

                if (!email) return Promise.reject('No email found for organizer');

                const html = await render(
                    React.createElement(PaymentReminderEmail, {
                        userName: name,
                        expiryDate: expiryDateStr,
                    })
                );

                return payload.sendEmail({
                    to: email,
                    subject: 'Ważne: Twoje Premium Kids Places wkrótce wygaśnie',
                    html,
                });
            })
        );

        const successes = results.filter((r) => r.status === 'fulfilled').length;
        const failures = results.filter((r) => r.status === 'rejected').length;

        return NextResponse.json({
            processed: organizers.docs.length,
            successes,
            failures,
        });
    } catch (error) {
        const fallbackPayload = await getPayloadClient();
        fallbackPayload.logger.error({ err: error }, 'Cron job error');
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
