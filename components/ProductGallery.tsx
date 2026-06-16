"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface Media {
  type: "image" | "video";
  url: string;
}

interface ProductGalleryProps {
  media: Media[];
  itemName: string;
}

export function ProductGallery({ media, itemName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!media || media.length === 0) {
    return (
      <div className="aspect-square bg-chocolate-light/10 flex items-center justify-center rounded-2xl border border-gold/10">
        <span className="text-gold/40">No media available</span>
      </div>
    );
  }

  const activeMedia = media[activeIndex];

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <div className="relative aspect-square bg-chocolate-light/10 rounded-2xl border border-gold/10 overflow-hidden shadow-sm">
        {activeMedia.type === "image" ? (
          <Image
            src={activeMedia.url}
            alt={itemName}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <video
            controls
            className="w-full h-full object-cover"
            key={activeMedia.url}
          >
            <source src={activeMedia.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {media.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {media.map((m, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                activeIndex === index
                  ? "border-gold shadow-md scale-105"
                  : "border-gold/10 opacity-70 hover:opacity-100"
              }`}
            >
              {m.type === "image" ? (
                <Image
                  src={m.url}
                  alt={`${itemName} ${index}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-chocolate-light flex items-center justify-center">
                  <Play className="w-6 h-6 text-gold fill-gold/20" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
