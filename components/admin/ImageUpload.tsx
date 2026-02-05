'use client';

import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImageUploadProps {
    onUpload: (url: string) => void;
    defaultImage?: string;
}

export default function ImageUpload({ onUpload, defaultImage }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(defaultImage || null);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('products-images')
                .getPublicUrl(filePath);

            setPreview(data.publicUrl);
            onUpload(data.publicUrl);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onUpload('');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
                {preview ? (
                    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 dark:border-zinc-700">
                        <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                        <button
                            onClick={removeImage}
                            type="button"
                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploading ? (
                                <Loader2 className="w-8 h-8 text-gray-500 animate-spin mb-3" />
                            ) : (
                                <Upload className="w-8 h-8 text-gray-400 mb-3" />
                            )}
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 2MB)
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={uploadImage}
                            disabled={uploading}
                        />
                    </label>
                )}
            </div>
            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
