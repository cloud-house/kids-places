'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Hero = () => {
    const router = useRouter();
    const [q, setQ] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (location) {
            params.set('city', location);
        }

        router.push(`/miejsca?${params.toString()}`);
    };

    return (
        <section className="relative pt-12 pb-20 lg:pt-28 lg:pb-32 overflow-hidden">
            {/* Animated Blobs */}
            <div className="blob-bg w-96 h-96 bg-rose-200 absolute top-10 -left-20 rounded-full animate-pulse blur-3xl opacity-50"></div>
            <div className="blob-bg w-96 h-96 bg-cyan-200 absolute bottom-10 -right-20 rounded-full animate-bounce blur-3xl opacity-50"></div>
            <div className="blob-bg w-64 h-64 bg-amber-200 absolute top-40 right-40 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 relative">
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
                    >
                        Wszystkie przygody Twojego dziecka <span className="text-rose-500">w jednym miejscu</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg lg:text-xl text-gray-600 mb-10"
                    >
                        Odkryj najlepsze miejsca i atrakcje dla dzieci w Twojej okolicy. Buduj wspomnienia, które zostaną na całe życie.
                    </motion.p>

                    <div className="max-w-3xl mx-auto">
                        <motion.form
                            onSubmit={handleSearch}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`bg-white p-2 md:p-3 rounded-3xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-stretch gap-2 border shadow-rose-200/50 border-rose-50`}
                        >
                            <div className="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-gray-100 pb-2 md:pb-0">
                                <Search className="text-rose-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Czego szukasz? (np. basen, lego)"
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    className="w-full py-2 focus:outline-none text-gray-700 bg-transparent placeholder-gray-400"
                                />
                            </div>
                            <div className="flex-1 flex items-center px-4 gap-3 py-2 md:py-0">
                                <MapPin className="text-rose-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Miasto (np. Warszawa)"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full py-2 focus:outline-none text-gray-700 bg-transparent placeholder-gray-400"
                                />
                            </div>
                            <button
                                type="submit"
                                className={`text-white font-bold px-10 py-3 rounded-full transition-all shadow-lg active:scale-95 bg-rose-500 hover:bg-rose-600 shadow-rose-200`}
                            >
                                Szukaj
                            </button>
                        </motion.form>
                    </div>
                </div>
            </div>
        </section>
    );
};
