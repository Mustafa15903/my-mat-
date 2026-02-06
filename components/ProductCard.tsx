'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { luxuryColors } from '@/lib/theme';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
}

export default React.memo(function ProductCard({ product, onAddToCart, index }: ProductCardProps) {
  // Calculate discount if originalPrice exists
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div
      className="group relative flex flex-col w-full bg-white/95 transition-all duration-400 ease-out overflow-hidden rounded-[12px] hover:rounded-[16px]"
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50/50 transition-all duration-500 ease-in-out">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm text-xs font-semibold tracking-wide border" style={{ backgroundColor: `${luxuryColors.accentGold}20`, color: luxuryColors.textPrimary, borderColor: luxuryColors.accentGold }}>
            -{discountPercentage}%
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-5 space-y-3">

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-lg font-medium tracking-tight leading-snug" style={{ color: luxuryColors.textPrimary }}>
            {product.name}
          </h3>
          <p className="text-sm font-normal leading-relaxed line-clamp-2 min-h-[2.5em]" style={{ color: luxuryColors.textSecondary }}>
            {product.description}
          </p>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-xl font-bold tracking-tight" style={{ color: luxuryColors.accentGold }}>
            ${product.price.toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-sm line-through font-normal" style={{ color: luxuryColors.textSecondary }}>
              ${product.originalPrice?.toFixed(0)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="relative w-full overflow-hidden rounded-xl text-white py-3.5 px-4 text-sm font-medium tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn"
          style={{ backgroundColor: luxuryColors.textPrimary }}
        >
          <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
          <span>Add to Cart</span>
        </button>
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
    </div>
  );
});
