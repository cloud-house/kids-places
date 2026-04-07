import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface DetailImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    priority?: boolean;
}

export const DetailImage: React.FC<DetailImageProps> = ({
    src,
    alt,
    className,
    priority = false
}) => {
    return (
        <div className={cn("bg-white rounded-3xl p-3 shadow-sm overflow-hidden border border-gray-100", className)}>
            {src ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden group bg-gray-50">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        priority={priority}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            ) : (
                <div className="aspect-video rounded-2xl bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-300">
                    <Calendar size={48} strokeWidth={1} />
                    <span className="text-xs font-bold uppercase">Brak zdjęcia</span>
                </div>
            )}
        </div>
    );
};
