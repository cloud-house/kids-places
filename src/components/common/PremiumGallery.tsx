'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Media } from '@/payload-types';

export interface GalleryImage {
    image?: number | Media | null;
    id?: string | null;
}

interface PremiumGalleryProps {
    images: GalleryImage[];
}

export const PremiumGallery: React.FC<PremiumGalleryProps> = ({ images }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const validImages = images
        .map(item => (typeof item.image === 'object' ? item.image?.url : null))
        .filter((url): url is string => !!url);

    const openLightbox = (index: number) => setSelectedImageIndex(index);
    const closeLightbox = () => setSelectedImageIndex(null);
    const showNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % validImages.length : null));
    };
    const showPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + validImages.length) % validImages.length : null));
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % validImages.length : null));
            if (e.key === 'ArrowLeft') setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + validImages.length) : null));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, validImages.length]);

    if (validImages.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {validImages.map((url, index) => (
                    <motion.div
                        key={url}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 bg-gray-100"
                        onClick={() => openLightbox(index)}
                    >
                        <Image
                            src={url}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileHover={{ opacity: 1, scale: 1 }}
                                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-rose-500 shadow-lg"
                            >
                                <Maximize2 size={24} />
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-10"
                        onClick={closeLightbox}
                    >
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-6 right-6 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                            onClick={closeLightbox}
                        >
                            <X size={24} />
                        </motion.button>

                        {validImages.length > 1 && (
                            <>
                                <button
                                    className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-md"
                                    onClick={showPrev}
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors backdrop-blur-md"
                                    onClick={showNext}
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        <motion.div
                            key={selectedImageIndex}
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={validImages[selectedImageIndex]}
                                alt={`Gallery image ${selectedImageIndex + 1}`}
                                fill
                                className="object-contain"
                                priority
                                sizes="100vw"
                            />
                        </motion.div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/80 text-sm font-medium">
                            {selectedImageIndex + 1} / {validImages.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
