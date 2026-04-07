'use client';

import React from 'react';
import { PlaceCard } from './PlaceCard';
import { Place } from '@/payload-types';

interface PlacesGridProps {
    places: Place[];
    onHover?: (id: string | number | null) => void;
}

export const PlacesGrid: React.FC<PlacesGridProps> = ({ places, onHover }) => {
    if (places.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-lg italic">Nie znaleziono żadnych miejsc spełniających kryteria.</p>
                <button
                    onClick={() => window.location.href = '/miejsca'}
                    className="mt-4 text-rose-500 font-bold hover:underline"
                >
                    Wyczyść wszystkie filtry
                </button>
            </div>
        );
    }

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {places.map((place, idx) => (
                <div
                    key={place.id}
                    onMouseEnter={() => onHover?.(place.id)}
                    className="h-full"
                >
                    <PlaceCard place={place} idx={idx} />
                </div>
            ))}
        </div>
    );
};
