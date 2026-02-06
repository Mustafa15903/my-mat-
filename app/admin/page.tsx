'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, ShoppingBag, FolderTree, TrendingUp, Loader2 } from 'lucide-react';
import OverviewChart from './components/OverviewChart';
import { luxuryColors } from '@/lib/theme';

// Prevent static generation - this page needs runtime environment variables
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [
        { count: productsCount },
        { count: categoriesCount },
        { count: ordersCount }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        products: productsCount || 0,
        categories: categoriesCount || 0,
        orders: ordersCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: luxuryColors.textPrimary }}>Dashboard Overview</h1>
        <p className="text-sm mt-1" style={{ color: luxuryColors.textSecondary }}>Welcome to your product management dashboard.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl animate-pulse"
              style={{ backgroundColor: `${luxuryColors.border}` }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {/* Products */}
          <div
            className="p-5 md:p-6 rounded-xl shadow-sm relative overflow-hidden transition-all hover:shadow-md"
            style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShoppingBag className="w-24 h-24" style={{ color: luxuryColors.textPrimary }} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xs md:text-sm font-medium" style={{ color: luxuryColors.textSecondary }}>Total Products</h3>
              <p className="text-3xl md:text-4xl font-bold mt-3" style={{ color: luxuryColors.textPrimary }}>{stats.products}</p>
              <div className="mt-4 flex items-center text-xs md:text-sm" style={{ color: luxuryColors.success }}>
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Active in catalog</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div
            className="p-5 md:p-6 rounded-xl shadow-sm relative overflow-hidden transition-all hover:shadow-md"
            style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <FolderTree className="w-24 h-24" style={{ color: luxuryColors.textPrimary }} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xs md:text-sm font-medium" style={{ color: luxuryColors.textSecondary }}>Total Categories</h3>
              <p className="text-3xl md:text-4xl font-bold mt-3" style={{ color: luxuryColors.textPrimary }}>{stats.categories}</p>
              <div className="mt-4 flex items-center text-xs md:text-sm" style={{ color: luxuryColors.accentGold }}>
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Organized collections</span>
              </div>
            </div>
          </div>

          {/* Orders */}
          <div
            className="p-5 md:p-6 rounded-xl shadow-sm relative overflow-hidden transition-all hover:shadow-md"
            style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Package className="w-24 h-24" style={{ color: luxuryColors.textPrimary }} />
            </div>
            <div className="relative z-10">
              <h3 className="text-xs md:text-sm font-medium" style={{ color: luxuryColors.textSecondary }}>Total Orders</h3>
              <p className="text-3xl md:text-4xl font-bold mt-3" style={{ color: luxuryColors.textPrimary }}>{stats.orders}</p>
              <div className="mt-4 flex items-center text-xs md:text-sm" style={{ color: luxuryColors.accentGreen }}>
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Lifetime volume</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div
          className="p-5 md:p-6 rounded-xl shadow-sm"
          style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}
        >
          <h3 className="text-base md:text-lg font-semibold mb-6" style={{ color: luxuryColors.textPrimary }}>Revenue Trends</h3>
          <OverviewChart />
        </div>

        {/* Recent Activity Widget */}
        <div
          className="p-5 md:p-6 rounded-xl shadow-sm"
          style={{ backgroundColor: luxuryColors.bgLight, border: `1px solid ${luxuryColors.border}` }}
        >
          <h3 className="text-base md:text-lg font-semibold mb-4" style={{ color: luxuryColors.textPrimary }}>Recent Activity</h3>
          <div className="space-y-3">
            {[
              { user: 'Guest User', action: 'New order received', time: '2 minutes ago' },
              { user: 'Admin', action: 'Product updated', time: '15 minutes ago' },
              { user: 'Guest User', action: 'New order received', time: '1 hour ago' },
              { user: 'Admin', action: 'Category added', time: '2 hours ago' },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-3 md:gap-4 py-3 last:border-0"
                style={{ borderBottom: i < 3 ? `1px solid ${luxuryColors.border}` : 'none' }}
              >
                <div
                  className="w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                  style={{ backgroundColor: luxuryColors.border, color: luxuryColors.textSecondary }}
                >
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium" style={{ color: luxuryColors.textPrimary }}>{activity.action}</p>
                  <p className="text-xs" style={{ color: luxuryColors.textSecondary }}>{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
