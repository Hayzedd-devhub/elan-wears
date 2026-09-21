"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
  Tag,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-chocolate">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Catalog Items", href: "/admin/items", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Analytics", href: "/admin/insights", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-chocolate relative">
      {/* Brand Background Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={siteConfig.backgroundUrl}
          alt="Brand Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-chocolate/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-chocolate-light/40 backdrop-blur-md border-r border-gray-100 dark:border-gold/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 h-20 px-6 border-b border-gray-100 dark:border-gold/10">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-gold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteConfig.logoUrl}
                alt="Brand Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-chocolate dark:text-gold tracking-tight">
                {siteConfig.businessName}
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gold/60 uppercase font-bold tracking-widest">
                Admin Portal
              </p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gold/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gold" />
            </button>
          </div>

          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            <p className="text-[11px] font-bold text-gray-400 dark:text-gold/40 uppercase tracking-widest mb-4 ml-4">
              Main Menu
            </p>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center justify-between group px-4 py-3.5 text-chocolate/70 dark:text-gold-light/70 hover:bg-chocolate/5 dark:hover:bg-gold/10 hover:text-chocolate dark:hover:text-gold rounded-2xl transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </nav>

          <div className="p-6 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 px-4 py-4 text-white dark:text-chocolate bg-chocolate dark:bg-gold rounded-2xl font-bold shadow-lg shadow-chocolate/20 dark:shadow-gold/10 hover:opacity-90 active:scale-95 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72 min-h-screen flex flex-col relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-6 bg-white/70 dark:bg-chocolate/70 backdrop-blur-lg border-b border-gray-100 dark:border-gold/10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-gray-50 dark:bg-gold/10 hover:bg-gray-100 dark:hover:bg-gold/20 transition-colors"
          >
            <Menu className="w-5 h-5 text-chocolate dark:text-gold" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-xs font-bold text-chocolate dark:text-gold">
                Administrator
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gold/50">
                Full Access
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold/20 dark:bg-gold/30 flex items-center justify-center border border-gold/30">
              <span className="text-chocolate dark:text-gold font-bold text-sm">
                A
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-10">{children}</main>

        <footer className="p-6 text-center border-t border-gray-100 dark:border-gold/5 mt-auto">
          <p className="text-xs text-gray-400 dark:text-gold/30 font-medium">
            &copy; {new Date().getFullYear()} {siteConfig.businessName} Admin
            Console. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
