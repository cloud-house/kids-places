import { Skeleton } from "@/components/ui/skeleton"

export function ClassDetailSkeleton() {
    return (
        <main className="bg-gray-50 pb-24 relative animate-pulse">
            {/* Navigation / Breadcrumbs Skeleton */}
            <div className="absolute top-8 left-0 w-full z-30">
                <div className="max-w-7xl mx-auto px-6">
                    <Skeleton className="h-10 w-48 rounded-full bg-white shadow-sm" />
                </div>
            </div>

            {/* Header Area Skeleton */}
            <div className="max-w-7xl mx-auto px-6 pt-24 pb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex flex-col md:flex-row gap-6 md:items-center">
                        {/* Logo Skeleton */}
                        <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-3xl border border-gray-100 bg-white p-2">
                            <Skeleton className="w-full h-full rounded-2xl bg-gray-200" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-32 rounded-full bg-gray-200" />
                            </div>
                            <Skeleton className="h-12 md:h-16 w-64 md:w-[500px] bg-gray-200" />
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

            <div className="max-w-7xl mx-auto px-6 mt-8 grid md:grid-cols-3 gap-8">
                {/* Main Content Skeleton */}
                <div className="md:col-span-2 space-y-8">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center space-y-2">
                                <Skeleton className="h-8 w-8 rounded-full bg-gray-100" />
                                <Skeleton className="h-3 w-12 bg-gray-50" />
                                <Skeleton className="h-5 w-20 bg-gray-100" />
                            </div>
                        ))}
                    </div>

                    {/* Pricing Skeleton */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                        <Skeleton className="h-8 w-48 bg-gray-100" />
                        <div className="grid sm:grid-cols-2 gap-4">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                                    <Skeleton className="h-6 w-1/2 bg-gray-100" />
                                    <Skeleton className="h-4 w-1/3 bg-gray-100" />
                                    <Skeleton className="h-8 w-1/4 bg-rose-100" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schedule Skeleton */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                        <Skeleton className="h-8 w-40 bg-gray-100" />
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-12 h-12 rounded-full bg-gray-100" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-24 bg-gray-100" />
                                            <Skeleton className="h-3 w-32 bg-gray-50" />
                                        </div>
                                    </div>
                                    <Skeleton className="h-7 w-16 bg-rose-100" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                        <Skeleton className="h-8 w-40 bg-gray-100" />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full bg-gray-50" />
                            <Skeleton className="h-4 w-full bg-gray-50" />
                            <Skeleton className="h-4 w-3/4 bg-gray-50" />
                        </div>
                    </div>
                </div>

                {/* Sidebar Skeleton */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
                        <div className="space-y-6">
                            <Skeleton className="h-8 w-3/4 bg-gray-100" />
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full bg-gray-50" />
                                    <Skeleton className="h-10 w-full bg-gray-100 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full bg-gray-50" />
                                    <Skeleton className="h-10 w-full bg-gray-100 rounded-xl" />
                                </div>
                                <Skeleton className="h-12 w-full rounded-xl bg-indigo-500 mt-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
