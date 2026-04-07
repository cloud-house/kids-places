'use client';

import React from 'react';
import { Instagram, Facebook, Heart, Twitter } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config';
import Link from 'next/link';

export const Footer = () => (
    <footer className="bg-gray-50 pt-24 pb-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:col-span-5 gap-12 mb-16">
                <div className="col-span-2 lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-md">
                            <Heart fill="currentColor" size={16} />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">Kids<span className="text-rose-500">Places</span></span>
                    </div>
                    <p className="text-gray-500 max-w-xs mb-8">
                        Najlepsza wyszukiwarka zajęć i miejsc dla dzieci w Polsce. Tworzona przez rodziców dla rodziców.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-sm border border-gray-100 transition-all hover:-translate-y-1">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-sm border border-gray-100 transition-all hover:-translate-y-1">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-sm border border-gray-100 transition-all hover:-translate-y-1">
                            <Twitter size={20} />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-6">Dla Rodziców</h4>
                    <ul className="space-y-4 text-gray-500 font-medium">
                        <li><Link href="/miejsca" className="hover:text-rose-500 transition-colors">Miejsca</Link></li>
                        <li><Link href="/wydarzenia" className="hover:text-rose-500 transition-colors">Wydarzenia</Link></li>
                        <li><Link href="/#newsletter" className="hover:text-rose-500 transition-colors">Newsletter</Link></li>
                        <li><Link href="/blog" className="hover:text-rose-500 transition-colors">Blog</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6">Dla Biznesu</h4>
                    <ul className="space-y-4 text-gray-500 font-medium">
                        <li><Link href="/moje-konto" className="hover:text-rose-500 transition-colors">Dodaj miejsce</Link></li>
                        <li><Link href="/dla-biznesu/cennik-premium" className="hover:text-rose-500 transition-colors">Cennik Premium</Link></li>
                        <li><Link href="/dla-biznesu/reklama" className="hover:text-rose-500 transition-colors">Reklama</Link></li>
                        <li><Link href="/dla-biznesu/partnerstwa" className="hover:text-rose-500 transition-colors">Partnerstwa</Link></li>
                    </ul>
                </div>
            </div>

            <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400 font-medium">
                <p>© {new Date().getFullYear()} {BRAND_CONFIG.name}. Wszystkie prawa zastrzeżone.</p>
                <div className="flex gap-8">
                    <Link href="/regulamin" className="hover:text-gray-600 transition-colors">Regulamin</Link>
                    <Link href="/polityka-prywatnosci" className="hover:text-gray-600 transition-colors">Polityka prywatności</Link>
                    <Link href="/kontakt" className="hover:text-gray-600 transition-colors">Kontakt</Link>
                </div>
            </div>
        </div>
    </footer>
);
