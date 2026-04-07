export const revalidate = 3600; // 1 hour

import { Suspense } from 'react';
import { getPayloadClient } from '@/lib/payload-client';
import { headers } from 'next/headers';

import { Hero } from '@/components/sections/home/Hero';
import { CategoriesGrid } from '@/features/categories/components/CategoriesGrid';
import { FeaturedPlaces } from '@/features/places/components/FeaturedPlaces';
import { BusinessSection } from '@/components/sections/home/BusinessSection';
import { Newsletter } from '@/components/sections/home/Newsletter';
import { LatestArticles } from '@/features/blog/components/LatestArticles';
import { UpcomingEventsSection } from '@/features/events/components/UpcomingEvents';

import { getCategories } from '@/features/categories/service';
import { getEvents } from '@/features/events/service';
import { getFeaturedPlaces } from '@/features/places/service';
import { getPricingPlans } from '@/features/pricing/service';

import { CategoriesSkeleton } from '@/components/skeletons/CategoriesSkeleton';
import { FeaturedPlacesSkeleton } from '@/components/skeletons/FeaturedPlacesSkeleton';
import { UpcomingEventsSectionSkeleton } from '@/components/skeletons/UpcomingEventsSectionSkeleton';

// Allow caching with revalidation, but headers() usage will make it dynamic on demand
// export const dynamic = 'force-dynamic' // Removed to allow optimization

async function CategoriesSection() {
  const categories = await getCategories('place', true);
  return <CategoriesGrid categories={categories} />;
}

async function FeaturedPlacesSection() {
  const places = await getFeaturedPlaces();
  return <FeaturedPlaces places={places} />;
}

async function UpcomingEventsSectionWrapper() {
  const { docs: upcomingEvents } = await getEvents({ limit: 4 });
  return <UpcomingEventsSection events={upcomingEvents} />;
}

async function BusinessSectionWrapper() {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  const plans = await getPricingPlans();
  const freePlan = plans.find(p => p.planPrice_recurring === 0 || p.planPrice_onetime === 0);

  return <BusinessSection isLoggedIn={!!user} freePlanId={freePlan?.id} />;
}

export default function Home() {
  return (
    <main>
      <Hero />

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>

      <Suspense fallback={<FeaturedPlacesSkeleton />}>
        <FeaturedPlacesSection />
      </Suspense>

      <Suspense fallback={<UpcomingEventsSectionSkeleton />}>
        <UpcomingEventsSectionWrapper />
      </Suspense>

      <Suspense fallback={<div className="h-96 bg-gray-50 animate-pulse" />}>
        <BusinessSectionWrapper />
      </Suspense>

      <LatestArticles />
      <Newsletter />
    </main>
  );
}
