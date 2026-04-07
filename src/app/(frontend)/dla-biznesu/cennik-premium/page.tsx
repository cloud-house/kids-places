import React from 'react';
import Link from 'next/link';
import { Pricing } from '@/features/pricing/components/Pricing';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Zap, TrendingUp, Search, Image as ImageIcon } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config';

export const metadata = {
    title: `Cennik Premium - ${BRAND_CONFIG.name}`,
    description: 'Wybierz plan dopasowany do Twoich potrzeb i wyróżnij swoje miejsce.',
};

export default function PricingPage() {
    const benefits = [
        {
            title: 'Większa widoczność',
            description: 'Twoje miejsce będzie wyświetlane wyżej w wynikach wyszukiwania i wyróżnione specjalną odznaką.',
            icon: <Search className="text-rose-500" />
        },
        {
            title: 'Rozbudowana galeria',
            description: 'Możliwość dodania większej liczby zdjęć, które przyciągną uwagę rodziców.',
            icon: <ImageIcon className="text-rose-500" />
        },
        {
            title: 'Linki social media',
            description: 'Bezpośrednie odsyłacze do Twojego Facebooka, Instagrama i strony WWW.',
            icon: <Zap className="text-rose-500" />
        },
        {
            title: 'Statystyki odwiedzin',
            description: 'Dostęp do panelu z danymi o tym, ile osób wyświetliło Twoją ofertę.',
            icon: <TrendingUp className="text-rose-500" />
        }
    ];

    return (
        <main className="bg-gray-50 pb-24 pt-8">
            <div className="max-w-7xl mx-auto px-6">
                <Breadcrumbs
                    items={[{ label: 'Dla Biznesu', href: '#' }, { label: 'Cennik Premium' }]}
                    className="mb-12"
                />

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                        Wynieś swój biznes na <span className="text-rose-500">wyższy poziom</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium">
                        Dołącz do grona partnerów {BRAND_CONFIG.name} i dotrzyj do tysięcy aktywnych rodziców w Twoim regionie.
                    </p>
                </div>

                {/* Reuse existing Pricing component */}
                <Pricing />

                <div className="mt-24">
                    <h2 className="text-3xl font-bold text-center mb-16">Dlaczego warto przejść na Premium?</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-24 bg-white border border-gray-100 rounded-[3rem] p-12 md:p-20 text-gray-900 relative overflow-hidden shadow-sm">
                    {/* Pastel Blobs like in Hero */}
                    <div className="absolute top-0 -left-10 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-0 -right-10 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-60"></div>

                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-black mb-6">Potrzebujesz dodatkowego wsprarcia merketingowego?</h2>
                        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                            Dla sieci placówek, dużych centrów rozrywki oraz gmin przygotowaliśmy pakiety enterprise z dedykowaną opieką doradcy.
                        </p>
                        <Link
                            href="/dla-biznesu/reklama"
                            className="inline-flex items-center gap-2 bg-rose-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                        >
                            Zobacz ofertę
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
