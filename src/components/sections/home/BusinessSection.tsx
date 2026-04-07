'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BRAND_CONFIG } from '@/lib/config';

interface BusinessSectionProps {
    isLoggedIn: boolean;
    freePlanId?: string | number;
}

export const BusinessSection = ({ isLoggedIn, freePlanId }: BusinessSectionProps) => {
    const router = useRouter();

    const handleFreeStart = () => {
        if (!isLoggedIn) {
            const planParam = freePlanId ? `&plan=${freePlanId}` : '';
            router.push(`/rejestracja?role=organizer${planParam}`);
        } else {
            router.push('/moje-konto');
        }
    };

    return (
        <section id="biznes" className="py-24 bg-indigo-50/50 overflow-hidden relative border-y border-indigo-100/50">
            {/* Decorative Pastel Bubbles */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-60"></div>

            <div className="max-w-7xl mx-auto px-4 relative">
                <div className="text-center mb-16">
                    <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4 block">Dla Właścicieli</span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">Prowadzisz biznes dla dzieci?</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">Dołącz do <span className="font-bold text-rose-500">{BRAND_CONFIG.name}</span> i dotrzyj do tysięcy rodziców szukających najlepszych atrakcji w Twoim mieście.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Free Plan Card */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-white p-10 rounded-[2.5rem] border border-emerald-100 shadow-xl shadow-emerald-900/5 flex flex-col h-full"
                    >
                        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 border border-emerald-100">
                            <PlusCircle size={32} className="text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Dodaj miejsce za darmo</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed flex-1">
                            Idealne dla małych firm i osób prowadzących atrakcje lokalne. Stwórz darmową wizytówkę i bądź widoczny na mapie atrakcji.
                        </p>
                        <button
                            onClick={handleFreeStart}
                            className="w-fit text-emerald-600 font-bold border-2 border-emerald-100 px-8 py-3 rounded-full hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all active:scale-95 inline-block text-center"
                        >
                            Zacznij za darmo
                        </button>
                    </motion.div>

                    {/* Premium Plan Card */}
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-rose-50 p-10 rounded-[2.5rem] border border-rose-100 shadow-xl shadow-rose-900/5 flex flex-col h-full relative overflow-hidden"
                    >
                        <div className="absolute top-8 right-8 text-rose-200 opacity-20 transform rotate-12 scale-150">
                            <Zap size={120} fill="currentColor" />
                        </div>

                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-rose-100">
                            <Zap size={32} className="text-rose-500" fill="currentColor" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Wyróżnij się z Planem Premium</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed flex-1 relative z-10">
                            Zyskaj pierwszeństwo w wyszukiwaniu, pełną galerię zdjęć i profesjonalny system rezerwacji. Buduj zaufanie dzięki plakietce Premium i priorytetowej widoczności.
                        </p>
                        <Link
                            href="/dla-biznesu/cennik-premium"
                            className="w-fit bg-rose-500 text-white font-bold px-8 py-3 rounded-full hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 active:scale-95 relative z-10 inline-block text-center"
                        >
                            Sprawdź korzyści
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
