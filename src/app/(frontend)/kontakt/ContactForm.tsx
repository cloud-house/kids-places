'use client';

import React, { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { sendContactMessageAction } from './actions';
import { toast } from 'sonner';

export const ContactForm = () => {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const result = await sendContactMessageAction(formData);

        setLoading(false);

        if (result.success) {
            setSubmitted(true);
            toast.success(result.message);
        } else {
            toast.error(result.error);
        }
    }

    if (submitted) {
        return (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Wiadomość wysłana!</h2>
                <p className="text-gray-500 mb-8">Dziękujemy za kontakt. Odpowiemy na Twoje zapytanie tak szybko, jak to możliwe.</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="text-rose-500 font-bold hover:underline"
                >
                    Wyślij kolejną wiadomość
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-8">Wyślij do nas wiadomość</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-bold text-gray-700 ml-1">Imię i nazwisko</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Jan Kowalski"
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1">Adres e-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="jan@przyklad.pl"
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-bold text-gray-700 ml-1">Temat (opcjonalnie)</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="W czym możemy pomóc?"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-gray-700 ml-1">Treść wiadomości</label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Napisz tutaj swoją wiadomość..."
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-12 py-4 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Wysyłanie...
                        </>
                    ) : (
                        <>
                            Wyślij wiadomość
                            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
