'use client';

import React from 'react';

import { Star, MapPin } from 'lucide-react';
import { Place } from '@/payload-types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';




interface PlaceCardProps {
    place: Place;
    idx?: number;
}

import { CardLayout } from '@/components/ui/CardLayout';

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, idx }) => {
    const imageUrl = (typeof place.logo === 'object' && place.logo?.url) ? place.logo.url : null;

    // Determine premium status
    // 1. Check place.plan (set by hooks)
    // 2. Fallback to checking organizer's text plan for backward compatibility or if populated
    const organizer = typeof place.organizer === 'object' ? place.organizer : null;
    const organizerPlan = organizer && typeof organizer.plan === 'object' ? organizer.plan : null;

    const isPremium = place.plan === 'premium' || (organizerPlan &&
        (organizerPlan.planPrice_recurring > 0 || organizerPlan.planPrice_onetime > 0));

    const badge = isPremium ? (
        <div className="bg-amber-400 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
            Premium
        </div>
    ) : null;

    return (
        <Link href={`/miejsca/${place.slug}`}>
            <CardLayout
                idx={idx}
                imageUrl={imageUrl}
                imageAlt={place.name}
                fallbackIcon={<Star size={48} strokeWidth={1} className="opacity-20" />}
                badge={badge}
                heartId={place.id}
                heartType="place"
                priority={idx !== undefined && idx < 4}
            >
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                    <Star size={16} fill={place.rating ? "currentColor" : "none"} />
                    <span className="font-bold text-sm">
                        {place.rating && place.rating > 0 ? place.rating : 'Brak ocen'}
                    </span>
                    <span className="text-gray-400 text-sm ml-1">
                        ({place.reviewCount || 0} {place.reviewCount === 1 ? 'opinia' : (place.reviewCount && place.reviewCount > 1 && place.reviewCount < 5 ? 'opinie' : 'opinii')})
                    </span>
                </div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {typeof place.city === 'object' && place.city && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 bg-sky-50 border border-sky-100 px-2 py-1 rounded-md">
                            [{place.city.name}]
                        </span>
                    )}
                    {typeof place.category === 'object' && place.category && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-2 py-1 rounded-md">
                            {place.category.title}
                        </span>
                    )}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-rose-500 transition-colors uppercase tracking-tight">{place.name}</h3>
                <div className="flex flex-col gap-2 text-gray-400 text-sm mt-auto">
                    <div className="flex items-start gap-1">
                        <MapPin className='min-w-[14px] mt-[2px]' size={14} />
                        <span className="line-clamp-1">
                            {place.street ?
                                `${place.street}, ${typeof place.city === 'object' ? place.city.name : place.city}` :
                                (typeof place.city === 'object' ? place.city.name : place.city)
                            }
                        </span>
                    </div>
                </div>
                {place.affiliateBookingLink && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <Button
                            asChild
                            variant="default"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-10 transition-all shadow-sm hover:shadow-md"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <a
                                href={place.affiliateBookingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                            >
                                <span className="text-sm">Zarezerwuj pobyt</span>
                            </a>
                        </Button>
                    </div>
                )}
            </CardLayout>
        </Link>
    );
};
