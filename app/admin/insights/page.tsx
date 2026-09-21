'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Heart, Users, TrendingUp, Award, Star } from 'lucide-react';
import MediaPreview from '@/components/MediaPreview';
import { siteConfig } from '@/lib/config';

interface InsightData {
  userFavourites: Record<string, string[]>;
  mostFavouritedItems: Array<{
    _id: string;
    name: string;
    price: number;
    media: {type: "image" | "video", url: string}[];
    category: string;
    favouriteCount: number;
  }>;
  totalFavourites: number;
  totalUniqueUsers: number;
}

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch('/api/admin/insights');
        if (response.ok) {
          const data = await response.json();
          setInsights(data);
        }
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!insights) {
    return (
      <AdminLayout>
        <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl p-16 shadow-sm border border-gray-100 dark:border-gold/10 text-center backdrop-blur-sm">
          <p className="text-chocolate dark:text-gold-light font-bold">
            Unable to synchronize insights data. Please check your connection.
          </p>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: 'Gross Favourites',
      value: insights.totalFavourites,
      icon: Heart,
      color: 'bg-red-500/10 text-red-500',
    },
    {
      title: 'Active Audience',
      value: insights.totalUniqueUsers,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Trend Awareness',
      value: insights.mostFavouritedItems.length,
      icon: TrendingUp,
      color: 'bg-gold/10 text-gold',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-chocolate dark:text-gold tracking-tight">
            Audience Analytics
          </h1>
          <p className="text-gray-500 dark:text-gold/60 mt-1">
            Understand customer preferences and identify trending styles.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-white dark:bg-chocolate-light/20 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gold/10 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.color} shadow-inner`}>
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

        {/* Most Favourited Items */}
        <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl shadow-sm border border-gray-100 dark:border-gold/10 overflow-hidden backdrop-blur-sm">
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gold/10 flex items-center gap-3">
            <Award className="w-6 h-6 text-gold" />
            <h2 className="text-xl font-bold text-chocolate dark:text-gold tracking-tight">
              Curated Style Trends
            </h2>
          </div>

          {insights.mostFavouritedItems.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-gold/30" />
              </div>
              <p className="text-gray-500 dark:text-gold/50 font-medium">
                No audience engagement captured yet. Start sharing to see trends!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gold/5 border-b border-gray-100 dark:border-gold/10">
                    <th className="px-8 py-4 text-left text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                      Ranking
                    </th>
                    <th className="px-8 py-4 text-left text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                      Product Detail
                    </th>
                    <th className="px-8 py-4 text-left text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                      Category
                    </th>
                    <th className="px-8 py-4 text-left text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                      Market Value
                    </th>
                    <th className="px-8 py-4 text-right text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                      Popularity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gold/10">
                  {insights.mostFavouritedItems.map((item, index) => (
                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gold/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black shadow-sm ${
                          index === 0 
                            ? 'bg-gold text-chocolate ring-4 ring-gold/20'
                            : index === 1
                            ? 'bg-gray-200 dark:bg-chocolate-light/60 text-chocolate dark:text-gold-light'
                            : index === 2
                            ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
                            : 'bg-gray-50 dark:bg-chocolate-light/40 text-gray-400 dark:text-gold/30'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-chocolate-light/40 border border-gray-100 dark:border-gold/10 group-hover:scale-105 transition-transform">
                            {item.media?.[0] ? (
                              <MediaPreview media={item.media[0]} itemName={item.name} />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-gray-300">
                                <Heart className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <span className="font-bold text-chocolate dark:text-white tracking-tight">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gold/10 dark:bg-gold/20 text-chocolate dark:text-gold-light uppercase tracking-wider">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-chocolate dark:text-gold">
                          {siteConfig.currencySymbol}{item.price.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 font-black shadow-inner">
                          <Heart className="w-4.5 h-4.5 fill-current" />
                          {item.favouriteCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Engagement Summary */}
        {Object.keys(insights.userFavourites).length > 0 && (
          <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gold/10 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-chocolate dark:text-gold mb-8 flex items-center gap-3">
              <Users className="w-6 h-6 text-gold" />
              Audience Engagement Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(insights.userFavourites).slice(0, 6).map(([userId, items]) => (
                <div
                  key={userId}
                  className="p-5 bg-gray-50 dark:bg-chocolate-light/40 border border-gray-100 dark:border-gold/5 rounded-2xl hover:border-gold/30 transition-all group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-chocolate flex items-center justify-center border border-gray-100 dark:border-gold/10">
                      <Users className="w-4 h-4 text-chocolate dark:text-gold" />
                    </div>
                    <span className="text-[11px] text-gray-400 dark:text-gold/40 font-mono tracking-tighter">
                      USER_{userId.substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-chocolate dark:text-gold group-hover:scale-105 transition-transform origin-left">
                    {items.length} <span className="text-sm font-bold text-gray-500 dark:text-gold/50 ml-1">Favourites</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
