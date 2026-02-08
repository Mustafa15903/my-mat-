import React from 'react';
import ProductForm from '@/components/admin/ProductForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { luxuryColors } from '@/lib/theme';

export default function AddProductPage() {
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
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: luxuryColors.textPrimary }}>Add New Product</h1>
                    <p className="text-xs sm:text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Create a new product for your store.</p>
                </div>
            </div>

            <ProductForm />
        </div>
    );
}
