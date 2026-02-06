'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Loader2, Pencil, X, Check, Search } from 'lucide-react';
import { luxuryColors } from '@/lib/theme';
import { toast } from 'sonner';

// Prevent static generation - this page needs runtime environment variables
export const dynamic = 'force-dynamic';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            const slug = newCategory.toLowerCase().replace(/\s+/g, '-');
            const { error } = await supabase
                .from('categories')
                .insert([{ name: newCategory, slug }]);

            if (error) throw error;

            toast.success('Category added successfully!');
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error('Failed to add category');
        }
    };

    const handleStartEdit = (category: any) => {
        setEditingId(category.id);
        setEditingName(category.name);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleSaveEdit = async (id: number) => {
        if (!editingName.trim()) {
            toast.error('Category name cannot be empty');
            return;
        }

        try {
            const slug = editingName.toLowerCase().replace(/\s+/g, '-');
            const { error } = await supabase
                .from('categories')
                .update({ name: editingName, slug })
                .eq('id', id);

            if (error) throw error;

            toast.success('Category updated successfully!');
            setEditingId(null);
            setEditingName('');
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Failed to update category');
        }
    };

    const handleDelete = async (id: number, name: string) => {
        // Using a simple confirmation - can be replaced with a custom modal later
        if (!window.confirm(`Delete "${name}"?`)) return;

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Category deleted successfully!');
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: luxuryColors.textPrimary }}>Categories</h1>
                <p className="text-xs sm:text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Manage product categories</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                {/* List */}
                <div
                    className="rounded-xl shadow-sm overflow-hidden"
                    style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}
                >
                    {/* Search */}
                    <div className="p-3 sm:p-4" style={{ borderBottom: `1px solid ${luxuryColors.border}` }}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: luxuryColors.textSecondary }} />
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg outline-none focus:ring-2 text-sm transition-all"
                                style={{
                                    backgroundColor: luxuryColors.bgLight,
                                    border: `1px solid ${luxuryColors.border}`,
                                    color: luxuryColors.textPrimary
                                }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="w-6 h-6 animate-spin" style={{ color: luxuryColors.accentGold }} />
                        </div>
                    ) : (
                        <ul style={{ borderTop: `1px solid ${luxuryColors.border}` }}>
                            {filteredCategories.length === 0 ? (
                                <li className="p-6 text-center text-sm" style={{ color: luxuryColors.textSecondary }}>
                                    {searchTerm ? 'No categories found' : 'No categories yet'}
                                </li>
                            ) : (
                                filteredCategories.map((cat) => (
                                    <li
                                        key={cat.id}
                                        className="p-3 sm:p-4 flex items-center justify-between hover:bg-black/5 transition-colors text-sm"
                                        style={{ borderBottom: `1px solid ${luxuryColors.border}` }}
                                    >
                                        {editingId === cat.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    className="flex-1 px-2 py-1 rounded outline-none focus:ring-2 text-sm"
                                                    style={{
                                                        border: `1px solid ${luxuryColors.accentGold}`,
                                                        color: luxuryColors.textPrimary
                                                    }}
                                                    autoFocus
                                                />
                                                <div className="flex gap-2 ml-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleSaveEdit(cat.id)}
                                                        className="p-1.5 sm:p-2 rounded-lg transition-colors"
                                                        style={{ color: luxuryColors.success, backgroundColor: 'rgba(74, 222, 128, 0.1)' }}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="p-1.5 sm:p-2 rounded-lg transition-colors"
                                                        style={{ color: luxuryColors.textSecondary, backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-1">
                                                    <span className="font-medium block" style={{ color: luxuryColors.textPrimary }}>{cat.name}</span>
                                                    <span className="text-xs" style={{ color: luxuryColors.textSecondary }}>{cat.slug}</span>
                                                </div>
                                                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => handleStartEdit(cat)}
                                                        className="p-1.5 sm:p-2 rounded-lg transition-colors hover:bg-black/5"
                                                        style={{ color: luxuryColors.accentGold }}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id, cat.name)}
                                                        className="p-1.5 sm:p-2 rounded-lg transition-colors hover:shadow-sm"
                                                        style={{ color: luxuryColors.error, backgroundColor: `${luxuryColors.error}10` }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    )}
                </div>

                {/* Add Form */}
                <div
                    className="rounded-xl shadow-sm p-4 sm:p-6 h-fit"
                    style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}
                >
                    <h2 className="text-base sm:text-lg font-bold mb-4" style={{ color: luxuryColors.textPrimary }}>Add New Category</h2>
                    <form onSubmit={handleAddCategory} className="space-y-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium mb-2" style={{ color: luxuryColors.textPrimary }}>Category Name</label>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg outline-none focus:ring-2 text-sm transition-all"
                                style={{
                                    border: `1px solid ${luxuryColors.border}`,
                                    color: luxuryColors.textPrimary,
                                    backgroundColor: luxuryColors.bgLight
                                }}
                                placeholder="e.g. Silk Rugs"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2.5 rounded-lg font-medium transition-all hover:shadow-md flex justify-center items-center text-sm"
                            style={{ backgroundColor: luxuryColors.accentGold, color: luxuryColors.bgLight }}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
