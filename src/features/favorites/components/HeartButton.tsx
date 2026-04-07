'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/features/favorites/providers/FavoritesProvider';
import { cn } from '@/lib/utils';

interface HeartButtonProps {
    id: string | number;
    type: 'place' | 'event';
    className?: string;
    iconSize?: number;
}

export const HeartButton: React.FC<HeartButtonProps> = ({ id, type, className, iconSize = 20 }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const active = isFavorite(id);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(id, type);
    };

    return (
        <button
            onClick={handleToggle}
            className={cn(
                "inline-flex items-center justify-center rounded-full transition-all duration-300 transform active:scale-90 aspect-square flex-shrink-0 p-2",
                active
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                    : "bg-white/20 backdrop-blur-md text-white hover:bg-white/40",
                className
            )}
            aria-label={active ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
        >
            <Heart
                size={iconSize}
                className={cn(active && "fill-current")}
            />
        </button>
    );
};
