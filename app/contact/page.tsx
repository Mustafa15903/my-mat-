'use client';

import React from 'react';
import { luxuryColors } from '@/lib/theme';
import Link from 'next/link';
import { Mail, Phone, MapPin, ChevronLeft } from 'lucide-react';

export default function ContactPage() {
    return (
        <main
            className="min-h-screen relative flex flex-col items-center justify-center px-8"
            style={{ backgroundColor: luxuryColors.bgLight }}
        >
            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 p-2 sm:p-3 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-md group"
                aria-label="Back to Home"
            >
                <ChevronLeft size={24} style={{ color: luxuryColors.textPrimary }} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>

            <div
                className="max-w-4xl w-full"
                style={{
                    animation: 'fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
                }}
            >
                <div className="text-center mb-16 space-y-4">
                    <h1
                        className="text-4xl md:text-5xl font-light tracking-tight"
                        style={{ color: luxuryColors.textPrimary }}
                    >
                        Contact Us
                    </h1>
                    <p
                        className="text-lg font-light"
                        style={{ color: luxuryColors.textSecondary }}
                    >
                        We'd love to hear from you.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        { icon: Mail, label: 'Email', value: 'support@mymat.com', href: 'mailto:support@mymat.com' },
                        { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
                        { icon: MapPin, label: 'Location', value: 'any, where', href: null }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center gap-5 p-8 rounded-[24px] bg-white border border-gray-100/50 shadow-[0_2px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="p-4 rounded-2xl bg-gray-50 group-hover:bg-gray-100/50 transition-colors duration-300">
                                <item.icon size={28} style={{ color: luxuryColors.accentGold }} strokeWidth={1.5} />
                            </div>
                            <div className="text-center space-y-1">
                                <h3 className="font-medium tracking-wide text-sm uppercase" style={{ color: luxuryColors.textSecondary }}>
                                    {item.label}
                                </h3>
                                {item.href ? (
                                    <a href={item.href} className="text-lg font-medium hover:opacity-70 transition-opacity" style={{ color: luxuryColors.textPrimary }}>
                                        {item.value}
                                    </a>
                                ) : (
                                    <p className="text-lg font-medium" style={{ color: luxuryColors.textPrimary }}>
                                        {item.value}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </main>
    );
}
