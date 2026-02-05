'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

// Define a CartItem type that extends Product with a quantity
interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[]; // Cart now holds CartItem objects
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void; // Added updateQuantity
    clearCart: () => void;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]); // State now uses CartItem[]
    const [isLoading, setIsLoading] = useState(true);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('cart-storage');
            if (stored) {
                setCart(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load cart from storage:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save to localStorage whenever cart changes
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('cart-storage', JSON.stringify(cart));
        }
    }, [cart, isLoading]);

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);
            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 } // Increment quantity
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }]; // Add new item with quantity 1
        });
        console.log('Added to cart via Context:', product.name);
    };

    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, isLoading }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
