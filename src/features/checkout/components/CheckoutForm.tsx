'use client';

import React, { useState } from 'react';
import { PricingPlan, Organizer } from '@/payload-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateOrganizerBillingAction } from '../actions';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';

interface CheckoutFormProps {
    plan: PricingPlan;
    organizer: Organizer;
    mode: 'recurring' | 'onetime';
    interval: 'month' | 'year';
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ plan, organizer, mode, interval }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [invoiceType, setInvoiceType] = useState<'person' | 'company'>('person');
    const [selectedMode, setSelectedMode] = useState<'recurring' | 'onetime'>(mode);
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>(interval);
    const [billingData, setBillingData] = useState({
        companyName: organizer.billing?.companyName || '',
        nip: organizer.billing?.nip || '',
        address: organizer.billing?.address || '',
        city: organizer.billing?.city || '',
        postalCode: organizer.billing?.postalCode || '',
    });

    const isBillingRequired = invoiceType === 'company';
    const isBillingComplete = !isBillingRequired || Object.values(billingData).every(val => val.trim().length > 0);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Update billing details (even if empty/partial, to save state)
            const updateRes = await updateOrganizerBillingAction(organizer.id, billingData);
            if (!updateRes.success) {
                toast.error(updateRes.error || 'Błąd zapisu danych.');
                setIsLoading(false);
                return;
            }

            // 2. Init Stripe Checkout
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId: plan.id,
                    mode: selectedMode,
                    interval: billingInterval,
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error(data.error || 'Błąd inicjalizacji płatności.');
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Wystąpił nieoczekiwany błąd.');
            setIsLoading(false);
        }
    };

    const price = billingInterval === 'year'
        ? selectedMode === 'recurring' ? plan.planPrice_annual_recurring : plan.planPrice_annual_onetime
        : selectedMode === 'recurring' ? plan.planPrice_recurring : plan.planPrice_onetime;

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <form onSubmit={handleCheckout} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-8">

                    {/* Payment Mode Selection */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-rose-500" />
                            Wybierz formę płatności
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${selectedMode === 'recurring' ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="recurring"
                                        checked={selectedMode === 'recurring'}
                                        onChange={() => setSelectedMode('recurring')}
                                        className="w-5 h-5 text-rose-500 accent-rose-500"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900">Subskrypcja (Karta)</p>
                                        <p className="text-xs text-gray-500">Automatyczne odnawianie</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all ${selectedMode === 'onetime' ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="mode"
                                        value="onetime"
                                        checked={selectedMode === 'onetime'}
                                        onChange={() => setSelectedMode('onetime')}
                                        className="w-5 h-5 text-rose-500 accent-rose-500"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900">Jednorazowo (BLIK, P24)</p>
                                        <p className="text-xs text-gray-500">Wygasa po okresie ważności</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Billing Details */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShieldCheck size={20} className="text-rose-500" />
                                Dane do faktury
                            </h2>

                            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={invoiceType === 'company'}
                                    onChange={(e) => setInvoiceType(e.target.checked ? 'company' : 'person')}
                                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500"
                                />
                                Chcę otrzymać fakturę VAT
                            </label>
                        </div>

                        {invoiceType === 'company' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Nazwa firmy</Label>
                                    <Input
                                        id="companyName"
                                        value={billingData.companyName}
                                        onChange={e => setBillingData({ ...billingData, companyName: e.target.value })}
                                        required
                                        placeholder="Twoja Firma Sp. z o.o."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nip">NIP</Label>
                                    <Input
                                        id="nip"
                                        value={billingData.nip}
                                        onChange={e => setBillingData({ ...billingData, nip: e.target.value })}
                                        required
                                        placeholder="1234567890"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Ulica i numer</Label>
                                    <Input
                                        id="address"
                                        value={billingData.address}
                                        onChange={e => setBillingData({ ...billingData, address: e.target.value })}
                                        required
                                        placeholder="ul. Przykładowa 1/2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Kod pocztowy</Label>
                                    <Input
                                        id="postalCode"
                                        value={billingData.postalCode}
                                        onChange={e => setBillingData({ ...billingData, postalCode: e.target.value })}
                                        required
                                        placeholder="00-000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">Miasto</Label>
                                    <Input
                                        id="city"
                                        value={billingData.city}
                                        onChange={e => setBillingData({ ...billingData, city: e.target.value })}
                                        required
                                        placeholder="Warszawa"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 text-gray-600 p-4 rounded-xl text-sm">
                                Faktura zostanie wystawiona na dane Twojego konta organizatora (Imię i Nazwisko).
                            </div>
                        )}
                    </div>
                </form>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm sticky top-8">
                    <h3 className="font-bold text-gray-900 mb-6">Podsumowanie</h3>

                    {/* Interval Toggle */}
                    <div className="bg-gray-50 p-1.5 rounded-xl flex items-center mb-10 relative mt-4">
                        <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-[10px] px-2.5 py-1 rounded-full font-black shadow-lg shadow-emerald-100 z-20">
                            2 MIESIĄCE GRATIS
                        </div>
                        <button
                            type="button"
                            onClick={() => setBillingInterval('month')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all z-10 ${billingInterval === 'month' ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Miesięcznie
                        </button>
                        <button
                            type="button"
                            onClick={() => setBillingInterval('year')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all z-10 ${billingInterval === 'year' ? 'text-gray-900 shadow-sm bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Rocznie
                        </button>
                    </div>

                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                        <div>
                            <p className="font-bold text-gray-900">{plan.name}</p>
                            <p className="text-sm text-gray-500">
                                {billingInterval === 'year' ? 'Płatność roczna' : 'Płatność miesięczna'}
                                {selectedMode === 'recurring' ? ' (subskrypcja)' : ' (jednorazowo)'}
                            </p>
                        </div>
                        <p className="font-bold text-lg">{price} PLN</p>
                    </div>

                    <div className="flex justify-between items-center mb-8">
                        <span className="font-bold text-xl">Do zapłaty</span>
                        <span className="font-black text-2xl text-rose-500">{price} PLN</span>
                    </div>

                    <Button
                        onClick={handleCheckout}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-6 rounded-xl text-lg shadow-lg shadow-rose-200"
                        disabled={isLoading || !isBillingComplete}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Przejdź do płatności'}
                    </Button>

                    <p className="text-xs text-center text-gray-400 mt-4">
                        Klikając przycisk, zostaniesz przekierowany do bezpiecznej bramki płatności Stripe.
                    </p>
                </div>
            </div>
        </div>
    );
};
