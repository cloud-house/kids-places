import * as z from 'zod';

export const ticketSchema = z.object({
    name: z.string().min(1, 'Nazwa biletu jest wymagana'),
    price: z.number().min(0, 'Cena musi być >= 0'),
    limit: z.number().optional(),
});

export const eventSchema = z.object({
    title: z.string().min(2, { message: 'Tytuł musi mieć co najmniej 2 znaki' }),
    startDate: z.string().min(1, { message: 'Data rozpoczęcia jest wymagana' }),
    endDate: z.string().optional(),
    category: z.string().min(1, { message: 'Wybierz kategorię' }),
    place: z.string().optional(),
    isFree: z.boolean(),
    tickets: z.array(ticketSchema).optional(),
    logo: z.union([z.string(), z.number()]).nullable().optional(),
    gallery: z.array(z.union([z.string(), z.number()])).optional(),
    description: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
    features: z.array(z.object({
        attribute: z.union([z.string(), z.number()]),
        value: z.string()
    })).optional(),
    recurrence: z.object({
        isRecurring: z.boolean(),
        frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
        interval: z.number().min(1).optional(),
        daysOfWeek: z.array(z.string()).optional(),
        recurrenceEndDate: z.string().optional(),
    }),
    _status: z.enum(['draft', 'published']).optional(),
}).refine(data => {
    if (!data.isFree && (!data.tickets || data.tickets.length === 0)) {
        return false;
    }
    return true;
}, {
    message: "Dla płatnych wydarzeń musisz dodać przynajmniej jeden bilet",
    path: ["tickets"],
});

export type EventSchema = z.infer<typeof eventSchema>;
