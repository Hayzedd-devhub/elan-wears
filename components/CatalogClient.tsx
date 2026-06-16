"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ItemCard } from "@/components/ItemCard";
import { ItemModal } from "@/components/ItemModal";
import { useAnonymousUser, useFavourites } from "@/hooks/useAnonymousUser";
import { getShareUrl } from "@/lib/util";
import { ItemProps } from "@/app/types";

interface CatalogClientProps {
  items: Array<ItemProps>;
  categories: string[];
}

export default function CatalogClient({
  items: initialItems,
  categories: initialCategories,
}: CatalogClientProps) {
  const [items, setItems] = useState(initialItems);
  const [categories, setCategories] = useState(initialCategories);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    (typeof initialItems)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userId = useAnonymousUser();
  const { favourites, toggleFavourite } = useFavourites(userId);

  const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "My Catalog";
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  useEffect(() => {
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
          setCategories([...data.categories, "Favourites"]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by category
    if (activeCategory !== "all" && activeCategory !== "Favourites") {
      filtered = filtered.filter((item) => item.category === activeCategory);
    }

    if (activeCategory === "Favourites") {
      filtered = filtered.filter((item) => favourites.has(item._id));
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [items, activeCategory, searchQuery, favourites]);

  const handleItemClick = (item: ItemProps) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleFavouriteToggle = async (itemId: string) => {
    await toggleFavourite(itemId);
  };

  const handleWhatsApp = (item: ItemProps) => {
    const formatPrice = (price: number) => {
      return `₦${price.toLocaleString()}`;
    };
    const message = `Hi, I found interest in this item: ${item.name} - (${formatPrice(item.price)}) \n\n${getShareUrl(item.slug) || ""}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full">
      <Header
        businessName={businessName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFavouritesClick={() => {
          setActiveCategory("Favourites");
        }}
      />

      {!searchQuery && activeCategory === "all" && (
        <div className="relative h-48 sm:h-64 overflow-hidden mb-6">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            src="/background.jpeg"
            alt="Brand Background"
            fill
            className="object-cover"
            priority
          />
          <div className="bg-[#000000CC] absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg tracking-tight">
              Premium Footwear
            </h2>
            <p className="text-gold-light text-sm sm:text-base max-w-md drop-shadow-md">
              Discover comfort and style in every step with our exclusive
              collection.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <main className="px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gold/60 text-lg">
                {searchQuery
                  ? "No items match your search"
                  : "No items available in this category"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  isFavourite={favourites.has(item._id)}
                  onFavouriteToggle={handleFavouriteToggle}
                  onWhatsApp={handleWhatsApp}
                  onClick={handleItemClick}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <ItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        isFavourite={selectedItem ? favourites.has(selectedItem._id) : false}
        onClose={handleCloseModal}
        onFavouriteToggle={handleFavouriteToggle}
        onWhatsApp={handleWhatsApp}
      />
    </div>
  );
}
