import { getPosts, getPostCategories } from '@/features/blog/service';
import { BlogCard } from '@/features/blog/components/BlogCard';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { BRAND_CONFIG } from '@/lib/config';

export const metadata = {
    title: `Blog - Inspiracje dla rodzin | ${BRAND_CONFIG.name}`,
    description: 'Artykuły, porady i inspiracje dla rodziców. Odkryj najlepsze miejsca i zajęcia dla dzieci.',
};

interface PageProps {
    searchParams: Promise<{
        category?: string;
        page?: string;
    }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const categorySlug = params.category;
    const page = parseInt(params.page || '1');

    const { docs: posts, totalPages } = await getPosts({
        categorySlug,
        page,
        limit: 9
    });

    const categories = await getPostCategories();

    return (
        <main className="flex-grow bg-gray-50/50 pb-24">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-16 text-center lg:text-left">
                    <Breadcrumbs
                        items={[{ label: 'Blog' }]}
                        className="justify-center lg:justify-start mb-8"
                    />
                    <div className="flex items-center justify-center lg:justify-start gap-3 text-rose-500 font-bold uppercase tracking-widest text-sm mb-4">
                        <BookOpen size={20} />
                        Blog & Inspiracje
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        Inspiracje dla <span className="text-rose-500">aktywnych rodzin</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto lg:mx-0">
                        Odkrywaj nowe miejsca, poznawaj wartościowe zajęcia i czytaj porady naszych ekspertów.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* Categories Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    <Link
                        href="/blog"
                        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${!categorySlug
                            ? 'bg-rose-500 text-white shadow-rose-200'
                            : 'bg-white text-gray-600 hover:text-rose-500 border border-gray-100'
                            }`}
                    >
                        Wszystkie
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/blog?category=${cat.slug}`}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${categorySlug === cat.slug
                                ? 'bg-rose-500 text-white shadow-rose-200'
                                : 'bg-white text-gray-600 hover:text-rose-500 border border-gray-100'
                                }`}
                        >
                            {cat.title}
                        </Link>
                    ))}
                </div>

                {posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                        <p className="text-gray-400 text-lg">Nie znaleziono jeszcze żadnych artykułów.</p>
                    </div>
                )}

                {/* Pagination (Simplified) */}
                {totalPages > 1 && (
                    <div className="mt-16 flex justify-center gap-4">
                        {/* Add pagination logic if needed */}
                    </div>
                )}
            </div>
        </main>
    );
}
