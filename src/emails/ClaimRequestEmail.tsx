import {
    Button,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import React from 'react';
import { BaseLayout } from './BaseLayout';
import { BRAND_CONFIG } from '../lib/config';

interface ClaimRequestEmailProps {
    placeName: string;
    url: string;
}

export const ClaimRequestEmail = ({
    placeName,
    url,
}: ClaimRequestEmailProps) => {
    const preview = `Potwierdź chęć przejęcia miejsca ${placeName}`;

    return (
        <BaseLayout preview={preview}>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Przejęcie miejsca: <strong>{placeName}</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
                Cześć,
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                Otrzymaliśmy prośbę o przejęcie zarządzania wizytówką miejsca <strong>{placeName}</strong> w serwisie {BRAND_CONFIG.name}.
                Jeśli to Ty wysłałeś to zgłoszenie, kliknij w poniższy przycisk, aby potwierdzić weryfikację.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                    className="bg-[#f43f5e] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                    href={url}
                >
                    Potwierdź przejęcie miejsca
                </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
                Jeśli to nie Ty, zignoruj tę wiadomość. Link wygaśnie za 24 godziny.
            </Text>
        </BaseLayout>
    );
};

export default ClaimRequestEmail;
