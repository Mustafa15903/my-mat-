'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Calendar, Loader2, MapPin, Package, User, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface OrderDetailsProps {
    params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsProps) {
    const { id } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (id) fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);

            // Fetch Order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .single();

            if (orderError) throw orderError;
            setOrder(orderData);

            // Fetch Items
            const { data: itemsData, error: itemsError } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', id);

            if (itemsError) throw itemsError;
            setItems(itemsData || []);

        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setUpdating(true);
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setOrder((prev: any) => ({ ...prev, status: newStatus }));
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold">Order not found</h2>
                <Link href="/admin/orders" className="text-blue-600 hover:underline mt-2 inline-block">
                    Return to Orders
                </Link>
            </div>
        );
    }

    const availableStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">Order #{order.id}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} capitalize`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Placed on {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Status Actions */}
                <div className="flex flex-wrap gap-2">
                    {availableStatuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusUpdate(status)}
                            disabled={updating || order.status === status}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors capitalize ${order.status === status
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Package className="w-5 h-5 text-gray-500" />
                                Items
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-zinc-800">
                            {items.map((item) => (
                                <div key={item.id} className="p-6 flex items-start gap-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-zinc-800">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-300">
                                                <Package className="w-8 h-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.product_name}</h4>
                                        <p className="text-sm text-gray-500 mt-1">Ref/ID: {item.product_id}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${Number(item.price_at_time).toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 flex justify-end">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">${Number(order.total_amount).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info - Right Column */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-gray-500" />
                            Customer
                        </h3>
                        <div className="space-y-2">
                            <p className="font-medium">{order.customer_name || 'Guest Checkout'}</p>
                            <p className="text-sm text-gray-500">{order.customer_email}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-gray-500" />
                            Shipping
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                            {order.shipping_address || 'No address provided'}
                        </div>
                    </div>

                    {/* Timeline (Static for now to show implementation idea) */}
                    <div className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-6">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Clock className="w-5 h-5 text-gray-500" />
                            Timeline
                        </h3>
                        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:w-0.5 before:bg-gray-200 dark:before:bg-zinc-800">
                            {/* Created */}
                            <div className="relative pl-6">
                                <div className="absolute left-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-zinc-950" />
                                <p className="text-sm font-medium">Order Placed</p>
                                <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                            </div>
                            {/* Current Status */}
                            {order.status !== 'pending' && (
                                <div className="relative pl-6">
                                    <div className="absolute left-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-zinc-950" />
                                    <p className="text-sm font-medium capitalize">Marked as {order.status}</p>
                                    <p className="text-xs text-gray-500">Latest Update</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
