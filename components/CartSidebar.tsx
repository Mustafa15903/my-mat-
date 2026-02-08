'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { luxuryColors } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartSidebarProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

export default function CartSidebar({
  items,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const { clearCart } = useCart();
  const router = useRouter();

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(sidebarRef.current, {
        x: '0%',
        duration: 0.4,
        ease: 'power3.out',
      });

      // Stagger items animation
      if (itemsRef.current) {
        gsap.fromTo(itemsRef.current.children,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.05,
            delay: 0.2,
            ease: 'power2.out',
          }
        );
      }
    } else {
      document.body.style.overflow = 'auto';

      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3,
        ease: 'power2.in',
      });

      gsap.to(sidebarRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in',
      });
    }
  }, [isOpen]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: ''
  });

  const handleCheckoutClick = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setShowCheckoutForm(true);
  };

  const handleCheckoutProcess = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!customerInfo.name.trim() || !customerInfo.email.trim() || !customerInfo.address.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (checkingOut) return;
    setCheckingOut(true);

    try {
      // 1. Create Order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_email: customerInfo.email,
          customer_name: customerInfo.name,
          total_amount: total,
          status: 'pending',
          shipping_address: customerInfo.address
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create Order Items
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price_at_time: item.price,
        image_url: item.image
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Success
      toast.success('Order placed successfully! Check your email for details.');
      clearCart();
      setCustomerInfo({ name: '', email: '', address: '' });
      setShowCheckoutForm(false);
      onClose(); // Close sidebar

    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop Overlay - إزالة backdrop-blur من الشاشات الصغيرة */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/40  opacity-0 pointer-events-none"
        onClick={onClose}
      />

      <aside
        ref={sidebarRef}
        className="fixed right-0 top-0 h-[100dvh] z-[51] flex flex-col shadow-2xl transform translate-x-full"
        style={{
          backgroundColor: luxuryColors.bgLight,
          width: 'min(400px, 100vw)',
          maxWidth: '100vw',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 border-b flex-shrink-0" style={{ borderColor: luxuryColors.border }}>
          <h2
            className="text-base sm:text-lg font-light tracking-wide"
            style={{ color: luxuryColors.textPrimary }}
          >
            Cart ({items.reduce((acc, item) => acc + item.quantity, 0)})
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close cart"
          >
            <X size={20} style={{ color: luxuryColors.textPrimary }} />
          </button>
        </div>

        {/* Cart Items Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
          <div
            ref={itemsRef}
            className="space-y-6"
          >
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 pt-20">
                <p
                  className="text-lg font-light"
                  style={{ color: luxuryColors.textPrimary }}
                >
                  Your cart is empty
                </p>
                <p
                  className="text-sm"
                  style={{ color: luxuryColors.textSecondary }}
                >
                  Looks like you haven't added anything yet.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 text-sm underline underline-offset-4 hover:opacity-70 transition-opacity"
                  style={{ color: luxuryColors.textPrimary }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 group"
                >
                  <div className="w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 bg-gray-100 relative overflow-hidden rounded-sm">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4
                          className="font-medium text-base mb-1 truncate flex-1"
                          style={{ color: luxuryColors.textPrimary }}
                          title={item.name}
                        >
                          {item.name}
                        </h4>
                        <p
                          className="text-sm font-medium whitespace-nowrap"
                          style={{ color: luxuryColors.textPrimary }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: luxuryColors.textSecondary }}
                      >
                        ${item.price.toFixed(2)} / each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-md" style={{ borderColor: luxuryColors.border }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-2 sm:p-1.5 hover:bg-black/5 transition-colors"
                          style={{ color: luxuryColors.textSecondary }}
                        >
                          <Minus size={16} />
                        </button>
                        <span
                          className="text-sm w-10 sm:w-8 text-center font-medium"
                          style={{ color: luxuryColors.textPrimary }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-2 sm:p-1.5 hover:bg-black/5 transition-colors"
                          style={{ color: luxuryColors.textSecondary }}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-xs p-2 -mr-2 flex items-center gap-1 hover:text-red-500 transition-colors"
                        style={{ color: luxuryColors.textSecondary }}
                      >
                        <Trash2 size={16} />
                        <span className="sr-only sm:not-sr-only sm:inline-block">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Summary - إزالة backdrop-blur من الشاشات الصغيرة */}
        {items.length > 0 && (
          <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-t bg-white/50 md:backdrop-blur-sm" style={{ borderColor: luxuryColors.border }}>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span style={{ color: luxuryColors.textSecondary }}>Subtotal</span>
                <span style={{ color: luxuryColors.textPrimary }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: luxuryColors.textSecondary }}>Tax (10%)</span>
                <span style={{ color: luxuryColors.textPrimary }}>
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-3 border-t" style={{ borderColor: luxuryColors.border }}>
                <span style={{ color: luxuryColors.textPrimary }}>Total</span>
                <span style={{ color: luxuryColors.accentGold }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {!showCheckoutForm ? (
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3 sm:py-4 rounded-xl font-medium tracking-wide text-center transition-all duration-300 hover:opacity-90 active:scale-[0.98] shadow-lg touch-manipulation"
                style={{
                  backgroundColor: luxuryColors.textPrimary,
                  color: luxuryColors.bgLight,
                  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'
                }}
              >
                Proceed to Checkout
              </button>
            ) : (
              <form onSubmit={handleCheckoutProcess} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: luxuryColors.textSecondary }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base outline-none focus:ring-2 touch-manipulation"
                    style={{
                      border: `1px solid ${luxuryColors.border}`,
                      color: luxuryColors.textPrimary
                    }}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: luxuryColors.textSecondary }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base outline-none focus:ring-2 touch-manipulation"
                    style={{
                      border: `1px solid ${luxuryColors.border}`,
                      color: luxuryColors.textPrimary
                    }}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2" style={{ color: luxuryColors.textSecondary }}>
                    Shipping Address
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base outline-none focus:ring-2 resize-none touch-manipulation"
                    style={{
                      border: `1px solid ${luxuryColors.border}`,
                      color: luxuryColors.textPrimary
                    }}
                    placeholder="&apos;123 Main St, City, Country&apos;"
                    rows={2}
                    required
                  />
                </div>
                <div className="flex gap-2 sm:gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckoutForm(false)}
                    className="flex-1 py-3 sm:py-3.5 rounded-lg font-medium text-sm sm:text-base transition-colors touch-manipulation"
                    style={{
                      border: `1px solid ${luxuryColors.border}`,
                      color: luxuryColors.textSecondary
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={checkingOut}
                    className="flex-1 py-3 sm:py-3.5 rounded-lg font-medium text-sm sm:text-base transition-all hover:opacity-90 disabled:opacity-50 touch-manipulation"
                    style={{
                      backgroundColor: luxuryColors.accentGold,
                      color: luxuryColors.bgLight
                    }}
                  >
                    {checkingOut ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </aside>
    </>
  );
}