'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { luxuryColors } from '@/lib/theme';

export default function AboutPage() {
    return (
        <main
            className="min-h-screen relative flex flex-col items-center justify-center px-8"
            style={{ backgroundColor: luxuryColors.bgLight }}
        >
            {/* Back Button */}
            <Link
                href="/"
                className="absolute top-8 left-8 p-3 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-md group"
                aria-label="Back to Home"
            >
                <ChevronLeft size={24} style={{ color: luxuryColors.textPrimary }} className="group-hover:-translate-x-0.5 transition-transform" />
            </Link>

            <div
                className="max-w-2xl text-center space-y-8"
                style={{
                    animation: 'fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
                }}
            >
                <div className="space-y-4">
                    <h1
                        className="text-4xl md:text-5xl font-light tracking-tight"
                        style={{ color: luxuryColors.textPrimary }}
                    >
                        About myMat
                    </h1>
                    <div className="w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: luxuryColors.accentGold, opacity: 0.3 }} />
                </div>

                <div className="space-y-6 text-lg leading-relaxed font-light" style={{ color: luxuryColors.textSecondary }}>
                    <p>
                        myMat is dedicated to bringing serenity and luxury to your sacred moments. We believe that the physical space you pray in affects your spiritual state.
                    </p>
                    <p>
                        Our mats are handcrafted using the finest materials, designed to provide comfort and focus. Every pattern tells a story, and every thread is woven with intention.
                    </p>
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
