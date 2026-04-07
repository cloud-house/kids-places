import { PricingPlan } from '@/payload-types';

export interface PremiumStatus {
    isPremium: boolean;
    expiresAt: Date | null;
    isExpiringSoon: boolean; // within 7 days
    daysLeft: number;
}

/**
 * Generic function to determine premium status based on plan and Stripe fields.
 * Works for both Users (legacy) and Organizers.
 */
export function getPremiumStatus(obj: Partial<{
    plan: number | PricingPlan | null;
    stripeSubscriptionStatus: string | null;
    premiumExpiresAt: string | null;
}> | null | undefined): PremiumStatus {
    if (!obj) {
        return { isPremium: false, expiresAt: null, isExpiringSoon: false, daysLeft: 0 };
    }

    const plan = typeof obj.plan === 'object' ? obj.plan as PricingPlan : null;
    const isPremiumByFlag = plan?.isPremium === true;
    const isStripeActive = obj.stripeSubscriptionStatus === 'active';

    // Explicitly check expiry date if present
    const expiryDate = obj.premiumExpiresAt ? new Date(obj.premiumExpiresAt) : null;
    const isExpired = expiryDate ? expiryDate < new Date() : false;

    // A user/org is premium if:
    // 1. They have an active stripe subscription with a premium plan
    // 2. OR they have a future premiumExpiresAt date (handles one-time payments)
    const isPremium = (isPremiumByFlag && isStripeActive && !isExpired) || (!!expiryDate && !isExpired);

    let isExpiringSoon = false;
    let daysLeft = 0;

    if (isPremium && expiryDate) {
        const diffTime = expiryDate.getTime() - new Date().getTime();
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isExpiringSoon = daysLeft <= 7;
    }

    return {
        isPremium,
        expiresAt: expiryDate,
        isExpiringSoon,
        daysLeft: Math.max(0, daysLeft)
    };
}

