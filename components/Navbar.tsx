'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { luxuryColors } from '@/lib/theme';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  cartCount: number;
  onAccountClick: () => void;
  onCartClick: () => void;
}

export default function Navbar({ cartCount, onAccountClick, onCartClick }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);

      if (navRef.current) {
        gsap.to(navRef.current, {
          backgroundColor: scrolled
            ? 'rgba(250, 248, 246, 0.95)'
            : 'rgba(250, 248, 246, 0)',
          backdropFilter: scrolled ? 'blur(10px)' : 'blur(0px)',
          boxShadow: scrolled
            ? '0 1px 3px rgba(0, 0, 0, 0.05)'
            : '0 0px 0px rgba(0, 0, 0, 0)',
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: 'rgba(250, 248, 246, 0)',
          backdropFilter: 'blur(0px)',
          width: '100%',
          maxWidth: '100vw',
        }}
      >
        <div 
          className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 flex items-center justify-between w-full"
        >
          {/* Brand */}
          <div className="flex-shrink-0">
            <h1
              className="text-xl sm:text-2xl font-light tracking-widest relative z-50 whitespace-nowrap"
              style={{ color: luxuryColors.textPrimary }}
            >
              my<span style={{ color: luxuryColors.accentGold }}>Mat</span>
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex flex-1 justify-center gap-8 lg:gap-12">
            {['Shop', 'About', 'Contact'].map((link) => (
              <Link
                key={link}
                href={link === 'Shop' ? '/#products' : `/${link.toLowerCase()}`}
                className="text-xs sm:text-sm tracking-wide hover:opacity-60 transition-opacity duration-300"
                style={{ color: luxuryColors.textPrimary }}
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Account & Cart & Mobile Menu Toggle */}
          <div className="flex-shrink-0 flex justify-end items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
            <button
              onClick={onAccountClick}
              className="hidden sm:flex text-xs sm:text-sm tracking-wide hover:opacity-60 transition-opacity duration-300 items-center gap-1 sm:gap-2"
              style={{ color: luxuryColors.textPrimary }}
              aria-label="Account"
            >
              <User size={18} strokeWidth={1.5} />
              <span className="hidden lg:inline">Account</span>
            </button>

            <button
              onClick={onCartClick}
              className="text-xs sm:text-sm tracking-wide hover:opacity-60 transition-opacity duration-300 relative flex items-center gap-1 sm:gap-2"
              style={{ color: luxuryColors.textPrimary }}
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: luxuryColors.accentGold }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button - Improved touch target */}
            <button
              className="md:hidden z-50 relative p-2 -mr-2 touch-manipulation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ color: luxuryColors.textPrimary }}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-20 md:hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu */}
          <div
            className="fixed top-0 left-0 right-0 z-30 md:hidden flex flex-col items-center justify-center space-y-8 pt-24 pb-8"
            style={{ backgroundColor: luxuryColors.bgLight }}
          >
            {['Shop', 'About', 'Contact'].map((link) => (
              <Link
                key={link}
                href={link === 'Shop' ? '/#products' : `/${link.toLowerCase()}`}
                className="text-2xl font-light tracking-widest hover:opacity-60 transition-opacity"
                style={{ color: luxuryColors.textPrimary }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link}
              </Link>
            ))}
            <button
              onClick={() => {
                onAccountClick();
                setIsMobileMenuOpen(false);
              }}
              className="text-xl font-light tracking-widest mt-8 flex items-center gap-2"
              style={{ color: luxuryColors.textSecondary }}
            >
              <User size={24} /> Account
            </button>
          </div>
        </>
      )}
    </>
  );
}