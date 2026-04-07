'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
            <AlertTriangle size={48} className="text-rose-400" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-gray-900">Coś poszło nie tak</h1>
            <p className="text-gray-500 max-w-md">
                Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę lub wróć do strony głównej.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={reset}
                    className="px-6 py-2 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors"
                >
                    Spróbuj ponownie
                </button>
                <Link
                    href="/"
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                    Strona główna
                </Link>
            </div>
        </div>
    );
}
