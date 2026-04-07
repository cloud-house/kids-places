'use client';

import React, { useState } from 'react';
import { LucideIcon, Globe, Phone, Mail, MapPin } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    globe: Globe,
    phone: Phone,
    mail: Mail,
    mapPin: MapPin,
};

interface ContactInfoProps {
    iconName: 'globe' | 'phone' | 'mail' | 'mapPin';
    label: string;
    value: string;
    type?: 'tel' | 'mailto';
    revealText?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
    iconName,
    label,
    value,
    type,
    revealText = "Pokaż"
}) => {
    const Icon = iconMap[iconName];
    const [revealed, setRevealed] = useState(false);

    const handleReveal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setRevealed(true);
    };

    return (
        <div className="flex items-center gap-3 text-gray-600">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-rose-500">
                <Icon size={18} />
            </div>
            <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
                {!revealed ? (
                    <button
                        onClick={handleReveal}
                        className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                        {revealText}
                    </button>
                ) : (
                    type ? (
                        <a
                            href={`${type}:${value}`}
                            className="font-bold hover:text-rose-500 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {value}
                        </a>
                    ) : (
                        <p className="font-bold">{value}</p>
                    )
                )}
            </div>
        </div>
    );
};
