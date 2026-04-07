'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if cookie exists
        const consent = document.cookie.split('; ').find(row => row.startsWith('cookie_consent='));
        if (!consent) {
            // Delay slightly to avoid layout shift impact on LCP
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const updateConsent = (granted: boolean) => {
        const newValue = granted ? 'granted' : 'denied';

        // Update Google Analytics Consent
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
                'ad_storage': newValue,
                'analytics_storage': newValue,
                'ad_user_data': newValue,
                'ad_personalization': newValue
            });
        }

        // Set Cookie (valid for 1 year)
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = `cookie_consent=${granted}; ${expires}; path=/; SameSite=Lax`;

        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
                >
                    <div className="bg-white/95 backdrop-blur-md p-6 rounded-[1.5rem] shadow-2xl border border-gray-100/50">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Dbamy o Twoją prywatność 🍪</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    Używamy plików cookie i Google Analytics, aby lepiej zrozumieć, jak korzystasz z naszego portalu i dostarczać Ci najlepsze treści. Możesz zaakceptować wszystkie pliki cookie lub odrzucić te, które nie są niezbędne.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={() => updateConsent(true)}
                                className="flex-1 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-transform hover:scale-[1.02]"
                            >
                                Zaakceptuj
                            </Button>
                            <Button
                                onClick={() => updateConsent(false)}
                                variant="outline"
                                className="flex-1 rounded-xl font-bold text-gray-600 hover:bg-gray-50 border-gray-200"
                            >
                                Tylko niezbędne
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Add global type for gtag
declare global {
    interface Window {
        gtag: (
            command: 'consent' | 'config' | 'event' | 'js',
            targetId: string,
            config?: Record<string, unknown>
        ) => void;
    }
}
