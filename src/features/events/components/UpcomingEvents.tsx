'use client';

import React from 'react';
import { EventCard } from './EventCard';
import { Event } from '@/payload-types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface UpcomingEventsSectionProps {
    events?: Event[]
}

export const UpcomingEventsSection: React.FC<UpcomingEventsSectionProps> = ({ events = [] }) => {
    if (events.length === 0) return null;

    return (
        <section id="wydarzenia" className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-rose-500 font-bold uppercase tracking-widest text-sm mb-4 block">Co się dzieje?</span>
                        <h2 className="text-4xl font-bold mb-4">Najciekawsze wydarzenia w ten weekend</h2>
                        <p className="text-gray-600 max-w-2xl">Zapisz się na warsztaty, koncerty i spotkania, które rozwijają pasje Twojego dziecka.</p>
                    </div>
                    <Link href="/wydarzenia" className="inline-flex items-center gap-2 text-rose-500 font-bold hover:gap-3 transition-all">
                        Zobacz wszystkie wydarzenia <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {events.map((event, idx) => (
                        <EventCard key={event.id} event={event} idx={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};
