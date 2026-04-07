'use client'

import React, { Suspense } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { registerAction } from '../actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
    role: z.enum(['parent', 'organizer']),
    name: z.string().min(2, { message: 'Imię musi mieć co najmniej 2 znaki' }),
    surname: z.string().min(2, { message: 'Nazwisko musi mieć co najmniej 2 znaki' }),
    email: z.string().email({ message: 'Niepoprawny adres email' }),
    password: z.string().min(8, { message: 'Hasło musi mieć co najmniej 8 znaków' }),
    acceptTerms: z.literal(true, {
        message: 'Musisz zaakceptować regulamin',
    }),
    plan: z.string().optional(),
    mode: z.enum(['recurring', 'onetime']).optional(),
    interval: z.enum(['month', 'year']).optional(),
    next: z.string().optional(),
    organizationName: z.string().optional().refine(() => true),
})
    .refine((data) => {
        if (data.role === 'organizer' && (!data.organizationName || data.organizationName.length < 2)) {
            return false;
        }
        return true;
    }, {
        message: "Nazwa organizacji jest wymagana dla organizatorów",
        path: ["organizationName"],
    })

function RegisterFormContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = React.useState(false)

    // Read from URL
    const defaultRole = searchParams.get('role') === 'organizer' ? 'organizer' : 'parent';
    const defaultPlan = searchParams.get('plan') || '';
    const defaultMode = (searchParams.get('mode') === 'onetime' ? 'onetime' : 'recurring') as 'recurring' | 'onetime';
    const defaultInterval = (searchParams.get('interval') === 'year' ? 'year' : 'month') as 'month' | 'year';
    const defaultNext = searchParams.get('next') || '';
    const defaultEmail = searchParams.get('email') || '';
    const isEmailLocked = searchParams.get('lockEmail') === 'true';

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: defaultRole,
            name: '',
            surname: '',
            email: defaultEmail,
            password: '',
            acceptTerms: false as unknown as true,
            plan: defaultPlan,
            mode: defaultMode,
            interval: defaultInterval,
            next: defaultNext,
            organizationName: '',
        },
    })

    const role = form.watch('role');

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const res = await registerAction(values)

            if (res.success) {
                toast.success(res.message || 'Konto utworzone pomyślnie!')
                if (res.redirectPath) {
                    router.push(res.redirectPath)
                }
                // We don't set loading to false here to keep the button state until navigation
            } else {
                setLoading(false)
                toast.error('Błąd rejestracji', {
                    description: res.error || 'Wystąpił nieoczekiwany błąd.'
                })
            }
        } catch {
            setLoading(false)
            toast.error('Błąd rejestracji', {
                description: 'Wystąpił nieoczekiwany błąd podczas rejestracji.'
            })
        }
    }

    return (
        <div className="space-y-6">
            <Tabs
                defaultValue={form.getValues('role')}
                className="w-full"
                onValueChange={(val) => form.setValue('role', val as 'parent' | 'organizer')}
            >
                <TabsList className="grid w-full grid-cols-2 rounded-xl h-12 p-1 bg-gray-100">
                    <TabsTrigger
                        value="parent"
                        className="rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-rose-500 data-[state=active]:shadow-sm transition-all"
                    >
                        Dla Rodziców
                    </TabsTrigger>
                    <TabsTrigger
                        value="organizer"
                        className="rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-500 data-[state=active]:shadow-sm transition-all"
                    >
                        Dla Organizatorów
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="plan"
                        render={({ field }) => (
                            <input type="hidden" {...field} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mode"
                        render={({ field }) => (
                            <input type="hidden" {...field} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="interval"
                        render={({ field }) => (
                            <input type="hidden" {...field} />
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Imię</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jan" className="rounded-xl h-11" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="surname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazwisko</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Kowalski" className="rounded-xl h-11" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {role === 'organizer' && (
                        <FormField
                            control={form.control}
                            name="organizationName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazwa Organizacji / Firmy</FormLabel>
                                    <FormControl>
                                        <Input placeholder="np. Akademia Przygody" className="rounded-xl h-11 border-indigo-200 focus:border-indigo-500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="jan.kowalski@example.com"
                                        className={`rounded-xl h-11 ${isEmailLocked ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}
                                        {...field}
                                        readOnly={isEmailLocked}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hasło</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="********" className="rounded-xl h-11" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="acceptTerms"
                        render={({ field }) => (
                            <FormItem className="py-2">
                                <div className="flex flex-row items-center space-x-2">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="rounded-md border-gray-300 text-rose-500 focus:ring-rose-500"
                                        />
                                    </FormControl>
                                    <FormLabel className="text-gray-500 font-normal block leading-relaxed cursor-pointer">
                                        Akceptuję{' '}
                                        <Link href="/regulamin" className="text-rose-500 hover:underline font-bold whitespace-nowrap">
                                            Regulamin
                                        </Link>{' '}
                                        i{' '}
                                        <Link href="/polityka-prywatnosci" className="text-rose-500 hover:underline font-bold whitespace-nowrap">
                                            Politykę Prywatności
                                        </Link>{' '}
                                        serwisu
                                    </FormLabel>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className={`w-full h-12 rounded-xl font-bold transition-colors ${form.watch('role') === 'organizer' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-rose-500 hover:bg-rose-600'}`} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Rejestrowanie...
                            </>
                        ) : (
                            'Zarejestruj się'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export function RegisterForm() {
    return (
        <Suspense fallback={<div className="h-64 flex items-center justify-center animate-pulse bg-gray-50 rounded-3xl text-gray-400 font-medium">Ładowanie formularza...</div>}>
            <RegisterFormContent />
        </Suspense>
    )
}
