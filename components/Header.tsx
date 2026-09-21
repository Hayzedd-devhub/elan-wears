"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Heart } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { SortDropdown, SortOption } from "@/components/SortDropdown";

interface HeaderProps {
  businessName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFavouritesClick: () => void;
  favouritesCount: number;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function Header({
  businessName,
  searchQuery,
  onSearchChange,
  onFavouritesClick,
  favouritesCount,
  sortBy,
  onSortChange,
}: HeaderProps) {
  const [isSearchRowHidden, setIsSearchRowHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    // Above the max momentum/rubber-band jitter seen between animation
    // frames, so a settling scroll never flips the row back and forth —
    // only a real directional gesture commits.
    const DIRECTION_THRESHOLD = 24;
    let ticking = false;

    function evaluateScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 80) {
        setIsSearchRowHidden(false);
        lastScrollY.current = currentScrollY;
      } else if (Math.abs(delta) > DIRECTION_THRESHOLD) {
        setIsSearchRowHidden(delta > 0);
        lastScrollY.current = currentScrollY;
      }

      ticking = false;
    }

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(evaluateScroll);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-chocolate border-b border-gold/20 shadow-sm transform-gpu">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div
          className={`flex items-center justify-between gap-4 transition-[margin] duration-300 ease-in-out ${
            isSearchRowHidden ? "mb-0" : "mb-4"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`relative overflow-hidden border border-gold/30 ${
                siteConfig.logoOrientation === "square"
                  ? "w-10 h-10 rounded-xl"
                  : "w-40 h-10 rounded-md"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteConfig.logoUrl}
                alt="Brand Logo"
                className={`w-full h-full ${
                  siteConfig.logoOrientation === "square"
                    ? "object-contain"
                    : "object-cover"
                }`}
              />
            </div>
            <h1 className="text-2xl aesthetic-title tracking-tight">
              {businessName}
            </h1>
          </div>
          <button
            onClick={onFavouritesClick}
            className="relative p-2.5 rounded-full hover:bg-gold/10 dark:hover:bg-gold/20 transition-all group"
            aria-label="View favourites"
          >
            <Heart className="w-5 h-5 text-chocolate dark:text-gold group-hover:scale-110 transition-transform" />
            {favouritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                {favouritesCount > 99 ? "99+" : favouritesCount}
              </span>
            )}
          </button>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            isSearchRowHidden
              ? "grid-rows-[0fr] opacity-0"
              : "grid-rows-[1fr] opacity-100"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="relative group flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-gold transition-colors" />
                <input
                  type="text"
                  placeholder="Search our collection..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-chocolate-light/30 border border-gray-200 dark:border-gold/20 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                />
              </div>
              <SortDropdown value={sortBy} onChange={onSortChange} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
