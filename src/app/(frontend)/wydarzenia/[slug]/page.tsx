export const revalidate = 1800; // 30 minutes

import React from 'react';
import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/features/events/service';
import { Calendar, MapPin, Ticket, Clock, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import { headers } from 'next/headers';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { HeartButton } from '@/features/favorites/components/HeartButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { StructuredData } from '@/components/seo/StructuredData';
import { AmenitiesGrid } from '@/components/common/AmenitiesGrid';
import { RichText } from '@/components/RichText';
import { PremiumGalleryGrid, GalleryImage } from '@/components/common/PremiumGalleryGrid';
import { ContactSidebar } from '@/components/common/ContactSidebar';
import Map from '@/components/common/MapWrapper';
import { RegistrationForm } from '@/features/inquiries/components/RegistrationForm';

import { Place, Media, Ticket as TicketType } from '@/payload-types';
import { BRAND_CONFIG } from '@/lib/config';
import { getPremiumStatus } from '@/features/account/utils';
import { getPayloadClient } from '@/lib/payload-client';
import { LexicalRichText } from '@/components/RichText/types';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) return {};

    const imageUrl =
        typeof event.logo === 'object' && (event.logo as Media)?.url
            ? (event.logo as Media).url
            : `${BRAND_CONFIG.url}/og-image.png`;

    const descriptionText = (event.description as LexicalRichText)?.root?.children[0]?.children?.[0]?.text || `Wydarzenie dla dzieci: ${event.title}`;

    return {
        title: `${event.title} | ${BRAND_CONFIG.name}`,
        description: descriptionText,
        alternates: {
            canonical: `${BRAND_CONFIG.url}/wydarzenia/${slug}`,
        },
        openGraph: {
            title: `${event.title} | ${BRAND_CONFIG.name}`,
            description: descriptionText,
            url: `${BRAND_CONFIG.url}/wydarzenia/${slug}`,
            type: 'article',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: event.title,
                },
            ],
        },
    };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const event = await getEventBySlug(slug);

    if (!event) {
        notFound();
    }

    const payload = await getPayloadClient();
    await payload.auth({ headers: await headers() });

    const imageUrl =
        typeof event.logo === 'object' && (event.logo as Media)?.url
            ? (event.logo as Media).url
            : null;

    const place = typeof event.place === 'object' ? (event.place as Place) : null;
    const cityName = place ? (typeof place.city === 'object' ? place.city.name : '') : '';
    const fullAddress = place
        ? place.street
            ? `${place.street}, ${place.postalCode} ${cityName}`
            : cityName
        : '';

    const lat = place?.latitude || 52.2297;
    const lon = place?.longitude || 21.0122;

    const organizer = typeof event.organizer === 'object' ? event.organizer : null;
    const { isPremium: isOrgPremium } = getPremiumStatus(organizer);
    const isPremium = event.plan === 'premium' || isOrgPremium;

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        description: (event.description as LexicalRichText)?.root?.children[0]?.children?.[0]?.text || '',
        image: imageUrl,
        startDate: event.startDate,
        location: place ? {
            '@type': 'Place',
            name: place.name,
            address: {
                '@type': 'PostalAddress',
                streetAddress: place.street,
                addressLocality: cityName,
                postalCode: place.postalCode,
                addressCountry: 'PL',
            },
        } : undefined,
    };

    const galleryItems = event.gallery || [];
    const tickets = (event.tickets || []).filter((t): t is TicketType => typeof t === 'object' && t !== null);

    const startDate = new Date(event.startDate);
    const formattedDate = startDate.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedTime = startDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    return (
        <main className="bg-gray-50 pb-24 min-h-screen relative">
            <StructuredData data={structuredData} />

            {/* Breadcrumbs */}
            <div className="absolute top-8 left-0 w-full z-30 pointer-events-none">
                <div className="max-w-7xl mx-auto px-6 pointer-events-auto">
                    <Breadcrumbs
                        items={[
                            { label: 'Wydarzenia', href: '/wydarzenia' },
                            { label: event.title },
                        ]}
                        className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm w-fit"
                    />
                </div>
            </div>

            {/* HEADER AREA */}
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-8">
                <div className="mb-8">
                    {/* Title & Badges */}
                    <div className="flex items-center gap-3 mb-4">
                        {isPremium && (
                            <span className="bg-amber-400 text-gray-900 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">Premium</span>
                        )}
                        {typeof event.category !== 'number' && event.category && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 border border-rose-100">
                                {event.category.title}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 md:items-center">
                        {imageUrl && (
                            <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white p-2">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                    <Image src={imageUrl} alt={event.title} fill className="object-contain" sizes="(max-width: 768px) 96px, 128px" />
                                </div>
                            </div>
                        )}
                        <div className="flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">{event.title}</h1>
                                <div className="flex flex-wrap items-center gap-6 text-gray-600 font-bold">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="text-rose-500" size={20} />
                                        <span>{formattedDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="text-rose-500" size={20} />
                                        <span>{formattedTime}</span>
                                    </div>
                                    {place && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="text-rose-500" size={20} />
                                            <span>{place.name} {cityName ? `(${cityName})` : ''}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <HeartButton id={event.id} type="event" className="bg-white border-2 border-rose-50 text-rose-500 shadow-sm hover:bg-rose-50 p-4 rounded-full transition-all scale-110" />
                                <ShareButton title={event.title} className="bg-white border-2 border-gray-50 p-4 rounded-full text-gray-600 hover:bg-gray-50 transition-all shadow-sm scale-110" />
                            </div>
                        </div>
                    </div>
                </div>

                {isPremium && galleryItems.length > 0 && (
                    <div className="mt-8">
                        <PremiumGalleryGrid images={galleryItems as GalleryImage[]} />
                    </div>
                )}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mt-8">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-8">
                    {/* Description Section */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">O wydarzeniu</h2>
                        {event.description && (
                            <RichText content={event.description as LexicalRichText} className="text-gray-600 leading-relaxed text-lg" />
                        )}
                    </div>

                    {/* Location Map */}
                    {place && (
                        <div className="bg-white rounded-3xl p-0 overflow-hidden shadow-sm h-80 relative border border-gray-100 z-10">
                            <Map key={`${lat}-${lon}`} lat={lat} lon={lon} name={event.title} />
                            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.title} ${fullAddress}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2 hover:bg-white transition-colors text-gray-900 cursor-pointer"
                                >
                                    <MapPin size={16} className="text-rose-500" />
                                    {fullAddress}
                                </a>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.title} ${fullAddress}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-rose-500 text-white px-4 py-2 rounded-xl shadow-sm text-sm font-bold hover:bg-rose-600 transition-colors cursor-pointer"
                                >
                                    Zobacz na mapie
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Amenities / Features */}
                    {event.features && event.features.length > 0 && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <AmenitiesGrid features={event.features} />
                        </div>
                    )}

                    {/* Pricing Section */}
                    {(event.isFree || tickets.length > 0) && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6">Ceny i bilety</h2>
                            {event.isFree ? (
                                <div className="flex items-center gap-4 p-6 bg-green-50 rounded-[2.5rem] border border-green-100 italic">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm shrink-0">
                                        <BadgeCheck size={28} />
                                    </div>
                                    <div>
                                        <p className="font-black text-green-900 text-xl">Wstęp bezpłatny</p>
                                        <p className="text-green-700 font-medium text-sm">To wydarzenie oferuje bezpłatny wstęp dla wszystkich uczestników.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tickets.map((ticket) => (
                                        <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:border-rose-200 hover:bg-white transition-all group relative overflow-hidden">
                                            {/* Decorative element */}
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity -mr-8 -mt-8" />
                                            
                                            <div className="flex items-start gap-4 z-10">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm shrink-0 border border-rose-50 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                                    <Ticket size={22} />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-gray-900 text-lg mb-1">{ticket.name}</h3>
                                                    {ticket.description && (
                                                        <p className="text-sm text-gray-500 leading-relaxed max-w-md">{ticket.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-end shrink-0 z-10 pt-2 sm:pt-0">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-3xl font-black text-gray-900">{ticket.price}</span>
                                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">PLN</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">Cena za osobę</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column (Sidebar) */}
                <div className="md:col-span-1 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        <ContactSidebar
                            phoneNumber={place?.phoneNumber || organizer?.phone}
                            email={place?.email || organizer?.email}
                            website={place?.socialLinks?.find(l => l.platform === 'Website')?.url || organizer?.website}
                            socialLinks={place?.socialLinks}
                            scrollToId="rejestracja-form"
                        />
                        
                        <div id="rejestracja-form" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-black mb-6 text-gray-900">Zapisz się na wydarzenie</h2>
                            <RegistrationForm sourceType="events" sourceId={event.id} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
