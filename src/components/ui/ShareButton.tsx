'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Share2, Facebook, MessageCircle, Link2, X } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
    title: string;
    text?: string;
    url?: string;
    className?: string;
    showText?: boolean;
    iconSize?: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
    title,
    url,
    className,
    showText = false,
    iconSize = 20
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const shareUrl = typeof window !== 'undefined' ? (url || window.location.href) : '';

    const socialPlatforms = [
        {
            name: 'Facebook',
            icon: <Facebook size={18} />,
            color: 'bg-[#1877F2]',
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
        },
        {
            name: 'Messenger',
            icon: <MessageCircle size={18} />,
            color: 'bg-[#0084FF]',
            action: () => window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(shareUrl)}`, '_blank')
        },
        {
            name: 'WhatsApp',
            icon: <MessageCircle size={18} />, // Using MessageCircle as fallback for WhatsApp
            color: 'bg-[#25D366]',
            action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}`, '_blank')
        },
        {
            name: 'Kopiuj link',
            icon: <Link2 size={18} />,
            color: 'bg-gray-500',
            action: async () => {
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    toast.success('Link skopiowany do schowka!');
                    setIsOpen(false);
                } catch {
                    toast.error('Nie udało się skopiować linku.');
                }
            }
        }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={cn(
                    "inline-flex items-center justify-center gap-2 transition-all active:scale-95",
                    className
                )}
                aria-label="Udostępnij"
            >
                <Share2 size={iconSize} />
                {showText && <span className="font-bold">Udostępnij</span>}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-full mb-4 right-0 md:right-auto md:left-0 z-[100] bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 min-w-[220px]"
                    >
                        <div className="flex items-center justify-between mb-4 px-2">
                            <span className="text-sm font-black text-gray-900 uppercase tracking-wider">Udostępnij</span>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {socialPlatforms.map((platform) => (
                                <button
                                    key={platform.name}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        platform.action();
                                    }}
                                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-all text-left group"
                                >
                                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform", platform.color)}>
                                        {platform.icon}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{platform.name}</span>
                                </button>
                            ))}
                        </div>
                        <div className="absolute -bottom-2 left-1/2 md:left-8 -translate-x-1/2 md:translate-x-0 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
