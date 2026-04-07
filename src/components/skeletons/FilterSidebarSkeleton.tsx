import { Skeleton } from "@/components/ui/skeleton"

export function FilterSidebarSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Search Mock */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* City Mock */}
            <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-12 w-full rounded-xl" />
            </div>

            {/* Categories Mock */}
            <div className="space-y-3">
                <Skeleton className="h-5 w-28" />
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-5 w-5 rounded" />
                            <Skeleton className="h-4 flex-1" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Attributes Groups Mock */}
            {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-3 pt-4 border-t border-gray-100">
                    <Skeleton className="h-5 w-32" />
                    <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, j) => (
                            <div key={j} className="flex items-center gap-3">
                                <Skeleton className="h-5 w-5 rounded" />
                                <Skeleton className="h-4 flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
