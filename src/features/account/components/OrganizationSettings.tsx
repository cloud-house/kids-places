'use client';

import React, { useState, useTransition } from 'react';
import { Organizer } from '@/payload-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizerSchema, type OrganizerSchema } from '../schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save, Building2, Globe, Mail, Phone, Receipt } from 'lucide-react';
import { updateOrganizerAction } from '../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface OrganizationSettingsProps {
    organizer: Organizer;
    isPremium: boolean;
}

export const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ organizer }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<OrganizerSchema>({
        resolver: zodResolver(organizerSchema),
        defaultValues: {
            name: organizer.name || '',
            email: organizer.email || '',
            phone: organizer.phone || '',
            website: organizer.website || '',
            billing: {
                companyName: organizer.billing?.companyName || '',
                nip: organizer.billing?.nip || '',
                address: organizer.billing?.address || '',
                city: organizer.billing?.city || '',
                postalCode: organizer.billing?.postalCode || '',
            },
        },
    });

    const onSubmit = async (values: OrganizerSchema) => {
        setIsLoading(true);
        try {
            const res = await updateOrganizerAction(organizer.id, values);
            if (res.success) {
                toast.success(res.message);
                startTransition(() => {
                    router.refresh();
                });
            } else {
                toast.error(res.error || 'Wystąpił błąd podczas zapisywania.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Wystąpił błąd połączenia.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">Profil Organizacji</h2>
                            <p className="text-sm text-gray-500">Zarządzaj informacjami o swojej firmie lub marce.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-2">
                                    <FormLabel className="font-bold">Nazwa organizacji</FormLabel>
                                    <FormControl>
                                        <Input placeholder="np. Akademia Małego Odkrywcy" className="rounded-2xl h-12 font-medium" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Contact info grid */}
                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold flex items-center gap-2">
                                            <Mail size={14} className="text-gray-400" /> Email publiczny
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="kontakt@firma.pl" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold flex items-center gap-2">
                                            <Phone size={14} className="text-gray-400" /> Telefon
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="+48 000 000 000" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold flex items-center gap-2">
                                            <Globe size={14} className="text-gray-400" /> Strona WWW
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://twoja-strona.pl" className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Billing Section */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight">Dane do faktury</h2>
                            <p className="text-sm text-gray-500">Te dane będą wykorzystywane do wystawiania faktur.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="billing.companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Pełna nazwa firmy</FormLabel>
                                    <FormControl>
                                        <Input placeholder="np. Akademia Przygody Sp. z o.o." className="rounded-xl h-12" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billing.nip"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">NIP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1234567890" className="rounded-xl h-12" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <FormField
                                control={form.control}
                                name="billing.address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Ulica i numer</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="billing.city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Miasto</FormLabel>
                                    <FormControl>
                                        <Input className="rounded-xl h-11" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billing.postalCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-bold">Kod pocztowy</FormLabel>
                                    <FormControl>
                                        <Input placeholder="00-000" className="rounded-xl h-11" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-end">
                    <Button
                        type="submit"
                        disabled={isLoading || isPending}
                        className="rounded-2xl px-12 h-14 bg-rose-500 hover:bg-rose-600 text-white font-black shadow-lg shadow-rose-200 transition-all hover:scale-[1.02] disabled:opacity-70"
                    >
                        {isLoading || isPending ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Zapisywanie...
                            </div>
                        ) : (
                            <>
                                <Save size={20} className="mr-2" />
                                Zapisz zmiany profilu
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
