'use client';

import React from 'react';
import { Calendar, MapPin, ChevronRight, Ticket } from 'lucide-react';
import { Event } from '@/payload-types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeartButton } from '@/features/favorites/components/HeartButton';

interface BlogEventCardProps {
    event: Event;
    idx?: number;
}

export const BlogEventCard: React.FC<BlogEventCardProps> = ({ event, idx = 0 }) => {
    const imageUrl = (typeof event.logo === 'object' && event.logo?.url) ? event.logo.url : null;
    const placeObj = (typeof event.place === 'object' && event.place) ? event.place : null;
    const placeName = placeObj ? placeObj.name : null;
    const city = placeObj && typeof placeObj.city === 'object' ? placeObj.city : null;
    const category = typeof event.category === 'object' ? event.category : null;

    const startDate = new Date(event.startDate);
    const day = startDate.getDate();
    const month = startDate.toLocaleString('pl-PL', { month: 'short' }).toUpperCase();
    const time = startDate.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-rose-100/30 transition-all duration-500"
        >
            {/* Index Numbering for "Top lists" */}
            {idx >= 0 && (
                <div className="hidden lg:block absolute -right-6 -bottom-12 text-[14rem] font-black text-gray-100/80 select-none pointer-events-none group-hover:text-rose-100/50 transition-colors duration-500 z-0">
                    {String(idx + 1).padStart(2, '0')}
                </div>
            )}

            <div className="flex flex-col md:flex-row h-full relative z-10">
                {/* Image Section */}
                <div className="relative w-full md:w-2/5 min-h-[280px] overflow-hidden">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                            <Calendar size={48} className="text-gray-200" />
                        </div>
                    )}
                    
                    {/* Date Badge */}
                    <div className="absolute top-6 left-6 flex flex-col items-center bg-white/95 backdrop-blur-md min-w-[64px] py-3 rounded-2xl shadow-lg px-2 border border-white">
                        <span className="text-[10px] font-black text-rose-500 leading-none mb-1">{month}</span>
                        <span className="text-2xl font-black text-gray-900 leading-none mb-1">{day}</span>
                        <span className="text-[10px] font-bold text-gray-400 leading-none">{time}</span>
                    </div>

                    <HeartButton
                        id={event.id}
                        type="event"
                        className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-sm hover:bg-white transition-colors"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 p-8 md:p-10 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {category && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 px-3 py-1 rounded-lg">
                                {category.title}
                            </span>
                        )}
                        {city && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg">
                                {city.name}
                            </span>
                        )}
                        {event.ageRange && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
                                {event.ageRange}
                            </span>
                        )}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-rose-500 transition-colors uppercase tracking-tight leading-tight">
                        {event.title}
                    </h3>

                    {placeName && (
                        <div className="flex items-center gap-2 mb-6 text-gray-500">
                            <MapPin size={16} className="text-rose-500" />
                            <span className="text-sm font-medium">{placeName}</span>
                        </div>
                    )}

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                                <Ticket size={18} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cena od</span>
                                <span className="font-black text-gray-900 text-lg">
                                    {event.isFree ? 'Bezpłatne' : (
                                        event.tickets && event.tickets.length > 0 ? (
                                            (() => {
                                                const prices = event.tickets.map(t => typeof t === 'object' ? t.price : null).filter((p): p is number => p !== null && p !== undefined);
                                                if (prices.length === 0) return 'Płatne';
                                                const minPrice = Math.min(...prices);
                                                return `${minPrice} PLN`;
                                            })()
                                        ) : 'Tak'
                                    )}
                                </span>
                            </div>
                        </div>

                        <Link
                            href={`/wydarzenia/${event.slug}`}
                            className="group/btn inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-500 transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-rose-200"
                        >
                            <span>Zobacz wydarzenie</span>
                            <div className="bg-white/20 p-1 rounded-lg transition-transform group-hover/btn:translate-x-1">
                                <ChevronRight size={18} />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
