'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Tag, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Category, Attribute, AttributeGroup, City } from '@/payload-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils/cn"

import { Icon } from '@/components/ui/Icon';
import { useCity } from '@/features/cities/providers/CityProvider';
import { setCityCookie } from '@/features/cities/actions';

// Removed CITIES import

interface FilterSidebarProps {
    categories: Category[];
    attributes: Attribute[];
    basePath: string;
    scope: 'place' | 'event';
    cities: City[];
}


export const FilterSidebar: React.FC<FilterSidebarProps> = ({ categories, attributes, basePath, scope, cities }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { selectedCity, changeCity } = useCity();
    const [isPending, startTransition] = useTransition();

    const urlCity = searchParams.get('city');

    const [q, setQ] = useState(searchParams.get('q') || '');
    const [city, setCity] = useState(urlCity || selectedCity || '');
    const [categorySlug, setCategorySlug] = useState(searchParams.get('category') || '');

    useEffect(() => {
        setCity(urlCity || selectedCity || '');
    }, [urlCity, selectedCity]);

    // Get current attribute filters from URL
    const getCurrentAttributes = () => {
        const attrs: Record<string, string> = {};
        searchParams.forEach((value, key) => {
            if (key.startsWith('attr_')) {
                attrs[key.replace('attr_', '')] = value;
            }
        });
        return attrs;
    };

    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(getCurrentAttributes());
    const [isExpanded, setIsExpanded] = useState(false);

    // Update URL when filters change
    const updateFilters = (updates: { q?: string; city?: string; category?: string; attributes?: Record<string, string> }) => {
        const params = new URLSearchParams(searchParams.toString());

        if (updates.q !== undefined) {
            if (updates.q) params.set('q', updates.q);
            else params.delete('q');
        }

        if (updates.city !== undefined) {
            if (updates.city) params.set('city', updates.city);
            else params.delete('city');
        }

        if (updates.category !== undefined) {
            if (updates.category) params.set('category', updates.category);
            else params.delete('category');

            // Clear attributes on category change as they might not apply
            Array.from(params.keys()).forEach(key => {
                if (key.startsWith('attr_')) params.delete(key);
            });
            setSelectedAttributes({});
        }

        if (updates.attributes !== undefined) {
            // Keep existing search/city/category, but update attributes
            Array.from(params.keys()).forEach(key => {
                if (key.startsWith('attr_')) params.delete(key);
            });
            Object.entries(updates.attributes).forEach(([key, value]) => {
                params.set(`attr_${key}`, value);
            });
        }

        router.push(`${basePath}?${params.toString()}`);
    };

    const handleAttributeChange = (slug: string, value: string, checked: boolean) => {
        const newAttrs = { ...selectedAttributes };
        if (checked) {
            newAttrs[slug] = value;
        } else {
            delete newAttrs[slug];
        }
        setSelectedAttributes(newAttrs);
        updateFilters({ attributes: newAttrs });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ q });
    };

    const clearFilters = () => {
        setQ('');
        setCity('');
        setCategorySlug('');
        setSelectedAttributes({});
        router.push(basePath);
    };

    // Filter attributes based on selected category or current scope
    const relevantAttributes = attributes.filter(attr => {
        if (categorySlug) {
            const selectedCat = categories.find(c => c.slug === categorySlug);
            if (!selectedCat) return false;

            if (!attr.categories || attr.categories.length === 0) return true; // Global attributes

            return attr.categories.some(cat => {
                const catId = typeof cat === 'object' ? cat.id : cat;
                return catId === selectedCat.id;
            });
        }

        // No category selected - filter by scope
        // Show attribute if it belongs to ANY category that has the current scope
        if (!attr.categories || attr.categories.length === 0) return true; // Global attributes

        return attr.categories.some(cat => {
            const category = typeof cat === 'object' ? cat : categories.find(c => c.id === cat);
            return category?.scopes?.includes(scope);
        });
    });

    // Group attributes by group
    const groupedAttributes: Record<string, { group: AttributeGroup; items: Attribute[] }> = {};
    relevantAttributes.forEach(attr => {
        const group = attr.group;
        if (!group || typeof group !== 'object') return;

        const groupObj = group as AttributeGroup;
        if (!groupedAttributes[groupObj.slug]) {
            groupedAttributes[groupObj.slug] = { group: groupObj, items: [] };
        }
        groupedAttributes[groupObj.slug].items.push(attr);
    });

    const hasFilters = q || city || categorySlug || Object.keys(selectedAttributes).length > 0;

    const activeFiltersCount = [
        q ? 1 : 0,
        city ? 1 : 0,
        categorySlug ? 1 : 0,
        Object.keys(selectedAttributes).length
    ].reduce((a, b) => a + b, 0);

    return (
        <div className="bg-white p-4 lg:p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            {/* Mobile Toggle Button */}
            <div className="lg:hidden">
                <Button
                    variant="outline"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={cn(
                        "w-full flex items-center justify-between h-14 rounded-2xl border-2 transition-all",
                        isExpanded ? "border-rose-500 bg-rose-50 text-rose-500" : "border-gray-100 bg-gray-50 text-gray-700"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <SlidersHorizontal size={20} className={isExpanded ? "text-rose-500" : "text-gray-400"} />
                        <span className="font-bold text-lg">Filtry</span>
                        {activeFiltersCount > 0 && (
                            <span className="bg-rose-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-in zoom-in duration-300">
                                {activeFiltersCount}
                            </span>
                        )}
                    </div>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
            </div>

            <div className={cn(
                "space-y-8 mt-6 lg:mt-0 lg:block",
                isExpanded ? "block" : "hidden"
            )}>
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold hidden lg:block">Filtry</h3>
                    {hasFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 -mr-2"
                        >
                            <X size={14} className="mr-1" /> Wyczyść
                        </Button>
                    )}
                </div>

                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="space-y-3">
                    <Label htmlFor="search" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Szukaj</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                        <Input
                            id="search"
                            type="text"
                            placeholder="Nazwa, opis..."
                            value={q}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
                            className="pl-10 bg-gray-50 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-rose-500 transition-all h-11"
                        />
                    </div>
                </form>

                {/* City */}
                <div className="space-y-4">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} className="text-rose-500" /> Lokalizacja
                    </Label>
                    <Select
                        value={city || "all"}
                        onValueChange={(val) => {
                            const newCity = val === "all" ? "" : val;
                            setCity(newCity);
                            changeCity(newCity || "all");
                            startTransition(async () => {
                                await setCityCookie(newCity || "all");
                                // We remove the explicit `city` from URL to rely purely on the global cookie
                                // and keep the URL clean.
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete('city');
                                router.push(`${basePath}?${params.toString()}`);
                            });
                        }}
                        disabled={isPending}
                    >
                        <SelectTrigger className="w-full bg-gray-50 border-none rounded-2xl h-11 focus:ring-rose-500">
                            <SelectValue placeholder="Wybierz miasto" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Cała Polska</SelectItem>
                            {cities.map((c) => (
                                <SelectItem key={c.id} value={c.slug || c.name}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Categories */}
                <div className="space-y-4">
                    <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Tag size={14} className="text-rose-500" /> Kategoria
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between h-12 rounded-2xl border-none bg-gray-50 hover:bg-gray-100/80"
                            >
                                <span className="flex items-center gap-2 truncate">
                                    {categorySlug ? (
                                        (() => {
                                            const cat = categories.find((c) => c.slug === categorySlug);
                                            return cat ? (
                                                <>
                                                    <Icon name={cat.icon} size={18} className="text-rose-500" />
                                                    <span className="text-gray-900">{cat.title}</span>
                                                </>
                                            ) : "Wybierz kategorię";
                                        })()
                                    ) : (
                                        <span className="text-gray-500">Wybierz kategorię</span>
                                    )}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Szukaj kategorii..." />
                                <CommandList>
                                    <CommandEmpty>Brak wyników.</CommandEmpty>
                                    <CommandGroup>
                                        <CommandItem
                                            value="all"
                                            onSelect={() => {
                                                setCategorySlug('');
                                                updateFilters({ category: '' });
                                            }}
                                            className="gap-2"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    categorySlug === "" ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            <span>Wszystkie kategorie</span>
                                        </CommandItem>
                                        {categories.map((cat) => (
                                            <CommandItem
                                                key={cat.id}
                                                value={cat.title}
                                                onSelect={() => {
                                                    const newCatSlug = categorySlug === cat.slug ? '' : cat.slug;
                                                    setCategorySlug(newCatSlug);
                                                    updateFilters({ category: newCatSlug });
                                                }}
                                                className="gap-2"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        categorySlug === cat.slug ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <Icon name={cat.icon} size={16} className={categorySlug === cat.slug ? 'text-rose-500' : 'text-gray-400'} />
                                                <span>{cat.title}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Dynamic Attributes */}
                {Object.values(groupedAttributes)
                    .sort((a, b) => (a.group.order || 100) - (b.group.order || 100))
                    .map(({ group, items }) => (
                        <div key={group.id} className="space-y-4 pt-4 border-t border-gray-50">
                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                {group.name}
                            </Label>
                            <div className="space-y-3">
                                {items
                                    .sort((a, b) => (a.order || 100) - (b.order || 100))
                                    .map(attr => (
                                        <div key={attr.id} className="flex items-center space-x-3">
                                            {attr.type === 'boolean' ? (
                                                <>
                                                    <Checkbox
                                                        id={`attr-${attr.slug}`}
                                                        checked={selectedAttributes[attr.slug] === 'true'}
                                                        onCheckedChange={(checked: boolean) => handleAttributeChange(attr.slug, 'true', checked)}
                                                        className="rounded-md border-gray-300 text-rose-500 focus:ring-rose-500"
                                                    />
                                                    <label
                                                        htmlFor={`attr-${attr.slug}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {attr.name}
                                                    </label>
                                                </>
                                            ) : (attr.type === 'select' || attr.type === 'multi-select') ? (
                                                <div className="w-full space-y-2">
                                                    <Label className="text-xs text-gray-400">{attr.name}</Label>
                                                    {attr.type === 'select' ? (
                                                        <Select
                                                            value={selectedAttributes[attr.slug] || "all"}
                                                            onValueChange={(val) => {
                                                                if (val === "all") {
                                                                    const newAttrs = { ...selectedAttributes };
                                                                    delete newAttrs[attr.slug];
                                                                    setSelectedAttributes(newAttrs);
                                                                    updateFilters({ attributes: newAttrs });
                                                                } else {
                                                                    const newAttrs = { ...selectedAttributes, [attr.slug]: val };
                                                                    setSelectedAttributes(newAttrs);
                                                                    updateFilters({ attributes: newAttrs });
                                                                }
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full bg-white rounded-xl h-10 border-gray-200 focus:ring-rose-500">
                                                                <SelectValue placeholder="Wybierz..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">Wszystkie</SelectItem>
                                                                {attr.options?.map(opt => (
                                                                    <SelectItem key={opt.id} value={opt.value}>{opt.label}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <MultiSelect
                                                            options={attr.options?.map(opt => ({ label: opt.label, value: opt.value })) || []}
                                                            selected={selectedAttributes[attr.slug] ? selectedAttributes[attr.slug].split(',') : []}
                                                            onChange={(selected) => {
                                                                const newAttrs = { ...selectedAttributes };
                                                                if (selected.length > 0) {
                                                                    newAttrs[attr.slug] = selected.join(',');
                                                                } else {
                                                                    delete newAttrs[attr.slug];
                                                                }
                                                                setSelectedAttributes(newAttrs);
                                                                updateFilters({ attributes: newAttrs });
                                                            }}
                                                            placeholder="Wybierz opcje..."
                                                            className="bg-white border-gray-200 rounded-xl"
                                                        />
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};
