import { getPayloadClient } from '@/lib/payload-client';
import { getClaimRequestAction } from '@/actions/claim';
import { VerifyClaimForm } from '@/features/places/components/VerifyClaimForm';
import { ShieldCheck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { headers } from 'next/headers';

interface PageProps {
    params: Promise<{
        token: string;
    }>;
}

export default async function VerifyClaimPage({ params }: PageProps) {
    const { token } = await params;
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await headers() });

    const result = await getClaimRequestAction(token);

    if (!result.success) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-50 px-4 py-12">
                <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-rose-100 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
                        <XCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Błąd weryfikacji</h1>
                    <p className="text-gray-600 mb-8">{result.error || 'Link jest nieprawidłowy lub wygasł.'}</p>
                    <Link href="/">
                        <Button variant="outline" className="w-full rounded-xl">Wróć na stronę główną</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const data = result.data;

    if (!data) {
        return (
            <div className="flex-grow flex items-center justify-center bg-gray-50 px-4 py-12">
                <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-rose-100 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-6">
                        <XCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Błąd weryfikacji</h1>
                    <p className="text-gray-600 mb-8">Nie udało się pobrać danych zgłoszenia.</p>
                    <Link href="/">
                        <Button variant="outline" className="w-full rounded-xl">Wróć na stronę główną</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const { placeName, email } = data;

    return (
        <div className="flex-grow flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-indigo-100 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                    <ShieldCheck size={32} />
                </div>

                <h1 className="text-2xl font-bold mb-2">Weryfikacja przejęcia</h1>
                <p className="text-gray-600 mb-8">
                    Jesteś o krok od przejęcia zarządzania tym miejscem.
                </p>

                <VerifyClaimForm
                    token={token}
                    placeName={placeName}
                    email={email}
                    isLoggedIn={!!user}
                />
            </div>
        </div>
    );
}
