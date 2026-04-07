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
import { forgotPasswordAction } from '../actions'

const formSchema = z.object({
    email: z.string().email(),
})

export function ForgotPasswordForm() {
    const [loading, setLoading] = React.useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const res = await forgotPasswordAction(values.email)
        setLoading(false)

        if (res.success) {
            toast.success(res.message || 'Jeśli konto istnieje, wysłaliśmy link resetujący.')
            form.reset()
        } else {
            toast.error('Wystąpił błąd', {
                description: res.error || 'Nie udało się wysłać linku resetującego.'
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
                <Button type="submit" className="w-full bg-rose-500 hover:bg-rose-600" disabled={loading}>
                    {loading ? 'Wysyłanie...' : 'Zresetuj hasło'}
                </Button>
            </form>
        </Form>
    )
}
