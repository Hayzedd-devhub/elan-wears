"use client";

import { getShareUrl } from "@/lib/util";
import { siteConfig } from "@/lib/config";
import { MessageCircle } from "lucide-react";
const whatsappNumber = siteConfig.whatsappNumber;

interface WhatsAppButtonProps {
  itemName: string;
  price: number;
  slug: string;
}

export function WhatsAppButton({ itemName, price, slug }: WhatsAppButtonProps) {
  const formatPrice = (price: number) => {
    return `${siteConfig.currencySymbol}${price.toLocaleString()}`;
  };

  const handleWhatsApp = () => {
    const message = `Hi, I found interest in this item: ${itemName}\n\n${getShareUrl(slug) || ""}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button
      onClick={handleWhatsApp}
      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-chocolate dark:bg-gold text-white dark:text-chocolate font-bold rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95 shadow-sm"
    >
      <MessageCircle className="w-5 h-5" />
      Order via WhatsApp
    </button>
  );
}
