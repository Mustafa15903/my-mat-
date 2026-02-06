'use client';

import React from 'react';
import { Carpet } from '@/types';
import { ShoppingBag } from 'lucide-react';
import { luxuryColors } from '@/lib/theme';

interface CarpetCardProps {
  product: Carpet;
  onAddToCart: (product: Carpet) => void;
}

export default function CarpetCard({ product, onAddToCart }: CarpetCardProps) {
  return (
    <div className="group relative flex flex-col w-full bg-white/95 transition-all duration-400 ease-out overflow-hidden rounded-[12px] hover:rounded-[16px]">
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50/50 transition-all duration-500 ease-in-out">
        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center group-hover:from-slate-300 group-hover:to-slate-400 transition-colors duration-500">
          <div className="text-center">
            <p className="text-slate-600 text-sm font-medium tracking-wide">{product.category}</p>
            <p className="text-slate-500 text-xs mt-1">{product.name}</p>
          </div>
        </div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-5 space-y-4">
        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-lg font-medium transition-colors duration-300" style={{ color: luxuryColors.textPrimary }}>
            {product.name}
          </h3>
          <p className="text-sm transition-colors duration-300 leading-relaxed line-clamp-2 min-h-[2.5em]" style={{ color: luxuryColors.textSecondary }}>
            {product.description}
          </p>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-xl font-bold tracking-tight" style={{ color: luxuryColors.textPrimary }}>
            ${product.price.toFixed(0)}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="relative w-full overflow-hidden rounded-xl text-white py-3.5 px-4 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn"
          style={{ backgroundColor: luxuryColors.textPrimary }}
        >
          <ShoppingBag size={18} strokeWidth={2} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
