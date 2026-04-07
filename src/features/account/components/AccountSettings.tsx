'use client';

import React, { useState, useTransition } from 'react';
import { User as UserType, Organizer } from '@/payload-types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Settings, Save, CreditCard, AlertCircle, Crown } from 'lucide-react';
import { getPremiumStatus } from '@/features/account/utils';
import { updateUserAction, downgradeToFreeAction } from '@/features/account/actions';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useRouter } from 'next/navigation';

interface AccountSettingsProps {
    user: UserType;
    organizer?: Organizer;
    reviewsMode: 'parent' | 'organizer';
    planLimits: {
        maxPlaces: number;
        maxEvents: number;
    };
    counts: {
        places: number;
        events: number;
    };
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({
    user,
    organizer,
    reviewsMode,
    planLimits,
    counts
}) => {
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
    const router = useRouter();

    const { isPremium, isExpiringSoon, daysLeft } = getPremiumStatus(organizer);

    const handleManageSubscription = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || 'Błąd portalu płatności.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Błąd połączenia ze Stripe.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                            <Settings size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Ustawienia Konta</h2>
                            <p className="text-sm text-gray-500">Zarządzaj swoimi danymi i subskrypcją</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {reviewsMode === 'organizer' && (
                            <>
                                {!isPremium ? (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="hidden sm:flex items-center gap-2 text-rose-500 border-rose-200 font-bold hover:bg-rose-50 rounded-xl"
                                    >
                                        <Link href="/dla-biznesu/cennik-premium">
                                            <Crown size={18} className="text-rose-500" />
                                            Aktywuj Premium
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="hidden sm:flex items-center gap-2 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
                                        >
                                            <Link href="/dla-biznesu/cennik-premium">
                                                <Settings size={18} />
                                                Zmień plan
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setShowDowngradeConfirm(true)}
                                            disabled={isLoading}
                                            className="hidden sm:flex items-center gap-2 text-gray-400 font-bold hover:bg-gray-50 rounded-xl text-xs"
                                        >
                                            Przejdź na Free
                                        </Button>
                                    </>
                                )}
                                {organizer?.stripeCustomerId && (
                                    <Button
                                        variant="outline"
                                        onClick={handleManageSubscription}
                                        disabled={isLoading}
                                        className="hidden sm:flex items-center gap-2 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
                                    >
                                        <CreditCard size={18} />
                                        Faktury i Płatności
                                    </Button>
                                )}
                            </>
                        )}
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditingProfile(!isEditingProfile)}
                            className="text-gray-500 font-bold hover:bg-rose-50 hover:text-rose-500 rounded-xl"
                        >
                            {isEditingProfile ? 'Anuluj' : 'Edytuj profil'}
                        </Button>
                    </div>
                </div>

                {isPremium && isExpiringSoon && (
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3 text-amber-800 animate-in slide-in-from-top duration-500">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm flex-shrink-0">
                            <AlertCircle size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm">Twoja subskrypcja wygasa za {daysLeft} {daysLeft === 1 ? 'dzień' : 'dni'}.</p>
                            <p className="text-xs opacity-80">Przedłuż teraz, aby zachować dostęp Premium.</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                                variant="default"
                                onClick={async () => {
                                    setIsLoading(true);
                                    try {
                                        // Get the organizer's current plan ID
                                        const planId = typeof organizer?.plan === 'object' ? organizer?.plan?.id : organizer?.plan;
                                        if (!planId) {
                                            toast.error('Nie znaleziono planu. Przejdź do cennika.');
                                            setIsLoading(false);
                                            return;
                                        }
                                        const res = await fetch('/api/stripe/checkout', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ planId, mode: 'onetime' }),
                                        });
                                        const data = await res.json();
                                        if (data.url) {
                                            window.location.href = data.url;
                                        } else {
                                            toast.error(data.error || 'Błąd inicjowania płatności.');
                                            setIsLoading(false);
                                        }
                                    } catch (error) {
                                        console.error(error);
                                        toast.error('Błąd połączenia ze Stripe.');
                                        setIsLoading(false);
                                    }
                                }}
                                disabled={isLoading}
                                className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs px-4 h-9"
                            >
                                {isLoading ? 'Ładowanie...' : 'Przedłuż BLIK / P24'}
                            </Button>
                            {organizer?.stripeCustomerId && (
                                <Button
                                    variant="ghost"
                                    onClick={handleManageSubscription}
                                    disabled={isLoading}
                                    className="text-amber-700 font-bold hover:bg-amber-100/50 rounded-lg text-xs"
                                >
                                    Faktury
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {isEditingProfile ? (
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setIsLoading(true);
                            try {
                                const res = await updateUserAction(new FormData(e.currentTarget));
                                if (res.success) {
                                    toast.success(res.message);
                                    setIsEditingProfile(false);
                                    startTransition(() => {
                                        router.refresh();
                                    });
                                } else {
                                    toast.error(res.error);
                                }
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        className="space-y-6 max-w-xl animate-in fade-in duration-300"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold">Imię</Label>
                                <Input name="name" defaultValue={user.name || ''} required className="rounded-xl h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Nazwisko</Label>
                                <Input name="surname" defaultValue={user.surname || ''} required className="rounded-xl h-11" />
                            </div>
                        </div>

                        <Button type="submit" disabled={isLoading || isPending} className="bg-gray-900 text-white rounded-xl px-8 h-11 font-bold disabled:opacity-70">
                            {isLoading || isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Zapisywanie...
                                </div>
                            ) : (
                                <><Save size={18} className="mr-2" /> Zapisz zmiany</>
                            )}
                        </Button>
                    </form>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Imię i nazwisko</p>
                            <p className="font-bold text-gray-900">{user.name} {user.surname}</p>
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Adres E-mail</p>
                            <p className="font-bold text-gray-900">{user.email}</p>
                        </div>

                        <div>
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Rola</p>
                            <div className="flex gap-2">
                                {(user.roles || ['parent']).map(role => (
                                    <span key={role} className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
                                        {role === 'organizer' ? 'Organizator' : role === 'admin' ? 'Admin' : 'Rodzic'}
                                    </span>
                                ))}
                            </div>
                        </div>
                        {reviewsMode === 'organizer' && (
                            <div>
                                <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Limity konta</p>
                                <div className="flex gap-6 mt-1">
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Miejsca</span>
                                        <span className="font-bold text-gray-900 text-sm">
                                            {counts.places} <span className="text-gray-300">/</span> {planLimits.maxPlaces === -1 ? '∞' : planLimits.maxPlaces}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-0.5">Wydarzenia</span>
                                        <span className="font-bold text-gray-900 text-sm">
                                            {counts.events} <span className="text-gray-300">/</span> {planLimits.maxEvents === -1 ? '∞' : planLimits.maxEvents}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
            <ConfirmModal
                isOpen={showDowngradeConfirm}
                onClose={() => setShowDowngradeConfirm(false)}
                onConfirm={async () => {
                    setIsLoading(true);
                    setShowDowngradeConfirm(false);
                    const res = await downgradeToFreeAction();
                    if (res.success) {
                        toast.success(res.message);
                        window.location.reload();
                    } else {
                        toast.error(res.error || 'Błąd podczas zmiany planu.');
                        setIsLoading(false);
                    }
                }}
                title="Potwierdź zmianę planu"
                description="Czy na pewno chcesz przejść na plan Free? Stracisz dostęp do funkcji Premium."
                confirmLabel="Przejdź na Free"
                cancelLabel="Anuluj"
                variant="destructive"
                isLoading={isLoading}
            />
        </>
    );
};
