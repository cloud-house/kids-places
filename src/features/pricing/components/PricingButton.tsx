'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

interface PricingButtonProps {
    planId: string | number;
    isFeatured?: boolean;
    isFree?: boolean;
    isLoggedIn: boolean;
    buttonText?: string;
    variant?: 'default' | 'outline';
    hasActiveSubscription?: boolean;
    interval?: 'month' | 'year';
}

export const PricingButton = ({
    planId,
    isFeatured,
    isFree,
    isLoggedIn,
    buttonText,
    variant = 'default',
    hasActiveSubscription = false,
    interval = 'month',
}: PricingButtonProps) => {
    const router = useRouter();

    const handleClick = async () => {
        // Default to recurring, user can switch on checkout page
        const defaultMode = 'recurring';

        if (!isLoggedIn) {
            router.push(`/rejestracja?role=organizer&plan=${planId}&mode=${defaultMode}&interval=${interval}`);
            return;
        }

        if (isFree) {
            router.push('/moje-konto');
            return;
        }

        // If user has active subscription and clicks recurring, redirect to portal
        if (hasActiveSubscription) {
            // ... portal logic if needed, or simply let them manage via account
            // For now, if they want to buy a NEW plan, we send them to checkout
        }

        // Redirect to new checkout page
        router.push(`/checkout?planId=${planId}&mode=${defaultMode}&interval=${interval}`);
    };

    const baseStyles = "w-full py-3 rounded-2xl font-bold transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm";
    const featuredStyles = "bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600 hover:scale-[1.02] active:scale-95";
    const normalStyles = "bg-white border-2 border-gray-200 text-gray-900 hover:border-gray-400";
    const outlineStyles = "bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-50";

    const useFeaturedStyle = !isFree && (variant === 'default' || isFeatured);
    const useOutlineStyle = isFree || variant === 'outline';

    return (
        <button
            onClick={() => handleClick()}
            className={cn(
                baseStyles,
                useFeaturedStyle ? featuredStyles : (useOutlineStyle ? outlineStyles : normalStyles)
            )}
        >
            {buttonText || (isFree ? 'Zacznij za darmo' : 'Wybierz plan')}
        </button>
    );
};
