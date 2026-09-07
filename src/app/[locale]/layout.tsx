import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import "@/app/globals.css";

import { I18nProvider } from "@/lib/i18n/client";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, locales, localeDirection, type Locale } from "@/lib/i18n/config";
import { ServiceWorker } from "@/components/pwa/service-worker";
import { ThemeProvider, themeScript } from "@/components/layout/theme";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${dict.meta.name} — ${dict.meta.tagline}`,
      template: `%s · ${dict.meta.name}`,
    },
    description: dict.meta.description,
    applicationName: dict.meta.name,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: dict.meta.short,
      statusBarStyle: "default",
    },
    icons: {
      icon: [
        { url: "/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.name,
      title: `${dict.meta.name} — ${dict.meta.tagline}`,
      description: dict.meta.description,
      locale: locale === "ha" ? "ha_NG" : "en_NG",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: dict.meta.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.name,
      description: dict.meta.description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((code) => [code, `/${code}`])),
    },
    // Counselling pages carry their own noindex; the site as a whole is
    // indexable so people can find it in the first place.
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  // Matches the browser chrome to the resolved theme on mobile.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5B3A7E" },
    { media: "(prefers-color-scheme: dark)", color: "#140B1C" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const messages = getDictionary(locale);

  return (
    <html lang={locale} dir={localeDirection[locale]} suppressHydrationWarning>
      <head>
        {/* Resolves the theme before first paint. Must stay the first thing in
            <head> — anything above it can paint in the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* The faces above the fold. The rest load on demand. */}
        <link
          rel="preload"
          href="/fonts/jakarta-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/fraunces-display.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          <I18nProvider locale={locale} messages={messages as unknown as Record<string, unknown>}>
            {children}
          </I18nProvider>
        </ThemeProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
