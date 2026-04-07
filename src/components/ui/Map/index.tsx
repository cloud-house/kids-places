'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const MapLoader = dynamic(() => import('./MapLoader'), {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />,
});

interface MapProps {
    center?: [number, number];
    zoom?: number;
    markers?: Array<{
        id: string | number;
        position: [number, number];
        title: string;
        isActive?: boolean;
    }>;
}

export const Map = ({ center = [52.237, 21.017], zoom = 6, markers = [] }: MapProps) => {
    return (
        <div className="h-full w-full relative z-0">
            <MapLoader center={center} zoom={zoom} markers={markers} />
        </div>
    );
};
