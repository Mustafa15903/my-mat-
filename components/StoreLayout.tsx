'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import { useCart } from '@/context/CartContext';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;

  const { cart, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();
  const [authOpen, setAuthOpen] = useState(false);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setAuthOpen(true);
  };

  const handleAuthSubmit = (_email: string, _password: string) => {
    setAuthOpen(false);
  };

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onAccountClick={() => setAuthOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
      />
      {children}
      <CartSidebar
        items={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSubmit={handleAuthSubmit}
      />
    </>
  );
}
