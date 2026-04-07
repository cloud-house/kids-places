import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const AccountDashboardSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in duration-500">
            {/* Sidebar Skeleton */}
            <aside className="w-full lg:w-[280px] flex flex-col gap-6">
                {/* User Card Skeleton */}
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                    <Skeleton className="w-20 h-20 rounded-full mb-4" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-40 mb-4" />
                    <div className="w-full pt-4 border-t border-gray-50 flex flex-col items-center gap-2">
                        <Skeleton className="h-8 w-full rounded-xl" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>

                {/* Navigation Skeleton */}
                <nav className="bg-white rounded-[2rem] p-3 border border-gray-100 shadow-sm w-full">
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-2xl" />
                        ))}
                    </div>
                </nav>
            </aside>

            {/* Content Area Skeleton */}
            <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-40 rounded-xl" />
                </div>

                <div className="grid gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between gap-4 shadow-sm">
                            <div className="flex items-center gap-4">
                                <Skeleton className="w-16 h-16 rounded-2xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <Skeleton className="h-10 w-10 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
