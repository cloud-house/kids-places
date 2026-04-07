import { Skeleton } from "@/components/ui/skeleton"

export function UpcomingEventsSectionSkeleton() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <Skeleton className="h-4 w-32 mb-4" />
                        <Skeleton className="h-10 w-72 mb-4" />
                        <Skeleton className="h-4 w-[500px]" />
                    </div>
                    <Skeleton className="h-6 w-48" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-full bg-white rounded-2xl p-4">
                            <div className="flex gap-4 mb-4">
                                <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
                                <div className="flex-1">
                                    <Skeleton className="h-5 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-full mb-2" />
                            <div className="flex justify-between mt-4">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
