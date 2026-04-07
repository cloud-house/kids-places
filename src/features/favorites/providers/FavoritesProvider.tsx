'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type FavoriteType = 'place' | 'event';

interface FavoriteItem {
    id: string | number;
    type: FavoriteType;
}

interface FavoritesContextType {
    favorites: FavoriteItem[];
    toggleFavorite: (id: string | number, type: FavoriteType) => void;
    isFavorite: (id: string | number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('kids-places-favorites');
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse favorites from localStorage', e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever favorites change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('kids-places-favorites', JSON.stringify(favorites));
        }
    }, [favorites, isInitialized]);

    const toggleFavorite = (id: string | number, type: FavoriteType) => {
        setFavorites((prev) => {
            const exists = prev.find((item) => item.id === id);
            if (exists) {
                return prev.filter((item) => item.id !== id);
            } else {
                return [...prev, { id, type }];
            }
        });
    };

    const isFavorite = (id: string | number) => {
        return !!favorites.find((item) => item.id === id);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
