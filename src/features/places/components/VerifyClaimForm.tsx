'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { verifyClaimAction } from '@/actions/claim';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface VerifyClaimFormProps {
    token: string;
    placeName: string;
    email: string;
    isLoggedIn: boolean;
}

export const VerifyClaimForm = ({ token, placeName, email, isLoggedIn }: VerifyClaimFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleConfirm = async () => {
        if (!isLoggedIn) {
            const nextUrl = encodeURIComponent(window.location.pathname);
            router.push(`/logowanie?next=${nextUrl}`);
            return;
        }

        setIsLoading(true);
        try {
            const result = await verifyClaimAction(token);

            if (result.success) {
                toast.success('Sukces!', {
                    description: result.message || 'Miejsce zostało pomyślnie przypisane do Twojego konta.'
                });
                router.push('/claim/status?success=true');
            } else {
                toast.error('Błąd weryfikacji', {
                    description: result.error || 'Nie udało się zweryfikować zgłoszenia.'
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

    return (
        <div className="space-y-6">
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-8">
                <p className="text-gray-700 leading-relaxed">
                    Potwierdzając, przejmiesz zarządzanie wizytówką: <br />
                    <strong className="text-indigo-900 text-lg">{placeName}</strong>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Będziesz mógł edytować dane, dodawać zdjęcia oraz odpowiadać na opinie klientów.
                </p>
            </div>

            {!isLoggedIn ? (
                <div className="space-y-4">
                    <p className="text-sm text-rose-600 font-medium">
                        Zaloguj się lub załóż konto, aby dokończyć ten proces.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const nextUrl = encodeURIComponent(window.location.pathname);
                                router.push(`/logowanie?next=${nextUrl}&email=${encodeURIComponent(email)}`);
                            }}
                            className="rounded-xl border-gray-200"
                        >
                            Zaloguj się
                        </Button>
                        <Button
                            onClick={() => {
                                const nextUrl = encodeURIComponent(window.location.pathname);
                                router.push(`/rejestracja?next=${nextUrl}&role=organizer&email=${encodeURIComponent(email)}&lockEmail=true`);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                        >
                            Załóż konto
                        </Button>
                    </div>
                </div>
            ) : (
                <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl text-lg font-bold shadow-lg shadow-indigo-100"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Przetwarzanie...
                        </>
                    ) : (
                        'Potwierdzam przejęcie miejsca'
                    )}
                </Button>
            )}
        </div>
    );
};
