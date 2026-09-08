import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * The platform handles counselling intake data, so the defaults are deliberately
 * strict: no framing, no referrer leakage to third parties, no MIME sniffing,
 * and browser features (camera/mic/geolocation) switched off unless a future
 * online-counselling module explicitly opts back in.
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/**
 * Counselling, portal and API surfaces must never be cached by a proxy, a CDN
 * or the service worker. See public/sw.js for the matching rule.
 *
 * These are written as separate simple patterns rather than one combined
 * regular expression: a custom regex in a `source` is easy to get subtly wrong,
 * and getting it wrong breaks routing for every asset on the site.
 */
const noStore = [
  { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, private" },
];

const confidentialPaths = [
  "/:locale(en|ha)/counselling",
  "/:locale(en|ha)/counselling/:path*",
  "/:locale(en|ha)/portal",
  "/:locale(en|ha)/portal/:path*",
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Hosts allowed to serve imagery. Covers are plain <img> today, so this only
  // matters if next/image is adopted later — but declaring it now means adding
  // a photograph in src/lib/data/images.ts is genuinely a one-line change.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      ...confidentialPaths.map((source) => ({ source, headers: noStore })),
    ];
  },
};

export default nextConfig;
