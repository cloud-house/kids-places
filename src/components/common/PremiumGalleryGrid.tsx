'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { Media } from '@/payload-types';

export interface GalleryImage {
    image?: number | Media | null;
    id?: string | null;
}

interface PremiumGalleryGridProps {
    images: GalleryImage[];
}

export const PremiumGalleryGrid: React.FC<PremiumGalleryGridProps> = ({ images }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const validImages = images
        .map(item => (typeof item.image === 'object' ? item.image?.url : null))
        .filter((url): url is string => !!url);


    // Keyboard navigation (reusing from PremiumGallery)
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;
            if (e.key === 'Escape') setSelectedImageIndex(null);
            if (e.key === 'ArrowRight') setSelectedImageIndex((prev) => (prev !== null ? (prev + 1) % validImages.length : null));
            if (e.key === 'ArrowLeft') setSelectedImageIndex((prev) => (prev !== null ? (prev - 1 + validImages.length) : null));
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, validImages.length]);

    if (validImages.length === 0) return null;

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

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[50vh] min-h-[400px]">
                {/* Main Large Image (Left) */}
                {validImages[0] && (
                    <div
                        className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden cursor-pointer group"
                        onClick={() => openLightbox(0)}
                    >
                        <Image
                            src={validImages[0]}
                            alt="Main gallery image"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                )}

                {/* Top Right 1 */}
                {validImages[1] && (
                    <div
                        className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden cursor-pointer group hidden md:block"
                        onClick={() => openLightbox(1)}
                    >
                        <Image
                            src={validImages[1]}
                            alt="Gallery image 2"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                )}

                {/* Top Right 2 */}
                {validImages[2] && (
                    <div
                        className="md:col-span-1 md:row-span-1 relative rounded-3xl overflow-hidden cursor-pointer group hidden md:block"
                        onClick={() => openLightbox(2)}
                    >
                        <Image
                            src={validImages[2]}
                            alt="Gallery image 3"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                )}

                {/* Bottom Wide (Right) */}
                {validImages.length > 3 && (
                    <div
                        className="md:col-span-2 md:row-span-1 relative rounded-3xl overflow-hidden cursor-pointer group hidden md:block"
                        onClick={() => openLightbox(3)}
                    >
                        <Image
                            src={validImages[3] || validImages[1]} // Fallback if 4th missing but length check passed
                            alt="Gallery image 4"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                        {/* View All Button Overlay */}
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-gray-900 shadow-sm flex items-center gap-2 hover:bg-white transition-colors">
                            <Share2 size={16} />
                            <span>Zobacz wszystkie zdjęcia ({validImages.length})</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile View / Fallback for fewer images */}
            <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x">
                {validImages.slice(1).map((url, idx) => (
                    <div
                        key={idx}
                        className="snap-center shrink-0 w-[200px] aspect-[4/3] relative rounded-2xl overflow-hidden"
                        onClick={() => openLightbox(idx + 1)}
                    >
                        <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover" />
                    </div>
                ))}
            </div>


            {/* Lightbox (Reused Logic) */}
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
        </>
    );
};
