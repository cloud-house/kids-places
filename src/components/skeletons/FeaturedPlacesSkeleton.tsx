import { Skeleton } from "@/components/ui/skeleton"

export function FeaturedPlacesSkeleton() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 flex flex-col items-center">
                    <Skeleton className="h-4 w-32 mb-4" />
                    <Skeleton className="h-10 w-80 mb-6" />
                    <Skeleton className="h-4 w-[600px]" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-full">
                            <Skeleton className="aspect-[4/3] w-full rounded-2xl mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <div className="flex justify-between items-center">
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
