'use client';

import React, { useEffect, useState } from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

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
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-zinc-800"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
                    <p className="text-gray-500 dark:text-gray-400">Update product details.</p>
                </div>
            </div>

            <ProductForm initialData={product} />
        </div>
    );
}
