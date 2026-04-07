'use client';

import React, { useState } from 'react';
import { SplitScreenLayout } from '@/components/layout/SplitScreenLayout';
import { Map } from '@/components/ui/Map';
import { PlacesGrid } from '@/features/places/components/PlacesGrid';
import { Place } from '@/payload-types';

interface SplitScreenClientProps {
    places: Place[];
    title: string;
    description: string;
    sidebar: React.ReactNode;
    pagination: React.ReactNode;
    sortSelect: React.ReactNode;
}

export function SplitScreenClient({ places, title, description, sidebar, pagination, sortSelect }: SplitScreenClientProps) {
    const [activeMarkerId, setActiveMarkerId] = useState<string | number | null>(null);

    const markers = places.filter(p => p.latitude && p.longitude).map(p => ({
        id: p.id,
        position: [p.latitude!, p.longitude!] as [number, number],
        title: p.name,
        isActive: p.id === activeMarkerId
    }));

    // Find the center of the markers or default to Warsaw
    const center: [number, number] = markers.length > 0
        ? [markers[0].position[0], markers[0].position[1]]
        : [52.237, 21.017];

    return (
        <SplitScreenLayout
            map={<Map center={center} markers={markers} zoom={markers.length > 0 ? 12 : 6} />}
        >
            <div className="mb-8">
                <h1 className="text-3xl font-black mb-2">{title}</h1>
                <p className="text-gray-600">{description}</p>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-8">
                <aside>
                    {sidebar}
                </aside>
                <div className="min-h-[400px] flex flex-col gap-8">
                    <div className="flex justify-end">
                        {sortSelect}
                    </div>

                    {/* Grid wrapper to capture hovers */}
                    <div
                        onMouseLeave={() => setActiveMarkerId(null)}
                    >
                        <PlacesGrid
                            places={places}
                            onHover={(id) => setActiveMarkerId(id)}
                        />
                    </div>

                    <div className="mt-auto">
                        {pagination}
                    </div>
                </div>
            </div>
        </SplitScreenLayout>
    );
}
