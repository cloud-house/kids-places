'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import { requestClaimAction } from '@/actions/claim';
import { toast } from 'sonner';

interface ClaimPlaceButtonProps {
    placeId: number;
    placeName: string;
}


export const ClaimPlaceButton = ({ placeId, placeName }: ClaimPlaceButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRequested, setIsRequested] = useState(false);

    const handleClaim = async () => {
        setIsLoading(true);
        try {
            const result = await requestClaimAction(placeId);

            if (result.success) {
                toast.success('Wysłano zgłoszenie', {
                    description: `Prośba o przejęcie miejsca "${placeName}" została wysłana na przypisany adres e-mail.`
                });
                setIsRequested(true);
            } else {
                toast.error('Błąd zgłoszenia', {
                    description: result.error || 'Nie udało się wysłać zgłoszenia.'
                });
            }
        } catch {
            toast.error('Błąd komunikacji', {
                description: 'Wystąpił problem z połączeniem.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isRequested) {
        return (
            <div className="bg-green-50 p-4 rounded-xl text-green-700 text-sm font-medium border border-green-100 flex items-center gap-2">
                <ShieldCheck size={18} />
                Wysłano prośbę o weryfikację. Sprawdź e-mail miejsca.
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-6 shadow-sm border border-indigo-100 mt-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>

            <h3 className="font-bold text-gray-900 mb-2 relative z-10 flex items-center gap-2">
                <ShieldCheck className="text-indigo-600" size={20} />
                To Twoja firma?
            </h3>
            <p className="text-sm text-gray-600 mb-4 relative z-10">
                Przejmij zarządzanie nad tym miejscem, aby edytować dane i odpowiadać na opinie.
            </p>

            <Button
                onClick={handleClaim}
                disabled={isLoading}
                variant="outline"
                className="w-full bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200"
            >
                {isLoading ? 'Wysyłanie...' : 'Przejmij miejsce'}
            </Button>
        </div>
    );
};
