import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Handshake, Globe, ShieldCheck, Heart, Users, School, Landmark, Calendar } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config';

export const metadata = {
    title: `Partnerstwa - ${BRAND_CONFIG.name}`,
    description: 'Współpracuj z nami. Oferta dla samorządów, fundacji i partnerów strategicznych.',
};

export default function PartnershipsPage() {
    const sectors = [
        {
            title: 'Samorządy i Gminy',
            description: 'Wspieramy promocję lokalnych atrakcji, parków i domów kultury wśród mieszkańców.',
            icon: <Landmark className="text-blue-500" />
        },
        {
            title: 'Szkoły i Przedszkola',
            description: 'Dedykowane narzędzia dla placówek edukacyjnych ułatwiające komunikację z rodzicami.',
            icon: <School className="text-amber-500" />
        },
        {
            title: 'Fundacje i NGO',
            description: 'Pomagamy w promocji wydarzeń charytatywnych i akcji społecznych skierowanych do rodzin.',
            icon: <Heart className="text-rose-500" />
        },
        {
            title: 'Organizatorzy Eventów',
            description: 'Kompleksowe wsparcie promocyjne festiwali, koncertów i warsztatów dla dzieci.',
            icon: <Calendar className="text-emerald-500" />
        }
    ];

    return (
        <main className="bg-gray-50 pb-24 pt-8">
            <div className="max-w-7xl mx-auto px-6">
                <Breadcrumbs
                    items={[{ label: 'Dla Biznesu', href: '#' }, { label: 'Partnerstwa' }]}
                    className="mb-12"
                />

                <div className="text-center max-w-4xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-8 leading-[1.1]">
                        Budujmy razem <br /><span className="text-rose-500">przyjazny świat</span> dla dzieci
                    </h1>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-3xl mx-auto">
                        {BRAND_CONFIG.name} to nie tylko katalog miejsc. To misja wspierania rozwoju dzieci poprzez łatwy dostęp
                        do najlepszych ofert. Szukamy partnerów, którzy dzielą nasze wartości.
                    </p>
                </div>

                <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-sm border border-gray-100 mb-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-8">Nasze filary współpracy</h2>
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="shrink-0 w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                                        <Globe size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Ogólnopolski zasięg</h4>
                                        <p className="text-gray-500 text-sm">Rozwijamy się w każdym większym mieście w Polsce, dając Partnerom dostęp do szerokiej bazy klientów.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Zaufanie i Bezpieczeństwo</h4>
                                        <p className="text-gray-500 text-sm">Wszystkie miejsca na platformie są weryfikowane pod kątem jakości i bezpieczeństwa dzieci.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="shrink-0 w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1">Wspólna Społeczność</h4>
                                        <p className="text-gray-500 text-sm">Wspieramy integrację lokalnych społeczności rodziców i organizatorów.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-[2rem] p-4">
                            <div className="aspect-video bg-gray-200 rounded-3xl relative overflow-hidden group">
                                <Image
                                    src="/partnerships-contact.png"
                                    alt="Współpraca i partnerstwo"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex flex-col justify-end p-8 text-white">
                                    <h3 className="font-bold text-2xl mb-2">Zapraszamy do kontaktu</h3>
                                    <p className="text-sm opacity-90">Jesteśmy otwarci na Twoje pomysły</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-12">
                    <h2 className="text-3xl font-bold text-center mb-16">Grupy Partnerów</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {sectors.map((sector) => (
                            <div key={sector.title} className="bg-white p-10 rounded-3xl border border-gray-100 transition-all hover:bg-rose-500/5 hover:border-rose-100 group">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                    {sector.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{sector.title}</h3>
                                <p className="text-gray-500 leading-relaxed mb-6">
                                    {sector.description}
                                </p>
                                <Link href="/kontakt" className="text-rose-500 font-bold flex items-center gap-2 text-sm hover:gap-3 transition-all">
                                    Dowiedz się więcej <span>→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-32 text-center">
                    <div className="inline-flex items-center gap-3 py-2 px-6 bg-gray-900 text-white rounded-full text-sm font-medium mb-8">
                        <Handshake size={18} className="text-rose-400" />
                        Dołącz do nas już dzisiaj
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-12">Chcesz zostać <br />oficjalnym Partnerem?</h2>
                    <Link
                        href="/kontakt"
                        className="inline-flex items-center gap-2 bg-rose-500 text-white px-10 py-5 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-xl shadow-rose-100"
                    >
                        Rozpocznij współpracę
                    </Link>
                </div>
            </div>
        </main>
    );
}
