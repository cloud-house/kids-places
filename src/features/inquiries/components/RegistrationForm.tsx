'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createInquiryAction } from '@/features/inquiries/actions'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const registrationSchema = z.object({
    name: z.string().min(1, 'To pole jest wymagane'),
    email: z.string().email('Nieprawidłowy adres email'),
    phone: z.string().optional(),
    message: z.string().min(1, 'To pole jest wymagane'),
    sourceType: z.enum(['places', 'events']),
    sourceId: z.string(),
})

type RegistrationFormData = z.infer<typeof registrationSchema>

interface RegistrationFormProps {
    sourceType: 'places' | 'events'
    sourceId: string | number
    className?: string
}

export const RegistrationForm = ({ sourceType, sourceId, className = '' }: RegistrationFormProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegistrationFormData>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            sourceType,
            sourceId: String(sourceId),
            message: sourceType === 'events' 
                ? 'Dzień dobry, chciałbym zapisać dziecko na wydarzenie...' 
                : 'Dzień dobry, chciałbym zapytać o ofertę...',
        },
    })

    const onSubmit = async (data: RegistrationFormData) => {
        setIsSubmitting(true)
        try {
            const res = await createInquiryAction(data)
            if (res.success) {
                toast.success(res.message)
                reset()
            } else {
                toast.error(res.error)
            }
        } catch {
            toast.error('Wystąpił błąd. Spróbuj ponownie.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Twoje Imię i Nazwisko</label>
                    <input
                        {...register('name')}
                        type="text"
                        className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-rose-500 text-gray-900"
                        placeholder="np. Anna Kowalska"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">E-mail</label>
                    <input
                        {...register('email')}
                        type="email"
                        className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-rose-500 text-gray-900"
                        placeholder="anna@przyklad.pl"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Numer telefonu (opcjonalnie)</label>
                    <input
                        {...register('phone')}
                        type="tel"
                        className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-rose-500 text-gray-900"
                        placeholder="np. 500 123 456"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Wiadomość / Pytanie</label>
                    <textarea
                        {...register('message')}
                        rows={3}
                        className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-rose-500 text-gray-900 resize-none"
                        placeholder="Treść wiadomości..."
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl shadow-lg shadow-rose-100 transition-all text-base"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Wyślij zgłoszenie'}
                </Button>

                <p className="text-[10px] text-gray-400 text-center leading-tight">
                    Klikając przycisk, wyrażasz zgodę na przetwarzanie danych w celu kontaktu przez organizatora.
                </p>
            </form>
        </div>
    )
}
