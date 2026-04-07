import React, { Suspense } from 'react';
import { getPlaces } from '@/features/places/service';
import { getCategories } from '@/features/categories/service';
import { getAttributes } from '@/features/attributes/service';
import { getCities } from '@/features/cities/service';
import { FilterSidebar } from '@/features/search/components/FilterSidebar';
import { SortSelect } from '@/features/search/components/SortSelect';
import { Pagination } from '@/components/ui/Pagination';
import { FilterSidebarSkeleton } from '@/components/skeletons/FilterSidebarSkeleton';
import { SplitScreenClient } from './SplitScreenClient';

interface PlacesContentProps {
    searchParams: Record<string, string | string[] | undefined>;
    isPoland?: boolean;
    basePath: string;
    title: string;
    description: string;
}

async function SidebarWrapper({ basePath }: { basePath: string; isPoland?: boolean }) {
    const [categories, attributes, cities] = await Promise.all([
        getCategories('place'),
        getAttributes(),
        getCities()
    ]);
    return <FilterSidebar categories={categories} attributes={attributes} basePath={basePath} scope="place" cities={cities} />;
}

export async function PlacesContent({ searchParams, isPoland, basePath, title, description }: PlacesContentProps) {
    const currentPage = Number(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page) || 1;
    const currentSort = (Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort) || '-createdAt';

    const attributeFilters: Record<string, string> = {};
    Object.entries(searchParams).forEach(([key, value]) => {
        if (key.startsWith('attr_') && value) {
            attributeFilters[key.replace('attr_', '')] = (Array.isArray(value) ? value[0] : value) as string;
        }
    });

    const placesResult = await getPlaces({
        q: (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q),
        city: (Array.isArray(searchParams.city) ? searchParams.city[0] : searchParams.city),
        categorySlug: (Array.isArray(searchParams.category) ? searchParams.category[0] : searchParams.category),
        page: currentPage,
        sort: currentSort,
        limit: 12,
        attributes: attributeFilters,
        isPoland
    });

    const { docs: places, totalPages, page } = placesResult;

    const sortOptions = [
        { label: 'Najnowsze', value: '-createdAt' },
        { label: 'Najstarsze', value: 'createdAt' },
        { label: 'Nazwa A-Z', value: 'name' },
        { label: 'Nazwa Z-A', value: '-name' },
    ];

    return (
        <SplitScreenClient
            places={places}
            title={title}
            description={description}
            sidebar={
                <Suspense fallback={<FilterSidebarSkeleton />}>
                    <SidebarWrapper basePath={basePath} isPoland={isPoland} />
                </Suspense>
            }
            pagination={<Pagination totalPages={totalPages} currentPage={page || 1} />}
            sortSelect={<SortSelect options={sortOptions} />}
        />
    );
}
