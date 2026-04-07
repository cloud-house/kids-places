'use client';

import React from 'react';

import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Event } from '@/payload-types';
import Link from 'next/link';

interface EventCardProps {
    event: Event;
    idx?: number;
}

import { CardLayout } from '@/components/ui/CardLayout';

export const EventCard: React.FC<EventCardProps> = React.memo(({ event, idx = 0 }) => {
    const imageUrl = (typeof event.logo === 'object' && event.logo?.url) ? event.logo.url : null;
    const placeObj = (typeof event.place === 'object' && event.place) ? event.place : null;
    const placeName = placeObj ? placeObj.name : null;
    const cityName = placeObj && typeof placeObj.city === 'object' ? placeObj.city?.name : null;

    const startDate = new Date(event.startDate);
    const day = startDate.getDate();
    const month = startDate.toLocaleString('pl-PL', { month: 'short' }).toUpperCase();
    const time = startDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    const isPremium = event.plan === 'premium';

    const premiumBadge = isPremium ? (
        <div className="bg-amber-400 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg h-fit">
            Premium
        </div>
    ) : null;

    const dateBadge = (
        <div className="flex gap-2 items-start">
            <div className="bg-white/95 backdrop-blur-sm min-w-[56px] h-auto py-2 rounded-2xl flex flex-col items-center justify-center shadow-lg px-2 border border-white">
                <span className="text-[10px] font-black text-rose-500 leading-none mb-1">{month}</span>
                <span className="text-xl font-black text-gray-900 leading-none mb-1">{day}</span>
                <span className="text-[10px] font-bold text-gray-400 leading-none">{time}</span>
            </div>
            {premiumBadge}
        </div>
    );

    return (
        <Link href={`/wydarzenia/${event.slug}`} aria-label={`Szczegóły wydarzenia: ${event.title}`}>
            <CardLayout
                idx={idx}
                imageUrl={imageUrl}
                imageAlt={event.title}
                fallbackIcon={<Calendar size={48} strokeWidth={1} className="opacity-20" />}
                badge={dateBadge}
                heartId={event.id}
                heartType="event"
                priority={idx < 4}
            >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {cityName && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 bg-sky-50 border border-sky-100 px-2 py-1 rounded-md">
                            [{cityName}]
                        </span>
                    )}
                    {typeof event.category === 'object' && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-1 rounded-md">
                            {event.category.title}
                        </span>
                    )}
                    {event.ageRange && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                            {event.ageRange}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold mb-4 group-hover:text-rose-500 transition-colors uppercase tracking-tight">{event.title}</h3>

                <div className="space-y-3 text-sm text-gray-500 mt-auto">
                    {placeName && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                                <MapPin size={14} />
                            </div>
                            <span className="line-clamp-1 font-medium text-gray-700">{placeName}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                            <Ticket size={14} />
                        </div>
                        <span className="font-black text-gray-900">
                            {event.isFree ? 'Bezpłatne' : (
                                event.tickets && event.tickets.length > 0 ? (
                                    (() => {
                                        const prices = event.tickets.map(t => typeof t === 'object' ? t.price : null).filter((p): p is number => p !== null && p !== undefined);
                                        if (prices.length === 0) return 'Płatne';
                                        const minPrice = Math.min(...prices);
                                        const maxPrice = Math.max(...prices);
                                        if (minPrice === maxPrice) return `${minPrice} PLN`;
                                        return `od ${minPrice} PLN`;
                                    })()
                                ) : 'Płatne'
                            )}
                        </span>
                    </div>
                </div>
            </CardLayout>
        </Link>
    );
});
EventCard.displayName = 'EventCard';
