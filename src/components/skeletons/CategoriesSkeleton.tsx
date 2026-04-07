import { Skeleton } from "@/components/ui/skeleton"

export function CategoriesSkeleton() {
    return (
        <section className="py-20 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <Skeleton className="h-8 w-64 mb-4" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <Skeleton className="h-6 w-32 hidden sm:block" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-square">
                            <Skeleton className="w-full h-full rounded-3xl" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
