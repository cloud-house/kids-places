'use client';

import React from 'react';
import { PlaceCard } from './PlaceCard';
import { Place } from '@/payload-types';

interface FeaturedPlacesProps {
    places?: Place[]
}

export const FeaturedPlaces: React.FC<FeaturedPlacesProps> = ({ places = [] }) => (
    <section id="miejsca" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <span className="text-rose-500 font-bold uppercase tracking-widest text-sm mb-4 block">Wybrane dla Ciebie</span>
                <h2 className="text-4xl font-bold mb-6">Najlepiej oceniane miejsca</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Te lokalizacje skradły serca dzieci i rodziców. Sprawdź, co sprawia, że są tak wyjątkowe.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {places.map((place, idx) => (
                    <PlaceCard key={place.id} place={place} idx={idx} />
                ))}
            </div>
        </div>
    </section>
);
