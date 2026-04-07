import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("mb-4", className)}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5">
                <li className="inline-flex items-center gap-1.5">
                    <Link
                        href="/"
                        className="transition-colors hover:text-foreground flex items-center gap-1.5"
                    >
                        <Home size={16} />
                        <span className="sr-only">Strona główna</span>
                    </Link>
                </li>
                {items.map((item) => (
                    <li key={item.label} className="inline-flex items-center gap-1.5">
                        <ChevronRight size={16} className="text-muted-foreground/50" />
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="transition-colors hover:text-foreground font-medium"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-normal text-foreground" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
