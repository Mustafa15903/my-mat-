'use client';

import React, { useState } from 'react';
import { Save, Store, Mail, DollarSign, Globe, Lock, Bell, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { luxuryColors } from '@/lib/theme';

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
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: luxuryColors.textPrimary }}>Settings</h1>
                <p className="text-xs sm:text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Manage your store configuration and preferences.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

                {/* General Store Settings */}
                <section className="rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}>
                    <div className="px-4 sm:px-6 py-4" style={{ borderBottom: `1px solid ${luxuryColors.border}`, backgroundColor: `${luxuryColors.border}20` }}>
                        <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2" style={{ color: luxuryColors.textPrimary }}>
                            <Store className="w-5 h-5" style={{ color: luxuryColors.textSecondary }} />
                            Store Information
                        </h2>
                        <p className="text-xs sm:text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Basic details visible to your customers.</p>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium" style={{ color: luxuryColors.textPrimary }}>Store Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 pl-10 rounded-lg text-sm outline-none focus:ring-2 transition-all"
                                        style={{
                                            backgroundColor: luxuryColors.bgLight,
                                            border: `1px solid ${luxuryColors.border}`,
                                            color: luxuryColors.textPrimary,
                                        }}
                                    />
                                    <Store className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: luxuryColors.textSecondary }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium" style={{ color: luxuryColors.textPrimary }}>Support Email</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="supportEmail"
                                        value={formData.supportEmail}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 pl-10 rounded-lg text-sm outline-none focus:ring-2 transition-all"
                                        style={{
                                            backgroundColor: luxuryColors.bgLight,
                                            border: `1px solid ${luxuryColors.border}`,
                                            color: luxuryColors.textPrimary,
                                        }}
                                    />
                                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: luxuryColors.textSecondary }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Regional Settings */}
                <section className="rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}>
                    <div className="px-4 sm:px-6 py-4" style={{ borderBottom: `1px solid ${luxuryColors.border}`, backgroundColor: `${luxuryColors.border}20` }}>
                        <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2" style={{ color: luxuryColors.textPrimary }}>
                            <Globe className="w-5 h-5" style={{ color: luxuryColors.textSecondary }} />
                            Regional Preferences
                        </h2>
                        <p className="text-xs sm:text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Set your currency and local time.</p>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium" style={{ color: luxuryColors.textPrimary }}>Currency</label>
                                <div className="relative">
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 pl-10 rounded-lg text-sm outline-none focus:ring-2 transition-all appearance-none"
                                        style={{
                                            backgroundColor: luxuryColors.bgLight,
                                            border: `1px solid ${luxuryColors.border}`,
                                            color: luxuryColors.textPrimary,
                                        }}
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: luxuryColors.textSecondary }} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs sm:text-sm font-medium" style={{ color: luxuryColors.textPrimary }}>Timezone</label>
                                <div className="relative">
                                    <select
                                        name="timezone"
                                        value={formData.timezone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 pl-10 rounded-lg text-sm outline-none focus:ring-2 transition-all appearance-none"
                                        style={{
                                            backgroundColor: luxuryColors.bgLight,
                                            border: `1px solid ${luxuryColors.border}`,
                                            color: luxuryColors.textPrimary,
                                        }}
                                    >
                                        <option value="UTC">UTC (GMT+0)</option>
                                        <option value="EST">New York (EST)</option>
                                        <option value="LDN">London (BST)</option>
                                    </select>
                                    <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: luxuryColors.textSecondary }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications */}
                <section className="rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}>
                    <div className="px-4 sm:px-6 py-4" style={{ borderBottom: `1px solid ${luxuryColors.border}`, backgroundColor: `${luxuryColors.border}20` }}>
                        <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2" style={{ color: luxuryColors.textPrimary }}>
                            <Bell className="w-5 h-5" style={{ color: luxuryColors.textSecondary }} />
                            Notifications
                        </h2>
                    </div>
                    <div className="p-4 sm:p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-sm" style={{ color: luxuryColors.textPrimary }}>Order Alert</p>
                                <p className="text-xs" style={{ color: luxuryColors.textSecondary }}>Receive an email when a new order is placed.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="orderNotifications"
                                    checked={formData.orderNotifications}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 rounded-full peer transition-all" style={{ backgroundColor: formData.orderNotifications ? luxuryColors.accentGold : luxuryColors.border }}>
                                    <div className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-transform ${formData.orderNotifications ? 'translate-x-5' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${luxuryColors.border}` }}>
                            <div>
                                <p className="font-medium text-sm" style={{ color: luxuryColors.textPrimary }}>Marketing Emails</p>
                                <p className="text-xs" style={{ color: luxuryColors.textSecondary }}>Receive tips and feature updates.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="promoEmails"
                                    checked={formData.promoEmails}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 rounded-full peer transition-all" style={{ backgroundColor: formData.promoEmails ? luxuryColors.accentGold : luxuryColors.border }}>
                                    <div className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-transform ${formData.promoEmails ? 'translate-x-5' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Security / Danger Zone - Placeholder */}
                <section className="rounded-xl shadow-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity" style={{ backgroundColor: `${luxuryColors.error}10`, border: `1px solid ${luxuryColors.error}40` }}>
                    <div className="px-4 sm:px-6 py-4" style={{ borderBottom: `1px solid ${luxuryColors.error}40` }}>
                        <h2 className="font-semibold text-base sm:text-lg flex items-center gap-2" style={{ color: luxuryColors.error }}>
                            <Lock className="w-5 h-5" />
                            Security
                        </h2>
                    </div>
                    <div className="p-4 sm:p-6">
                        <button type="button" className="text-xs sm:text-sm font-medium hover:underline" style={{ color: luxuryColors.error }}>
                            Change Admin Password
                        </button>
                    </div>
                </section>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm transition-all hover:shadow-md disabled:opacity-50"
                        style={{ backgroundColor: luxuryColors.textPrimary, color: luxuryColors.bgLight }}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>

            </form>
        </div>
    );
}
