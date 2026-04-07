import {
    Body,
    Container,
    Head,
    Html,
    Preview,
    Tailwind,
    Section,
    Text,
} from '@react-email/components';
import { BRAND_CONFIG } from '../lib/config';
import * as React from 'react';

interface BaseLayoutProps {
    preview: string;
    children: React.ReactNode;
}

export const BaseLayout = ({ preview, children }: BaseLayoutProps) => {
    return (
        <Html>
            <Head />
            <Preview>{preview}</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        {children}
                        <Section className="mt-8 pt-8 border-t border-solid border-[#eaeaea]">
                            <Text className="text-[#666666] text-[12px] leading-[24px] text-center">
                                © {new Date().getFullYear()} {BRAND_CONFIG.name}. Wszelkie prawa zastrzeżone.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default BaseLayout;
