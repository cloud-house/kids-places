export const BRAND_CONFIG = {
    name: 'Kids Places',
    tagline: 'Odkryj przygody swojego dziecka',
    description: 'Najlepsza wyszukiwarka zajęć i miejsc dla dzieci w Polsce.',
    contactEmail: 'kontakt@kids-places.pl', // Adjust this if needed
    defaultFromAddress: 'kontakt@notifications.kids-places.pl',
    defaultFromName: 'Kids Places',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kids-places.pl',
    defaultOrganizerName: 'Kids Places Centrala',
} as const;
