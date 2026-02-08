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
  const [carouselItemWidth, setCarouselItemWidth] = useState(320);

  // Calculate responsive carousel item width
  useEffect(() => {
    const calculateWidth = () => {
      if (typeof window !== 'undefined') {
        const vw = window.innerWidth;
        if (vw < 360) {
          // Extra small screens: 320px device leaves ~16px margin each side
          setCarouselItemWidth(Math.min(vw - 32, 280));
        } else if (vw < 640) {
          // Mobile: 300px
          setCarouselItemWidth(300);
        } else if (vw < 1024) {
          // Tablet: 320px
          setCarouselItemWidth(320);
        } else {
          // Desktop: 360px
          setCarouselItemWidth(360);
        }
      }
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, []);

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
      className="w-full min-h-[100dvh] flex flex-col items-center pt-20 pb-20"
      style={{
        maxWidth: '100vw',
      }}
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
        className="mb-6 sm:mb-8 text-center px-3 sm:px-4"
        style={{
          animation: 'titleFadeIn 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) backwards',
          maxWidth: '100vw',
        }}
      >
        <h1
          className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight mb-2 sm:mb-4"
          style={{ color: luxuryColors.textPrimary }}
        >
          Our Collection
        </h1>
        <p
          className="text-xs sm:text-sm tracking-wide"
          style={{ color: luxuryColors.textSecondary }}
        >
          Crafted with care for moments of devotion
        </p>
      </div>

      {/* Carousel/Grid Container */}
      <div
        className="w-full px-4 md:px-8 lg:px-12"
        style={{
          maxWidth: '100vw',
        }}
      >
        {/* Mobile Carousel View */}
        <div className="block lg:hidden">
          <div
            ref={containerRef}
            className="horizontal-scroll flex items-center gap-6 pb-8"
            role="group"
            aria-label="Products Carousel"
            style={{
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              paddingLeft: `calc(50vw - ${carouselItemWidth / 2}px)`,
              paddingRight: `calc(50vw - ${carouselItemWidth / 2}px)`,
            }}
          >
            {products.map((product, index) => {
              const isFocused = centeredIndex === index;
              return (
                <div
                  key={product.id}
                  className="flex-shrink-0 scroll-snap-center transition-all duration-700"
                  data-product-index={index}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${products.length}`}
                  style={{
                    width: `${carouselItemWidth}px`,
                    opacity: isFocused ? 1 : 0.6,
                    transform: isFocused ? 'scale(1)' : 'scale(0.95)',
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

          {/* Mobile Pagination Dots */}
          <div className="mt-4 flex gap-2 justify-center" role="tablist" aria-label="Slides">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                role="tab"
                aria-selected={centeredIndex === index}
                style={{
                  backgroundColor: centeredIndex === index ? luxuryColors.accentGold : luxuryColors.border,
                  transform: centeredIndex === index ? 'scale(1.5)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              index={index}
            />
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
