'use client';

import React, { useState, useEffect } from 'react';
import { Heart, User, Menu, X, Plus, ChevronRight, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { User as UserType } from '@/payload-types';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { logoutAction } from '@/features/auth/actions';

interface NavbarProps {
    user?: UserType | null;
}

export const NAV_LINKS = [
    { href: '/miejsca', label: 'Miejsca' },
    { href: '/wydarzenia', label: 'Wydarzenia' },
    { href: '/blog', label: 'Blog' },
];

export const Navbar: React.FC<NavbarProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const pathname = usePathname();
    const isParentOnly = user && user.roles?.includes('parent') && !user.roles?.includes('organizer') && !user.roles?.includes('admin');
    const showAddButton = !isParentOnly;

    // Close mobile menu when path changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {/* Main Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 md:h-24">
                    {/* Grid Layout for perfect centering */}
                    <div className="grid grid-cols-12 h-full items-center">

                        {/* 1. Logo (Left) */}
                        <div className="col-span-6 lg:col-span-3 flex items-center justify-start">
                            <Link href="/" className="flex items-center gap-3 shrink-0 group">
                                <div className="w-10 h-10 md:w-11 md:h-11 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200 transition-transform group-hover:scale-105 group-hover:rotate-3">
                                    <Heart fill="currentColor" size={22} className="md:w-6 md:h-6" />
                                </div>
                                <span className="text-xl md:text-2xl font-black tracking-tight text-gray-900 group-hover:opacity-90">
                                    Kids<span className="text-rose-500">Places</span>
                                </span>
                            </Link>
                        </div>

                        {/* 2. Desktop Navigation (Center) - Only visible on LG+ */}
                        <div className="hidden lg:flex flex-col col-span-6 justify-center items-center gap-1">
                            {/* Links */}
                            <div className="flex items-center gap-2">
                                {NAV_LINKS.map((link) => {
                                    const isActive = pathname.startsWith(link.href) && link.href !== '/' || pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={cn(
                                                "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 inline-flex items-center",
                                                isActive
                                                    ? "text-rose-600"
                                                    : "text-gray-900 hover:text-rose-500 hover:bg-rose-50/50"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 3. Actions (Right) */}
                        <div className="col-span-6 lg:col-span-3 flex items-center justify-end gap-2 md:gap-4">
                            {/* Favorites Icon */}
                            <Link
                                href="/ulubione"
                                className="hidden md:flex p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all relative shrink-0 group"
                                title="Ulubione"
                            >
                                <Heart size={22} className={cn("group-hover:scale-110 transition-transform", pathname === '/ulubione' && "text-rose-500 fill-rose-500")} />
                            </Link>

                            {/* User Menu / Login */}
                            {user ? (
                                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <button
                                            className="hidden md:flex items-center gap-2 bg-white text-gray-700 font-bold px-4 py-2.5 rounded-full hover:bg-gray-50 transition-all border border-gray-200 hover:border-gray-300 shadow-sm shrink-0"
                                        >
                                            <div className="w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center text-rose-500">
                                                <User size={14} className="text-rose-600" />
                                            </div>
                                            <span className="text-sm">Konto</span>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56 p-2" align="end">
                                        <div className="flex flex-col gap-1">
                                            <div className="px-3 py-2 border-b border-gray-100 mb-1">
                                                <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href="/moje-konto"
                                                onClick={() => setIsPopoverOpen(false)}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <User size={16} className="text-gray-400" />
                                                Moje konto
                                            </Link>
                                            <div className="h-px bg-gray-100 my-1" />
                                            <button
                                                onClick={() => logoutAction()}
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors w-full text-left"
                                            >
                                                <LogOut size={16} />
                                                Wyloguj się
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Link
                                    href="/logowanie"
                                    className="hidden md:block text-gray-900 font-medium px-4 py-2 hover:text-rose-600 transition-colors shrink-0 text-sm"
                                >
                                    Zaloguj
                                </Link>
                            )}

                            {/* CTA Button */}
                            {showAddButton && (
                                <Link
                                    href="/moje-konto"
                                    className="hidden md:flex bg-rose-500 text-white font-bold px-5 py-2.5 rounded-full hover:bg-rose-600 transition-all shadow-md shadow-rose-200 hover:shadow-lg hover:-translate-y-0.5 items-center gap-2 shrink-0 text-sm"
                                >
                                    <Plus size={18} strokeWidth={3} />
                                    <span>Dodaj</span>
                                </Link>
                            )}

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsOpen(true)}
                                className="lg:hidden p-2 text-gray-800 hover:text-rose-500 transition-colors shrink-0 focus:outline-none"
                                aria-label="Otwórz menu"
                            >
                                <Menu size={32} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl transition-all duration-500 ease-in-out lg:hidden flex flex-col",
                    isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"
                )}
            >
                {/* Mobile Header */}
                <div className="flex items-center justify-between px-6 h-24 shrink-0 border-b border-gray-100/50">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                            <Heart fill="currentColor" size={20} />
                        </div>
                        <span className="text-xl font-black text-gray-900">
                            Kids<span className="text-rose-500">Places</span>
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Mobile Links */}
                <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
                    <div className="space-y-4">
                        {NAV_LINKS.map((link, idx) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                style={{
                                    transitionDelay: `${idx * 50}ms`,
                                }}
                                className={cn(
                                    "flex items-center justify-between text-3xl font-black tracking-tight transition-all duration-300 hover:translate-x-2",
                                    pathname.startsWith(link.href) ? "text-rose-500" : "text-gray-900 hover:text-rose-500/80"
                                )}
                            >
                                {link.label}
                                {pathname.startsWith(link.href) && <ChevronRight size={28} className="text-rose-500" />}
                            </Link>
                        ))}
                    </div>

                    <div className="h-px bg-gray-100 w-full my-4" />

                    <div className="space-y-4">
                        <Link href="/ulubione" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-xl font-bold text-gray-700 hover:text-rose-500 p-4 bg-gray-50 rounded-2xl">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-rose-500">
                                <Heart size={20} />
                            </div>
                            Ulubione
                        </Link>

                        {user ? (
                            <>
                                <Link href="/moje-konto" onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-xl font-bold text-gray-700 hover:text-rose-500 p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-rose-500">
                                        <User size={20} />
                                    </div>
                                    Moje konto
                                </Link>
                                <button
                                    onClick={() => logoutAction()}
                                    className="flex items-center gap-4 text-xl font-bold text-rose-600 hover:bg-rose-50 p-4 bg-gray-50 rounded-2xl w-full text-left"
                                >
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-rose-500">
                                        <LogOut size={20} />
                                    </div>
                                    Wyloguj się
                                </button>
                            </>
                        ) : (
                            <Link href="/logowanie" className="flex items-center justify-between text-2xl font-bold text-gray-700 hover:text-rose-500 p-2">
                                Zaloguj się
                                <ChevronRight size={24} className="opacity-50" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Footer */}
                {showAddButton && (
                    <div className="p-6 bg-gray-50/50 shrink-0">
                        <Link
                            href="/moje-konto"
                            className="flex items-center justify-center gap-2 w-full bg-rose-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-rose-200 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <Plus size={24} strokeWidth={2.5} />
                            Dodaj własne miejsce
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

