
export const cities = [
    { name: 'Gdańsk', slug: 'gdansk', isPopular: true },
    { name: 'Gdynia', slug: 'gdynia', isPopular: true },
    { name: 'Sopot', slug: 'sopot', isPopular: true },
    { name: 'Warszawa', slug: 'warszawa', isPopular: true },
    { name: 'Kraków', slug: 'krakow', isPopular: true },
    { name: 'Wrocław', slug: 'wroclaw', isPopular: true },
    { name: 'Poznań', slug: 'poznan', isPopular: true },
] as const

export const attributeGroups = [
    { slug: 'info', name: 'Podstawowe Informacje' },
    { slug: 'amenities', name: 'Udogodnienia' },
    { slug: 'place-details', name: 'Specyfika Miejsca' },
]

export const categories = [
    // --- TRAVEL & LEISURE (Tutaj eventy to np. Targi Turystyczne, Otwarcia sezonu)
    { slug: 'atrakcje-podroznicze', title: 'Atrakcje podróżnicze', icon: 'PlaneTakeoff', color: 'bg-red-100 text-red-600', scopes: ['place', 'event'], isFeatured: true },
    { slug: 'noclegi-rodzinne', title: 'Hotele i Noclegi', icon: 'Hotel', color: 'bg-blue-100 text-blue-00', scopes: ['place'], isFeatured: true },
    { slug: 'agroturystyka-natura', title: 'Natura i Zwierzęta', icon: 'Leaf', color: 'bg-green-100 text-green-600', scopes: ['place', 'event'], isFeatured: false },

    // --- ENTERTAINMENT (Kluczowe dla eventów: premiery, show, pikniki)
    { slug: 'widowiska-i-teatr', title: 'Spektakle i Koncerty', icon: 'Music', color: 'bg-fuchsia-100 text-fuchsia-600', scopes: ['event'], isFeatured: true },
    { slug: 'festiwale-pikniki', title: 'Festiwale i Pikniki', icon: 'Tent', color: 'bg-yellow-100 text-yellow-600', scopes: ['event'], isFeatured: true },
    { slug: 'parki-rozrywki', title: 'Parki rozrywki', icon: 'FerrisWheel', color: 'bg-rose-100 text-rose-600', scopes: ['place', 'event'], isFeatured: true },
    { slug: 'sale-zabaw', title: 'Sale zabaw', icon: 'Gamepad2', color: 'bg-orange-100 text-orange-600', scopes: ['place', 'event'], isFeatured: true },
    { slug: 'baseny-aquaparki', title: 'Baseny i Aquaparki', icon: 'Waves', color: 'bg-cyan-100 text-cyan-600', scopes: ['place', 'event'], isFeatured: true },

    // --- EDUCATION & CULTURE (Warsztaty to serce eventów)
    { slug: 'muzea-interaktywne', title: 'Muzea i Wystawy', icon: 'Landmark', color: 'bg-purple-100 text-purple-600', scopes: ['place', 'event'], isFeatured: false },
    { slug: 'nauka-i-technologia', title: 'Nauka i Technologia', icon: 'Microscope', color: 'bg-indigo-100 text-indigo-600', scopes: ['event', 'place'], isFeatured: true },

    // --- SPORT (Obozy, zawody, mecze)
    { slug: 'sport-i-aktywnosc', title: 'Sport i Ruch', icon: 'Trophy', color: 'bg-emerald-100 text-emerald-600', scopes: ['place', 'event'], isFeatured: false },

    // --- PRACTICAL
    { slug: 'restauracje-kawiarnie', title: 'Gdzie zjeść', icon: 'Utensils', color: 'bg-amber-100 text-amber-700', scopes: ['place', 'event'], isFeatured: false },
] as const

