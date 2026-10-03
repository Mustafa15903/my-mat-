'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import ProductFeed from '@/components/ProductFeed';
import { luxuryColors } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      const formattedProducts = (productsData || []).map((p) => ({
        ...p,
        image: p.image_url,
      }));
      setProducts(formattedProducts);

      // Fetch Categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  return (
    <div
      className="min-h-screen relative w-full"
      style={{ 
        backgroundColor: luxuryColors.bgLight,
        maxWidth: '100vw',
        overflowX: 'hidden',
      }}
    >
      <main 
        className="min-h-screen flex flex-col justify-center pt-24"
        style={{ 
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
        }}
      >
        <div className="w-full px-3 sm:px-6 md:px-8 mb-8 sm:mb-10">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[#e8e1d7] bg-white/80 shadow-[0_24px_80px_rgba(45,32,21,0.08)] backdrop-blur-sm">
            <div className="grid md:grid-cols-[1.05fr_0.95fr] items-center">
              <div className="p-6 sm:p-8 lg:p-12">
                <span className="inline-flex rounded-full border border-[#d9c8ad] bg-[#f9f4ee] px-3 py-1 text-[10px] sm:text-xs font-medium uppercase tracking-[0.22em] text-[#7c5b3a]">
                  Crafted for comfort
                </span>
                <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-light tracking-[-0.04em] text-[#2d2014]">
                  Beautiful prayer mats for daily moments of peace.
                </h1>
                <p className="mt-4 max-w-xl text-sm sm:text-base leading-7 text-[#5c4b3d]">
                  Explore soft, elegant designs inspired by traditional craftsmanship, modern comfort, and a calming everyday ritual.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
                    style={{ backgroundColor: luxuryColors.textPrimary }}
                  >
                    Shop all
                  </button>
                  <button
                    onClick={() => setSelectedCategory(categories[0]?.name || '')}
                    className="rounded-full border px-5 py-2.5 text-sm font-medium transition hover:border-[#b98d5b] hover:text-[#2d2014]"
                    style={{ borderColor: luxuryColors.border, color: luxuryColors.textPrimary }}
                  >
                    Browse favorites
                  </button>
                </div>
              </div>

              <div className="relative min-h-[320px] sm:min-h-[420px] w-full">
                <Image
                  src="/img/gold%20and%20blue%20vintage%20prayer%20mat.jpg"
                  alt="Prayer mat collection"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-3 sm:px-4 mb-6 sm:mb-8 z-10 relative">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 ${selectedCategory === cat.name
                    ? 'text-white shadow-md scale-105'
                    : 'text-gray-700 hover:text-gray-900 border-2 hover:border-opacity-100'
                    }`}
                  style={{
                    backgroundColor: selectedCategory === cat.name ? luxuryColors.textPrimary : 'transparent',
                    borderColor: selectedCategory === cat.name ? luxuryColors.textPrimary : luxuryColors.border,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <ProductFeed products={filteredProducts} onAddToCart={handleAddToCart} />
          </>
        )}
      </main>
    </div>
  );
}
