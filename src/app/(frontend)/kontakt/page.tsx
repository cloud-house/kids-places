import React from 'react';
import { Mail, Users, Facebook, Instagram } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ContactForm } from './ContactForm';
import { BRAND_CONFIG } from '@/lib/config';



export const metadata = {
    title: `Kontakt - ${BRAND_CONFIG.name}`,
    description: 'Skontaktuj się z nami w sprawie współpracy lub zapytań.',
};

export default function ContactPage() {
    return (
        <main className="bg-gray-50 pb-24 pt-8">
            <div className="max-w-7xl mx-auto px-6">
                <Breadcrumbs
                    items={[{ label: 'Kontakt' }]}
                    className="mb-12"
                />

                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Header Row */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                            Zostańmy w <span className="text-rose-500">kontakcie</span>
                        </h1>
                        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                            Masz pytania dotyczące platformy? Chcesz nawiązać współpracę? Jesteśmy tutaj, aby pomóc!
                        </p>
                    </div>

                    {/* Info Cards Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center gap-6 transition-all hover:shadow-md hover:-translate-y-1">
                            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
                                <Mail size={32} />
                            </div>
                            <div className="w-full">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter mb-4 text-center">Napisz do nas</p>
                                <a
                                    href={`mailto:${BRAND_CONFIG.contactEmail}`}
                                    className="flex items-center justify-center gap-2 py-3 px-6 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-sm hover:shadow-md w-max mx-auto"
                                >
                                    <Mail size={20} />
                                    <span className="text-sm">{BRAND_CONFIG.contactEmail}</span>
                                </a>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col items-center text-center gap-6 transition-all hover:shadow-md hover:-translate-y-1">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                                <Users size={32} />
                            </div>
                            <div className="w-full">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tight mb-4 text-center">Znajdź nas w social mediach</p>
                                <div className="flex items-center justify-center gap-3">
                                    <a
                                        href="https://facebook.com/kidsplaces"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                                        title="Facebook"
                                    >
                                        <Facebook size={20} />
                                        <span className="text-sm">Facebook</span>
                                    </a>
                                    <a
                                        href="https://instagram.com/kidsplaces"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-sm hover:shadow-md"
                                        title="Instagram"
                                    >
                                        <Instagram size={20} />
                                        <span className="text-sm">Instagram</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Row */}
                    <div className="w-full">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
