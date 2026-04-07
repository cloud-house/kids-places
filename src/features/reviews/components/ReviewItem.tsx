'use client'

import { useState } from 'react'
import { Review } from '@/payload-types'
import { Star, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { replyToReviewAction } from '@/features/reviews/actions'
import { toast } from 'sonner'

interface ReviewItemProps {
    review: Review
    isOwner: boolean
    index?: number
}

const PASTEL_VARIANTS = [
    { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-700', avatar: 'bg-sky-200 text-sky-700', stars: 'text-sky-400' },
    { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', avatar: 'bg-pink-200 text-pink-700', stars: 'text-pink-400' },
    { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', avatar: 'bg-amber-200 text-amber-700', stars: 'text-amber-400' },
    { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', avatar: 'bg-emerald-200 text-emerald-700', stars: 'text-emerald-400' },
    { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700', avatar: 'bg-violet-200 text-violet-700', stars: 'text-violet-400' },
];

export function ReviewItem({ review, isOwner, index = 0 }: ReviewItemProps) {
    const [isReplying, setIsReplying] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleReply() {
        if (!replyContent.trim()) return

        setLoading(true)
        const res = await replyToReviewAction(review.id, replyContent)
        setLoading(false)

        if (res.success) {
            toast.success(res.message)
            setIsReplying(false)
        } else {
            toast.error(res.error || 'Błąd odpowiedzi')
        }
    }

    const { user: reviewer, rating, content: comment, createdAt, reply } = review;
    const p = PASTEL_VARIANTS[index % PASTEL_VARIANTS.length];

    const containerClass = `${p.bg} p-6 md:p-8 rounded-[2.5rem] border-2 ${p.border} shadow-sm space-y-4 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1`
    const nameClass = `font-black text-rose-600 text-lg leading-tight`
    const dateClass = "text-xs font-bold opacity-60"
    const textClass = "text-gray-700 leading-relaxed font-medium text-lg"
    const replyClass = "bg-white/60 backdrop-blur-sm border-2 border-white/50 text-gray-700 shadow-inner"

    return (
        <div className={containerClass}>
            {/* Playful decoration */}
            <div className={`absolute -top-4 -right-4 w-16 h-16 ${p.avatar} opacity-10 rounded-full blur-xl`} />

            <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 bg-rose-100 text-rose-600 border-2 border-white shadow-sm font-black text-xl overflow-hidden`}>
                        {(typeof reviewer === 'object' && reviewer?.name) ? reviewer.name[0] : '?'}
                    </div>
                    <div>
                        <div className={nameClass}>
                            {typeof reviewer === 'object' ? reviewer?.name : 'Użytkownik'}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <div className="flex gap-0.5 text-amber-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={16}
                                        className={star <= rating ? "fill-current" : "text-gray-300/40"}
                                        strokeWidth={3}
                                    />
                                ))}
                            </div>
                            <span className={dateClass}>
                                {new Date(createdAt).toLocaleDateString('pl-PL')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <div className="text-gray-300 absolute -left-4 -top-2 text-4xl font-serif pointer-events-none opacity-50">&ldquo;</div>
                <p className={`pl-2 ${textClass}`}>
                    {comment}
                </p>
                <div className="text-gray-300 absolute -right-2 bottom-0 text-4xl font-serif pointer-events-none opacity-50">&rdquo;</div>
            </div>

            {/* Reply Section */}
            {reply && (
                <div className={`mt-4 p-5 rounded-3xl ${replyClass} relative z-10`}>
                    <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase tracking-wider">
                        <MessageCircle size={16} className="text-rose-500" />
                        <span>Odpowiedź organizatora</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed opacity-90">
                        {typeof reply === 'string' ? reply : (reply as { comment: string }).comment}
                    </p>
                    {review.replyDate && (
                        <div className="text-[10px] font-bold opacity-40 mt-2 text-right">
                            {new Date(review.replyDate).toLocaleDateString('pl-PL')}
                        </div>
                    )}
                </div>
            )}

            {/* Reply Form for Owner */}
            {isOwner && !review.reply && (
                <div className="mt-4 pt-4 border-t border-black/5 relative z-10">
                    {!isReplying ? (
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600 rounded-2xl font-black px-6 h-10 text-xs uppercase tracking-tight"
                            onClick={() => setIsReplying(true)}
                        >
                            <MessageCircle size={14} className="mr-2" /> Odpowiedz
                        </Button>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <Textarea
                                placeholder="Napisz odpowiedź..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                rows={3}
                                className="bg-white/80 rounded-[1.5rem] border-white focus:ring-4 focus:ring-rose-100 transition-all"
                            />
                            <div className="flex gap-2">
                                <Button size="sm" onClick={handleReply} disabled={loading} className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-6 font-bold shadow-lg shadow-rose-200">
                                    {loading ? 'Wysyłanie...' : 'Wyślij odpowiedź'}
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsReplying(false)} className="rounded-xl font-bold text-gray-500">
                                    Anuluj
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
