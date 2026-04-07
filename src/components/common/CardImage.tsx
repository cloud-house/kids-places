import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CardImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    fallbackIcon?: React.ReactNode;
    priority?: boolean;
}

export const CardImage: React.FC<CardImageProps> = ({
    src,
    alt,
    className,
    fallbackIcon,
    priority = false,
}) => {
    return (
        <div className={cn("relative w-full overflow-hidden bg-gray-50", className)}>
            <div className="aspect-video relative w-full">
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        priority={priority}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                        {fallbackIcon}
                    </div>
                )}
            </div>
        </div>
    );
};
