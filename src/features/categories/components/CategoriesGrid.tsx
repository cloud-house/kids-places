'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Category } from '@/payload-types';
import { Icon } from '@/components/ui/Icon';

interface CategoriesGridProps {
    categories?: Category[]
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({ categories = [] }) => (
    <section id="kategorie" className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-12">
                <div>
                    <h2 className="text-3xl font-bold mb-4">Wybierz kategorię</h2>
                    <p className="text-gray-600">Dostosuj wyszukiwanie do zainteresowań Twojego dziecka.</p>
                </div>
                <Link href="/miejsca" className="hidden sm:flex items-center gap-2 text-rose-500 font-bold hover:underline">
                    Zobacz wszystkie <ChevronRight size={20} />
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((cat, idx) => (
                    <Link href={`/miejsca?category=${cat.slug}`} key={cat.id}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -5 }}
                            className="cursor-pointer group h-full"
                        >
                            <div className={`aspect-square rounded-3xl ${cat.color} flex flex-col items-center justify-center gap-4 transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-current/10 h-full p-4 text-center`}>
                                <Icon name={cat.icon} size={32} />
                                <span className="font-bold text-lg">{cat.title}</span>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
);
