"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminLayout } from "@/components/AdminLayout";
import { ItemForm } from "@/components/ItemForm";
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Share2,
  Copy,
  Check,
  ChevronRight,
  Search,
} from "lucide-react";
import { ItemProps } from "@/app/types";
import MediaPreview from "@/components/MediaPreview";
import { siteConfig } from "@/lib/config";
const baseUrl = siteConfig.webUrl;

export default function AdminItemsPage() {
  const [items, setItems] = useState<ItemProps[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemProps | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        fetch("/api/items"),
        fetch("/api/categories"),
      ]);

      if (itemsRes.ok) {
        const data = await itemsRes.json();
        setItems(data.items);
      }
      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: unknown) => {
    setIsSubmitting(true);
    try {
      const url = editingItem ? `/api/items/${editingItem._id}` : "/api/items";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchData();
        setShowForm(false);
        setEditingItem(null);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save item");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: ItemProps) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems(items.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const getShareUrl = (slug: string) => {
    return `${baseUrl}/item/${slug}`;
  };

  const handleCopyLink = async (item: ItemProps) => {
    const url = getShareUrl(item.slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(item._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
    setShowShareMenu(null);
  };

  const handleShare = (
    platform: "twitter" | "facebook" | "whatsapp",
    item: ItemProps,
  ) => {
    const url = getShareUrl(item.slug);
    const text = `Check out this item: ${item.name} - ${siteConfig.currencySymbol}${item.price.toLocaleString()}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
    setShowShareMenu(null);
  };

  const handleNativeShare = async (item: ItemProps) => {
    const url = getShareUrl(item.slug);
    const text = `Check out this item: ${item.name} - ${siteConfig.currencySymbol}${item.price.toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: text,
          url: url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      setShowShareMenu(showShareMenu === item._id ? null : item._id);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-chocolate dark:text-gold tracking-tight">
              Inventory Management
            </h1>
            <p className="text-gray-500 dark:text-gold/60 mt-1">
              Organize and update your product catalog.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-chocolate dark:bg-gold text-white dark:text-chocolate rounded-2xl font-bold shadow-lg shadow-chocolate/20 dark:shadow-gold/10 hover:opacity-95 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Item
            </button>
          )}
        </div>

        {showForm ? (
          <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gold/10 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-chocolate dark:text-gold mb-8 flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Edit className="w-5 h-5" />
              </div>
              {editingItem ? "Refine Product Details" : "Create New Product Listing"}
            </h2>
            <ItemForm
              initialData={editingItem || undefined}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative group max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-gold transition-colors" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-chocolate-light/20 border border-gray-100 dark:border-gold/10 rounded-2xl text-sm text-chocolate dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
              />
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl p-16 shadow-sm border border-gray-100 dark:border-gold/10 text-center backdrop-blur-sm">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ImageIcon className="w-10 h-10 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-chocolate dark:text-gold mb-2">No Items Found</h3>
                <p className="text-gray-500 dark:text-gold/50 mb-8 max-w-sm mx-auto">
                  {searchQuery ? `No results for "${searchQuery}"` : "Your inventory is currently empty. Start by adding your first premium item."}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-chocolate dark:bg-gold text-white dark:text-chocolate rounded-2xl font-bold shadow-lg shadow-chocolate/20 dark:shadow-gold/10 hover:opacity-95 active:scale-95 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Item
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl shadow-sm border border-gray-100 dark:border-gold/10 overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gold/5 border-b border-gray-100 dark:border-gold/10">
                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                          Visual
                        </th>
                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                          Product Name
                        </th>
                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                          Category
                        </th>
                        <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                          Pricing
                        </th>
                        <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                          Operations
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gold/10">
                      {filteredItems.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 dark:hover:bg-gold/5 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-chocolate-light/40 border border-gray-100 dark:border-gold/10 group-hover:scale-105 transition-transform">
                              {item.media?.length ? (
                                <MediaPreview media={item.media[0]} itemName={item.name} />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-300">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-chocolate dark:text-white tracking-tight">
                              {item.name}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-gold/10 dark:bg-gold/20 text-chocolate dark:text-gold-light uppercase tracking-wider">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-black text-chocolate dark:text-gold">
                              {siteConfig.currencySymbol}{item.price.toLocaleString()}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3 relative">
                              <button
                                onClick={() => handleNativeShare(item)}
                                className="p-2.5 text-chocolate/50 dark:text-gold/50 hover:bg-chocolate/5 dark:hover:bg-gold/10 hover:text-chocolate dark:hover:text-gold rounded-xl transition-all"
                                title="Share"
                              >
                                <Share2 className="w-4.5 h-4.5" />
                              </button>
                              {showShareMenu === item._id && (
                                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-chocolate rounded-2xl shadow-2xl border border-gray-100 dark:border-gold/20 py-2 z-20 min-w-[180px] animate-in fade-in slide-in-from-top-2">
                                  <button
                                    onClick={() => handleShare("whatsapp", item)}
                                    className="w-full px-4 py-2.5 text-left text-sm font-bold text-chocolate dark:text-gold-light hover:bg-gold/10 flex items-center gap-3 transition-colors"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    WhatsApp
                                  </button>
                                  <button
                                    onClick={() => handleShare("twitter", item)}
                                    className="w-full px-4 py-2.5 text-left text-sm font-bold text-chocolate dark:text-gold-light hover:bg-gold/10 flex items-center gap-3 transition-colors"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    Twitter
                                  </button>
                                  <button
                                    onClick={() => handleShare("facebook", item)}
                                    className="w-full px-4 py-2.5 text-left text-sm font-bold text-chocolate dark:text-gold-light hover:bg-gold/10 flex items-center gap-3 transition-colors"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    Facebook
                                  </button>
                                  <div className="my-2 border-t border-gray-100 dark:border-gold/10" />
                                  <button
                                    onClick={() => handleCopyLink(item)}
                                    className="w-full px-4 py-2.5 text-left text-sm font-bold text-chocolate dark:text-gold-light hover:bg-gold/10 flex items-center gap-3 transition-colors"
                                  >
                                    {copiedId === item._id ? (
                                      <>
                                        <Check className="w-4.5 h-4.5 text-green-500" />
                                        <span className="text-green-500">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-4.5 h-4.5" />
                                        Copy Link
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2.5 text-chocolate/50 dark:text-gold/50 hover:bg-chocolate/5 dark:hover:bg-gold/10 hover:text-chocolate dark:hover:text-gold rounded-xl transition-all"
                                title="Edit"
                              >
                                <Edit className="w-4.5 h-4.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(item._id)}
                                className="p-2.5 text-red-400/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-xl transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
