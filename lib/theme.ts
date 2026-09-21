import { siteConfig } from "@/lib/config";

function lighten(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  const mix = (channel: number) =>
    Math.round(channel + (255 - channel) * amount)
      .toString(16)
      .padStart(2, "0");

  return `#${mix((num >> 16) & 0xff)}${mix((num >> 8) & 0xff)}${mix(num & 0xff)}`;
}

/**
 * Overrides the CSS custom properties app/globals.css defines in its @theme
 * block, so the site's actual gold/chocolate palette (buttons, text, borders —
 * anything using bg-gold, text-chocolate, etc.) follows env-driven brand
 * colors instead of being hardcoded per client. Defaults exactly match the
 * hardcoded values already in globals.css, so this is a no-op unless
 * NEXT_PUBLIC_THEME_COLOR / NEXT_PUBLIC_ACCENT_COLOR are set.
 */
export function getThemeOverrideStyles(): string {
  const base = siteConfig.themeColor;
  const accent = siteConfig.accentColor;

  const vars: Record<string, string> = {
    "--color-theme": base,
    "--color-faint-bg": `${base}b8`,
    "--color-chocolate": base,
    "--color-chocolate-light": lighten(base, 0.3),
    "--color-gold": accent,
    "--color-gold-light": lighten(accent, 0.5),
    "--color-primary": accent,
    "--color-accent": accent,
  };

  const declarations = Object.entries(vars)
    .map(([key, value]) => `${key}:${value} !important`)
    .join(";");

  return `:root{${declarations}}`;
}
