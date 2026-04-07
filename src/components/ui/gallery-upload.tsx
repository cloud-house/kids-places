import React, { useRef, useState } from 'react';
import { ImageUpload } from './image-upload';
import { Plus, Loader2 } from 'lucide-react';
import { uploadMediaAction } from '@/actions/media';
import { toast } from 'sonner';

interface GalleryUploadProps {
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    label?: string;
    maxImages?: number;
    disabled?: boolean;
}

export function GalleryUpload({
    value = [],
    onChange,
    label = "Galeria zdjęć",
    maxImages = 8,
    disabled = false
}: GalleryUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (index: number, imageId: string | number | undefined) => {
        const newValue = [...value];
        if (imageId) {
            newValue[index] = imageId;
        } else {
            newValue.splice(index, 1);
        }
        onChange(newValue);
    };

    const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - value.length;
        if (remainingSlots <= 0) {
            toast.error(`Osiągnięto limit ${maxImages} zdjęć.`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        if (files.length > remainingSlots) {
            toast.warning(`Wybrano zbyt wiele plików. Tylko pierwsze ${remainingSlots} zostanie przesłanych.`);
        }

        setUploading(true);
        const newIds: (string | number)[] = [...value];

        try {
            for (const file of filesToUpload) {
                const formData = new FormData();
                formData.append('file', file);

                const res = await uploadMediaAction(formData);
                if (res.success && res.id) {
                    newIds.push(res.id);
                    // Update state after EACH successful upload for better feedback
                    onChange([...newIds]);
                } else {
                    toast.error(`Błąd przesyłania ${file.name}: ${res.error}`);
                }
            }
            toast.success('Dodano zdjęcia do galerii');
        } catch (error) {
            console.error('Multi-upload error:', error);
            toast.error('Wystąpił błąd podczas przesyłania zdjęć.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            {label && (
                <label className="text-sm font-bold text-gray-700 ml-1">{label}</label>
            )}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFilesSelect}
                disabled={disabled || uploading}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {value.map((id, index) => (
                    <div key={`${id}-${index}`} className="relative group">
                        <ImageUpload
                            value={id}
                            onChange={(newId) => handleImageChange(index, newId)}
                            label=""
                            aspectRatio="square"
                        />
                    </div>
                ))}

                {!disabled && value.length < maxImages && (
                    <button
                        type="button"
                        onClick={triggerUpload}
                        disabled={uploading}
                        className="aspect-square border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-rose-300 hover:bg-rose-50/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                                <span className="text-[10px] font-bold text-rose-500 animate-pulse">Przesyłanie...</span>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="text-rose-500" size={24} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 px-2 text-center text-balance">Dodaj zdjęcia</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {!disabled && (
                <p className="text-xs text-gray-400 mt-2 italic">
                    Możesz dodać do {maxImages} zdjęć do swojej galerii. Pierwsze zdjęcie w galerii będzie widoczne jako drugie po zdjęciu głównym. Możesz zaznaczyć kilka plików naraz.
                </p>
            )}
        </div>
    );
}
