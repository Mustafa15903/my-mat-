'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductFeed from '@/components/ProductFeed';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import { luxuryColors } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

// interface CartItem removed as it's handled by Context (or we can keep purely for reference if needed, but better to rely on Context types)
import { useCart } from '@/context/CartContext';

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [authOpen, setAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const handleRemoveItem = (id: number) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setAuthOpen(true);
  };

  const handleAuthSubmit = (email: string, password: string) => {
    console.log('Auth:', { email, password });
    setAuthOpen(false);
    // Handle checkout flow
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
      {/* Navbar */}
      <Navbar
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onAccountClick={() => setAuthOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Main Content */}
      <main 
        className="min-h-screen flex flex-col justify-center pt-24"
        style={{ 
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
        }}
      >
        {loading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 px-4 mb-8 z-10 relative">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${selectedCategory === cat.name
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

      {/* Cart Drawer */}
      <CartSidebar
        items={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSubmit={handleAuthSubmit}
      />
    </div>
  );
}
