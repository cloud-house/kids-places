'use client';

import React, { createContext, useContext, useState } from 'react';

interface CityContextType {
    selectedCity: string | null;
    isModalOpen: boolean;
    changeCity: (slug: string) => void;
    openModal: () => void;
    closeModal: () => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const useCity = () => {
    const context = useContext(CityContext);
    if (!context) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
};

interface CityProviderProps {
    children: React.ReactNode;
    initialCity: string | null;
}

export const CityProvider: React.FC<CityProviderProps> = ({ children, initialCity }) => {
    const [selectedCity, setSelectedCity] = useState<string | null>(initialCity);
    // Open modal automatically if there's no initial city selected
    const [isModalOpen, setIsModalOpen] = useState(initialCity === null);

    const changeCity = (slug: string) => {
        setSelectedCity(slug === 'all' ? null : slug);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <CityContext.Provider value={{ selectedCity, isModalOpen, changeCity, openModal, closeModal }}>
            {children}
        </CityContext.Provider>
    );
};
