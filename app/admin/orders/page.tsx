'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Eye, Loader2, Package, Search } from 'lucide-react';

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
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage customer orders</p>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Orders Found</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Wait for customers to make a purchase.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Date</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Customer</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Total</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{order.customer_name || 'Guest'}</div>
                                            <div className="text-xs text-gray-500">{order.customer_email}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            ${order.total_amount?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="sr-only">View Details</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
