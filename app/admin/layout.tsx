'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, FolderTree, Settings, LogOut, Package, Menu, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { luxuryColors } from '@/lib/theme';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If we are on the login page, render children without the layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Client-side protection
  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', href: '/admin/categories', icon: FolderTree },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen font-sans" style={{ backgroundColor: luxuryColors.bgLight, color: luxuryColors.textPrimary }}>

      {/* Mobile Header */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-[60] p-3 sm:p-4 flex items-center justify-between shadow-sm"
        style={{ backgroundColor: luxuryColors.bgLight, borderBottom: `1px solid ${luxuryColors.border}` }}
      >
        <h1 className="text-base sm:text-lg font-bold tracking-tight" style={{ color: luxuryColors.textPrimary }}>Admin Panel</h1>
        <button
          onClick={toggleSidebar}
          className="p-2 -mr-2 rounded-lg transition-colors hover:bg-black/5"
          style={{ color: luxuryColors.textSecondary }}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-[100dvh] w-56 md:w-56 lg:w-64 flex flex-col z-50 transition-transform duration-300 transform shadow-lg
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 pt-16 md:pt-0`
        }
        style={{ backgroundColor: luxuryColors.bgLight, borderRight: `1px solid ${luxuryColors.border}` }}
      >
        <div className="hidden md:block p-4 md:p-6" style={{ borderBottom: `1px solid ${luxuryColors.border}` }}>
          <h1 className="text-lg md:text-xl font-bold tracking-tight" style={{ color: luxuryColors.textPrimary }}>Admin Panel</h1>
          <p className="text-xs mt-1" style={{ color: luxuryColors.textSecondary }}>myMat Dashboard</p>
        </div>

        <nav className="flex-1 p-3 md:p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'shadow-sm' : ''
                  }`}
                style={{
                  backgroundColor: isActive ? luxuryColors.accentGold : 'transparent',
                  color: isActive ? luxuryColors.bgLight : luxuryColors.textPrimary,
                }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 md:p-4" style={{ borderTop: `1px solid ${luxuryColors.border}` }}>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg transition-colors mb-2 hover:bg-black/5"
            style={{ color: luxuryColors.textSecondary }}
          >
            ← Return to Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-lg transition-colors hover:bg-red-50"
            style={{ color: luxuryColors.error }}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full pt-16 md:pt-0">
        <div className="px-3 sm:px-4 md:px-8 py-4 md:py-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
