"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Package,
  DollarSign,
  Tag,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalItems: number;
  totalCategories: number;
  totalFavourites: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalCategories: 0,
    totalFavourites: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [itemsRes, categoriesRes, insightsRes] = await Promise.all([
          fetch("/api/items"),
          fetch("/api/categories"),
          fetch("/api/admin/insights"),
        ]);

        const itemsData = itemsRes.ok ? await itemsRes.json() : { items: [] };
        const categoriesData = categoriesRes.ok
          ? await categoriesRes.json()
          : { categories: [] };
        const insightsData = insightsRes.ok
          ? await insightsRes.json()
          : { totalFavourites: 0 };

        const totalRevenue = itemsData.items.reduce(
          (sum: number, item: { price: number }) => sum + (item.price || 0),
          0,
        );

        setStats({
          totalItems: itemsData.items.length,
          totalCategories: categoriesData.categories.length,
          totalFavourites: insightsData.totalFavourites || 0,
          totalRevenue,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Items",
      value: stats.totalItems,
      icon: Package,
      color: "bg-chocolate dark:bg-gold",
      iconColor: "text-white dark:text-chocolate",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Tag,
      color: "bg-gold/20 dark:bg-gold/10",
      iconColor: "text-chocolate dark:text-gold",
    },
    {
      title: "Total Favourites",
      value: stats.totalFavourites,
      icon: TrendingUp,
      color: "bg-chocolate/10 dark:bg-white/5",
      iconColor: "text-chocolate dark:text-gold",
    },
    {
      title: "Price Range",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-gold dark:bg-gold-light/20",
      iconColor: "text-chocolate dark:text-gold",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-chocolate dark:text-gold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 dark:text-gold/60 mt-1">
            Welcome back! Here's what's happening with your catalog today.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <div
                key={stat.title}
                className="bg-white dark:bg-chocolate-light/20 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gold/10 backdrop-blur-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-4 rounded-2xl ${stat.color} ${stat.iconColor} shadow-inner`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-gold/40 uppercase tracking-widest mb-0.5">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-black text-chocolate dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gold/10 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-chocolate dark:text-gold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/admin/items"
              className="flex items-center justify-between p-5 bg-gray-50 dark:bg-chocolate-light/40 border border-gray-100 dark:border-gold/5 rounded-2xl hover:border-gold/50 dark:hover:border-gold/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-chocolate rounded-xl shadow-sm">
                  <Package className="w-6 h-6 text-chocolate dark:text-gold" />
                </div>
                <div>
                  <span className="block font-bold text-chocolate dark:text-gold-light">
                    Manage Items
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gold/50">
                    Add or edit your products
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/admin/insights"
              className="flex items-center justify-between p-5 bg-gray-50 dark:bg-chocolate-light/40 border border-gray-100 dark:border-gold/5 rounded-2xl hover:border-gold/50 dark:hover:border-gold/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-chocolate rounded-xl shadow-sm">
                  <TrendingUp className="w-6 h-6 text-chocolate dark:text-gold" />
                </div>
                <div>
                  <span className="block font-bold text-chocolate dark:text-gold-light">
                    View Insights
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gold/50">
                    Analyze customer interests
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
