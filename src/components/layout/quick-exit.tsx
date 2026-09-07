"use client";

import { useCallback, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useT } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

/**
 * Quick exit.
 *
 * For someone reading this page on a shared or monitored device. It replaces
 * the current history entry so the back button does not return here, opens a
 * neutral page, and can also be triggered by pressing Escape three times —
 * which is faster than finding a button, and silent.
 *
 * It cannot erase browsing history; the page says so plainly rather than
 * implying a safety it can't deliver.
 */
const NEUTRAL_URL = "https://www.bbc.com/weather";

export function QuickExit({ className }: { className?: string }) {
  const t = useT();

  const exit = useCallback(() => {
    try {
      // Replace this entry first so "back" doesn't come straight back here.
      window.location.replace(NEUTRAL_URL);
    } catch {
      window.location.href = NEUTRAL_URL;
    }
  }, []);

  useEffect(() => {
    let presses = 0;
    let timer: ReturnType<typeof setTimeout>;

    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      presses += 1;
      clearTimeout(timer);
      if (presses >= 3) {
        exit();
        return;
      }
      timer = setTimeout(() => {
        presses = 0;
      }, 900);
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, [exit]);

  return (
    <button
      type="button"
      onClick={exit}
      title={t("emergency.safetyExitHint")}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/35 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-white/15",
        className,
      )}
    >
      <LogOut aria-hidden="true" className="size-3.5" />
      {t("emergency.safetyExit")}
    </button>
  );
}
