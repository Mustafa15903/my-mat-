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
        <main className="min-h-screen bg-neutral-50" style={{ backgroundColor: luxuryColors.bgLight }}>
            <div className="pt-20">
                <div className="text-center py-12">
                    <h1 className="text-4xl font-light tracking-wide mb-4" style={{ color: luxuryColors.textPrimary }}>
                        Shop All
                    </h1>
                </div>
                <ProductFeed products={products} />
            </div>
        </main>
    );
}
