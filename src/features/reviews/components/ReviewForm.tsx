'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import { addReviewAction } from '@/features/reviews/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ReviewFormProps {
    placeId: number
    onSuccess?: () => void
}

export function ReviewForm({ placeId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit() {
        if (rating === 0) {
            toast.error('Wybierz ocenę gwiazdkową')
            return
        }
        if (!content.trim() || content.length < 10) {
            toast.error('Napisz co najmniej kilka słów opinii (min. 10 znaków)')
            return
        }

        setLoading(true)
        const res = await addReviewAction({
            placeId,
            rating,
            content
        })
        setLoading(false)

        if (res.success) {
            toast.success(res.message)
            setContent('')
            setRating(0)
            if (onSuccess) onSuccess()
        } else {
            toast.error(res.error || 'Błąd dodawania opinii')
        }
    }

    return (
        <div className="bg-rose-50/50 p-8 md:p-10 rounded-[3rem] border-2 border-rose-100 shadow-xl shadow-rose-50/50 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/50 rounded-full blur-3xl" />

            <h3 className="font-black text-2xl mb-2 text-rose-900 relative z-10">Twoja opinia ma znaczenie! 🦄</h3>
            <p className="text-rose-700/60 font-medium mb-8 relative z-10">Pomóż innym rodzicom odkryć to miejsce.</p>

            <div className="mb-8 relative z-10 bg-white/60 backdrop-blur-sm p-6 rounded-[2rem] border border-white/50 inline-block">
                <div className="flex gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="focus:outline-none transition-all hover:scale-125 active:scale-95"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            type="button"
                        >
                            <Star
                                size={40}
                                className={cn(
                                    "transition-all duration-300",
                                    (hoverRating || rating) >= star
                                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                        : "fill-transparent text-gray-200"
                                )}
                                strokeWidth={2.5}
                            />
                        </button>
                    ))}
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-rose-400">
                    {rating > 0 ? `Wybrałeś: ${rating} / 5` : 'Oceń gwiazdkami'}
                </p>
            </div>

            <div className="relative z-10">
                <Textarea
                    placeholder="Opisz swoje wrażenia... Co spodobało się Twojemu dziecku? Czy obsługa była pomocna?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[160px] mb-6 bg-white rounded-[2rem] border-white focus:ring-4 focus:ring-rose-100 transition-all p-6 text-lg font-medium placeholder:text-gray-300"
                />

                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full md:w-auto bg-rose-500 hover:bg-rose-600 text-white font-black py-6 px-12 rounded-2xl text-lg shadow-lg shadow-rose-200 active:scale-95 transition-all"
                >
                    {loading ? 'Wysyłanie...' : 'Opublikuj opinię 🎉'}
                </Button>
            </div>
        </div>
    )
}
