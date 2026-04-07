'use client';

import React, { useState } from 'react';
import { Review } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Trash2, MapPin, Star, MessageCircle, Save, X } from 'lucide-react';
import { updateReviewAction, deleteReviewAction } from '@/features/reviews/actions';
import { toast } from 'sonner';

import { EmptyState } from './EmptyState';
import { ConfirmModal } from '@/components/common/ConfirmModal';

interface ParentReviewsProps {
    reviews: Review[];
}

export const ParentReviews: React.FC<ParentReviewsProps> = ({ reviews }) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [editRating, setEditRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

    const startEditing = (review: Review) => {
        setEditingId(review.id);
        setEditContent(review.content);
        setEditRating(review.rating);
    };

    const handleUpdate = async (reviewId: number) => {
        if (!editContent.trim()) return;
        setIsSubmitting(true);
        const res = await updateReviewAction(reviewId, editContent, editRating);
        setIsSubmitting(false);

        if (res.success) {
            toast.success(res.message);
            setEditingId(null);
        } else {
            toast.error(res.error || 'Błąd aktualizacji.');
        }
    };

    const handleDelete = async (reviewId: number) => {
        setReviewToDelete(reviewId);
    };

    const confirmDelete = async () => {
        if (!reviewToDelete) return;
        const res = await deleteReviewAction(reviewToDelete);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.error || 'Błąd usuwania.');
        }
        setReviewToDelete(null);
    };

    if (reviews.length === 0) {
        return (
            <EmptyState
                icon={Star}
                message="Nie dodałeś jeszcze żadnych opinii."
            />
        );
    }

    return (
        <div className="grid gap-6 animate-in fade-in duration-500">
            {reviews.map((review) => {
                const place = typeof review.place === 'object' ? review.place : null;

                return (
                    <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
                        {editingId === review.id ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onClick={() => setEditRating(star)} type="button">
                                            <Star
                                                size={24}
                                                fill={star <= editRating ? "currentColor" : "none"}
                                                className={star <= editRating ? "text-amber-400" : "text-gray-200"}
                                                strokeWidth={3}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <Textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="min-h-[120px] rounded-2xl"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setEditingId(null)} className="rounded-xl">
                                        <X size={18} className="mr-2" /> Anuluj
                                    </Button>
                                    <Button onClick={() => handleUpdate(review.id)} disabled={isSubmitting} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Save size={18} className="mr-2" /> Zapisz
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Row 1: Place Info & Rating */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 flex-shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div className="flex-1">
                                        {place && (
                                            <h4 className="font-black text-lg text-gray-900 leading-tight mb-1">{place.name}</h4>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={`star-${i}`} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={3} className={i < review.rating ? "text-amber-400" : "text-gray-200"} />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold text-gray-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Content */}
                                <div className="py-4 border-t border-gray-50">
                                    <p className="text-gray-600 leading-relaxed font-medium">{review.content}</p>
                                </div>

                                {/* Row 3: Actions & Reply */}
                                <div className="flex flex-col gap-6 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => startEditing(review)}
                                            className="rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 font-bold px-4"
                                        >
                                            <Edit2 size={16} className="mr-2" /> Edytuj
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(review.id)}
                                            className="rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 font-bold px-4"
                                        >
                                            <Trash2 size={16} className="mr-2" /> Usuń
                                        </Button>
                                    </div>

                                    {review.reply && (
                                        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex flex-col gap-3">
                                            <div className="flex items-center gap-2 text-indigo-400">
                                                <MessageCircle size={18} />
                                                <h5 className="font-bold text-indigo-900 text-xs uppercase tracking-wider">Odpowiedź organizatora</h5>
                                            </div>
                                            <p className="text-indigo-800 text-sm leading-relaxed">{review.reply}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            <ConfirmModal
                isOpen={!!reviewToDelete}
                onClose={() => setReviewToDelete(null)}
                onConfirm={confirmDelete}
                title="Potwierdź usunięcie"
                description="Czy na pewno chcesz usunąć tę opinię? Ta operacja jest nieodwracalna."
                confirmLabel="Usuń"
                cancelLabel="Anuluj"
                variant="destructive"
            />
        </div >
    );
};
