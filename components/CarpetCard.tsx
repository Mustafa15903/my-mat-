'use client';

import React from 'react';
import { Carpet } from '@/types';
import { Plus } from 'lucide-react';

interface CarpetCardProps {
  product: Carpet;
  onAddToCart: (product: Carpet) => void;
}

export default function CarpetCard({ product, onAddToCart }: CarpetCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
      {/* Product Image Placeholder */}
      <div className="w-full h-40 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
        <span className="text-gray-600 text-sm">{product.category}</span>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 h-8 overflow-hidden">{product.description}</p>

        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-purple-600">${product.price}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center space-x-2"
        >
          <Plus size={18} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
