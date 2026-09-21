/**
 * Single source of truth for everything that changes between client deployments.
 * Every value here is driven by an env var with a sane fallback, so shipping a
 * new client is just setting env vars — no code or component edits.
 *
 * Logo/background accept either a local /public path (default) or an absolute
 * URL (e.g. a Cloudinary asset), so a client can be re-branded without touching
 * files in the repo at all.
 */
export const siteConfig = {
  businessName: process.env.NEXT_PUBLIC_BUSINESS_NAME || "My Catalog",
  webUrl: process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  currencySymbol: process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₦",
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || "/logo-main.jpeg",
  backgroundUrl: process.env.NEXT_PUBLIC_BACKGROUND_URL || "/background.jpeg",
  heroTitle: process.env.NEXT_PUBLIC_HERO_TITLE || "Welcome to Our Collection",
  heroSubtitle:
    process.env.NEXT_PUBLIC_HERO_SUBTITLE ||
    "Discover quality products, curated just for you.",
  themeColor: process.env.NEXT_PUBLIC_THEME_COLOR || "#2D1210",
} as const;
