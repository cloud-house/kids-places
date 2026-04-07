import { Skeleton } from "@/components/ui/skeleton"

export function PlaceDetailSkeleton() {
    return (
        <main className="bg-gray-50 pb-24 relative animate-pulse">
            {/* Navigation / Breadcrumbs Skeleton */}
            <div className="absolute top-8 left-0 w-full z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <Skeleton className="h-10 w-48 rounded-full bg-white shadow-sm" />
                </div>
            </div>

            {/* Header Area Skeleton */}
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center">
                        {/* Logo Skeleton */}
                        <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 rounded-3xl border border-gray-100 bg-white p-2">
                            <Skeleton className="w-full h-full rounded-2xl bg-gray-200" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-24 rounded-full bg-gray-200" />
                            </div>
                            <Skeleton className="h-12 md:h-16 w-64 md:w-96 bg-gray-200" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-5 w-5 rounded-full bg-gray-200" />
                                <Skeleton className="h-5 w-64 bg-gray-100" />
                            </div>
                        </div>
                    </div>

                    {/* Actions Skeleton */}
                    <div className="flex gap-3">
                        <Skeleton className="h-14 w-14 rounded-full border-2 border-rose-50 bg-white" />
                        <Skeleton className="h-14 w-14 rounded-full border-2 border-gray-50 bg-white" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-8 grid md:grid-cols-3 gap-8">
                {/* Main Content Skeleton */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4">
                        <Skeleton className="h-8 w-40 bg-gray-100" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full bg-gray-50" />
                            <Skeleton className="h-4 w-full bg-gray-50" />
                            <Skeleton className="h-4 w-3/4 bg-gray-50" />
                        </div>
                    </div>

                    {/* Map Skeleton */}
                    <div className="bg-white rounded-3xl p-0 overflow-hidden shadow-sm h-80 relative border border-gray-100">
                        <Skeleton className="w-full h-full bg-gray-200" />
                        <div className="absolute bottom-4 left-4">
                            <Skeleton className="h-10 w-48 rounded-xl bg-white/90" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6">
                        <Skeleton className="h-8 w-60 bg-gray-100" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-10 w-full rounded-xl bg-gray-50" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-8">
                        <div className="space-y-6">
                            <Skeleton className="h-8 w-1/2 bg-gray-100" />
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full rounded-2xl bg-gray-50" />
                                <Skeleton className="h-12 w-full rounded-2xl bg-gray-50" />
                            </div>
                        </div>
                        <div className="pt-8 border-t border-gray-100 space-y-4">
                            <Skeleton className="h-8 w-1/2 bg-gray-100" />
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <Skeleton className="h-4 w-20 bg-gray-50" />
                                    <Skeleton className="h-4 w-24 bg-gray-50" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
