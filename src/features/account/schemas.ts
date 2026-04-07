import * as z from 'zod';

export const organizerSchema = z.object({
    name: z.string().min(2, { message: 'Nazwa firmy musi mieć co najmniej 2 znaki' }),
    email: z.string().email({ message: 'Niepoprawny adres email' }).optional().or(z.literal('')),
    phone: z.string().optional(),
    website: z.string().url({ message: 'Niepoprawny adres URL' }).optional().or(z.literal('')),
    billing: z.object({
        companyName: z.string().optional(),
        nip: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
    }).optional(),
});

export type OrganizerSchema = z.infer<typeof organizerSchema>;
