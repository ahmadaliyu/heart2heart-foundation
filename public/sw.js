/* eslint-disable */
/**
 * Heart2Heart Foundation — service worker
 *
 * The single most important rule in this file is the exclusion list. The
 * blueprint states: "Sensitive counselling information should not be
 * unnecessarily cached offline." So the counselling flow, the staff portal and
 * every API response are never written to any cache, never served from one,
 * and are purged from existing caches on activation.
 *
 * Everything else — the public site, articles, events, emergency contacts —
 * IS cached, because a poor connection is common and someone looking for a
 * helpline should not be met with a blank page.
 */

const VERSION = "h2h-v2"; // bumped: new type system + dark theme
const SHELL_CACHE = `${VERSION}-shell`;
const PAGE_CACHE = `${VERSION}-pages`;
const ASSET_CACHE = `${VERSION}-assets`;

const PRECACHE = [
  "/en/offline",
  "/ha/offline",
  "/brand/logo-mark.svg",
  "/icon-192.png",
  "/manifest.webmanifest",
];

/** Anything matching these is treated as confidential and never touched. */
const NEVER_CACHE = [
  /\/counselling(\/|$)/,
  /\/portal(\/|$)/,
  /^\/api\//,
];

function isConfidential(url) {
  return NEVER_CACHE.some((pattern) => pattern.test(url.pathname));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)),
      );

      // Belt and braces: clear anything confidential a previous version may
      // have stored before this rule existed.
      for (const name of await caches.keys()) {
        const cache = await caches.open(name);
        for (const request of await cache.keys()) {
          try {
            if (isConfidential(new URL(request.url))) await cache.delete(request);
          } catch {
            /* ignore malformed entries */
          }
        }
      }

      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Confidential surfaces bypass the worker completely.
  if (isConfidential(url)) {
    event.respondWith(fetch(request));
    return;
  }

  // Next.js build output is content-hashed: cache-first is safe and fast.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
            return response;
          }),
      ),
    );
    return;
  }

  // Images, icons and fonts: cache-first, they change rarely.
  if (/\.(?:svg|png|jpe?g|webp|gif|ico|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request)
            .then((response) => {
              const copy = response.clone();
              caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
              return response;
            })
            .catch(() => hit),
      ),
    );
    return;
  }

  // Pages: network-first so content stays current, with the cache as the
  // fallback and a dedicated offline page as the last resort.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const locale = url.pathname.startsWith("/ha") ? "ha" : "en";
          const offline = await caches.match(`/${locale}/offline`);
          return (
            offline ||
            new Response("You are offline.", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          );
        }),
    );
  }
});

/** Allows a future release to activate immediately when the user accepts. */
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
