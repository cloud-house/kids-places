import { Button } from '@/components/ui/button';
import { ShieldCheck, XCircle } from 'lucide-react';
import Link from 'next/link';

export default async function ClaimStatusPage({ searchParams }: { searchParams: Promise<{ success?: string; message?: string }> }) {
    const { success, message } = await searchParams;
    const isSuccess = success === 'true';
    const displayMessage = message ? decodeURIComponent(message) : (isSuccess ? 'Pomyślnie zweryfikowano zgłoszenie.' : 'Wystąpił błąd weryfikacji.');

    return (
        <div className="flex-grow flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className={`w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border ${isSuccess ? 'border-green-100' : 'border-rose-100'} text-center`}>
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-rose-100 text-rose-600'}`}>
                    {isSuccess ? <ShieldCheck size={32} /> : <XCircle size={32} />}
                </div>

                <h1 className="text-2xl font-bold mb-2">{isSuccess ? 'Weryfikacja udana!' : 'Błąd weryfikacji'}</h1>
                <p className="text-gray-600 mb-8">{displayMessage}</p>

                {isSuccess ? (
                    <div className="space-y-4">
                        <Link href="/moje-konto">
                            <Button className="w-full">Przejdź do Mojego Konta</Button>
                        </Link>
                    </div>
                ) : (
                    <Link href="/">
                        <Button variant="outline" className="w-full">Wróć na stronę główną</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
