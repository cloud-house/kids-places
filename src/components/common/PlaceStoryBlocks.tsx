'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { RichText } from '@/components/RichText'
import { LexicalRichText } from '@/components/RichText/types'
import { Media } from '@/payload-types'

type StoryTextBlock = {
    blockType: 'storyText'
    content: LexicalRichText
    id?: string | null
}

type StoryImageBlock = {
    blockType: 'storyImage'
    image: number | Media
    caption?: string | null
    size?: 'full' | 'centered' | null
    id?: string | null
}

type StoryGalleryBlock = {
    blockType: 'storyGallery'
    images?: { image: number | Media; id?: string | null }[] | null
    caption?: string | null
    id?: string | null
}

type StoryBlock = StoryTextBlock | StoryImageBlock | StoryGalleryBlock

function getImageUrl(image: number | Media | null | undefined): string | null {
    if (!image || typeof image === 'number') return null
    return (image as Media).url ?? null
}

const StoryTextRenderer: React.FC<{ block: StoryTextBlock }> = ({ block }) => (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
        <RichText content={block.content} className="text-gray-700 leading-relaxed text-lg" />
    </div>
)

const StoryImageRenderer: React.FC<{ block: StoryImageBlock }> = ({ block }) => {
    const url = getImageUrl(block.image)
    if (!url) return null
    const isCentered = block.size === 'centered'

    return (
        <div className={isCentered ? 'flex flex-col items-center' : ''}>
            <div
                className={`relative overflow-hidden rounded-3xl shadow-sm ${isCentered ? 'w-full max-w-2xl' : 'w-full'}`}
                style={{ aspectRatio: '16/9' }}
            >
                <Image
                    src={url}
                    alt={block.caption || ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
                />
            </div>
            {block.caption && (
                <p className="mt-3 text-sm text-gray-500 text-center italic">{block.caption}</p>
            )}
        </div>
    )
}

const StoryGalleryRenderer: React.FC<{ block: StoryGalleryBlock }> = ({ block }) => {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

    const validImages = (block.images || [])
        .map(item => getImageUrl(item.image))
        .filter((url): url is string => !!url)

    if (validImages.length === 0) return null

    const prev = () => setLightboxIndex(i => (i !== null ? (i - 1 + validImages.length) % validImages.length : 0))
    const next = () => setLightboxIndex(i => (i !== null ? (i + 1) % validImages.length : 0))

    React.useEffect(() => {
        if (lightboxIndex === null) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setLightboxIndex(null)
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [lightboxIndex])

    const cols = validImages.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'

    return (
        <div>
            <div className={`grid ${cols} gap-2`}>
                {validImages.map((url, i) => (
                    <div
                        key={i}
                        className="relative overflow-hidden rounded-2xl cursor-pointer group"
                        style={{ aspectRatio: '4/3' }}
                        onClick={() => setLightboxIndex(i)}
                    >
                        <Image
                            src={url}
                            alt={block.caption || `Zdjęcie ${i + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    </div>
                ))}
            </div>
            {block.caption && (
                <p className="mt-3 text-sm text-gray-500 text-center italic">{block.caption}</p>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
                    onClick={() => setLightboxIndex(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                        onClick={() => setLightboxIndex(null)}
                        aria-label="Zamknij"
                    >
                        <X size={24} />
                    </button>
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                        onClick={e => { e.stopPropagation(); prev() }}
                        aria-label="Poprzednie"
                    >
                        <ChevronLeft size={28} />
                    </button>
                    <div
                        className="relative w-full max-w-4xl mx-16"
                        style={{ aspectRatio: '16/9' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <Image
                            src={validImages[lightboxIndex]}
                            alt=""
                            fill
                            className="object-contain"
                            sizes="90vw"
                        />
                    </div>
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                        onClick={e => { e.stopPropagation(); next() }}
                        aria-label="Następne"
                    >
                        <ChevronRight size={28} />
                    </button>
                    <span className="absolute bottom-4 text-white/60 text-sm">
                        {lightboxIndex + 1} / {validImages.length}
                    </span>
                </div>
            )}
        </div>
    )
}

interface PlaceStoryBlocksProps {
    blocks: StoryBlock[]
}

export const PlaceStoryBlocks: React.FC<PlaceStoryBlocksProps> = ({ blocks }) => {
    if (!blocks || blocks.length === 0) return null

    return (
        <div className="space-y-6">
            {blocks.map((block, i) => {
                switch (block.blockType) {
                    case 'storyText':
                        return <StoryTextRenderer key={block.id || i} block={block} />
                    case 'storyImage':
                        return <StoryImageRenderer key={block.id || i} block={block} />
                    case 'storyGallery':
                        return <StoryGalleryRenderer key={block.id || i} block={block} />
                    default:
                        return null
                }
            })}
        </div>
    )
}
