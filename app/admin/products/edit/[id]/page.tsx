'use client';

import React, { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { luxuryColors } from '@/lib/theme';

export default function EditProductPage() {
    const params = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchProduct(params.id as string);
        }
    }, [params.id]);

    const fetchProduct = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            // Map database fields to form expectation if different
            const formatted = {
                ...data,
                image: data.image_url // map image_url to image
            };

            setProduct(formatted);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: luxuryColors.accentGold }} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <h2 className="text-lg font-semibold" style={{ color: luxuryColors.textPrimary }}>Product not found</h2>
                <Link href="/admin/products" className="text-sm mt-2 inline-block" style={{ color: luxuryColors.accentGold }}>
                    Return to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 -ml-2 rounded-lg transition-colors"
                    style={{ color: luxuryColors.textSecondary }}
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: luxuryColors.textPrimary }}>Edit Product</h1>
                    <p className="text-xs sm:text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Update product details.</p>
                </div>
            </div>

            <ProductForm initialData={product} />
        </div>
    );
}
