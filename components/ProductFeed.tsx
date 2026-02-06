'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import ProductCard from './ProductCard';
import { luxuryColors } from '@/lib/theme';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductFeedProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
}

export default function ProductFeed({ products, onAddToCart }: ProductFeedProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addToCart(product);
      // Optional: Add a simple alert or toast here if global toast is not available
      // alert(`Added ${product.name} to cart`); 
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const [centeredIndex, setCenteredIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      const element = containerRef.current.querySelector(`[data-product-index="${index}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
        setCenteredIndex(index);
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        const nextIndex = Math.min(centeredIndex + 1, products.length - 1);
        scrollToIndex(nextIndex);
      } else if (e.key === 'ArrowLeft') {
        const prevIndex = Math.max(centeredIndex - 1, 0);
        scrollToIndex(prevIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [centeredIndex, products.length, scrollToIndex]);


  useEffect(() => {
    // Setup IntersectionObserver to detect centered product
    if (containerRef.current) {
      const container = containerRef.current;
      const productElements = container.querySelectorAll('[data-product-index]');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
              const index = parseInt(entry.target.getAttribute('data-product-index') || '0');
              setCenteredIndex(index);
            }
          });
        },
        {
          root: container,
          threshold: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        }
      );

      productElements.forEach((element) => {
        observer.observe(element);
      });

      return () => {
        observer.disconnect();
      };
    }
  }, [products.length]);

  return (
    <section
      id="products"
      className="w-full min-h-[100dvh] flex flex-col items-center justify-center px-4 md:px-8 pt-20"
      role="region"
      aria-roledescription="carousel"
      aria-label="Product Showcase"
    >
      {/* Screen Reader Live Region for Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing product {centeredIndex + 1} of {products.length}
      </div>

      {/* Section Title */}
      <div
        className="mb-8 text-center"
        style={{
          animation: 'titleFadeIn 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) backwards',
        }}
      >
        <h1
          className="text-4xl md:text-5xl font-light tracking-tight mb-4"
          style={{ color: luxuryColors.textPrimary }}
        >
          Our Collection
        </h1>
        <p
          className="text-sm tracking-wide"
          style={{ color: luxuryColors.textSecondary }}
        >
          Crafted with care for moments of devotion
        </p>
      </div>

      {/* Single Product View Container */}
      <div className="relative w-full max-w-4xl px-4 flex-1 flex flex-col justify-center overflow-hidden">
        <div
          ref={containerRef}
          className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide flex-1 flex items-center"
          role="group"
          aria-label="Products Collection"
          style={{
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
          }}
        >
          <div className="flex gap-16 md:gap-32 w-max px-[20vw] md:px-[30vw]">
            {products.map((product, index) => {
              const isFocused = centeredIndex === index;
              return (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[75vw] sm:w-[50vw] md:w-[450px] lg:w-[500px] transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)"
                  data-product-index={index}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${products.length}`}
                  style={{
                    scrollSnapAlign: 'center',
                    scrollSnapStop: 'always',
                    opacity: isFocused ? 1 : 0.5,
                    transform: isFocused ? 'scale(1)' : 'scale(0.95)',
                    filter: isFocused ? 'none' : 'none',
                  }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="mt-8 mb-12 text-center" role="tablist" aria-label="Slides">
        <div className="flex gap-2 justify-center">
          {products.map((product, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className="group relative flex items-center justify-center w-11 h-11 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-full"
              role="tab"
              aria-selected={centeredIndex === index}
              aria-label={`Go to product ${index + 1}: ${product.name}`}
              style={{
                // @ts-ignore
                '--tw-ring-color': luxuryColors.accentGold,
              }}
            >
              <div
                className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-125 group-active:scale-150"
                style={{
                  backgroundColor: centeredIndex === index ? luxuryColors.accentGold : luxuryColors.border,
                  transform: centeredIndex === index ? 'scale(1.5)' : 'scale(1)',
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes titleFadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
