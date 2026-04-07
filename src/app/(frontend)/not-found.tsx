import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
            <Search size={48} className="text-gray-300" strokeWidth={1.5} />
            <h1 className="text-4xl font-black text-gray-900">404</h1>
            <h2 className="text-xl font-bold text-gray-700">Strona nie istnieje</h2>
            <p className="text-gray-500 max-w-md">
                Szukana strona nie istnieje lub została przeniesiona.
            </p>
            <Link
                href="/"
                className="px-6 py-2 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 transition-colors"
            >
                Wróć na stronę główną
            </Link>
        </div>
    );
}
