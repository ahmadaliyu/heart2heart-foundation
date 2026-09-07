import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Filters are plain links, not a JavaScript control.
 *
 * They stay in the URL, so a member of staff can bookmark "urgent requests
 * waiting for review", share it with a colleague, and use it with the browser
 * back button — and it works with JavaScript disabled or still loading.
 */
export function FilterBar({
  label,
  basePath,
  param,
  current,
  options,
  searchParams,
}: {
  label: string;
  basePath: string;
  param: string;
  current?: string;
  options: { value: string; label: string }[];
  searchParams: Record<string, string | undefined>;
}) {
  function hrefFor(value?: string) {
    const next = new URLSearchParams();
    for (const [key, existing] of Object.entries(searchParams)) {
      if (existing && key !== param) next.set(key, existing);
    }
    if (value) next.set(param, value);
    const query = next.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const all = [{ value: "", label: "All" }, ...options];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-ink-faint">
        {label}
      </span>
      {all.map((option) => {
        const active = (current ?? "") === option.value;
        return (
          <Link
            key={option.value || "all"}
            href={hrefFor(option.value || undefined)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              active
                ? "border-plum-700 bg-plum-700 text-white"
                : "border-line bg-surface text-ink-muted hover:border-plum-300 hover:text-brand-strong",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
