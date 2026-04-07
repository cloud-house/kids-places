import React from 'react';
import { icons } from 'lucide-react';

interface IconProps {
    name: string;
    size?: number;
    className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className }) => {
    const LucideIcon = icons[name as keyof typeof icons];

    if (!LucideIcon) {
        return null; // Or a default icon
    }

    return <LucideIcon size={size} className={className} />;
};
