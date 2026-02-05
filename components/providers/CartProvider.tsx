'use client';

import React from 'react';
import { CartProvider as Provider } from '@/context/CartContext';

export default function CartProviderWrapper({ children }: { children: React.ReactNode }) {
    return <Provider>{children}</Provider>;
}
