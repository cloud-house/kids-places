'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { subscribeToNewsletterAction } from '@/features/newsletter/actions';
import { Loader2 } from 'lucide-react';

export const Newsletter = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            const res = await subscribeToNewsletterAction(formData);
            if (res.success) {
                toast.success(res.message);
                (e.target as HTMLFormElement).reset();
            } else {
                toast.error(res.error);
            }
        } catch {
            toast.error('Wystąpił nieoczekiwany błąd.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="newsletter" className="py-24">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-cyan-500 rounded-[3rem] p-8 md:p-20 text-white flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                    <div className="relative z-10 text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Co tydzień nowe pomysły!</h2>
                        <p className="text-cyan-100 text-lg max-w-md">Zapisz się do newslettera i otrzymuj zestawienie najlepszych wydarzeń dla dzieci w Twoim mieście.</p>
                    </div>

                    <div className="relative z-10 w-full max-w-lg">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col gap-4 p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        name="name"
                                        type="text"
                                        placeholder="Imię"
                                        className="flex-1 px-6 py-4 bg-white rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none"
                                    />
                                    <input
                                        name="city"
                                        type="text"
                                        placeholder="Twoje miasto"
                                        className="flex-1 px-6 py-4 bg-white rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none"
                                    />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Twój email"
                                    className="w-full px-6 py-4 bg-white rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none"
                                />
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="w-full bg-amber-400 text-gray-900 font-bold px-10 py-4 rounded-2xl hover:bg-amber-300 transition-all shadow-xl whitespace-nowrap flex items-center justify-center"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Zapisz mnie'}
                                </button>
                            </div>

                            <div className="flex items-start gap-3 px-2">
                                <input
                                    id="consent"
                                    name="consent"
                                    type="checkbox"
                                    required
                                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 text-amber-400 focus:ring-amber-400 focus:ring-offset-cyan-500"
                                />
                                <label htmlFor="consent" className="text-xs text-cyan-50 leading-relaxed cursor-pointer selection:bg-cyan-600">
                                    Wyrażam zgodę na otrzymywanie informacji handlowych oraz przetwarzanie moich danych osobowych w celu wysyłki newslettera. Zapoznałem się z polityką prywatności.
                                </label>
                            </div>
                        </form>
                        <p className="text-xs text-cyan-200 mt-4 text-center lg:text-left">Szanujemy Twoją prywatność. Możesz wypisać się w każdej chwili.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};
