'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductFeed from '@/components/ProductFeed';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import { prayerMats } from '@/lib/products';
import { luxuryColors } from '@/lib/theme';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Page() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      // Auto-open cart when adding an item
      setIsCartOpen(true);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
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

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: luxuryColors.bgLight }}
    >
      {/* Navbar */}
      <Navbar
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onAccountClick={() => setAuthOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Main Content */}
      <main className="min-h-screen flex flex-col justify-center">
        <ProductFeed products={prayerMats} onAddToCart={handleAddToCart} />
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
