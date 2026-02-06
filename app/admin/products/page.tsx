'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { luxuryColors } from '@/lib/theme';

// Prevent static generation - this page needs runtime environment variables
export const dynamic = 'force-dynamic';

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!window.confirm(`Delete "${name}"?`)) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Product deleted successfully!');
            // Refresh list
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: luxuryColors.textPrimary }}>Products</h1>
                    <p className="text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Manage your product catalog</p>
                </div>
                <Link
                    href="/admin/products/add"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 sm:py-2 rounded-lg hover:shadow-md transition-all font-medium text-sm whitespace-nowrap"
                    style={{ backgroundColor: luxuryColors.textPrimary, color: luxuryColors.bgLight }}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Link>
            </div>

            {/* Search and Filter */}
            <div className="p-3 sm:p-4 rounded-xl" style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: luxuryColors.textSecondary }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                            backgroundColor: luxuryColors.bgLight,
                            border: `1px solid ${luxuryColors.border}`,
                            color: luxuryColors.textPrimary,
                        }}
                    />
                </div>
            </div>

            {/* Products List/Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: luxuryColors.accentGold }} />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="p-12 text-center rounded-xl" style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}`, color: luxuryColors.textSecondary }}>
                    No products found. Add your first one!
                </div>
            ) : (
                <>
                    {/* Mobile Card View (hidden on sm and up) */}
                    <div className="grid grid-cols-1 gap-4 sm:hidden">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="p-4 rounded-xl shadow-sm space-y-4"
                                style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: luxuryColors.border }}>
                                        {product.image_url && (
                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold truncate" style={{ color: luxuryColors.textPrimary }}>{product.name}</h3>
                                        <p className="text-xs" style={{ color: luxuryColors.textSecondary }}>{product.category}</p>
                                        <p className="text-sm font-bold mt-1" style={{ color: luxuryColors.accentGold }}>${product.price}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2 border-t" style={{ borderColor: luxuryColors.border }}>
                                    <Link
                                        href={`/admin/products/edit/${product.id}`}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                                        style={{ color: luxuryColors.accentGold, backgroundColor: `${luxuryColors.accentGold}10` }}
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id, product.name)}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                                        style={{ color: luxuryColors.error, backgroundColor: `${luxuryColors.error}10` }}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View (hidden on mobile) */}
                    <div className="hidden sm:block rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead style={{ backgroundColor: `${luxuryColors.border}20`, borderBottom: `1px solid ${luxuryColors.border}` }}>
                                    <tr>
                                        <th className="px-6 py-4 font-medium" style={{ color: luxuryColors.textSecondary }}>Product</th>
                                        <th className="px-6 py-4 font-medium" style={{ color: luxuryColors.textSecondary }}>Category</th>
                                        <th className="px-6 py-4 font-medium" style={{ color: luxuryColors.textSecondary }}>Price</th>
                                        <th className="px-6 py-4 font-medium text-right" style={{ color: luxuryColors.textSecondary }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody style={{ borderColor: luxuryColors.border }}>
                                    {filteredProducts.map((product, index) => (
                                        <tr
                                            key={product.id}
                                            className="transition-colors hover:shadow-sm"
                                            style={{
                                                borderBottom: `1px solid ${luxuryColors.border}`,
                                                backgroundColor: index % 2 === 0 ? 'transparent' : `${luxuryColors.border}08`
                                            }}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0" style={{ backgroundColor: luxuryColors.border }}>
                                                        {product.image_url && (
                                                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium truncate" style={{ color: luxuryColors.textPrimary }}>{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" style={{ color: luxuryColors.textSecondary }}>{product.category}</td>
                                            <td className="px-6 py-4 font-medium" style={{ color: luxuryColors.textPrimary }}>${product.price}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/products/edit/${product.id}`}
                                                        className="p-2 rounded-lg transition-all hover:shadow-sm"
                                                        style={{ color: luxuryColors.accentGold, backgroundColor: `${luxuryColors.accentGold}10` }}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="p-2 rounded-lg transition-all hover:shadow-sm"
                                                        style={{ color: luxuryColors.error, backgroundColor: `${luxuryColors.error}10` }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
