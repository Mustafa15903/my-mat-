import React from 'react';
import { luxuryColors } from '@/lib/theme';
import ProductFeed from '@/components/ProductFeed';
import { carpets } from '@/data/carpets';
import { Product } from '@/types';

// For now, Shop page will just reuse the ProductFeed from home
// We map the existing data to match the new Product interface
export default function ShopPage() {
    const products: Product[] = carpets.map((carpet) => ({
        id: parseInt(carpet.id),
        name: carpet.name,
        price: carpet.price,
        image: carpet.image,
        material: carpet.category,
        description: carpet.description,
        // Add mock discount to every other item for demo
        originalPrice: parseInt(carpet.id) % 2 === 0 ? carpet.price * 1.2 : undefined,
    }));

    return (
        <main
            className="relative min-h-screen overflow-hidden scroll-smooth"
            style={{ backgroundColor: luxuryColors.bgLight }}
        >
            {/* Stamp pattern overlay — transparent, above content, non-blocking */}
            <div
                className="pointer-events-none absolute inset-0 z-10 opacity-[0.07]"
                style={{
                    backgroundImage: "url('/stamp-collection.svg')",
                    backgroundRepeat: 'repeat',
                    backgroundSize: '88px 122px',
                }}
                aria-hidden
            />
            <div className="relative z-0 pt-24 pb-20">
                <div className="text-center py-10 md:py-14">
                    <h1
                        className="text-4xl font-light tracking-wide mb-3 transition-colors duration-300"
                        style={{ color: luxuryColors.textPrimary }}
                    >
                        Shop All
                    </h1>
                </div>
                <ProductFeed products={products} />
            </div>
        </main>
    );
}
