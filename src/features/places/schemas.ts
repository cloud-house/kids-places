import * as z from 'zod';

export const openingHoursSchema = z.object({
    day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    hours: z.string()
});

export const placeSchema = z.object({
    name: z.string().min(2, { message: 'Nazwa musi mieć co najmniej 2 znaki' }),
    category: z.string().min(1, { message: 'Wybierz kategorię' }),
    city: z.string().min(2, { message: 'Podaj miasto' }),
    street: z.string().optional(),
    postalCode: z.string().optional(),
    shortDescription: z.string().optional(),
    longDescription: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email({ message: 'Nieprawidłowy adres email' }).optional().or(z.literal('')),
    website: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    tiktok: z.string().optional(),
    logo: z.union([z.string(), z.number()]).nullable().optional(),
    gallery: z.array(z.union([z.string(), z.number()])).optional(),
    openingHours: z.array(openingHoursSchema).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    features: z.array(z.object({
        attribute: z.union([z.string(), z.number()]),
        value: z.string()
    })).optional(),
    tickets: z.array(z.object({
        name: z.string().min(1, { message: 'Podaj nazwę biletu' }),
        price: z.number().min(0, { message: 'Cena nie może być ujemna' }),
        entries: z.number().min(1).optional(),
        validityValue: z.number().optional(),
        validityUnit: z.enum(['days', 'months', 'years']).optional(),
    })).optional(),
    isFree: z.boolean().optional(),
    _status: z.enum(['draft', 'published']).optional(),
});

export type PlaceSchema = z.infer<typeof placeSchema>;
