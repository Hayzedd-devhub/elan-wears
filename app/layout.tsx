import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { getThemeOverrideStyles } from "@/lib/theme";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.webUrl),
  title: siteConfig.businessName,
  description: `Digital catalog for ${siteConfig.businessName}`,
  icons: {
    icon: siteConfig.faviconUrl,
    shortcut: siteConfig.faviconUrl,
    apple: siteConfig.faviconUrl,
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <style dangerouslySetInnerHTML={{ __html: getThemeOverrideStyles() }} />
        {children}
      </body>
    </html>
  );
}
