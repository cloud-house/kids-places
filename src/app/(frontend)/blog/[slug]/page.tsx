import React from 'react';
import { getPostBySlug } from '@/features/blog/service';
import { notFound } from 'next/navigation';

import Image from 'next/image';
import { Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { BlogBlocks } from '@/features/blog/components/BlogBlocks';
import { BRAND_CONFIG } from '@/lib/config';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return {};

    return {
        title: `${post.title} - Blog ${BRAND_CONFIG.name}`,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) notFound();

    const heroImageUrl = typeof post.heroImage === 'object' ? post.heroImage.url : '';
    const category = typeof post.category === 'object' ? post.category : null;
    const publishedDate = post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : '';

    return (
        <main className="bg-white pb-24">
            {/* Hero Header */}
            <div className="relative h-[60vh] min-h-[400px] w-full mb-12">
                {heroImageUrl && (
                    <Image
                        src={heroImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-end pb-16">
                    <div className="max-w-4xl mx-auto px-6 w-full">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors text-sm font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl"
                        >
                            <ChevronLeft size={16} />
                            Powrót do bloga
                        </Link>

                        <div className="flex flex-wrap gap-4 items-center mb-6">
                            {category && (
                                <span className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {category.title}
                                </span>
                            )}
                            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                                <Calendar size={16} />
                                <span>{publishedDate}</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6">
                {/* Intro / Excerpt */}
                <div className="mb-16">
                    <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed italic border-l-4 border-rose-500 pl-8">
                        {post.excerpt}
                    </p>
                </div>

                {/* Content Sections */}
                <BlogBlocks blocks={post.content} />

                {/* Footer of the post */}
                <div className="mt-24 pt-12 border-t border-gray-100 text-center">
                    <h4 className="text-2xl font-bold mb-8">Spodobał Ci się ten artykuł?</h4>
                    <p className="text-gray-500 mb-10">Zapisz się do newslettera, aby otrzymywać więcej inspiracji prosto na swoją skrzynkę.</p>
                    <Link
                        href="/#newsletter"
                        className="inline-flex items-center gap-2 bg-rose-500 text-white px-10 py-5 rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-xl shadow-rose-200"
                    >
                        Zapisz się
                    </Link>
                </div>
            </div>
        </main>
    );
}
