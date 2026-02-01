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
      className="group relative flex flex-col w-full bg-white rounded-[20px] shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out overflow-hidden border border-gray-100/50"
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) backwards',
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50">
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
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-xs font-semibold tracking-wide text-gray-900 border border-black/5">
            -{discountPercentage}%
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-5 space-y-4">

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900 tracking-tight leading-snug">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 font-normal leading-relaxed line-clamp-2 min-h-[2.5em]">
            {product.description}
          </p>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            ${product.price.toFixed(0)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through font-normal">
              ${product.originalPrice?.toFixed(0)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="relative w-full overflow-hidden rounded-xl bg-black text-white py-3.5 px-4 text-sm font-medium tracking-wide transition-all duration-300 hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/btn"
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
