import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/lib/i18n/config";

/** Tailwind-aware class merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LOCALE_TAG: Record<Locale, string> = {
  en: "en-NG",
  ha: "ha-NG",
};

export function formatDate(
  value: string | Date,
  locale: Locale = "en",
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    ...options,
    timeZone: "Africa/Lagos",
  }).format(date);
}

export function formatTime(value: string | Date, locale: Locale = "en") {
  return formatDate(value, locale, { hour: "numeric", minute: "2-digit", hour12: true });
}

export function formatDateTime(value: string | Date, locale: Locale = "en") {
  return formatDate(value, locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Naira amounts. Donation figures are stored in kobo to avoid float drift. */
export function formatNaira(kobo: number, locale: Locale = "en") {
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

export function relativeDay(value: string | Date, locale: Locale = "en") {
  const date = typeof value === "string" ? new Date(value) : value;
  const today = new Date();
  const diff = Math.round(
    (new Date(date.toDateString()).getTime() - new Date(today.toDateString()).getTime()) /
      86_400_000,
  );
  if (Math.abs(diff) > 6) return formatDate(date, locale, { day: "numeric", month: "short" });
  return new Intl.RelativeTimeFormat(LOCALE_TAG[locale], { numeric: "auto" }).format(
    diff,
    "day",
  );
}

/** Minutes since midnight -> "2:30 pm". Used for appointment slots. */
export function formatSlot(minutes: number, locale: Locale = "en") {
  const d = new Date(Date.UTC(2000, 0, 1, Math.floor(minutes / 60), minutes % 60));
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(d);
}

const HONORIFICS = new Set(["dr", "dr.", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "prof", "prof."]);

/** First name for greetings, skipping an honorific: "Dr. Amina Yusuf" -> "Amina". */
export function firstName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? name;
  if (HONORIFICS.has(first.toLowerCase()) && parts[1]) return parts[1];
  return first;
}

export function initials(name: string) {
  // Skip an honorific so "Dr. Amina Yusuf" reads AY rather than DA.
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part && !HONORIFICS.has(part.toLowerCase()));
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Deterministic id for demo records. Real ids come from the API. */
export function shortId(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
