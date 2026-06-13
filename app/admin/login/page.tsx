"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Info, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-chocolate flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gold/10 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center gap-4 mb-10">
            <div className="relative w-46 h-16 rounded-2xl overflow-hidden border-2 border-gold shadow-lg">
              <Image
                src="/logo-main.jpeg"
                alt="Brand Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-chocolate dark:text-gold tracking-tight">
                Admin Console
              </h1>
              <p className="text-gray-500 dark:text-gold/60 text-sm mt-1">
                Secure access to your catalog management
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-gold/5 dark:bg-gold/10 border border-gold/20 rounded-2xl flex gap-3 items-start">
              <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="text-xs text-chocolate/80 dark:text-gold-light/80 leading-relaxed">
                <span className="font-bold">Setup Note:</span> If this is the
                first time accessing the console, the credentials you enter
                below will become your permanent admin login.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-bold text-chocolate dark:text-gold-light ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-5 py-3.5 border border-gray-200 dark:border-gold/20 rounded-xl bg-gray-50 dark:bg-chocolate text-chocolate dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-chocolate dark:text-gold-light ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full px-5 pr-12 py-3.5 border border-gray-200 dark:border-gold/20 rounded-xl bg-gray-50 dark:bg-chocolate text-chocolate dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-chocolate dark:text-white" />
                  ) : (
                    <Eye className="w-5 h-5 text-chocolate dark:text-white" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-chocolate dark:bg-gold text-white dark:text-chocolate rounded-xl font-bold text-lg hover:opacity-95 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
