import { Skeleton } from "@/components/ui/skeleton"

export function ListingGridSkeleton({ count = 6, columns = "grid-md-2 xl-grid-3" }: { count?: number, columns?: string }) {
    return (
        <div className={`grid gap-8 ${columns === "grid-md-2 xl-grid-3" ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"
            }`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="h-[400px] border border-gray-100 rounded-3xl p-4 space-y-4">
                    <Skeleton className="aspect-video w-full rounded-2xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <Skeleton className="h-10 w-24 rounded-full" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            ))}
        </div>
    )
}
