"use client";

import { Search, Heart } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  businessName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFavouritesClick: () => void;
}

export function Header({
  businessName,
  searchQuery,
  onSearchChange,
  onFavouritesClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-chocolate border-b border-gold/20 shadow-sm will-change-transform isolate">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-40 h-10 rounded-md overflow-hidden border border-gold/30">
              <Image
                src="/logo-main.jpeg"
                alt="Brand Logo"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-2xl aesthetic-title tracking-tight">
              {businessName}
            </h1>
          </div>
          <button
            onClick={onFavouritesClick}
            className="p-2.5 rounded-full hover:bg-gold/10 dark:hover:bg-gold/20 transition-all group"
            aria-label="View favourites"
          >
            <Heart className="w-5 h-5 text-chocolate dark:text-gold group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-gold transition-colors" />
          <input
            type="text"
            placeholder="Search our collection..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-chocolate-light/30 border border-gray-200 dark:border-gold/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          />
        </div>
      </div>
    </header>
  );
}
