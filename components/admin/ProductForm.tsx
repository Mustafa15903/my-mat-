'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ImageUpload from './ImageUpload';
import { Loader2 } from 'lucide-react';
import { luxuryColors } from '@/lib/theme';

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
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-2xl p-4 sm:p-6 rounded-xl shadow-sm" style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}>
            <div className="space-y-6">
                <div>
                    <h2 className="text-base sm:text-lg font-semibold" style={{ color: luxuryColors.textPrimary }}>Product Details</h2>
                    <p className="text-xs sm:text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Provide the basic information about the product.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: luxuryColors.textPrimary }}>Product Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 transition-all"
                            style={{
                                backgroundColor: luxuryColors.bgLight,
                                border: `1px solid ${luxuryColors.border}`,
                                color: luxuryColors.textPrimary,
                            }}
                            placeholder="e.g. Royal Persian Rug"
                        />
                    </div>

                    {/* Price & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: luxuryColors.textPrimary }}>Price ($)</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 transition-all"
                                style={{
                                    backgroundColor: luxuryColors.bgLight,
                                    border: `1px solid ${luxuryColors.border}`,
                                    color: luxuryColors.textPrimary,
                                }}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: luxuryColors.textPrimary }}>Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 transition-all appearance-none"
                                style={{
                                    backgroundColor: luxuryColors.bgLight,
                                    border: `1px solid ${luxuryColors.border}`,
                                    color: luxuryColors.textPrimary,
                                }}
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: luxuryColors.textPrimary }}>Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 transition-all resize-none"
                            style={{
                                backgroundColor: luxuryColors.bgLight,
                                border: `1px solid ${luxuryColors.border}`,
                                color: luxuryColors.textPrimary,
                            }}
                            placeholder="Describe the product..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: luxuryColors.textPrimary }}>Product Image</label>
                        <ImageUpload
                            defaultImage={formData.image}
                            onUpload={(url) => setFormData({ ...formData, image: url })}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-3 sm:p-4 rounded-lg text-xs sm:text-sm" style={{ backgroundColor: `${luxuryColors.error}15`, color: luxuryColors.error }}>
                    {error}
                </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sm:pt-6" style={{ borderTop: `1px solid ${luxuryColors.border}` }}>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2.5 text-sm font-medium rounded-lg transition-all"
                    style={{ color: luxuryColors.textSecondary, backgroundColor: `${luxuryColors.border}40` }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all hover:shadow-md disabled:opacity-50"
                    style={{ backgroundColor: luxuryColors.textPrimary, color: luxuryColors.bgLight }}
                >
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {initialData ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}
