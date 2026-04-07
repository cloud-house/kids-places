'use client';

import React from 'react';
import { Event, Category, Place, Attribute, Media } from '@/payload-types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Save, X, Calendar, MapPin, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray, Control, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEventAction } from '../actions';
import { eventSchema, type EventSchema } from '../../events/schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';
import { GalleryUpload } from '@/components/ui/gallery-upload';
import { PremiumBadge } from '@/components/ui/PremiumIndicators';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/RichText/Editor'

import { Checkbox } from '@/components/ui/checkbox';
import { AttributeFields } from './AttributeFields';

interface EventFormProps {
    event?: Event;
    categories: Category[];
    places: Place[];
    attributes: Attribute[];
    isPremium: boolean;
    onSubmit: (values: Parameters<typeof createEventAction>[0]) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};


export const EventForm: React.FC<EventFormProps> = ({
    event,
    categories,
    places,
    attributes,
    isPremium,
    onSubmit,
    onCancel,
    isLoading
}) => {
    const form = useForm<EventSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: event?.title || '',
            startDate: event?.startDate ? formatDate(event?.startDate) : '',
            endDate: event?.endDate ? formatDate(event?.endDate) : '',
            category: event?.category ? String(typeof event.category === 'object' ? event.category.id : event.category) : '',
            place: event?.place ? String(typeof event.place === 'object' ? event.place.id : event.place) : '',
            isFree: (event?.isFree === false) ? false : true,
            tickets: (event?.tickets || []).map(t => {
                if (typeof t === 'object' && t !== null) {
                    return {
                        name: t.name,
                        price: t.price,
                        limit: t.limit || undefined
                    };
                }
                return null;
            }).filter((t): t is NonNullable<typeof t> => t !== null),
            logo: typeof event?.logo === 'object' ? event.logo?.id : event?.logo,
            description: event?.description || '',
            features: event?.features?.map(f => ({
                attribute: typeof f.attribute === 'object' ? f.attribute.id : f.attribute,
                value: f.value
            })) || [],
            gallery: (event as { gallery?: { image?: string | number | Media | null; id?: string | null }[] | null })?.gallery?.map((item) => (typeof item.image === 'object' ? item.image?.id : item.image) as number).filter(Boolean) || [],
            recurrence: {
                isRecurring: event?.recurrence?.isRecurring || false,
                frequency: event?.recurrence?.frequency || 'weekly',
                interval: event?.recurrence?.interval || 1,
                daysOfWeek: event?.recurrence?.daysOfWeek || [],
                recurrenceEndDate: event?.recurrence?.recurrenceEndDate ? formatDate(event.recurrence.recurrenceEndDate).slice(0, 10) : '',
            },
            _status: (event?._status as 'draft' | 'published') || 'published',
        },
    });

    const selectedCategory = form.watch('category');

    const { fields, append, remove } = useFieldArray({
        control: form.control as unknown as Control<EventSchema>,
        name: "tickets",
    });

    const isFree = form.watch("isFree");

    const handleSubmit = async (values: EventSchema) => {
        // Prepare payload, ensuring tickets are handled correctly
        const payload: Parameters<typeof createEventAction>[0] = {
            ...values,
            tickets: values.isFree ? [] : values.tickets,
            description: values.description as unknown as Parameters<typeof createEventAction>[0]['description'],
        };
        await onSubmit(payload);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit as unknown as SubmitHandler<EventSchema>)} className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                    {/* Basic Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                <Calendar size={16} />
                            </div>
                            <h3 className="text-xl font-bold italic">Szczegóły wydarzenia</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField<EventSchema>
                                control={form.control as unknown as Control<EventSchema>}
                                name="logo"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value as string}
                                                onChange={field.onChange}
                                                label="Zdjęcie wydarzenia"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField<EventSchema>
                                control={form.control as unknown as Control<EventSchema>}
                                name="gallery"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FormLabel className={`font-bold ${!isPremium ? 'text-gray-400' : 'text-gray-700'}`}>Galeria zdjęć</FormLabel>
                                            <PremiumBadge />
                                        </div>
                                        <FormControl>
                                            <GalleryUpload
                                                value={field.value as string[] || []}
                                                onChange={field.onChange}
                                                disabled={!isPremium}
                                                maxImages={20}
                                            />
                                        </FormControl>
                                        {!isPremium && (
                                            <p className="text-[10px] text-amber-600 font-bold mt-1">Galeria jest dostępna tylko dla użytkowników Premium.</p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as unknown as Control<EventSchema>}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Tytuł wydarzenia</FormLabel>
                                        <FormControl>
                                            <Input placeholder="np. Warsztaty kreatywne dla maluchów" className="rounded-2xl h-12" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as unknown as Control<EventSchema>}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Początek</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as unknown as Control<EventSchema>}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Koniec (opcjonalne)</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Recurrence Section */}
                            <div className="mt-6 bg-gray-50 rounded-[2rem] p-6 border border-gray-100">
                                <FormField
                                    control={form.control as unknown as Control<EventSchema>}
                                    name="recurrence.isRecurring"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 mb-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="font-bold cursor-pointer text-gray-700">
                                                    To jest wydarzenie cykliczne
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {form.watch('recurrence.isRecurring') && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
                                        <FormField
                                            control={form.control as unknown as Control<EventSchema>}
                                            name="recurrence.frequency"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-bold text-gray-700">Częstotliwość</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-white rounded-xl h-10">
                                                                <SelectValue placeholder="Wybierz" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-xl">
                                                            <SelectItem value="daily" className="rounded-lg">Codziennie</SelectItem>
                                                            <SelectItem value="weekly" className="rounded-lg">Co tydzień</SelectItem>
                                                            <SelectItem value="monthly" className="rounded-lg">Co miesiąc</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control as unknown as Control<EventSchema>}
                                            name="recurrence.interval"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-bold text-gray-700">Interwał (np. co 2 tyg.)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            className="bg-white rounded-xl h-10"
                                                            {...field}
                                                            onChange={e => field.onChange(parseInt(e.target.value))}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {form.watch('recurrence.frequency') === 'weekly' && (
                                            <div className="col-span-1 md:col-span-2 space-y-3">
                                                <FormLabel className="text-sm font-bold text-gray-700">Dni tygodnia</FormLabel>
                                                <div className="flex flex-wrap gap-2">
                                                    {[
                                                        { label: 'Pon', value: 'monday' },
                                                        { label: 'Wt', value: 'tuesday' },
                                                        { label: 'Śr', value: 'wednesday' },
                                                        { label: 'Czw', value: 'thursday' },
                                                        { label: 'Pt', value: 'friday' },
                                                        { label: 'Sob', value: 'saturday' },
                                                        { label: 'Nie', value: 'sunday' },
                                                    ].map((day) => (
                                                        <FormField
                                                            key={day.value}
                                                            control={form.control as unknown as Control<EventSchema>}
                                                            name="recurrence.daysOfWeek"
                                                            render={({ field }) => {
                                                                const isSelected = field.value?.includes(day.value);
                                                                return (
                                                                    <Button
                                                                        type="button"
                                                                        variant={isSelected ? "default" : "outline"}
                                                                        size="sm"
                                                                        className={`rounded-full px-4 text-xs h-8 ${isSelected ? 'bg-rose-500 hover:bg-rose-600 border-rose-500 text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                                                        onClick={() => {
                                                                            const newValue = isSelected
                                                                                ? field.value?.filter((v: string) => v !== day.value)
                                                                                : [...(field.value || []), day.value];
                                                                            field.onChange(newValue);
                                                                        }}
                                                                    >
                                                                        {day.label}
                                                                    </Button>
                                                                );
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <FormField
                                            control={form.control as unknown as Control<EventSchema>}
                                            name="recurrence.recurrenceEndDate"
                                            render={({ field }) => (
                                                <FormItem className="col-span-1 md:col-span-2">
                                                    <FormLabel className="text-sm font-bold text-gray-700">Data zakończenia cyklu</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" className="bg-white rounded-xl h-10" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </div>

                            <FormField
                                control={form.control as unknown as Control<EventSchema>}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Kategoria</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-2xl h-12 bg-white">
                                                    <SelectValue placeholder="Wybierz kategorię" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl">
                                                {categories
                                                    .filter(cat => cat.scopes?.includes('event'))
                                                    .map(cat => (
                                                        <SelectItem key={cat.id} value={String(cat.id)} className="rounded-xl">{cat.title}</SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as unknown as Control<EventSchema>}
                                name="place"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Miejsce (opcjonalnie)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-2xl h-12 bg-white">
                                                    <SelectValue placeholder="Powiąż z miejscem" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="rounded-2xl">
                                                <SelectItem key="none" value="none" className="text-gray-400 italic">Brak powiązania</SelectItem>
                                                {places.map(place => (
                                                    <SelectItem key={place.id} value={String(place.id)} className="rounded-xl">
                                                        <span className="flex items-center gap-2">
                                                            <MapPin size={14} className="text-gray-400" />
                                                            {place.name}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Attributes Section */}
                    {selectedCategory && (
                        <div className="pt-8 border-t border-gray-50">
                            <AttributeFields
                                attributes={attributes}
                                categoryId={selectedCategory}
                                form={form}
                            />
                        </div>
                    )}

                    <div className="pt-8 border-t border-gray-50">
                        <h3 className="text-lg font-bold mb-6">Opis</h3>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Opis wydarzenia</FormLabel>
                                    <FormControl>
                                        {isPremium ? (
                                            <RichTextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Opisz czego dotyczy wydarzenie..."
                                            />
                                        ) : (
                                            <Textarea
                                                placeholder="Opisz czego dotyczy wydarzenie..."
                                                className="rounded-2xl"
                                                rows={4}
                                                {...field}
                                                value={typeof field.value === 'string' ? field.value : ''}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {!isPremium && (
                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mt-6">
                                <p className="text-sm text-amber-700 font-medium">
                                    Formatowanie opisu (pogrubienie, listy, linki) jest dostępne tylko dla użytkowników Premium.
                                    <Button asChild type="button" variant="link" className="p-0 h-auto text-amber-800 font-bold ml-1">
                                        <Link href="/dla-biznesu/cennik-premium">Zmień plan na Premium →</Link>
                                    </Button>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pricing Section */}
                    <div className="pt-8 border-t border-gray-50">
                        <div className="flex items-center gap-2 mb-6">
                            <h3 className="text-lg font-bold">Bilety i Ceny</h3>
                        </div>

                        <FormField
                            control={form.control}
                            name="isFree"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Wydarzenie bezpłatne
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {!isFree && (
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-xl">
                                        <div className="md:col-span-5">
                                            <FormField
                                                control={form.control as unknown as Control<EventSchema>}
                                                name={`tickets.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Nazwa biletu</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="np. Normalny" className="bg-white h-9" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control as unknown as Control<EventSchema>}
                                                name={`tickets.${index}.price`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Cena (PLN)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="0"
                                                                className="bg-white h-9"
                                                                {...field}
                                                                onChange={e => field.onChange(parseFloat(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <FormField
                                                control={form.control as unknown as Control<EventSchema>}
                                                name={`tickets.${index}.limit`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Limit (opc.)</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="∞"
                                                                className="bg-white h-9"
                                                                {...field}
                                                                value={field.value || ''}
                                                                onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 w-full"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ name: '', price: 0 })}
                                    className="mt-2"
                                >
                                    <Plus size={16} className="mr-2" /> Dodaj bilet
                                </Button>
                                <FormMessage>{form.formState.errors.tickets?.root?.message}</FormMessage>
                            </div>
                        )}
                    </div>

                    {/* Legacy Age Range section removed as it is now part of AttributeFields */}

                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between mt-8">
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 leading-tight">Status ogłoszenia</span>
                            <span className="text-sm text-gray-500 italic">Prywatne szkice nie są widoczne dla użytkowników serwisu.</span>
                        </div>
                        <FormField
                            control={form.control}
                            name="_status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-[180px] rounded-xl h-10 bg-gray-50 border-gray-100 font-bold">
                                                <SelectValue placeholder="Wybierz status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl">
                                                <SelectItem value="published" className="text-green-600 font-bold">Publiczne</SelectItem>
                                                <SelectItem value="draft" className="text-amber-600 font-bold">Szkic</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-gray-100">
                        <Button type="button" variant="ghost" onClick={onCancel} className="rounded-2xl px-8 h-12 text-gray-500 font-bold">
                            <X size={18} className="mr-2" /> Anuluj
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-2xl px-12 h-14 bg-rose-500 hover:bg-rose-600 text-white font-black shadow-lg shadow-rose-200 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Zapisywanie...
                                </div>
                            ) : (
                                <><Save size={20} className="mr-2" /> {event ? 'Zapisz zmiany' : 'Dodaj wydarzenie'}</>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};
