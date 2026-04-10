'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Globe } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCity } from '../providers/CityProvider';
import { setCityCookie } from '../actions';
import { City } from '@/payload-types';

interface CitySelectionModalProps {
    cities: City[];
}

export const CitySelectionModal: React.FC<CitySelectionModalProps> = ({ cities }) => {
    const { isModalOpen, closeModal, changeCity } = useCity();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSelectCity = async (slug: string) => {
        // Optimistically update context
        changeCity(slug);
        
        // Wait for cookie operation and transition
        startTransition(async () => {
            await setCityCookie(slug);
            closeModal();
            router.refresh();
        });
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={closeModal}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black text-center flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-2">
                            <MapPin size={24} />
                        </div>
                        Gdzie szukasz atrakcji?
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-500 text-base">
                        Wybierz miasto, aby zobaczyć tylko w jego okolicy najlepsze miejsca dla dzieci. Możesz to zmienić w każdej chwili.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => handleSelectCity('all')}
                        className="col-span-2 h-14 justify-start px-4 text-start rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                        disabled={isPending}
                    >
                        <Globe size={18} className="mr-3 text-gray-400" />
                        <span className="font-bold text-gray-700">Cała Polska</span>
                    </Button>
                    
                    {cities.map((city) => (
                        <Button
                            key={city.id}
                            variant="outline"
                            onClick={() => handleSelectCity(city.slug || city.name)}
                            className="h-14 justify-start px-4 text-start rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                            disabled={isPending}
                        >
                            <MapPin size={16} className="mr-2 text-rose-500/70" />
                            <span className="font-semibold text-gray-800">{city.name}</span>
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
