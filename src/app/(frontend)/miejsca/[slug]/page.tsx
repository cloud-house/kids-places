export const revalidate = 3600; // 1 hour

import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPlaceBySlug } from '@/features/places/service';
import { MapPin, Star, Ticket, BadgeCheck } from 'lucide-react';
import Image from 'next/image';
import { headers } from 'next/headers';

import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { HeartButton } from '@/features/favorites/components/HeartButton';
import { ShareButton } from '@/components/ui/ShareButton';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin as MapPinIcon } from 'lucide-react';

import { Media, Ticket as TicketType, User } from '@/payload-types';
import { BRAND_CONFIG } from '@/lib/config';
import { StructuredData } from '@/components/seo/StructuredData';
import { AmenitiesGrid } from '@/components/common/AmenitiesGrid';
import Map from '@/components/common/MapWrapper';
import { PremiumGalleryGrid } from '@/components/common/PremiumGalleryGrid';
import { ContactSidebar } from '@/components/common/ContactSidebar';
import { ClaimPlaceButton } from '@/features/places/components/ClaimPlaceButton';
import { PlaceEventsSection } from '@/features/events/components/PlaceEventsSection';
import { ReviewsSection } from '@/features/reviews/components/ReviewsSection';
import { getPremiumStatus } from '@/features/account/utils';
import { getPayloadClient } from '@/lib/payload-client';
import { RichText } from '@/components/RichText';
import { RegistrationForm } from '@/features/inquiries/components/RegistrationForm';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const place = await getPlaceBySlug(slug);

    if (!place) return {};

    const imageUrl =
        typeof place.logo === 'object' && (place.logo as Media)?.url
            ? (place.logo as Media).url
            : `${BRAND_CONFIG.url}/og-image.png`;

    return {
        title: `${place.name} | ${BRAND_CONFIG.name}`,
        description: place.shortDescription || `Odkryj ${place.name} - atrakcja dla dzieci w ${typeof place.city === 'object' ? place.city.name : ''}.`,
        alternates: {
            canonical: `${BRAND_CONFIG.url}/miejsca/${slug}`,
        },
        openGraph: {
            title: `${place.name} | ${BRAND_CONFIG.name}`,
            description: place.shortDescription || '',
            url: `${BRAND_CONFIG.url}/miejsca/${slug}`,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: place.name,
                },
            ],
        },
    };
}

