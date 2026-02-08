'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Eye, Loader2, Package, Search } from 'lucide-react';
import { luxuryColors } from '@/lib/theme';

// Prevent static generation - this page needs runtime environment variables
export const dynamic = 'force-dynamic';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return { bg: `${luxuryColors.accentGold}20`, text: luxuryColors.accentGold };
            case 'processing': return { bg: `#3b82f620`, text: '#3b82f6' };
            case 'shipped': return { bg: `#a855f720`, text: '#a855f7' };
            case 'delivered': return { bg: `${luxuryColors.success}20`, text: luxuryColors.success };
            case 'cancelled': return { bg: `${luxuryColors.error}20`, text: luxuryColors.error };
            default: return { bg: `${luxuryColors.border}`, text: luxuryColors.textSecondary };
        }
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: luxuryColors.textPrimary }}>Orders</h1>
                <p className="text-xs sm:text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Manage customer orders</p>
            </div>

            {/* Search */}
            <div className="p-3 sm:p-4 rounded-xl shadow-sm" style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: luxuryColors.textSecondary }} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{
                            border: `1px solid ${luxuryColors.border}`,
                            backgroundColor: luxuryColors.bgLight,
                            color: luxuryColors.textPrimary
                        }}
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin" style={{ color: luxuryColors.accentGold }} />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-8 sm:p-12 text-center flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${luxuryColors.border}40`, color: luxuryColors.textSecondary }}>
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-base sm:text-lg font-medium" style={{ color: luxuryColors.textPrimary }}>No Orders Found</h3>
                        <p className="text-xs sm:text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Wait for customers to make a purchase.</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View (hidden on sm and up) */}
                        <div className="grid grid-cols-1 sm:hidden">
                            {filteredOrders.map((order, index) => {
                                const statusColor = getStatusColor(order.status);
                                return (
                                    <div
                                        key={order.id}
                                        className="p-3 sm:p-4 space-y-3 border-b last:border-b-0"
                                        style={{ backgroundColor: luxuryColors.bgLight, borderColor: luxuryColors.border }}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-mono" style={{ color: luxuryColors.textSecondary }}>Order #{order.id}</p>
                                                <p className="text-sm font-bold mt-1 truncate" style={{ color: luxuryColors.textPrimary }}>{order.customer_name || 'Guest'}</p>
                                                <p className="text-xs truncate" style={{ color: luxuryColors.textSecondary }}>{order.customer_email}</p>
                                            </div>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0" style={{ backgroundColor: statusColor.bg, color: statusColor.text }}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: luxuryColors.border }}>
                                            <div className="flex-1">
                                                <p className="text-xs" style={{ color: luxuryColors.textSecondary }}>Date</p>
                                                <p className="text-xs sm:text-sm font-medium" style={{ color: luxuryColors.textPrimary }}>{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs" style={{ color: luxuryColors.textSecondary }}>Total</p>
                                                <p className="text-xs sm:text-sm font-bold" style={{ color: luxuryColors.textPrimary }}>${order.total_amount?.toFixed(2)}</p>
                                            </div>
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center justify-center p-2 rounded-lg transition-all hover:shadow-sm flex-shrink-0"
                                                style={{
                                                    color: luxuryColors.accentGold,
                                                    backgroundColor: `${luxuryColors.accentGold}10`
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="sr-only">View Details</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table View (hidden on mobile) */}
                        <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead style={{ backgroundColor: `${luxuryColors.border}20`, borderBottom: `1px solid ${luxuryColors.border}` }}>
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 font-medium" style={{ color: luxuryColors.textSecondary }}>Order ID</th>
                                    <th className="px-3 sm:px-6 py-3 font-medium" style={{ color: luxuryColors.textSecondary }}>Date</th>
                                    <th className="px-3 sm:px-6 py-3 font-medium" style={{ color: luxuryColors.textSecondary }}>Customer</th>
                                    <th className="px-3 sm:px-6 py-3 font-medium" style={{ color: luxuryColors.textSecondary }}>Total</th>
                                    <th className="px-3 sm:px-6 py-3 font-medium" style={{ color: luxuryColors.textSecondary }}>Status</th>
                                    <th className="px-3 sm:px-6 py-3 font-medium text-right" style={{ color: luxuryColors.textSecondary }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody style={{ borderColor: luxuryColors.border }}>
                                {filteredOrders.map((order, index) => {
                                    const statusColor = getStatusColor(order.status);
                                    return (
                                        <tr
                                            key={order.id}
                                            className="transition-colors hover:shadow-sm"
                                            style={{
                                                borderBottom: `1px solid ${luxuryColors.border}`,
                                                backgroundColor: index % 2 === 0 ? 'transparent' : `${luxuryColors.border}08`
                                            }}
                                        >
                                            <td className="px-3 sm:px-6 py-4 font-mono text-xs" style={{ color: luxuryColors.textSecondary }}>#{order.id}</td>
                                            <td className="px-3 sm:px-6 py-4" style={{ color: luxuryColors.textSecondary }}>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4">
                                                <div className="font-medium" style={{ color: luxuryColors.textPrimary }}>{order.customer_name || 'Guest'}</div>
                                                <div className="text-xs" style={{ color: luxuryColors.textSecondary }}>{order.customer_email}</div>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 font-medium" style={{ color: luxuryColors.textPrimary }}>
                                                ${order.total_amount?.toFixed(2)}
                                            </td>
                                            <td className="px-3 sm:px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize transition-all"
                                                    style={{
                                                        backgroundColor: statusColor.bg,
                                                        color: statusColor.text,
                                                    }}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-4 text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-lg transition-all hover:shadow-sm"
                                                    style={{
                                                        color: luxuryColors.accentGold,
                                                        backgroundColor: `${luxuryColors.accentGold}10`
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span className="sr-only">View Details</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
