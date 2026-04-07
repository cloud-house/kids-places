'use client';

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PricingButton } from './PricingButton';
import { PricingPlan } from '@/payload-types';

interface PricingContentProps {
    plans: PricingPlan[];
    isLoggedIn: boolean;
}

export const PricingContent = ({ plans, isLoggedIn }: PricingContentProps) => {
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

    return (
        <section className="py-24 bg-white">
            <div className="max-w-5xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Prosty cennik</h2>
                    <p className="text-gray-600 mb-8">Brak ukrytych kosztów. Wybierz plan dopasowany do Twoich potrzeb.</p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <span className={`text-sm font-medium ${billingInterval === 'month' ? 'text-gray-900' : 'text-gray-500'}`}>Miesięcznie</span>
                        <button
                            onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
                            className="relative w-14 h-7 bg-gray-200 rounded-full transition-colors flex items-center px-1"
                        >
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 transform ${billingInterval === 'year' ? 'translate-x-7' : 'translate-x-0'}`} />
                        </button>
                        <span className={`text-sm font-medium ${billingInterval === 'year' ? 'text-gray-900' : 'text-gray-500'}`}>
                            Rocznie
                            <span className="ml-2 inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase">
                                2 miesiące za darmo
                            </span>
                        </span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {plans.map((plan) => {

                        const isAnnual = billingInterval === 'year';
                        const price = isAnnual && plan.planPrice_annual_recurring !== undefined && plan.planPrice_annual_recurring !== null
                            ? plan.planPrice_annual_recurring
                            : plan.planPrice_recurring;

                        return (
                            <div
                                key={plan.id}
                                className={`p-10 rounded-[2rem] border-2 transition-all flex flex-col ${plan.isFeatured ? 'border-rose-500 shadow-2xl shadow-rose-200 relative overflow-hidden' : 'border-gray-100 bg-gray-50'}`}
                            >
                                {plan.isFeatured && (
                                    <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black uppercase px-6 py-2 rotate-45 translate-x-4 translate-y-2">
                                        Polecane
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                    {price !== undefined && price !== null && (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-black">{price}</span>
                                            <span className="text-5xl font-black ml-1">zł</span>
                                            <span className="text-gray-500 font-medium ml-1">/{isAnnual ? 'rok' : 'miesiąc'}</span>
                                        </div>
                                    )}
                                    {isAnnual && price !== undefined && price !== null && plan.planPrice_recurring !== undefined && plan.planPrice_recurring !== null && price > 0 && (
                                        <p className="text-emerald-600 text-sm font-bold mt-2">
                                            Oszczędzasz {(plan.planPrice_recurring * 12 - price).toFixed(0)} zł rocznie!
                                        </p>
                                    )}
                                    <p className="text-gray-500 mt-4 text-sm leading-relaxed">{plan.description}</p>
                                </div>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    {plan.features?.map((featObj, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm">
                                            <CheckCircle2 size={18} className={`mt-0.5 shrink-0 ${plan.isFeatured ? 'text-rose-500' : 'text-emerald-500'}`} />
                                            <span>{featObj.feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <PricingButton
                                    planId={plan.id}
                                    isFeatured={plan.isFeatured || false}
                                    isFree={plan.planPrice_recurring === 0}
                                    isLoggedIn={isLoggedIn}
                                    buttonText={plan.buttonText || undefined}
                                    interval={billingInterval}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
