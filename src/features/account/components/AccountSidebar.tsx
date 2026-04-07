'use client';

import React, { useState } from 'react';
import { User as UserType } from '@/payload-types';
import { MapPin, Calendar, GraduationCap, MessageCircle, Settings, LogOut, Building2, ChevronDown } from 'lucide-react';
import { logoutAction } from '@/features/auth/actions';

import Link from 'next/link';
import { cn } from '@/lib/utils';

export type TabType = 'places' | 'events' | 'reviews' | 'registrations' | 'settings' | 'organization';

interface AccountSidebarProps {
    user: UserType;
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    reviewsMode: 'parent' | 'organizer';
    planName?: string;
    premiumExpiresAt?: Date | null;
    stats?: {
        places: { current: number; max: number };
        events: { current: number; max: number };
        registrations?: number;
        reviews?: number;
    };
}

export const AccountSidebar: React.FC<AccountSidebarProps> = ({
    user,
    activeTab,
    onTabChange,
    reviewsMode,
    planName = 'Free',
    premiumExpiresAt,
    stats
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const navItems = [
        {
            id: 'organization',
            label: 'Organizacja',
            icon: <Building2 size={20} />,
            hide: reviewsMode === 'parent',
        },
        {
            id: 'places',
            label: 'Miejsca',
            icon: <MapPin size={20} />,
            hide: reviewsMode === 'parent',
            stat: stats?.places
        },
        {
            id: 'events',
            label: 'Wydarzenia',
            icon: <Calendar size={20} />,
            hide: reviewsMode === 'parent',
            stat: stats?.events
        },

        {
            id: 'registrations',
            label: 'Zapisy',
            icon: <GraduationCap size={20} />,
            hide: reviewsMode === 'parent',
            count: stats?.registrations
        },
        {
            id: 'reviews',
            label: reviewsMode === 'organizer' ? 'Opinie' : 'Moje opinie',
            icon: <MessageCircle size={20} />,
            count: stats?.reviews
        },
        { id: 'settings', label: 'Ustawienia', icon: <Settings size={20} /> },
    ].filter(item => !item.hide);

    const activeItem = navItems.find(i => i.id === activeTab);

    const handleTabChange = (tab: TabType) => {
        onTabChange(tab);
        setIsExpanded(false);
    };

    return (
        <aside className="w-full lg:w-[280px] flex flex-col gap-6">
            {/* User Card */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 font-bold text-2xl mb-4 border-4 border-white shadow-sm">
                    {user.name?.[0]}{user.surname?.[0]}
                </div>
                <h3 className="font-bold text-lg text-gray-900">{user.name} {user.surname}</h3>
                <p className="text-xs text-gray-400 mb-4 truncate w-full px-2">{user.email}</p>

                {reviewsMode === 'organizer' && (
                    <div className="flex flex-col items-center gap-2 w-full">
                        <div className="flex flex-col items-center gap-1 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-full">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Plan:</span>
                                <span className="text-xs font-bold text-rose-500">{planName}</span>
                            </div>
                            {premiumExpiresAt && (
                                <span className="text-[10px] text-gray-400 font-bold border-t border-gray-200 mt-1 pt-1 w-full text-center">
                                    Wygasa: {new Date(premiumExpiresAt).toLocaleDateString('pl-PL')}
                                </span>
                            )}
                        </div>
                        <Link
                            href="/dla-biznesu/cennik-premium"
                            className="text-xs font-bold text-blue-500 hover:text-blue-600 hover:underline transition-all"
                        >
                            Zmień plan &rarr;
                        </Link>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-[2rem] p-3 border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                {/* Mobile Active Tab Display / Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        "flex lg:hidden w-full items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300",
                        activeItem ? "bg-rose-50 text-rose-600 font-bold" : "bg-gray-50 text-gray-600"
                    )}
                >
                    <div className="flex items-center gap-3">
                        {activeItem?.icon}
                        <span className="font-bold">{activeItem?.label}</span>
                    </div>
                    <ChevronDown size={20} className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")} />
                </button>

                <ul className={cn(
                    "flex flex-col gap-1 transition-all duration-300 ease-in-out",
                    isExpanded
                        ? "mt-3 pt-3 border-t border-gray-50 max-h-[500px] opacity-100"
                        : "max-h-0 lg:max-h-none opacity-0 lg:opacity-100 overflow-hidden lg:overflow-visible"
                )}>
                    {navItems.map((item) => {
                        const isLimitReached = item.stat && item.stat.max !== -1 && item.stat.current >= item.stat.max;

                        return (
                            <li key={item.id} className="flex-shrink-0">
                                <button
                                    onClick={() => handleTabChange(item.id as TabType)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all group",
                                        activeTab === item.id
                                            ? "bg-rose-50 text-rose-600 font-bold"
                                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        <span className="whitespace-nowrap">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.stat && (
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-md",
                                                isLimitReached
                                                    ? 'bg-red-100 text-red-600'
                                                    : activeTab === item.id ? 'bg-rose-100/50 text-rose-600' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:shadow-sm'
                                            )}>
                                                {item.stat.current} / {item.stat.max === -1 ? '∞' : item.stat.max}
                                            </span>
                                        )}
                                        {item.count !== undefined && (
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-md",
                                                activeTab === item.id ? 'bg-rose-100/50 text-rose-600' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:shadow-sm'
                                            )}>
                                                {item.count}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </li>
                        );
                    })}

                    <li className="mt-2 pt-2 border-t border-gray-50 lg:block">
                        <form action={logoutAction}>
                            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-medium">
                                <LogOut size={20} />
                                <span>Wyloguj się</span>
                            </button>
                        </form>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};
