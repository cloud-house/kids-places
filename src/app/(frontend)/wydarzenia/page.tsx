import React, { Suspense } from 'react';
import { cookies } from 'next/headers';
import { Calendar } from 'lucide-react';

import { getAttributes } from '@/features/attributes/service';
import { getCategories } from '@/features/categories/service';
import { getEvents } from '@/features/events/service';
import { getCities } from '@/features/cities/service';
import { EventCard } from '@/features/events/components/EventCard';
import { FilterSidebar } from '@/features/search/components/FilterSidebar';
import { SortSelect } from '@/features/search/components/SortSelect';
import { Pagination } from '@/components/ui/Pagination';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Event } from '@/payload-types';

export const revalidate = 1800; // 30 minutes — events change more frequently

import type { Metadata } from 'next';
import { BRAND_CONFIG } from '@/lib/config';
import { FilterSidebarSkeleton } from '@/components/skeletons/FilterSidebarSkeleton';
import { ListingGridSkeleton } from '@/components/skeletons/ListingGridSkeleton';

// Removed force-dynamic to allow streaming
// export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: `Kalendarium Wydarzeń - Atrakcje dla dzieci v okolicy | ${BRAND_CONFIG.name}`,
    description: "Odkryj najciekawsze wydarzenia, warsztaty i spotkania dla dzieci w Twojej okolicy. Sprawdź co dzieje się w mieście."
};

interface PageProps {
    searchParams: Promise<{
        q?: string;
        city?: string;
        category?: string;
        page?: string;
        sort?: string;
    }>;
}

async function SidebarWrapper() {
    const [categories, attributes, cities] = await Promise.all([
        getCategories('event'),
        getAttributes(),
        getCities()
    ]);
    return <FilterSidebar categories={categories} attributes={attributes} basePath="/wydarzenia" scope="event" cities={cities} />;
}

async function ResultsWrapper({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    const params = await searchParams;
    const currentPage = Number(Array.isArray(params.page) ? params.page[0] : params.page) || 1;
    const currentSort = (Array.isArray(params.sort) ? params.sort[0] : params.sort) || 'startDate';

    const attributeFilters: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
        if (key.startsWith('attr_') && value) {
            attributeFilters[key.replace('attr_', '')] = (Array.isArray(value) ? value[0] : value) as string;
        }
    });

    const cookieStore = await cookies();
    const globalCity = cookieStore.get('kp_city_slug')?.value;
    const requestedCity = Array.isArray(params.city) ? params.city[0] : params.city;
    const effectiveCity = requestedCity || (globalCity !== 'all' ? globalCity : undefined);

    const eventsResult = await getEvents({
        limit: 12,
        page: currentPage,
        sort: currentSort,
        q: (Array.isArray(params.q) ? params.q[0] : params.q),
        city: effectiveCity,
        categorySlug: (Array.isArray(params.category) ? params.category[0] : params.category),
        attributes: attributeFilters
    });

    const { docs: events, totalPages, page } = eventsResult;

    const sortOptions = [
        { label: 'Najbliższe', value: 'startDate' },
        { label: 'Najdalsze', value: '-startDate' },
        { label: 'Nazwa A-Z', value: 'name' },
        { label: 'Nazwa Z-A', value: '-name' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">
                    {params.q || params.city || params.category ? 'Wyniki wyszukiwania' : 'Wszystkie wydarzenia'}
                    <span className="ml-2 text-gray-400 text-lg font-normal">({events.length > 0 ? `${events.length} na tej stronie` : '0'})</span>
                </h2>
                <SortSelect options={sortOptions} defaultValue="startDate" />
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {events.map((event: Event, idx: number) => (
                    <EventCard key={event.id} event={event} idx={idx} />
                ))}

                {events.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 italic">Brak nadchodzących wydarzeń spełniających kryteria.</p>
                    </div>
                )}
            </div>

            <div className="mt-12">
                <Pagination totalPages={totalPages} currentPage={page || 1} />
            </div>
        </div>
    );
}

export default function EventsPage({ searchParams }: PageProps) {
    return (
        <main className="flex-grow bg-gray-50 pb-24">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-16 text-center lg:text-left">
                    <Breadcrumbs
                        items={[{ label: 'Wydarzenia' }]}
                        className="justify-center lg:justify-start mb-8"
                    />
                    <div className="flex items-center justify-center lg:justify-start gap-3 text-rose-500 font-bold uppercase tracking-widest text-sm mb-4">
                        <Calendar size={20} />
                        Kalendarium
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        Najciekawsze <span className="text-rose-500">wydarzenia</span> w okolicy
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto lg:mx-0">
                        Odkryj wydarzenia, warsztaty i spotkania dla dzieci w Twojej okolicy.
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
