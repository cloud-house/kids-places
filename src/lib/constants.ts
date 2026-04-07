export interface PricingPlan {
    name: string;
    price: string;
    description: string;
    features: string[];
    isFeatured: boolean;
    buttonText: string;
}


export const DEFAULT_SORT = {
    PLACES: '-createdAt',
    EVENTS: 'startDate',
} as const;

export const CATEGORY_SCOPES = ['all', 'place', 'event'] as const;

export const PRICING_PLANS: PricingPlan[] = [
    {
        name: 'Darmowy',
        price: '0 zł',
        description: 'Dla małych firm i lokalnych inicjatyw.',
        features: [
            'Podstawowa wizytówka firmy',
            'Godziny otwarcia',
            'Dane kontaktowe',
            '1 zdjęcie główne'
        ],
        isFeatured: false,
        buttonText: 'Dodaj miejsce'
    },
    {
        name: 'Premium',
        price: '99 zł',
        description: 'Dla tych, którzy chcą być zawsze na szczycie.',
        features: [
            'Priorytet w wynikach wyszukiwania',
            'Pełna galeria zdjęć i wideo',
            'System rezerwacji online',
            'Wyróżnienie "Premium"',
            'Analityka odwiedzin'
        ],
        isFeatured: true,
        buttonText: 'Zasubskrybuj Premium'
    }
];
