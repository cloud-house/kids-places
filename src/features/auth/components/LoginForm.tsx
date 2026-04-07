'use client'

import React from 'react'
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
import { loginAction } from '../actions'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
})

export function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const nextPath = searchParams.get('next') || '/moje-konto'
    const defaultEmail = searchParams.get('email') || ''
    const [loading, setLoading] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: defaultEmail,
            password: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const res = await loginAction(values)

            if (res.success) {
                toast.success(res.message || 'Zalogowano pomyślnie')
                router.push(nextPath)
                // We don't set loading to false here to keep the button state until navigation
            } else {
                setLoading(false)
                toast.error('Błąd logowania', {
                    description: res.error || 'Wystąpił nieoczekiwany błąd.'
                })
            }
        } catch {
            setLoading(false)
            toast.error('Błąd logowania', {
                description: 'Wystąpił nieoczekiwany błąd podczas logowania.'
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="name@example.com" {...field} />
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
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 h-11" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logowanie...
                        </>
                    ) : (
                        'Zaloguj się'
                    )}
                </Button>
                <div className="text-center text-sm">
                    <Link href="/zapomnialem-hasla" className="text-gray-500 hover:text-gray-900">Zapomniałeś hasła?</Link>
                </div>
            </form>
        </Form>
    )
}
