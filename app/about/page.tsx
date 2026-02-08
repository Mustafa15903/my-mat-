'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { luxuryColors } from '@/lib/theme';

export default function AboutPage() {
    return (
        <main
            className="min-h-screen w-full relative flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-20 sm:py-24"
            style={{ backgroundColor: luxuryColors.bgLight }}
        >
            <div
                className="max-w-2xl w-full mx-auto text-center space-y-6 sm:space-y-8"
                style={{
                    animation: 'fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
                }}
            >
                <div className="space-y-3 sm:space-y-4">
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight"
                        style={{ color: luxuryColors.textPrimary }}
                    >
                        About myMat
                    </h1>
                    <div className="w-20 sm:w-24 h-1 mx-auto rounded-full" style={{ backgroundColor: luxuryColors.accentGold, opacity: 0.3 }} />
                </div>

                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg leading-relaxed font-light" style={{ color: luxuryColors.textSecondary }}>
                    <p>
                        myMat is dedicated to bringing serenity and luxury to your sacred moments. We believe that the physical space you pray in affects your spiritual state.
                    </p>
                    <p>
                        Our mats are handcrafted using the finest materials, designed to provide comfort and focus. Every pattern tells a story, and every thread is woven with intention.
                    </p>
                </div>
            </div>
        </main>
    );
}