import React from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Megaphone, Layout, FileText, Send, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config';

export const metadata = {
    title: `Reklama - ${BRAND_CONFIG.name}`,
    description: 'Promuj swoją markę wśród tysięcy rodziców. Sprawdź dostępne formaty reklamowe.',
};

export default function AdvertisingPage() {
    const formats = [
        {
            title: 'Banery reklamowe',
            description: 'Wysoka widoczność na stronie głównej oraz w wynikach wyszukiwania.',
            icon: <Layout className="text-blue-500" />,
            efficiency: 'Wysoka'
        },
        {
            title: 'Artykuły sponsorowane',
            description: 'Budowanie autorytetu marki poprzez wartościowe treści poradnikowe.',
            icon: <FileText className="text-rose-500" />,
            efficiency: 'Ekspercka'
        },
        {
            title: 'Social Media',
            description: 'Posty promocyjne na naszym Facebooku i Instagramie.',
            icon: <Send className="text-sky-500" />,
            efficiency: 'Interaktywna'
        },
        {
            title: 'Newsletter',
            description: 'Bezpośrednie dotarcie do skrzynek mailowych zapisanych rodziców.',
            icon: <Sparkles className="text-amber-500" />,
            efficiency: 'Direct'
        }
    ];

    return (
        <main className="bg-gray-50 pb-24 pt-8">
            <div className="max-w-7xl mx-auto px-6">
                <Breadcrumbs
                    items={[{ label: 'Dla Biznesu', href: '#' }, { label: 'Reklama' }]}
                    className="mb-12"
                />

                <div className="text-center max-w-4xl mx-auto mb-20">
                    <span className="inline-block py-1 px-4 bg-rose-50 text-rose-600 rounded-full text-sm font-bold uppercase tracking-widest mb-6 border border-rose-100">
                        Zwiększ swoje zasięgi
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1]">
                        Twoja marka tam, gdzie <span className="text-rose-500">planują rodzice</span>
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed">
                        {BRAND_CONFIG.name} to najszybciej rozwijająca się platforma dla rodzin w Polsce.
                        Pomagamy markom budować relacje z rodzicami w naturalnym dla nich kontekście.
                    </p>
                </div>

                <div className="space-y-12">
                    <h2 className="text-3xl font-bold text-center">Dostępne formaty</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {formats.map((format) => (
                            <div key={format.title} className="bg-white p-8 rounded-3xl border border-gray-100 flex items-start gap-6 group hover:shadow-lg transition-all">
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    {format.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold">{format.title}</h3>
                                        <span className="text-[10px] font-black uppercase py-0.5 px-2 bg-gray-100 text-gray-500 rounded-md">
                                            {format.efficiency}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm leading-relaxed">{format.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-24 text-center bg-white border border-gray-100 rounded-[3rem] p-12 md:p-20 text-gray-900 relative overflow-hidden shadow-sm">
                    {/* Pastel Blobs like in Hero */}
                    <div className="absolute top-0 -right-10 w-80 h-80 bg-rose-100 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-0 -left-10 w-80 h-80 bg-cyan-100 rounded-full blur-3xl opacity-60"></div>

                    <div className="relative z-10">
                        <Megaphone size={64} className="mx-auto mb-8 text-rose-500 opacity-20" />
                        <h2 className="text-3xl md:text-5xl font-black mb-6">Chcesz wiedzieć więcej?</h2>
                        <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                            Przygotujemy dla Ciebie indywidualną ofertę dopasowaną do budżetu i celów Twojej marki.
                            Ceny kampanii zaczynają się już od 499 zł netto.
                        </p>
                        <Link
                            href="/kontakt?subject=Reklama"
                            className="inline-flex items-center gap-2 bg-rose-500 text-white px-10 py-5 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-xl shadow-rose-200"
                        >
                            Zapytaj o ofertę reklamową
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
