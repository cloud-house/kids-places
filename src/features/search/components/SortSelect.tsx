'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface SortSelectProps {
    options: { label: string; value: string }[];
    defaultValue?: string;
}

export function SortSelect({ options, defaultValue }: SortSelectProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || defaultValue || options[0]?.value;

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", value);
        // Reset to page 1 when sorting changes
        params.delete("page");
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap hidden sm:inline">Sortuj:</span>
            <Select value={currentSort} onValueChange={handleValueChange}>
                <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Sortuj według" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
