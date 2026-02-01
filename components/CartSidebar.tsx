'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { luxuryColors } from '@/lib/theme';

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

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm opacity-0 pointer-events-none"
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <aside
        ref={sidebarRef}
        className="fixed right-0 top-0 w-full sm:w-[450px] h-[100dvh] z-[51] flex flex-col shadow-2xl transform translate-x-full"
        style={{ backgroundColor: luxuryColors.bgLight }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b" style={{ borderColor: luxuryColors.border }}>
          <h2
            className="text-xl font-light tracking-wide"
            style={{ color: luxuryColors.textPrimary }}
          >
            Your Cart ({items.reduce((acc, item) => acc + item.quantity, 0)})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={24} style={{ color: luxuryColors.textPrimary }} />
          </button>
        </div>

        {/* Cart Items Scroll Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
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
                  <div className="w-24 h-32 flex-shrink-0 bg-gray-100 relative overflow-hidden rounded-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4
                          className="font-medium text-base mb-1"
                          style={{ color: luxuryColors.textPrimary }}
                        >
                          {item.name}
                        </h4>
                        <p
                          className="text-sm font-medium"
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-md" style={{ borderColor: luxuryColors.border }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1.5 hover:bg-black/5 transition-colors"
                          style={{ color: luxuryColors.textSecondary }}
                        >
                          <Minus size={14} />
                        </button>
                        <span
                          className="text-sm w-8 text-center font-medium"
                          style={{ color: luxuryColors.textPrimary }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-black/5 transition-colors"
                          style={{ color: luxuryColors.textSecondary }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-xs flex items-center gap-1 hover:text-red-500 transition-colors"
                        style={{ color: luxuryColors.textSecondary }}
                      >
                        <Trash2 size={14} />
                        <span className="sr-only sm:not-sr-only sm:inline-block">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t bg-white/50 backdrop-blur-sm" style={{ borderColor: luxuryColors.border }}>
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

            <button
              onClick={onCheckout}
              className="w-full py-4 rounded-xl font-medium tracking-wide text-center transition-all duration-300 hover:opacity-90 active:scale-[0.98] shadow-lg"
              style={{
                backgroundColor: luxuryColors.textPrimary,
                color: luxuryColors.bgLight,
                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'
              }}
            >
              Checkout Now
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
