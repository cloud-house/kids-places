import React, { Suspense } from 'react';
import { MapPin } from 'lucide-react';
import { getAttributes } from '@/features/attributes/service';
import { getCategories } from '@/features/categories/service';
import { getPlaces } from '@/features/places/service';
import { getCities } from '@/features/cities/service';
import { FilterSidebar } from '@/features/search/components/FilterSidebar';
import { PlacesGrid } from '@/features/places/components/PlacesGrid';
import { SortSelect } from '@/features/search/components/SortSelect';
import { Pagination } from '@/components/ui/Pagination';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

export const revalidate = 3600; // 1 hour

import type { Metadata } from 'next';
import { BRAND_CONFIG } from '@/lib/config';
import { FilterSidebarSkeleton } from '@/components/skeletons/FilterSidebarSkeleton';
import { ListingGridSkeleton } from '@/components/skeletons/ListingGridSkeleton';

// Removed force-dynamic to allow streaming
// export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{
        q?: string;
        city?: string;
        category?: string;
        page?: string;
        sort?: string;
    }>;
}

export const metadata: Metadata = {
    title: `Baza Miejsc - Najlepsze atrakcje dla dzieci | ${BRAND_CONFIG.name}`,
    description: "Odkryj najlepsze miejsca dla Twojej rodziny. Od sal zabaw po parki edukacyjne - znajdź idealną lokalizację na spędzenie czasu z bliskimi."
};

async function SidebarWrapper() {
    const [categories, attributes, cities] = await Promise.all([
        getCategories('place'),
        getAttributes(),
        getCities()
    ]);
    return <FilterSidebar categories={categories} attributes={attributes} basePath="/miejsca" scope="place" cities={cities} />;
}

async function ResultsWrapper({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    const params = await searchParams;
    const currentPage = Number(Array.isArray(params.page) ? params.page[0] : params.page) || 1;
    const currentSort = (Array.isArray(params.sort) ? params.sort[0] : params.sort) || '-createdAt';

    const attributeFilters: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
        if (key.startsWith('attr_') && value) {
            attributeFilters[key.replace('attr_', '')] = (Array.isArray(value) ? value[0] : value) as string;
        }
    });

    const placesResult = await getPlaces({
        q: (Array.isArray(params.q) ? params.q[0] : params.q),
        city: (Array.isArray(params.city) ? params.city[0] : params.city),
        categorySlug: (Array.isArray(params.category) ? params.category[0] : params.category),
        page: currentPage,
        sort: currentSort,
        limit: 12,
        attributes: attributeFilters
    });

    const { docs: places, totalPages, page } = placesResult;

    const sortOptions = [
        { label: 'Najnowsze', value: '-createdAt' },
        { label: 'Najstarsze', value: 'createdAt' },
        { label: 'Nazwa A-Z', value: 'name' },
        { label: 'Nazwa Z-A', value: '-name' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">
                    {params.q || params.city || params.category ? 'Wyniki wyszukiwania' : 'Wszystkie miejsca'}
                    <span className="ml-2 text-gray-400 text-lg font-normal">({places.length > 0 ? `${places.length} na tej stronie` : '0'})</span>
                </h2>
                <SortSelect options={sortOptions} />
            </div>

            <PlacesGrid places={places} />

            <div className="mt-8">
                <Pagination totalPages={totalPages} currentPage={page || 1} />
            </div>
        </div>
    );
}

export default function PlacesPage({ searchParams }: PageProps) {
    return (
        <main className="flex-grow bg-gray-50/50 pb-24">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-16 text-center lg:text-left">
                    <Breadcrumbs
                        items={[{ label: 'Miejsca' }]}
                        className="justify-center lg:justify-start mb-8"
                    />
                    <div className="flex items-center justify-center lg:justify-start gap-3 text-rose-500 font-bold uppercase tracking-widest text-sm mb-4">
                        <MapPin size={20} />
                        Baza miejsc
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        Odkryj <span className="text-rose-500">najlepsze miejsca</span> dla Twojej rodziny
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto lg:mx-0">
                        Od sal zabaw po parki edukacyjne - znajdź idealną lokalizację na spędzenie czasu z bliskimi.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:grid lg:grid-cols-[320px_1fr] gap-12">
                    {/* Sidebar */}
                    <aside className="lg:block">
                        <Suspense fallback={<FilterSidebarSkeleton />}>
                            <SidebarWrapper />
                        </Suspense>
                    </aside>

                    {/* Main Content */}
                    <div className="min-h-[400px]">
                        <Suspense fallback={<ListingGridSkeleton count={4} columns="grid-md-2 xl-grid-3" />}>
                            <ResultsWrapper searchParams={searchParams} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}
