'use client';

import React from 'react';
import { Carpet } from '@/types';
import CarpetCard from './CarpetCard';

interface ProductsSidebarProps {
  products: Carpet[];
  onAddToCart: (product: Carpet) => void;
}

export default function ProductsSidebar({ products, onAddToCart }: ProductsSidebarProps) {
  return (
    <div className="w-2/3 bg-gray-50 p-6 overflow-y-auto h-screen pt-24">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Carpets</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
