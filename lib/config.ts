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
  // "landscape" (default) fills a wide bar and crops to fit — suits a wordmark
  // logo. "square" fits the whole logo in a compact icon-shaped slot without
  // cropping — suits a monogram/icon-only logo (portrait or square art).
  logoOrientation:
    process.env.NEXT_PUBLIC_LOGO_ORIENTATION === "square"
      ? ("square" as const)
      : ("landscape" as const),
  backgroundUrl: process.env.NEXT_PUBLIC_BACKGROUND_URL || "/background.jpeg",
  heroTitle: process.env.NEXT_PUBLIC_HERO_TITLE || "Welcome to Our Collection",
  heroSubtitle:
    process.env.NEXT_PUBLIC_HERO_SUBTITLE ||
    "Discover quality products, curated just for you.",
  // Drives both the browser/PWA chrome tint AND the site's actual dark/base
  // brand color (overrides --color-chocolate & friends in globals.css — see
  // lib/theme.ts). Defaults match Komfy Sole's current palette exactly, so
  // deployments that don't set these see no change.
  themeColor: process.env.NEXT_PUBLIC_THEME_COLOR || "#2D1210",
  accentColor: process.env.NEXT_PUBLIC_ACCENT_COLOR || "#D4AF37",
} as const;
