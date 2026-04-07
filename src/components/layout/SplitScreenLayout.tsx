import React, { ReactNode } from 'react';

interface SplitScreenLayoutProps {
    children: ReactNode;
    map: ReactNode;
}

export const SplitScreenLayout = ({ children, map }: SplitScreenLayoutProps) => {
    return (
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_minmax(400px,600px)] min-h-[calc(100vh-64px)]">
            {/* List Side */}
            <div className="flex flex-col h-full bg-white overflow-y-auto">
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </div>

            {/* Map Side - Sticky on desktop */}
            <div className="hidden lg:block sticky top-16 h-[calc(100vh-64px)] border-l border-gray-200">
                {map}
            </div>

            {/* Mobile Map - Fixed button or toggle could be added later */}
        </div>
    );
};
