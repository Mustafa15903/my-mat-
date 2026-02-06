'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ImageUpload from './ImageUpload';
import { Loader2 } from 'lucide-react';

interface ProductFormProps {
    initialData?: {
        id?: number;
        name: string;
        price: number;
        image: string;
        category: string;
        description: string;
    };
}

export default function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        price: initialData?.price || '',
        image: initialData?.image || '',
        category: initialData?.category || 'Modern',
        description: initialData?.description || '',
    });

    const categories = ['Persian', 'Modern', 'Turkish', 'Shag', 'Moroccan', 'Jute', 'Kids'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const productData = {
                name: formData.name,
                price: Number(formData.price),
                image_url: formData.image, // Supabase column name
                category: formData.category,
                description: formData.description,
            };

            if (initialData?.id) {
                // Update existing
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', initialData.id);

                if (error) throw error;
            } else {
                // Create new
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);

                if (error) throw error;
            }

            router.push('/admin/products');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl bg-white dark:bg-zinc-950 p-6 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <div className="space-y-6">
                <div>
                    <h2 className="text-lg font-medium">Product Details</h2>
                    <p className="text-sm text-gray-500">Provide the basic information about the product.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. Royal Persian Rug"
                        />
                    </div>

                    {/* Price & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Price ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Describe the product..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Image</label>
                        <ImageUpload
                            defaultImage={formData.image}
                            onUpload={(url) => setFormData({ ...formData, image: url })}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-zinc-800">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-gray-300 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {initialData ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}
