'use client';

import React, { useState } from 'react';
import { Review } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageCircle, MapPin } from 'lucide-react';
import { replyToReviewAction } from '@/features/reviews/actions';
import { toast } from 'sonner';

import { EmptyState } from './EmptyState';

interface OrganizerReviewsProps {
    reviews: Review[];
}

export const OrganizerReviews: React.FC<OrganizerReviewsProps> = ({ reviews }) => {
    const [replyingId, setReplyingId] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReply = async (reviewId: number) => {
        if (!replyContent.trim()) return;
        setIsSubmitting(true);
        const res = await replyToReviewAction(reviewId, replyContent);
        setIsSubmitting(false);

        if (res.success) {
            toast.success(res.message);
            setReplyingId(null);
            setReplyContent('');
        } else {
            toast.error(res.error || 'Błąd podczas dodawania odpowiedzi.');
        }
    };

    if (reviews.length === 0) {
        return (
            <EmptyState
                icon={MessageCircle}
                message="Brak opinii dla Twoich miejsc."
            />
        );
    }

    return (
        <div className="grid gap-6 animate-in fade-in duration-500">
            {reviews.map((review) => {
                const place = typeof review.place === 'object' ? review.place : null;
                const user = typeof review.user === 'object' ? review.user : null;

                return (
                    <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        <div className="space-y-6">
                            {/* Row 1: User Info & Rating */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 font-black text-lg flex-shrink-0">
                                    {user?.name?.[0]}{user?.surname?.[0]}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-lg text-gray-900 leading-tight mb-1">{user?.name} {user?.surname}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={`star-${i}`} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={3} className={i < review.rating ? "text-amber-400" : "text-gray-200"} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {place && (
                                        <div className="inline-flex items-center gap-1 mt-2 text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">
                                            <MapPin size={10} /> {place.name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Content */}
                            <div className="py-6 border-t border-gray-50">
                                <p className="text-gray-600 leading-relaxed font-medium">{review.content}</p>
                            </div>

                            {/* Row 3: Reply Section */}
                            <div className="pt-6 border-t border-gray-50">
                                {review.reply ? (
                                    <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex flex-col gap-3">
                                        <div className="flex items-center gap-2 text-indigo-400">
                                            <MessageCircle size={18} />
                                            <h5 className="font-bold text-indigo-900 text-xs uppercase tracking-wider">Twoja odpowiedź</h5>
                                        </div>
                                        <p className="text-indigo-800 text-sm leading-relaxed">{review.reply}</p>
                                        <span className="text-[10px] font-bold text-indigo-400 mt-1 opacity-70">
                                            {review.replyDate && new Date(review.replyDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                ) : (
                                    <div>
                                        {replyingId === review.id ? (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <Textarea
                                                    placeholder="Napisz odpowiedź..."
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    className="min-h-[120px] rounded-2xl border-indigo-100 focus:border-indigo-300 focus:ring-indigo-100"
                                                    autoFocus
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => setReplyingId(null)} className="rounded-xl text-gray-500 font-bold">Anuluj</Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleReply(review.id)}
                                                        disabled={isSubmitting}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 font-bold"
                                                    >
                                                        {isSubmitting ? 'Wysyłanie...' : 'Wyślij odpowiedź'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                onClick={() => setReplyingId(review.id)}
                                                className="rounded-xl border-indigo-100 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 font-bold px-6 h-11"
                                            >
                                                <MessageCircle size={16} className="mr-2" /> Odpowiedz na tę opinię
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
