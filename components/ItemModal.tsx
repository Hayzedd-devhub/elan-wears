"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react";
import { ItemProps } from "@/app/types";
import MediaPreview from "./MediaPreview";

interface ItemModalProps {
  item: ItemProps | null;
  isOpen: boolean;
  isFavourite: boolean;
  onClose: () => void;
  onFavouriteToggle: (itemId: string) => void;
  onWhatsApp: (item: ItemProps) => void;
}

export function ItemModal({
  item,
  isOpen,
  isFavourite,
  onClose,
  onFavouriteToggle,
  onWhatsApp,
}: ItemModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !item) return null;

  const media = item.media || [];
  const hasMultipleMedia = media.length > 1;

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-chocolate rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative aspect-square bg-gray-50 dark:bg-chocolate-light/40">
          {media.length > 0 ? (
            <>
              <MediaPreview
                media={media[currentImageIndex]}
                itemName={item.name}
              />

              {hasMultipleMedia && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition-all z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {media.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2.5 h-1 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "w-6 bg-gold"
                            : "bg-white/60 hover:bg-white/90"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-300">
              No media available
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-400px)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 bg-gold/10 dark:bg-gold/20 text-gold dark:text-gold-light text-xs font-bold rounded-lg uppercase tracking-wider">
              {item.category}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-chocolate dark:text-white mb-2 tracking-tight">
            {item.name}
          </h2>

          <p className="text-3xl font-extrabold text-chocolate dark:text-gold flex items-center gap-1 mb-6">
            <span className="text-lg font-normal opacity-80">₦</span>
            {item.price.toLocaleString()}
          </p>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-gray-600 dark:text-gold-light/70 leading-relaxed text-base">
              {item.description}
            </p>
          </div>
        </div>

        <div className="p-5 bg-gray-50 dark:bg-chocolate-light/30 border-t border-gray-100 dark:border-gold/10 flex gap-4">
          <button
            onClick={() => onFavouriteToggle(item._id)}
            className={`flex items-center justify-center p-4 rounded-xl transition-all active:scale-95 ${
              isFavourite
                ? "bg-red-50 dark:bg-red-900/20 text-red-500 shadow-inner"
                : "bg-white dark:bg-chocolate text-chocolate dark:text-gold border border-gray-200 dark:border-gold/20 shadow-sm"
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavourite ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={() => onWhatsApp(item)}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-chocolate dark:bg-gold text-white dark:text-chocolate rounded-xl font-bold text-lg hover:opacity-95 active:scale-95 transition-all shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
            Order on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
