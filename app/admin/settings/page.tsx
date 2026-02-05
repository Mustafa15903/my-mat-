'use client';

import React, { useState } from 'react';
import { Save, Store, Mail, DollarSign, Globe, Lock, Bell, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        storeName: 'myMat',
        supportEmail: 'support@mymat.com',
        currency: 'USD',
        timezone: 'UTC-5 (EST)',
        orderNotifications: true,
        promoEmails: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Here we would typically save to Supabase "settings" table or similar
        // For now, we'll just show success
        setLoading(false);
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your store configuration and preferences.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* General Store Settings */}
                <section className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <Store className="w-5 h-5 text-gray-500" />
                            Store Information
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Basic details visible to your customers.</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Store Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 pl-10 border rounded-lg dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                    <Store className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Support Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="supportEmail"
                                        value={formData.supportEmail}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 pl-10 border rounded-lg dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Regional Settings */}
                <section className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <Globe className="w-5 h-5 text-gray-500" />
                            Regional Preferences
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Set your currency and local time.</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Currency</label>
                                <div className="relative">
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 pl-10 border rounded-lg dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Timezone</label>
                                <div className="relative">
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 pl-10 border rounded-lg dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                    >
                                        <option value="UTC">UTC (GMT+0)</option>
                                        <option value="EST">New York (EST)</option>
                                        <option value="LDN">London (BST)</option>
                                    </select>
                                    <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="bg-white dark:bg-zinc-950 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <Bell className="w-5 h-5 text-gray-500" />
                            Notifications
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Order Alert</p>
                                <p className="text-sm text-gray-500">Receive an email when a new order is placed.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="orderNotifications"
                                    checked={formData.orderNotifications}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-900">
                            <div>
                                <p className="font-medium">Marketing Emails</p>
                                <p className="text-sm text-gray-500">Receive tips and feature updates.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="promoEmails"
                                    checked={formData.promoEmails}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Security / Danger Zone - Placeholder */}
                <section className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                    <div className="px-6 py-4 border-b border-red-200 dark:border-red-900/30">
                        <h2 className="font-semibold text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                            <Lock className="w-5 h-5" />
                            Security
                        </h2>
                    </div>
                    <div className="p-6">
                        <button type="button" className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline">
                            Change Admin Password
                        </button>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>

            </form>
        </div>
    );
}
