'use client';

import React from 'react';
import { Carpet } from '@/types';
import CarpetCard from './CarpetCard';
import { luxuryColors } from '@/lib/theme';

interface ProductsSidebarProps {
  products: Carpet[];
  onAddToCart: (product: Carpet) => void;
}

export default function ProductsSidebar({ products, onAddToCart }: ProductsSidebarProps) {
  return (
    <div className="w-full md:w-2/3 p-4 sm:p-6 overflow-y-auto min-h-screen pt-20 sm:pt-24" style={{ backgroundColor: luxuryColors.bgLight }}>
      <h2 className="text-xl sm:text-2xl font-light tracking-tight mb-6 sm:mb-8" style={{ color: luxuryColors.textPrimary }}>Available Carpets</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <CarpetCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
