import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar } from 'lucide-react';
import { Post } from '@/payload-types';

interface BlogCardProps {
    post: Post;
}

export const BlogCard = ({ post }: BlogCardProps) => {
    const heroImageUrl = typeof post.heroImage === 'object' ? post.heroImage.url : '';
    const categoryTitle = typeof post.category === 'object' ? post.category.title : '';
    const publishedDate = post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : '';

    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 block h-full flex flex-col"
        >
            <div className="relative aspect-[16/10] overflow-hidden">
                {heroImageUrl && (
                    <Image
                        src={heroImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-rose-500 shadow-sm uppercase tracking-wider">
                        {categoryTitle}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>{publishedDate}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-rose-500 transition-colors line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {post.excerpt}
                </p>

                <div className="flex items-center text-rose-500 font-bold text-sm">
                    Czytaj więcej
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
            </div>
        </Link>
    );
};
