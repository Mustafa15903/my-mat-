'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { luxuryColors } from '@/lib/theme';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, password: string) => void;
}

export default function AuthModal({ isOpen, onClose, onSubmit }: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLogin, setIsLogin] = React.useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        pointerEvents: 'auto',
      });
      gsap.from(modalRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.out',
      });
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        pointerEvents: 'none',
      });
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg"
        style={{ 
          backgroundColor: luxuryColors.bgLight,
          width: 'min(90vw, 400px)',
          maxWidth: '90vw',
          padding: 'clamp(1.25rem, 4vw, 1.75rem)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-xl hover:opacity-60 transition-opacity"
          style={{ color: luxuryColors.textPrimary }}
          aria-label="Close modal"
        >
          ×
        </button>

        <h2
          className="text-xl sm:text-2xl font-light tracking-tight mb-4 sm:mb-6"
          style={{ color: luxuryColors.textPrimary }}
        >
          {isLogin ? 'Sign In' : 'Create Account'}
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: luxuryColors.border,
                color: luxuryColors.textPrimary,
              }}
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-transparent border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: luxuryColors.border,
                color: luxuryColors.textPrimary,
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 sm:py-3 rounded-lg font-light tracking-wider text-sm transition-all duration-300 hover:opacity-80"
            style={{
              backgroundColor: luxuryColors.textPrimary,
              color: luxuryColors.bgLight,
            }}
          >
            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Toggle */}
        <p
          className="text-center text-xs mt-3 sm:mt-4"
          style={{ color: luxuryColors.textSecondary }}
        >
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="hover:opacity-60 font-light transition-opacity"
            style={{ color: luxuryColors.accentGold }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </>
  );
}
