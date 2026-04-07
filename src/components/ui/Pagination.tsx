'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
    totalPages: number;
    currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        router.push(createPageURL(page));
    };

    if (totalPages <= 1) return null;

    // Logic to show limited page numbers (e.g. 1 ... 4 5 6 ... 10)
    const getVisiblePages = () => {
        const delta = 1; // Number of pages to show on each side of current page
        const range = [];
        const rangeWithDots = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        let l;
        for (const i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Poprzednia strona"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2">
                {visiblePages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`dots-${index}`} className="text-gray-400 px-2">
                                ...
                            </span>
                        );
                    }

                    return (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            onClick={() => handlePageChange(Number(page))}
                            className={currentPage === page ? "bg-rose-500 hover:bg-rose-600 border-rose-500" : ""}
                        >
                            {page}
                        </Button>
                    );
                })}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Następna strona"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
