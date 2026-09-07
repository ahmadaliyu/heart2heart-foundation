import { cn } from "@/lib/utils";

/**
 * The mark: two ribbons that cross and continue past one another, tying into a
 * heart. Two people met; the knot is where.
 *
 * The plum ribbon passes OVER the amber at the crossing so the two are
 * genuinely interlaced rather than merely overlapping. That over-segment is
 * drawn as a third short path — the first 30% of the left ribbon, subdivided —
 * rather than with a <clipPath>, so the component needs no unique id and stays
 * safe to render in server components and to repeat on a page.
 */
const LEFT =
  "M58,91 C34,74 12,56 12,38 C12,25 24,16.5 34,16.5 C43,16.5 49,22.5 52.5,31";
const RIGHT =
  "M42,91 C66,74 88,56 88,38 C88,25 76,16.5 66,16.5 C57,16.5 51,22.5 47.5,31";
const OVER = "M58,91 C50.8,85.9 43.78,80.71 37.48,75.46";

export function LogoMark({
  className,
  reversed = false,
  mono = false,
  weight = 13,
  animated = false,
}: {
  className?: string;
  reversed?: boolean;
  mono?: boolean;
  weight?: number;
  /** Draws the ribbons on first paint. Used once, in the hero. */
  animated?: boolean;
}) {
  const plum = mono ? "currentColor" : reversed ? "#FFFFFF" : "var(--color-plum-700)";
  const amber = mono ? "currentColor" : "var(--color-amber-400)";

  const common = {
    fill: "none",
    strokeWidth: weight,
    strokeLinecap: "round" as const,
  };

  const draw = (delay: string) =>
    animated
      ? `motion-safe:[stroke-dasharray:260] motion-safe:animate-[h2h-draw_1100ms_var(--ease-out-soft)_${delay}_both]`
      : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={cn("h-8 w-auto", animated && "[--dash:260]", className)}
    >
      <path d={LEFT} stroke={plum} {...common} className={draw("0ms")} />
      <path d={RIGHT} stroke={amber} {...common} className={draw("160ms")} />
      <path d={OVER} stroke={plum} {...common} />
    </svg>
  );
}

/**
 * The lockup. The wordmark is set in the display face with the numeral in
 * amber — the same two-part idea as the mark, so the two read as one system.
 */
export function Logo({
  className,
  reversed = false,
  showSubtitle = true,
  size = "md",
}: {
  className?: string;
  reversed?: boolean;
  showSubtitle?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dims = {
    sm: { mark: "h-8", word: "text-[1.3rem]", gap: "gap-2.5", sub: "text-[0.5rem]" },
    md: { mark: "h-10", word: "text-[1.65rem]", gap: "gap-3", sub: "text-[0.5625rem]" },
    lg: { mark: "h-16", word: "text-[2.5rem]", gap: "gap-4", sub: "text-[0.75rem]" },
  }[size];

  return (
    <span className={cn("inline-flex items-center", dims.gap, className)}>
      <LogoMark reversed={reversed} className={dims.mark} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-semibold tracking-[-0.03em]",
            dims.word,
            reversed ? "text-white" : "text-brand-strong",
          )}
        >
          Heart<span className="text-amber-400">2</span>Heart
        </span>
        {showSubtitle ? (
          <span
            className={cn(
              "eyebrow mt-1.5",
              dims.sub,
              reversed ? "text-plum-300" : "text-ink-faint",
            )}
          >
            Foundation
          </span>
        ) : null}
      </span>
    </span>
  );
}
