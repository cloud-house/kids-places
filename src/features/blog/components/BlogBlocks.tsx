import React from 'react';
import { RichText } from '@/components/RichText';
import { PlaceCard } from '@/features/places/components/PlaceCard';
import { EventCard } from '@/features/events/components/EventCard';
import { BlogPlaceCard } from '@/features/blog/components/BlogPlaceCard';
import { BlogEventCard } from '@/features/blog/components/BlogEventCard';
import Link from 'next/link';

interface BlogBlock {
    id?: string | null;
    blockType: 'richText' | 'banner' | 'relatedItems';
    content?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    style?: 'rose' | 'blue' | 'dark' | null;
    title?: string | null;
    description?: string | null;
    link?: string | null;
    buttonLabel?: string | null;
    items?: Array<{
        relationTo: 'places' | 'events';
        value: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    }>;
}

interface BlogBlocksProps {
    blocks: BlogBlock[];
}

export const BlogBlocks = ({ blocks }: BlogBlocksProps) => {
    if (!blocks) return null;

    let relatedItemsCounter = 0;

    return (
        <div className="space-y-16 md:space-y-24">
            {blocks.map((block, index) => {
                const key = block.id || `block-${index}`;
                switch (block.blockType) {
                    case 'richText':
                        return (
                            <div key={key} className="prose prose-lg max-w-none prose-rose prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-img:rounded-[2.5rem] prose-img:shadow-xl">
                                <RichText content={block.content} />
                            </div>
                        );

                    case 'banner':
                        return (
                            <div
                                key={key}
                                className={`rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-white shadow-2xl ${block.style === 'blue' ? 'bg-blue-600 shadow-blue-200' :
                                    block.style === 'dark' ? 'bg-gray-900 shadow-gray-200' :
                                        'bg-rose-500 shadow-rose-200'
                                    }`}
                            >
                                <div className="relative z-10 max-w-2xl">
                                    <h3 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">{block.title}</h3>
                                    {block.description && (
                                        <p className="text-white/90 text-lg md:text-xl mb-10 leading-relaxed font-medium">
                                            {block.description}
                                        </p>
                                    )}
                                    {block.link && (
                                        <Link
                                            href={block.link}
                                            className="inline-flex items-center gap-3 bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl hover:shadow-2xl"
                                        >
                                            {block.buttonLabel || 'Dowiedz się więcej'}
                                            <span className="text-xl">→</span>
                                        </Link>
                                    )}
                                </div>
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4"></div>
                            </div>
                        );

                    case 'relatedItems': {
                        const itemsCount = block.items?.length || 0;
                        const isEditorial = itemsCount <= 2;
                        const currentBlockIndex = relatedItemsCounter;
                        relatedItemsCounter += itemsCount;

                        return (
                            <div key={key} className="space-y-10">
                                {block.title && <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">{block.title}</h3>}
                                <div className={isEditorial ? "space-y-10" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"}>
                                    {block.items?.map((item, i) => {
                                        const type = item.relationTo;
                                        const data = item.value;
                                        const itemId = data?.id || `item-${i}`;

                                        if (isEditorial) {
                                            if (type === 'places') return <BlogPlaceCard key={itemId} place={data} idx={currentBlockIndex + i} />;
                                            if (type === 'events') return <BlogEventCard key={itemId} event={data} idx={currentBlockIndex + i} />;
                                        } else {
                                            if (type === 'places') return <PlaceCard key={itemId} place={data} idx={i} />;
                                            if (type === 'events') return <EventCard key={itemId} event={data} />;
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        );
                    }

                    default:
                        return null;
                }
            })}
        </div>
    );
};
