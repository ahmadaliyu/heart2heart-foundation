"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { useI18n } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export type Theme = "light" | "dark";

const STORAGE_KEY = "h2h-theme";

/**
 * Runs before first paint, inline in <head>, so the page never flashes the
 * wrong theme. Kept deliberately tiny and dependency-free — it is inlined as a
 * string and cannot import anything.
 *
 * It stamps the *resolved* theme on <html data-theme>, which means the CSS only
 * ever has to match [data-theme="dark"]. No duplicated @media block, and no
 * second source of truth about what the current theme is.
 */
export const themeScript = `(function(){try{
var s=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
var d=s==="dark"||(!s&&window.matchMedia("(prefers-color-scheme: dark)").matches);
document.documentElement.setAttribute("data-theme",d?"dark":"light");
}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Starts light and is corrected in the effect below on the first client
  // frame. The inline script has already painted the right theme by then, so
  // this only ever syncs React's copy of the value — it never causes a flash.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    setThemeState(attr === "dark" ? "dark" : "light");

    // Colour transitions are switched on only after the first paint, so
    // loading the page in dark mode does not animate in from white.
    const raf = requestAnimationFrame(() =>
      document.documentElement.classList.add("theme-ready"),
    );
    return () => cancelAnimationFrame(raf);
  }, []);

  // Follow the operating system until the reader makes a choice of their own.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch {
        /* Storage can throw in a private window; the default is fine. */
      }
      if (stored) return;
      const next: Theme = event.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      setThemeState(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.setAttribute("data-theme", next);
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* Not being able to remember the choice is not a reason to refuse it. */
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}

/**
 * One button, two states. A three-way system/light/dark control is more
 * truthful but costs a menu, and the brief rules out crowded chrome — so the
 * page follows the operating system until the reader touches this, and
 * remembers their choice afterwards.
 */
export function ThemeToggle({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const next = theme === "dark" ? "light" : "dark";
  const label = t(next === "dark" ? "common.themeDark" : "common.themeLight");

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border transition-colors duration-250",
        tone === "dark"
          ? "border-white/25 text-white/85 hover:bg-white/10 hover:text-white"
          : "border-line-strong text-ink-muted hover:bg-tint hover:text-brand",
        className,
      )}
    >
      {/* Before hydration the stored theme is unknown, so both icons would be a
          guess. The sun is rendered as a neutral placeholder and swapped once
          the real value is in hand — the swap is invisible at this size. */}
      {mounted && theme === "dark" ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
    </button>
  );
}