export default async function PlacePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const place = await getPlaceBySlug(slug);

    if (!place) {
        notFound();
    }

    const payload = await getPayloadClient();
    const { user: currentUser } = await payload.auth({ headers: await headers() });

    const imageUrl =
        typeof place.logo === 'object' && (place.logo as Media)?.url
            ? (place.logo as Media).url
            : null;

    const cityName = typeof place.city === 'object' ? place.city.name : '';
    const fullAddress = place.street
        ? `${place.street}, ${place.postalCode} ${cityName}`
        : cityName;

    const lat = place.latitude || 52.2297;
    const lon = place.longitude || 21.0122;

    const organizer = typeof place.organizer === 'object' ? place.organizer : null;
    const { isPremium: isOrgPremium } = getPremiumStatus(organizer);
    const isPremium = place.plan === 'premium' || isOrgPremium;

    const isOwner = currentUser?.id === (typeof place.owner === 'object' ? place.owner?.id : place.owner);

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: place.name,
        description: place.shortDescription || '',
        image: imageUrl,
        address: {
            '@type': 'PostalAddress',
            streetAddress: place.street,
            addressLocality: cityName,
            postalCode: place.postalCode,
            addressCountry: 'PL',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: lat,
            longitude: lon,
        },
        url: `${BRAND_CONFIG.url}/miejsca/${slug}`,
        telephone: place.phoneNumber,
    };

    const galleryItems = place.gallery || [];
    const websiteUrl = place.socialLinks?.find(l => l.platform === 'Website')?.url ?? null;
    const tickets = (place.tickets || []).filter((t): t is TicketType => typeof t === 'object' && t !== null);

    const showInquiryForm = !!place.owner || isPremium;

    return (
        <main className="bg-gray-50 pb-24 min-h-screen relative">
            <StructuredData data={structuredData} />

            {/* Breadcrumbs */}
            <div className="absolute top-8 left-0 w-full z-30 pointer-events-none">
                <div className="max-w-7xl mx-auto px-6 pointer-events-auto">
                    <Breadcrumbs
                        items={[
                            { label: 'Miejsca', href: '/miejsca' },
                            { label: place.name },
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
                        {typeof place.category !== 'number' && place.category && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 border border-rose-100">
                                {place.category.title}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 md:items-center">
                        {imageUrl && (
                            <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white p-2">
                                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                    <Image src={imageUrl} alt={place.name} fill className="object-contain" sizes="(max-width: 768px) 96px, 128px" />
                                </div>
                            </div>
                        )}
                        <div className="flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">{place.name}</h1>
                                <div className="flex flex-wrap items-center gap-6 text-gray-600 font-medium font-bold">
                                    <div className="flex items-center gap-1">
                                        <Star className={place.rating && place.rating > 0 ? "text-amber-400 fill-amber-400" : "text-gray-300"} size={20} />
                                        {place.rating && place.rating > 0 ? (
                                            <>
                                                <span className="text-gray-900 font-bold">{place.rating.toFixed(1)}</span>
                                                <span className="text-sm">({place.reviewCount || 0} {place.reviewCount === 1 ? 'opinia' : (place.reviewCount && place.reviewCount < 5 ? 'opinie' : 'opinii')})</span>
                                            </>
                                        ) : (
                                            <span className="text-sm text-gray-400">Brak ocen</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="text-rose-500" size={20} />
                                        <span>{fullAddress}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <HeartButton id={place.id} type="place" className="bg-white border-2 border-rose-50 text-rose-500 shadow-sm hover:bg-rose-50 p-4 rounded-full transition-all scale-110" />
                                <ShareButton title={place.name} className="bg-white border-2 border-gray-50 p-4 rounded-full text-gray-600 hover:bg-gray-50 transition-all shadow-sm scale-110" />
                            </div>
                        </div>
                    </div>
                </div>

                {isPremium && galleryItems.length > 0 && (
                    <div className="mt-8">
                        <PremiumGalleryGrid images={galleryItems} />
                    </div>
                )}
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 mt-8">
                {/* Left Column */}
                <div className="md:col-span-2 space-y-8">
                    {/* Description Section */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-2xl font-bold mb-4">O miejscu</h2>
                        {place.shortDescription && (
                            <p className="text-gray-600 leading-relaxed text-lg mb-6">{place.shortDescription}</p>
                        )}
                        {isPremium && place.longDescription && (
                            <RichText content={place.longDescription} className="text-gray-600 leading-relaxed text-lg" />
                        )}
                    </div>

                    {/* Location Map */}
                    <div className="bg-white rounded-3xl p-0 overflow-hidden shadow-sm h-80 relative border border-gray-100">
                        <Map key={`${lat}-${lon}`} lat={lat} lon={lon} name={place.name} />
                        <div className="absolute bottom-4 left-4 z-[1000] flex items-center gap-2">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${fullAddress}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2 hover:bg-white transition-colors text-gray-900 cursor-pointer"
                            >
                                <MapPinIcon size={16} className="text-rose-500" />
                                {fullAddress}
                            </a>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${fullAddress}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-rose-500 text-white px-4 py-2 rounded-xl shadow-sm text-sm font-bold hover:bg-rose-600 transition-colors cursor-pointer"
                            >
                                Zobacz na mapie
                            </a>
                        </div>
                    </div>

                    {/* Amenities */}
                    {place.features && place.features.length > 0 && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <AmenitiesGrid features={place.features} />
                        </div>
                    )}

                    {/* Pricing Section */}
                    {(place.isFree || tickets.length > 0) && (
                        <div className="bg-white rounded-3xl p-8 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6">Ceny i bilety</h2>

                            {place.isFree ? (
                                <div className="flex items-center gap-4 p-6 bg-green-50 rounded-[2.5rem] border border-green-100 italic">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm shrink-0">
                                        <BadgeCheck size={28} />
                                    </div>
                                    <div>
                                        <p className="font-black text-green-900 text-xl">Wstęp bezpłatny</p>
                                        <p className="text-green-700 font-medium text-sm">To miejsce oferuje bezpłatny wstęp dla wszystkich odwiedzających.</p>
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
                                                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">Cena za bilet</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Events Section */}
                    <PlaceEventsSection placeId={place.id} />

                    {/* Reviews */}
                    <div id="opinie-sekcja">
                        <Suspense fallback={<Skeleton className="h-40 w-full rounded-3xl" />}>
                            <ReviewsSection
                                placeId={place.id as number}
                                currentUser={currentUser as User}
                                isOwner={isOwner}
                            />
                        </Suspense>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="md:col-span-1 space-y-6">
                    <div className="sticky top-24 space-y-6">
                        <ContactSidebar
                            phoneNumber={place.phoneNumber}
                            email={place.email}
                            website={websiteUrl}
                            openingHours={place.openingHours}
                            socialLinks={place.socialLinks}
                            scrollToId={showInquiryForm ? "rejestracja-form" : undefined}
                            ctaUrl={place.affiliateBookingLink}
                            ctaText={place.affiliateBookingLink ? "Zarezerwuj pobyt" : "Wyślij zapytanie"}
                        />
                        {showInquiryForm && (
                            <div id="rejestracja-form" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-black mb-6 text-gray-900">Zarezerwuj wizytę / Zadaj pytanie</h2>
                                <RegistrationForm sourceType="places" sourceId={place.id} />
                            </div>
                        )}
                        {!place.owner && (
                            <ClaimPlaceButton placeId={place.id} placeName={place.name} />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
