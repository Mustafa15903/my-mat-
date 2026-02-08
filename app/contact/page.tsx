'use client';

import React from 'react';
import { luxuryColors } from '@/lib/theme';
import Link from 'next/link';
import { Mail, Phone, MapPin, ChevronLeft } from 'lucide-react';

export default function ContactPage() {
    return (
        <main
            className="min-h-screen w-full relative flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-20 sm:py-24"
            style={{ backgroundColor: luxuryColors.bgLight }}
        >
            {/* Back Button */}


            <div
                className="max-w-4xl w-full mx-auto"
                style={{
                    animation: 'fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
                }}
            >
                <div className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4">
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight"
                        style={{ color: luxuryColors.textPrimary }}
                    >
                        Contact Us
                    </h1>
                    <p
                        className="text-base sm:text-lg font-light"
                        style={{ color: luxuryColors.textSecondary }}
                    >
                        We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    {[
                        { icon: Mail, label: 'Email', value: 'support@mymat.com', href: 'mailto:support@mymat.com' },
                        { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
                        { icon: MapPin, label: 'Location', value: 'any, where', href: null }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="contact-card group flex flex-col items-center gap-4 sm:gap-5 p-6 sm:p-7 md:p-8 rounded-2xl md:rounded-[24px] bg-white border border-gray-100/50 transition-all duration-300 hover:-translate-y-1"
                            style={{ 
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            <div className="p-3 sm:p-4 rounded-xl md:rounded-2xl bg-gray-50 group-hover:bg-gray-100/50 transition-colors duration-300">
                                <item.icon size={24} style={{ color: luxuryColors.accentGold }} strokeWidth={1.5} />
                            </div>
                            <div className="text-center space-y-1 w-full">
                                <h3 className="font-medium tracking-wide text-xs sm:text-sm uppercase" style={{ color: luxuryColors.textSecondary }}>
                                    {item.label}
                                </h3>
                                {item.href ? (
                                    <a 
                                        href={item.href} 
                                        className="text-sm sm:text-base md:text-lg font-medium hover:opacity-70 transition-opacity block break-words" 
                                        style={{ color: luxuryColors.textPrimary }}
                                    >
                                        {item.value}
                                    </a>
                                ) : (
                                    <p className="text-sm sm:text-base md:text-lg font-medium break-words" style={{ color: luxuryColors.textPrimary }}>
                                        {item.value}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </main>
    );
}