export const attributes = [
    {
        name: 'Wiek',
        slug: 'wiek',
        type: 'range',
        groupSlug: 'info',
        categorySlugs: ['atrakcje-podroznicze', 'noclegi-rodzinne', 'agroturystyka-natura', 'widowiska-i-teatr', 'festiwale-pikniki', 'parki-rozrywki', 'sale-zabaw', 'baseny-aquaparki', 'muzea-interaktywne', 'nauka-i-technologia', 'sport-i-aktywnosc', 'restauracje-kawiarnie'],
    },
    {
        name: 'Cena',
        slug: 'cena',
        type: 'select',
        groupSlug: 'info',
        categorySlugs: ['atrakcje-podroznicze', 'noclegi-rodzinne', 'agroturystyka-natura', 'widowiska-i-teatr', 'festiwale-pikniki', 'parki-rozrywki', 'sale-zabaw', 'baseny-aquaparki', 'muzea-interaktywne', 'nauka-i-technologia', 'sport-i-aktywnosc', 'restauracje-kawiarnie'],
        options: [
            { label: 'Bezpłatne', value: 'free' },
            { label: 'Płatne', value: 'paid' },
            { label: 'Wstęp wolny (rezerwacja)', value: 'free-reservation' },
        ],
    },
    {
        name: 'Przewijak',
        slug: 'przewijak',
        type: 'boolean',
        groupSlug: 'amenities',
        categorySlugs: ['atrakcje-podroznicze', 'noclegi-rodzinne', 'parki-rozrywki', 'sale-zabaw', 'baseny-aquaparki', 'muzea-interaktywne', 'nauka-i-technologia', 'restauracje-kawiarnie'],
    },
    {
        name: 'Podjazd / Miejsce na wózki',
        slug: 'podjazd-wozki',
        type: 'boolean',
        groupSlug: 'amenities',
        categorySlugs: ['atrakcje-podroznicze', 'noclegi-rodzinne', 'agroturystyka-natura', 'parki-rozrywki', 'sale-zabaw', 'baseny-aquaparki', 'muzea-interaktywne', 'nauka-i-technologia', 'sport-i-aktywnosc', 'restauracje-kawiarnie'],
    },
    {
        name: 'Klimatyzacja',
        slug: 'klimatyzacja',
        type: 'boolean',
        groupSlug: 'amenities',
        categorySlugs: ['noclegi-rodzinne', 'sale-zabaw', 'baseny-aquaparki', 'muzea-interaktywne', 'nauka-i-technologia', 'restauracje-kawiarnie'],
    },
    {
        name: 'Parking',
        slug: 'parking',
        type: 'select',
        groupSlug: 'amenities',
        categorySlugs: ['atrakcje-podroznicze', 'noclegi-rodzinne', 'agroturystyka-natura', 'parki-rozrywki', 'sale-zabaw', 'baseny-aquaparki', 'muzea-interaktywne', 'nauka-i-technologia', 'sport-i-aktywnosc', 'restauracje-kawiarnie'],
        options: [
            { label: 'Brak', value: 'none' },
            { label: 'Prywatny (bezpłatny)', value: 'private-free' },
            { label: 'Uliczny (płatny)', value: 'street-paid' },
        ],
    },
    {
        name: 'Ogródek / Przestrzeń zewnętrzna',
        slug: 'ogrodek',
        type: 'boolean',
        groupSlug: 'place-details',
        categorySlugs: ['noclegi-rodzinne', 'agroturystyka-natura', 'parki-rozrywki', 'sale-zabaw', 'restauracje-kawiarnie'],
    },
    {
        name: 'Menu dla dzieci / Diety',
        slug: 'menu-diety',
        type: 'multi-select',
        groupSlug: 'place-details',
        categorySlugs: ['restauracje-kawiarnie', 'noclegi-rodzinne'],
        options: [
            { label: 'Menu dziecięce', value: 'kids-menu' },
            { label: 'Opcje wegańskie', value: 'vegan' },
            { label: 'Bezglutenowe', value: 'gluten-free' },
        ],
    },
] as const

export const postCategories = [
    { slug: 'porady', title: 'Porady dla rodziców' },
    { slug: 'atrakcje', title: 'Najlepsze atrakcje' },
    { slug: 'edukacja', title: 'Edukacja i rozwój' },
] as const

export const pricingPlans = [
    {
        name: 'Free',
        planPrice_recurring: 0,
        planPrice_onetime: 0,
        description: 'Podstawowy plan dla lokalizacji',
        isFeatured: false,
        maxPlaces: 1,
        maxEvents: 1,
        buttonText: 'Zacznij za darmo',
        features: [
            { feature: '1 miejsce w bazie' },
            { feature: 'Podstawowe informacje' },
            { feature: 'Zdjęcie główne' },
            { feature: 'Panel właściciela' },
        ]
    },
    {
        name: 'Premium',
        description: 'Zwiększona widoczność i dodatkowe funkcje',
        isPremium: true,
        isFeatured: true,
        maxPlaces: 5,
        maxEvents: 10,
        buttonText: 'Zasubskrybuj Premium',
        stripePriceId_recurring: 'price_premium_mock',
        stripePriceId_onetime: 'price_premium_onetime_mock',
        stripePriceId_annual_recurring: 'price_premium_annual_mock',
        stripePriceId_annual_onetime: 'price_premium_annual_onetime_mock',
        planPrice_recurring: 49,
        planPrice_onetime: 49,
        planPrice_annual_recurring: 490,
        planPrice_annual_onetime: 490,
        features: [
            { feature: 'Do 5 miejsc w bazie' },
            { feature: 'Do 10 wydarzeń' },
            { feature: 'Wyróżnienie na liście' },
            { feature: 'Pełna galeria zdjęć' },
            { feature: 'Linki do social media' },
            { feature: 'Priorytetowe wsparcie' },
        ]
    },
] as const

