"use client";

import { useEffect } from "react";

/**
 * Registers the service worker in production only.
 *
 * Kept out of development because a stale worker caching pages is one of the
 * more confusing things to debug, and nothing here needs offline support while
 * building.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // A failed registration must never break the page — offline support is
        // an enhancement, not a requirement.
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
