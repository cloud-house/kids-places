import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, message }) => {
    return (
        <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200 animate-in fade-in duration-700">
            <Icon size={48} className="mx-auto mb-4 text-gray-200/80" />
            <p className="text-gray-400 font-bold max-w-xs mx-auto">{message}</p>
        </div>
    );
};
