
import {
    Button,
    Heading,
    Section,
    Text,
    Hr
} from '@react-email/components';
import React from 'react';
import { BaseLayout } from './BaseLayout';

interface NewInquiryEmailProps {
    organizerName?: string;
    sourceName: string;
    sourceType: 'places' | 'events' | 'classes';
    inquirerName: string;
    inquirerEmail: string;
    inquirerPhone?: string;
    message: string;
    dashboardUrl: string;
}

export const NewInquiryEmail = ({
    organizerName,
    sourceName,
    sourceType,
    inquirerName,
    inquirerEmail,
    inquirerPhone,
    message,
    dashboardUrl,
}: NewInquiryEmailProps) => {
    const typeLabel = sourceType === 'places' ? 'Miejsca' : sourceType === 'events' ? 'Wydarzenia' : 'Zajęć';
    const preview = `Nowe zapytanie dla ${typeLabel}: ${sourceName}`;

    return (
        <BaseLayout preview={preview}>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Nowe zgłoszenie
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
                Cześć {organizerName || 'Organizatorze'},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                Otrzymałeś nowe zapytanie dotyczące <strong>{sourceName}</strong>.
            </Text>

            <Section className="bg-gray-50 rounded-lg p-4 my-4 border border-gray-100">
                <Text className="m-0 mb-2 text-xs font-bold uppercase text-gray-500">Dane zgłaszającego:</Text>
                <Text className="m-0 text-sm font-bold text-gray-900">{inquirerName}</Text>
                <Text className="m-0 text-sm text-gray-700">Email: {inquirerEmail}</Text>
                {inquirerPhone && <Text className="m-0 text-sm text-gray-700">Tel: {inquirerPhone}</Text>}
            </Section>

            <Section className="my-4">
                <Text className="m-0 mb-2 text-xs font-bold uppercase text-gray-500">Wiadomość:</Text>
                <Text className="text-black text-[14px] italic bg-white p-3 border border-gray-200 rounded-lg">
                    &quot;{message}&quot;
                </Text>
            </Section>

            <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                    className="bg-[#f43f5e] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                    href={dashboardUrl}
                >
                    Zobacz w Panelu
                </Button>
            </Section>

            <Hr className="border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-[#666666] text-[12px] leading-[24px]">
                Możesz również odpowiedzieć bezpośrednio na tę wiadomość, pisząc na adres {inquirerEmail}.
            </Text>
        </BaseLayout>
    );
};

export default NewInquiryEmail;