export const organizers = [
    {
        name: 'Kids Places Centrala',
        email: 'marcin@nocode-house.pl',
        website: 'https://kids-places.pl',
        planSlug: 'Premium'
    },
    {
        name: 'Akademia Sportu Junior',
        email: 'biuro@asjunior.pl',
        website: 'https://asjunior.pl',
        planSlug: 'Premium'
    },
] as const


export const samplePlaces = [
    {
        name: 'Magiczna Sala Zabaw',
        slug: 'magiczna-sala-zabaw',
        categorySlug: 'sale-zabaw',
        city: 'Gdańsk',
        street: 'Grunwaldzka 102',
        postalCode: '80-244',
        email: 'marcin@nocode-house.pl',
        shortDescription: 'Największa i najbardziej kolorowa sala zabaw w Trójmieście. Idealne miejsce na aktywne popołudnie.',
        isFree: false,
        tickets: [
            { name: 'Bilet 1h', price: 35, description: 'Wstęp na 60 minut zabawy' },
            { name: 'Bilet całodniowy', price: 65, description: 'Zabawa bez limitu czasu' },
            { name: 'Karnet 10 wejść', price: 280, type: 'pass', entries: 10, validityValue: 3, validityUnit: 'months' },
        ],
        openingHours: [
            { day: 'monday', hours: '10:00 - 20:00' },
            { day: 'tuesday', hours: '10:00 - 20:00' },
            { day: 'wednesday', hours: '10:00 - 20:00' },
            { day: 'thursday', hours: '10:00 - 20:00' },
            { day: 'friday', hours: '10:00 - 21:00' },
            { day: 'saturday', hours: '09:00 - 21:00' },
            { day: 'sunday', hours: '09:00 - 20:00' },
        ],
    },
    {
        name: 'Park Edukacyjny "Mądry Maluch"',
        slug: 'madry-maluch',
        categorySlug: 'nauka-i-technologia',
        city: 'Gdynia',
        street: 'Zwycięstwa 96/98',
        postalCode: '81-451',
        email: 'marcin@nocode-house.pl',
        shortDescription: 'Interaktywna wystawa rozwijająca ciekawość świata i logiczne myślenie u najmłodszych.',
        isFree: false,
        tickets: [
            { name: 'Bilet normalny', price: 40 },
            { name: 'Bilet ulgowy (do lat 12)', price: 25 },
            { name: 'Bilet rodzinny (2+2)', price: 110 },
        ],
    },
    {
        name: 'Otwarty Plac Zabaw "Pod Chmurką"',
        slug: 'pod-chmurka',
        categorySlug: 'agroturystyka-natura',
        city: 'Sopot',
        street: 'Haffnera 50',
        postalCode: '81-717',
        email: 'marcin@nocode-house.pl',
        shortDescription: 'Nowoczesny i bezpieczny plac zabaw położony tuż przy plaży.',
        isFree: true,
    }
] as const

export const sampleEvents = [
    {
        title: 'Warsztaty Małego Programisty',
        slug: 'warsztaty-malego-programisty',
        categorySlug: 'nauka-i-technologia',
        organizerName: 'Kids Places Centrala',
        startDate: '2026-04-01T10:00:00.000Z',
        endDate: '2026-04-01T12:00:00.000Z',
        isFree: false,
        tickets: [
            { name: 'Pojedyncze wejście', price: 50 },
        ],
        description: 'Dla dzieci 7-10 lat. Budujemy pierwsze gry w Scratchu!',
        recurrence: {
            isRecurring: true,
            frequency: 'weekly',
            interval: 1,
            daysOfWeek: ['saturday'],
            recurrenceEndDate: '2026-06-30T00:00:00.000Z',
        },
    },
    {
        title: 'Piknik Rodzinny w Parku',
        slug: 'piknik-rodzinny',
        categorySlug: 'festiwale-pikniki',
        organizerName: 'Kids Places Centrala',
        startDate: '2026-05-15T11:00:00.000Z',
        endDate: '2026-05-15T18:00:00.000Z',
        isFree: true,
        description: 'Dmuchane zamki, watą cukrowa i mnóstwo atrakcji dla każdego!',
        recurrence: {
            isRecurring: false,
        },
    },
] as const


