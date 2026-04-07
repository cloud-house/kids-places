import {
    Button,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import React from 'react';
import { BaseLayout } from './BaseLayout';
import { BRAND_CONFIG } from '../lib/config';

interface PaymentReminderEmailProps {
    userName?: string;
    expiryDate: string;
}

export const PaymentReminderEmail = ({
    userName,
    expiryDate,
}: PaymentReminderEmailProps) => {
    const preview = `Twoja subskrypcja w ${BRAND_CONFIG.name} wkrótce wygaśnie`;
    const renewalUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/dla-biznesu/cennik-premium`;

    return (
        <BaseLayout preview={preview}>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Twoje Premium wygasa
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
                Cześć {userName || 'Użytkowniku'},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                Twoja subskrypcja Premium w serwisie {BRAND_CONFIG.name} wygaśnie w dniu <strong>{expiryDate}</strong>.
                Twoja ostatnia płatność była płatnością jednorazową, która nie odnawia się automatycznie.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                Jeśli chcesz zachować dostęp do wszystkich funkcji Premium, możesz przedłużyć subskrypcję w dowolnym momencie.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                    className="bg-[#f43f5e] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                    href={renewalUrl}
                >
                    Przedłuż Premium
                </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
                Jeśli nie podejmiesz żadnych działań, po wygaśnięciu Twój profil powróci do planu darmowego.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                Pozdrawiamy,<br />
                Zespół {BRAND_CONFIG.name}
            </Text>
        </BaseLayout>
    );
};

export default PaymentReminderEmail;
