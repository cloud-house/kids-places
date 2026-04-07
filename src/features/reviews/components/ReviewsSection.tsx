'use server'

import { getPayloadClient } from '@/lib/payload-client'
import { ReviewItem } from './ReviewItem'
import { ReviewForm } from './ReviewForm'
import { User } from '@/payload-types'
import { Star } from 'lucide-react'
import Link from 'next/link'

interface ReviewsSectionProps {
    placeId: number
    currentUser: User | null
    isOwner: boolean
}

export async function ReviewsSection({ placeId, currentUser, isOwner }: ReviewsSectionProps) {
    const payload = await getPayloadClient()

    // Fetch reviews
    const { docs: reviews, totalDocs } = await payload.find({
        collection: 'reviews',
        where: {
            place: { equals: placeId },
            status: { equals: 'published' }
        },
        sort: '-createdAt',
        depth: 1,
    })

    // Calculate average
    const averageRating = totalDocs > 0
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalDocs
        : 0

    // Check if user already reviewed
    const userReview = currentUser ? reviews.find(r =>
        (typeof r.user === 'number' && r.user === currentUser.id) ||
        (typeof r.user === 'object' && r.user.id === currentUser.id)
    ) : null

    return (
        <section className="py-12 relative overflow-hidden" id="opinie">
            <div className="absolute top-10 right-10 w-32 h-32 bg-pink-100/50 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-sky-100/50 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <h2 className="text-3xl font-black mb-3 text-gray-900">Głosy rodziców ({totalDocs})</h2>
                    <p className="text-gray-500 font-medium text-lg">
                        Zobacz co inni mówią o tym miejscu
                    </p>
                </div>

                <div className="bg-white border-rose-100 border-4 px-8 py-6 rounded-[2.5rem] shadow-xl shadow-rose-50/50 flex items-center gap-6">
                    <div className="text-5xl font-black text-gray-900 tracking-tighter">
                        {averageRating.toFixed(1)}
                    </div>
                    <div>
                        <div className="flex text-amber-400 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={20}
                                    fill={star <= Math.round(averageRating) ? "currentColor" : "none"}
                                    strokeWidth={3}
                                />
                            ))}
                        </div>
                        <span className="text-gray-400 font-bold text-sm uppercase tracking-widest">Średnia ocena</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-12">
                <div className="grid gap-6">
                    {reviews.length > 0 ? (
                        reviews.map((review, idx) => (
                            <ReviewItem
                                key={review.id}
                                review={review}
                                isOwner={isOwner}
                                index={idx}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-4 border-dashed border-gray-100">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Star className="text-gray-200" size={32} />
                            </div>
                            <p className="text-gray-400 text-lg font-medium mb-1">To miejsce czeka na pierwszą opinię</p>
                            <p className="text-rose-400 font-black uppercase tracking-wider text-sm">Bądź pierwszy i zainspiruj innych!</p>
                        </div>
                    )}
                </div>

                <div className="pt-12 border-gray-100 border-t">
                    {!currentUser ? (
                        <div className="bg-sky-50/50 border-sky-100 p-10 rounded-[3rem] border-2 text-center max-w-2xl mx-auto">
                            <h3 className="font-black text-2xl mb-3 text-sky-900">Dołącz do społeczności!</h3>
                            <p className="text-sky-700/70 mb-8 font-medium text-lg">Zaloguj się, aby podzielić się swoimi wrażeniami z innymi rodzicami.</p>
                            <Link href="/logowanie" className="inline-block bg-white text-sky-600 border-2 border-sky-100 hover:border-sky-500 hover:text-sky-700 font-black py-4 px-10 rounded-2xl transition-all shadow-lg shadow-sky-100 active:scale-95">
                                Zaloguj się teraz
                            </Link>
                        </div>
                    ) : isOwner ? (
                        <div className="bg-blue-50/50 p-10 rounded-[3rem] border-2 border-blue-100 text-center max-w-2xl mx-auto">
                            <h3 className="font-black text-2xl mb-3 text-blue-900">Panel Organizatora</h3>
                            <p className="text-blue-700 font-medium">Możesz odpowiadać na opinie użytkowników bezpośrednio na liście powyżej.</p>
                        </div>
                    ) : userReview ? (
                        <div className="bg-emerald-50/50 p-10 rounded-[3rem] border-2 border-emerald-100 text-center max-w-2xl mx-auto">
                            <h3 className="font-black text-2xl mb-3 text-emerald-800">Dziękujemy, {currentUser.name}! 🍦</h3>
                            <p className="text-emerald-700 font-medium text-lg">Twoja opinia jest już widoczna dla innych. Dzięki Tobie rodzice łatwiej znajdą to co najlepsze!</p>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto w-full">
                            <ReviewForm placeId={placeId} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
