'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HeartButton } from '@/features/favorites/components/HeartButton';
import { CardImage } from '@/components/common/CardImage';

interface CardLayoutProps {
    children: React.ReactNode;
    idx?: number;
    imageUrl?: string | null;
    imageAlt: string;
    fallbackIcon: React.ReactNode;
    badge?: React.ReactNode;
    heartId: number | string;
    heartType: 'place' | 'event';
    priority?: boolean;
}

export const CardLayout: React.FC<CardLayoutProps> = ({
    children,
    idx = 0,
    imageUrl,
    imageAlt,
    fallbackIcon,
    badge,
    heartId,
    heartType,
    priority = false,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            viewport={{ once: true, margin: '200px' }}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all flex flex-col h-full"
        >
            <div className="relative">
                <CardImage
                    src={imageUrl}
                    alt={imageAlt}
                    priority={priority}
                    fallbackIcon={
                        <div className="flex flex-col items-center justify-center gap-2">
                            {fallbackIcon}
                            <span className="font-bold text-xs uppercase tracking-wider">Brak zdjęcia</span>
                        </div>
                    }
                />

                {badge && (
                    <div className="absolute top-4 left-4 z-10">
                        {badge}
                    </div>
                )}

                <HeartButton
                    id={heartId}
                    type={heartType}
                    className="absolute top-4 right-4 z-20"
                />
            </div>

            <div className="p-6 flex flex-col flex-1">
                {children}
            </div>
        </motion.div>
    );
};
