'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
    lat: number;
    lon: number;
    name?: string;
}

export default function Map({ lat, lon }: MapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Force cleanup of any existing instance before creating a new one
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        // Initialize Leaflet Map
        const map = L.map(mapContainerRef.current, {
            scrollWheelZoom: false,
        }).setView([lat, lon], 15);

        mapInstanceRef.current = map;

        // Use CartoDB Light for a more premium, clean look
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Define Custom Icon
        const customIcon = L.divIcon({
            html: `
                <div class="relative flex items-center justify-center">
                    <div class="absolute w-12 h-12 bg-rose-500 rounded-full opacity-20 animate-ping"></div>
                    <div class="relative bg-rose-500 text-white p-3 rounded-2xl shadow-xl border-2 border-white transform -translate-y-1 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                        </svg>
                        <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-rose-500 rotate-45 border-b border-r border-white"></div>
                    </div>
                </div>
            `,
            className: 'custom-div-icon',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
        });

        // Add Marker
        L.marker([lat, lon], { icon: customIcon }).addTo(map);

        // Cleanup on unmount or update
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lon]);

    return (
        <div className="w-full h-full relative isolate z-10">
            <style dangerouslySetInnerHTML={{
                __html: `
                .leaflet-tile-pane {
                    filter: brightness(1.05) saturate(1.1);
                }
                .leaflet-container {
                    background: #f1f5f9;
                }
                .custom-div-icon {
                    background: none !important;
                    border: none !important;
                }
            `}} />
            <div
                ref={mapContainerRef}
                className="w-full h-full"
            />
        </div>
    );
}
