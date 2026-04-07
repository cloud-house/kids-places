'use client';

import React from 'react';
import { Place, Category, Attribute } from '@/payload-types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PremiumBadge } from '@/components/ui/PremiumIndicators';
import { Save, X, Sparkles, Plus, Trash2, MapPin, FileText, Phone, Clock, Ticket as TicketIcon } from 'lucide-react';
import { useForm, useFieldArray, Control, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPlaceAction } from '../actions';
import { placeSchema, type PlaceSchema } from '../../places/schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';
import { GalleryUpload } from '@/components/ui/gallery-upload';
import { OpeningHoursInput } from '@/components/ui/opening-hours-input';
import { RichTextEditor } from '@/components/RichText/Editor';
import { AttributeFields } from './AttributeFields';

import Map from '@/components/common/MapWrapper';

interface PlaceFormProps {
    place?: Place;
    categories: Category[];
    attributes: Attribute[];
    isPremium: boolean;
    onSubmit: (values: Parameters<typeof createPlaceAction>[0]) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}
const formSchema = placeSchema;

export const PlaceForm: React.FC<PlaceFormProps> = ({
    place,
    categories,
    attributes,
    isPremium,
    onSubmit,
    onCancel,
    isLoading
}) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: place?.name || '',
            category: place?.category ? String(typeof place.category === 'object' ? place.category.id : place.category) : '',
            city: (typeof place?.city === 'object' ? place.city.name : '') || '',
            street: place?.street || '',
            postalCode: place?.postalCode || '',
            shortDescription: place?.shortDescription || '',
            longDescription: place?.longDescription || '',
            phoneNumber: place?.phoneNumber || '',
            email: place?.email || '',
            website: place?.socialLinks?.find(l => l.platform === 'Website')?.url || '',
            facebook: place?.socialLinks?.find(l => l.platform === 'Facebook')?.url || '',
            instagram: place?.socialLinks?.find(l => l.platform === 'Instagram')?.url || '',
            tiktok: place?.socialLinks?.find(l => l.platform === 'TikTok')?.url || '',
            logo: typeof place?.logo === 'object' ? place.logo?.id : place?.logo,
            latitude: place?.latitude || undefined,
            longitude: place?.longitude || undefined,
            openingHours: place?.openingHours?.map(oh => ({
                day: oh.day as "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday",
                hours: oh.hours
            })) || [],
            features: place?.features?.map(f => ({
                attribute: typeof f.attribute === 'object' ? f.attribute.id : f.attribute,
                value: f.value
            })) || [],
            gallery: place?.gallery?.map(item => (typeof item.image === 'object' ? item.image?.id : item.image) as number).filter(Boolean) || [],
            isFree: place?.isFree || false,
            tickets: (place?.tickets || []).map(po => {
                if (typeof po === 'object' && po !== null) {
                    return {
                        name: po.name,
                        price: po.price,
                        entries: po.entries ?? undefined,
                        validityValue: po.validityValue ?? undefined,
                        validityUnit: (po.validityUnit as 'days' | 'months' | 'years') || 'days'
                    };
                }
                return null;
            }).filter((t): t is NonNullable<typeof t> => t !== null),
            _status: (place?._status as 'draft' | 'published') || 'published',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control as unknown as Control<PlaceSchema>,
        name: "tickets",
    });

    const selectedCategory = form.watch('category');
    const lat = form.watch('latitude');
    const lon = form.watch('longitude');
    const street = form.watch('street');
    const city = form.watch('city');
    const postalCode = form.watch('postalCode');

    const [isGeocoding, setIsGeocoding] = React.useState(false);

    const handleGeocode = async () => {
        if (!street || !city) return;

        setIsGeocoding(true);
        try {
            const query = `${street}, ${city}${postalCode ? `, ${postalCode}` : ''}`;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
            const data = await response.json();

            if (data && data[0]) {
                form.setValue('latitude', parseFloat(data[0].lat));
                form.setValue('longitude', parseFloat(data[0].lon));
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        await onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit as unknown as SubmitHandler<PlaceSchema>)} className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                    {/* Basic Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                                <Sparkles size={16} />
                            </div>
                            <h3 className="text-xl font-bold italic">Informacje podstawowe</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="logo"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value as number}
                                                onChange={field.onChange}
                                                label="Logo miejsca"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="gallery"
                                render={({ field }) => (
                                    <FormItem className="col-span-1 md:col-span-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FormLabel className={`font-bold ${!isPremium ? 'text-gray-400' : 'text-gray-700'}`}>Galeria zdjęć</FormLabel>
                                            <PremiumBadge />
                                        </div>
                                        <FormControl>
                                            <GalleryUpload
                                                value={field.value || []}
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
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Nazwa miejsca</FormLabel>
                                        <FormControl>
                                            <Input placeholder="np. Magiczna Sala Zabaw" className="rounded-2xl h-12" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
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
                                                    .filter(cat => cat.scopes?.includes('place'))
                                                    .map(cat => (
                                                        <SelectItem key={cat.id} value={String(cat.id)} className="rounded-xl">{cat.title}</SelectItem>
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

                    {/* Location Section */}
                    <div className="pt-8 border-t border-gray-50">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                                    <MapPin size={16} />
                                </div>
                                <h3 className="text-xl font-bold italic">Lokalizacja</h3>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50"
                                onClick={handleGeocode}
                                disabled={isGeocoding || !street || !city}
                            >
                                {isGeocoding ? 'Pobieranie...' : 'Sprawdź na mapie'}
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Miasto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Wpisz miasto" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Ulica i numer</FormLabel>
                                        <FormControl>
                                            <Input placeholder="np. Długa 12/4" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="postalCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Kod pocztowy</FormLabel>
                                        <FormControl>
                                            <Input placeholder="np. 80-001" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Map Preview */}
                        <div className="h-64 rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 relative mb-6">
                            {lat && lon ? (
                                <Map lat={lat} lon={lon} />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-2">
                                    <Sparkles size={32} strokeWidth={1} />
                                    <p className="text-sm">Wpisz adres i kliknij &quot;Sprawdź na mapie&quot;, aby zobaczyć podgląd.</p>
                                </div>
                            )}
                        </div>

                        <div className="hidden">
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="latitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Szerokość (Lat)</FormLabel>
                                        <FormControl>
                                            <Input readOnly type="number" step="any" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="longitude"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Długość (Lon)</FormLabel>
                                        <FormControl>
                                            <Input readOnly type="number" step="any" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Descriptions Section */}
                    <div className="pt-8 border-t border-gray-50">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                <FileText size={16} />
                            </div>
                            <h3 className="text-xl font-bold italic">Opisy</h3>
                        </div>
                        <div className="space-y-6">
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="shortDescription"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-gray-700">Krótki opis (podgląd na karcie)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Przyciągnij uwagę krótkim opisem..." className="rounded-2xl" rows={2} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="longDescription"
                                render={({ field }) => (
                                    <FormItem className="group relative">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FormLabel className={`font-bold ${!isPremium ? 'text-gray-400' : 'text-gray-700'}`}>Długi opis (strona miejsca)</FormLabel>
                                            <PremiumBadge />
                                        </div>
                                        <FormControl>
                                            {isPremium ? (
                                                <RichTextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Opisz szczegółowo swoją ofertę..."
                                                />
                                            ) : (
                                                <Textarea
                                                    disabled
                                                    rows={6}
                                                    placeholder="Dostępne po przejściu na plan Premium"
                                                    className="rounded-2xl bg-gray-50 cursor-not-allowed opacity-60"
                                                    {...field}
                                                    value=""
                                                />
                                            )}
                                        </FormControl>
                                        {!isPremium && (
                                            <p className="text-[10px] text-amber-600 font-bold mt-1">Ten opis pojawi się tylko w planie Premium.</p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Premium Contact Section */}
                    <div className="pt-8 border-t border-gray-50">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                <Phone size={16} />
                            </div>
                            <h3 className={`text-xl font-bold italic ${!isPremium ? 'text-gray-400' : ''}`}>Kontakt i Social Media</h3>
                            <PremiumBadge />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4">
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={`font-bold ${!isPremium ? 'text-gray-400' : ''}`}>Numer telefonu</FormLabel>
                                        <FormControl>
                                            <Input disabled={!isPremium} placeholder="np. +48 111 222 333" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={`font-bold ${!isPremium ? 'text-gray-400' : ''}`}>Email kontaktowy</FormLabel>
                                        <FormControl>
                                            <Input disabled={!isPremium} placeholder="np. kontakt@miejsce.pl" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={`font-bold ${!isPremium ? 'text-gray-400' : ''}`}>Strona WWW</FormLabel>
                                        <FormControl>
                                            <Input disabled={!isPremium} placeholder="np. https://example.com" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="facebook"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={`font-bold ${!isPremium ? 'text-gray-400' : ''}`}>Facebook</FormLabel>
                                        <FormControl>
                                            <Input disabled={!isPremium} placeholder="np. facebook.com/twojemiejsce" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="instagram"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={`font-bold ${!isPremium ? 'text-gray-400' : ''}`}>Instagram</FormLabel>
                                        <FormControl>
                                            <Input disabled={!isPremium} placeholder="np. instagram.com/twojemiejsce" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="tiktok"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={`font-bold ${!isPremium ? 'text-gray-400' : ''}`}>TikTok</FormLabel>
                                        <FormControl>
                                            <Input disabled={!isPremium} placeholder="np. tiktok.com/@twojemiejsce" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {!isPremium && (
                            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 mb-6">
                                <p className="text-sm text-amber-700 font-medium">
                                    Dane kontaktowe i linki do Twoich mediów społecznościowych są wyświetlane tylko użytkownikom Premium.
                                    <Button asChild type="button" variant="link" className="p-0 h-auto text-amber-800 font-bold ml-1">
                                        <Link href="/dla-biznesu/cennik-premium">Zmień plan na Premium →</Link>
                                    </Button>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pricing / Tickets Section */}
                    <div className="pt-8 border-t border-gray-50">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500">
                                    <TicketIcon size={16} />
                                </div>
                                <h3 className="text-xl font-bold italic">Bilety i karnety</h3>
                            </div>
                            <FormField
                                control={form.control as unknown as Control<PlaceSchema>}
                                name="isFree"
                                render={({ field }) => (
                                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                        <label className="text-sm font-bold text-gray-700 cursor-pointer" htmlFor="is-free">
                                            Bezpłatne wejście
                                        </label>
                                        <input
                                            id="is-free"
                                            type="checkbox"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="w-5 h-5 rounded-lg border-2 border-gray-300 text-rose-500 focus:ring-rose-500 transition-all cursor-pointer"
                                        />
                                    </div>
                                )}
                            />
                        </div>

                        {!form.watch('isFree') && (
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 relative group animate-in zoom-in-95 duration-200">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-gray-100 text-gray-400 hover:text-rose-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-5">
                                                <FormField
                                                    control={form.control as unknown as Control<PlaceSchema>}
                                                    name={`tickets.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[10px] font-black uppercase text-gray-400">Nazwa biletu / karnetu</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="np. Normalny / Karnet 10 wejść" className="bg-white rounded-xl h-11" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField
                                                    control={form.control as unknown as Control<PlaceSchema>}
                                                    name={`tickets.${index}.price`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[10px] font-black uppercase text-gray-400">Cena (PLN)</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    className="bg-white rounded-xl h-11"
                                                                    {...field}
                                                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField
                                                    control={form.control as unknown as Control<PlaceSchema>}
                                                    name={`tickets.${index}.entries`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[10px] font-black uppercase text-gray-400">Wejścia</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="np. 10"
                                                                    className="bg-white rounded-xl h-11"
                                                                    {...field}
                                                                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="md:col-span-3 flex gap-2">
                                                <div className="flex-1">
                                                    <FormField
                                                        control={form.control as unknown as Control<PlaceSchema>}
                                                        name={`tickets.${index}.validityValue`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-[10px] font-black uppercase text-gray-400">Ważność</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        placeholder="np. 30"
                                                                        className="bg-white rounded-xl h-11"
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
                                                <div className="w-20">
                                                    <FormField
                                                        control={form.control as unknown as Control<PlaceSchema>}
                                                        name={`tickets.${index}.validityUnit`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-[10px] font-black uppercase text-gray-400">Jedn.</FormLabel>
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="bg-white rounded-xl h-11 px-2">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent className="rounded-xl">
                                                                        <SelectItem value="days">dni</SelectItem>
                                                                        <SelectItem value="months">miesiące</SelectItem>
                                                                        <SelectItem value="years">lata</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-14 rounded-[1.5rem] border-2 border-dashed border-gray-200 text-gray-400 hover:border-green-200 hover:text-green-600 hover:bg-green-50 transition-all font-bold group"
                                    onClick={() => append({ name: '', price: 0, validityUnit: 'days' })}
                                >
                                    <Plus size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                                    Dodaj opcję cenową / bilet
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Opening Hours Section */}
                    <div className="pt-8 border-t border-gray-50">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                                <Clock size={16} />
                            </div>
                            <h3 className="text-xl font-bold italic">Godziny otwarcia</h3>
                        </div>
                        <FormField
                            control={form.control}
                            name="openingHours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <OpeningHoursInput
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
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

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
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
                                <><Save size={20} className="mr-2" /> {place ? 'Zapisz zmiany' : 'Dodaj miejsce'}</>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form >
    );
};
