'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { uploadMediaAction, getMediaAction } from '@/actions/media'
import { toast } from 'sonner'
import Image from 'next/image'
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
    value?: string | number | null
    onChange: (value: string | number | undefined) => void
    label?: string
    aspectRatio?: 'video' | 'square' | 'auto' | 'portrait'
    objectFit?: 'cover' | 'contain'
}

export function ImageUpload({
    value,
    onChange,
    label = "Zdjęcie główne",
    aspectRatio = 'video',
    objectFit = 'contain'
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [lastLoadedValue, setLastLoadedValue] = useState<string | number | null | undefined>(undefined)

    useEffect(() => {
        const fetchPreview = async () => {
            // Only fetch if value exists, is different from last loaded, and we don't have a preview
            if (value && value !== lastLoadedValue) {
                setLoading(true)
                try {
                    const res = await getMediaAction(value)
                    if (res.success && res.url) {
                        setPreview(res.url)
                        setLastLoadedValue(value)
                    }
                } catch (error) {
                    console.error('Failed to fetch preview:', error)
                } finally {
                    setLoading(false)
                }
            } else if (!value) {
                // If value is cleared, make sure preview is also cleared
                setPreview(null)
                setLastLoadedValue(undefined)
            }
        }
        fetchPreview()
    }, [value, lastLoadedValue])

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLoading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await uploadMediaAction(formData)

            if (res.success && res.id) {
                onChange(res.id)
                setLastLoadedValue(res.id) // Mark as loaded so useEffect doesn't refetch
                if (res.url) {
                    setPreview(res.url)
                } else {
                    setPreview(URL.createObjectURL(file))
                }
                toast.success('Zdjęcie przesłane')
            } else {
                toast.error(res.error || 'Błąd przesyłania')
            }
        } catch (error) {
            console.error('ImageUpload error:', error)
            toast.error('Wystąpił błąd: ' + (error instanceof Error ? error.message : 'Nieoczekiwany błąd serwera'))
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange(undefined)
        setPreview(null)
        setLastLoadedValue(undefined)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        fileInputRef.current?.click()
    }

    return (
        <div className="space-y-3">
            {label && (
                <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
            )}

            <div className="relative group">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={loading}
                />

                {!value && !preview ? (
                    <div
                        onClick={handleButtonClick}
                        className={`
                            border-2 border-dashed rounded-3xl 
                            flex flex-col items-center justify-center 
                            cursor-pointer transition-all duration-300
                            ${aspectRatio === 'video' ? 'aspect-video p-8' : aspectRatio === 'square' ? 'aspect-square p-8' : aspectRatio === 'portrait' ? 'aspect-[3/4] p-8' : 'min-h-[120px] p-4'}
                            bg-gray-50/50
                            ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-rose-300 hover:bg-rose-50/30'}
                            ${loading ? 'border-gray-200' : 'border-gray-200'}
                        `}
                    >
                        {loading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
                                <p className="text-[10px] font-bold text-rose-500 animate-pulse">Przesyłanie...</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                                    <Upload className="h-5 w-5 text-rose-500" />
                                </div>
                                <p className="text-xs font-bold text-gray-600">Kliknij lub przeciągnij zdjęcie</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG do 5MB</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className={`
                        relative w-full rounded-[2rem] overflow-hidden border-2 border-white shadow-xl ring-1 ring-gray-100 group bg-gray-50
                        ${aspectRatio === 'video' ? 'aspect-video' : aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'h-[120px]'}
                    `}>
                        {preview ? (
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className={`
                                    transition-transform duration-500 group-hover:scale-105
                                    ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}
                                `}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-gray-400">
                                <ImageIcon className="h-12 w-12 mb-2 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-widest opacity-50">Zdjęcie przesłane</p>
                                <p className="text-[10px] mt-1 opacity-30">ID: {value}</p>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 md:gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="rounded-xl font-bold bg-white/90 hover:bg-white text-gray-900 border-none shadow-lg h-8 md:h-9 px-3 md:px-4"
                                onClick={handleButtonClick}
                                disabled={loading}
                            >
                                <Upload className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-2" />
                                <span className="text-[10px] md:text-sm">Zmień</span>
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="rounded-xl font-bold border-none shadow-lg h-8 md:h-9 px-3 md:px-4"
                                onClick={handleRemove}
                                disabled={loading}
                            >
                                <X className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-2" />
                                <span className="text-[10px] md:text-sm">Usuń</span>
                            </Button>
                        </div>

                        {loading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
