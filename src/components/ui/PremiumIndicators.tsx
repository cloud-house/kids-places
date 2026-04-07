import React from 'react';
import { Crown, Lock } from 'lucide-react';

interface PremiumBadgeProps {
    className?: string;
}

export const PremiumBadge: React.FC<PremiumBadgeProps> = ({ className }) => {
    return (
        <span className={`inline-flex items-center gap-1 bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-amber-200 ${className || ''}`}>
            <Crown size={10} />
            Premium
        </span>
    );
};

export const PremiumLock: React.FC = () => (
    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center rounded-xl z-20 cursor-not-allowed group">
        <div className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-2 group-hover:scale-105 transition-transform">
            <Lock size={16} className="text-amber-500" />
            <span className="text-xs font-bold text-gray-900">Dostępne w Premium</span>
        </div>
    </div>
);
