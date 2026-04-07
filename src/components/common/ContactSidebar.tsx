'use client';

import React from 'react';
import { Phone, Mail, Globe, Clock, Calendar, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OpeningHours {
    day: string;
    hours: string;
    id?: string | null;
}

interface SocialLink {
    platform?: string | null;
    url?: string | null;
    id?: string | null;
}

interface ContactSidebarProps {
    phoneNumber?: string | null;
    email?: string | null;
    website?: string | null;
    openingHours?: OpeningHours[] | null;
    socialLinks?: SocialLink[] | null;
    onBookVisit?: () => void; // Optional handler for booking/claim
    scrollToId?: string; // ID to scroll to when clicking the CTA
    ctaUrl?: string | null; // Optional external link for CTA
    ctaText?: string; // Custom text for CTA
    ctaSubtext?: string | null; // Custom subtext for CTA
    className?: string;
}

const dayMapping: Record<string, string> = {
    monday: 'Poniedziałek',
    tuesday: 'Wtorek',
    wednesday: 'Środa',
    thursday: 'Czwartek',
    friday: 'Piątek',
    saturday: 'Sobota',
    sunday: 'Niedziela',
};

export const ContactSidebar: React.FC<ContactSidebarProps> = ({
    phoneNumber,
    email,
    website,
    openingHours,
    socialLinks,
    onBookVisit,
    scrollToId,
    ctaUrl,
    ctaText = "Rezerwuj wizytę",
    ctaSubtext = "Bezpieczna rezerwacja przez KidsPlaces",
    className = "",
    // ... removed unused props
}) => {
    const [showPhone, setShowPhone] = React.useState(false);
    const [showEmail, setShowEmail] = React.useState(false);

    // Ensure website has http/https prefix
    const formattedWebsite = website ? (website.startsWith('http') ? website : `https://${website}`) : null;

    const hasCTA = !!onBookVisit || !!scrollToId || !!ctaUrl;

    return (
        <div className={`bg-white rounded-3xl p-8 shadow-sm border border-gray-100 ${className}`}>
            <h3 className="text-xl font-black mb-6 text-gray-900">Dane kontaktowe</h3>

            <div className="space-y-4">
                {phoneNumber && (
                    <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-100 transition-colors">
                            <Phone size={18} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase">Telefon</div>
                            {showPhone ? (
                                <a href={`tel:${phoneNumber}`} className="text-gray-900 font-bold hover:text-rose-500 transition-colors">
                                    {phoneNumber}
                                </a>
                            ) : (
                                <button
                                    onClick={() => setShowPhone(true)}
                                    className="text-gray-900 font-bold hover:text-rose-500 transition-colors text-sm border-b border-rose-200 border-dashed"
                                >
                                    Pokaż numer telefonu
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {email && (
                    <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-100 transition-colors">
                            <Mail size={18} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase">E-mail</div>
                            {showEmail ? (
                                <a href={`mailto:${email}`} className="text-gray-900 font-bold hover:text-rose-500 transition-colors truncate max-w-[200px] block">
                                    {email}
                                </a>
                            ) : (
                                <button
                                    onClick={() => setShowEmail(true)}
                                    className="text-gray-900 font-bold hover:text-rose-500 transition-colors text-sm border-b border-rose-200 border-dashed"
                                >
                                    Pokaż e-mail
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {formattedWebsite && (
                    <div className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-100 transition-colors">
                            <Globe size={18} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase">Strona WWW</div>
                            <a href={formattedWebsite} target="_blank" rel="noopener noreferrer" className="text-gray-900 font-bold hover:text-rose-500 transition-colors truncate max-w-[200px] block">
                                {formattedWebsite}
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Opening Hours */}
            {openingHours && openingHours.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="text-gray-400" size={18} />
                        <h4 className="font-bold text-gray-900">Godziny otwarcia</h4>
                    </div>
                    <div className="space-y-2">
                        {openingHours.map((oh) => (
                            <div key={oh.id} className="flex justify-between text-sm">
                                <span className="text-gray-500 font-medium">{dayMapping[oh.day] || oh.day}</span>
                                <span className="text-gray-900 font-bold">{oh.hours}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-4">Znajdź nas</h4>
                    <div className="flex gap-3">
                        {socialLinks.map((link) => {
                            if (!link.url) return null;
                            const Icon =
                                link.platform === 'Facebook' ? <Facebook size={20} /> :
                                    link.platform === 'Instagram' ? <Instagram size={20} /> :
                                        link.platform === 'TikTok' ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-3.932 1.348 6.331 6.331 0 0 0-2.22 8.358 6.328 6.328 0 0 0 8.01 2.8c1.643-.72 2.896-1.975 3.513-3.61.123-.33.204-.67.243-1.02V8.455c1.474 1.096 3.28 1.743 5.244 1.743V6.756a4.793 4.793 0 0 1-1.625-.07z" />
                                            </svg>
                                        ) :
                                            link.platform === 'Website' ? <Globe size={20} /> :
                                                <Globe size={20} />;

                            return (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-rose-500 transition-colors"
                                >
                                    {Icon}
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* CTA Button */}
            {hasCTA && (
                <div className="mt-8">
                    {ctaUrl ? (
                        <a
                            href={ctaUrl.startsWith('http') ? ctaUrl : `https://${ctaUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <Button
                                variant="default"
                                size="lg"
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                <Calendar className="mr-2" size={20} />
                                {ctaText}
                            </Button>
                        </a>
                    ) : (
                        <Button
                            variant="default"
                            size="lg"
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl py-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                            onClick={() => {
                                if (onBookVisit) {
                                    onBookVisit();
                                } else if (scrollToId) {
                                    const el = document.getElementById(scrollToId);
                                    if (el) {
                                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }
                            }}
                        >
                            <Calendar className="mr-2" size={20} />
                            {ctaText}
                        </Button>
                    )}
                    {ctaSubtext && (
                        <p className="text-center text-xs text-gray-400 mt-2">{ctaSubtext}</p>
                    )}
                </div>
            )}


            {/* Mini Map Static / Link */}

        </div>
    );
};
