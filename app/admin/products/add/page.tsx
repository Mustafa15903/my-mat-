import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
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
                    <h1 className="text-2xl font-bold tracking-tight">Add New Product</h1>
                    <p className="text-gray-500 dark:text-gray-400">Create a new product for your store.</p>
                </div>
            </div>

            <ProductForm />
        </div>
    );
}
