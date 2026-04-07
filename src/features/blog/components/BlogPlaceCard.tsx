'use client';

import React from 'react';
import { Star, MapPin, ChevronRight } from 'lucide-react';
import { Place } from '@/payload-types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeartButton } from '@/features/favorites/components/HeartButton';

interface BlogPlaceCardProps {
    place: Place;
    idx?: number;
}

export const BlogPlaceCard: React.FC<BlogPlaceCardProps> = ({ place, idx = 0 }) => {
    const imageUrl = (typeof place.logo === 'object' && place.logo?.url) ? place.logo.url : null;
    const city = typeof place.city === 'object' ? place.city : null;
    const category = typeof place.category === 'object' ? place.category : null;

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
                            alt={place.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                            <Star size={48} className="text-gray-200" />
                        </div>
                    )}

                    {/* Badge Overlay */}
                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                        {category && (
                            <span className="bg-white/90 backdrop-blur-md text-rose-500 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-sm">
                                {category.title}
                            </span>
                        )}
                        {city && (
                            <span className="bg-rose-500 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-sm">
                                {city.name}
                            </span>
                        )}
                    </div>

                    <HeartButton
                        id={place.id}
                        type="place"
                        className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-sm hover:bg-white transition-colors"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 p-8 md:p-10 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i < Math.floor(place.rating || 0) ? "currentColor" : "none"}
                                    className={i < Math.floor(place.rating || 0) ? "" : "text-gray-200"}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{place.rating || '0.0'}</span>
                        <span className="text-xs text-gray-400">({place.reviewCount || 0} opinii)</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-rose-500 transition-colors uppercase tracking-tight leading-tight">
                        {place.name}
                    </h3>

                    {place.shortDescription && (
                        <p className="text-gray-500 text-base leading-relaxed mb-8 line-clamp-3">
                            {place.shortDescription}
                        </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-400">
                                <MapPin size={16} className="text-rose-500" />
                                <span className="text-sm font-medium">
                                    {place.street}, {city?.name}
                                </span>
                            </div>
                            {place.isFree && (
                                <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                                    Wstęp bezpłatny
                                </div>
                            )}
                        </div>

                        <Link
                            href={`/miejsca/${place.slug}`}
                            className="group/btn inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-rose-500 transition-all duration-300 shadow-xl shadow-gray-200 hover:shadow-rose-200"
                        >
                            <span>Odkryj miejsce</span>
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
