import {
    Button,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import React from 'react';
import { BaseLayout } from './BaseLayout';
import { BRAND_CONFIG } from '../lib/config';

interface ResetPasswordEmailProps {
    url: string;
    userName?: string;
}

export const ResetPasswordEmail = ({
    url,
    userName,
}: ResetPasswordEmailProps) => {
    const preview = `Zresetuj swoje hasło w ${BRAND_CONFIG.name}`;

    return (
        <BaseLayout preview={preview}>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Reset hasła
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
                Cześć {userName},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                Ktoś poprosił o zresetowanie hasła do Twojego konta w serwisie {BRAND_CONFIG.name}.
                Jeśli to Ty, kliknij w poniższy przycisk, aby ustawić nowe hasło.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                    className="bg-[#f43f5e] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                    href={url}
                >
                    Zresetuj hasło
                </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
                Jeśli nie prosiłeś o zmianę hasła, możesz bezpiecznie zignorować tę wiadomość. Twoje hasło pozostanie bez zmian.
            </Text>
        </BaseLayout>
    );
};

export default ResetPasswordEmail;
