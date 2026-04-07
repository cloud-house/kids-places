import React from 'react';
import { getPosts } from '@/features/blog/service';
import { BlogCard } from './BlogCard';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const LatestArticles = async () => {
    const { docs: posts } = await getPosts({ limit: 3 });

    if (!posts || posts.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            Aktualności i <span className="text-rose-500">inspiracje</span>
                        </h2>
                        <p className="text-lg text-gray-500 font-medium">
                            Czytaj najnowsze artykuły z naszego bloga. Szukaj inspiracji na spędzanie czasu z Twoimi dziećmi.
                        </p>
                    </div>
                    <Link
                        href="/blog"
                        className="group inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-100 px-6 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
                    >
                        Zobacz wszystkie artykuły
                        <ChevronRight size={18} className="text-rose-500 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
};
