import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PortalPageHeader({
  eyebrow,
  title,
  lede,
  action,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow mb-3 text-accent">{eyebrow}</p> : null}
        <h1 className="text-[1.875rem] leading-tight tracking-[-0.03em] sm:text-[2.25rem]">
          {title}
        </h1>
        {lede ? <p className="mt-2 text-[0.9375rem] text-ink-muted">{lede}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/**
 * The figure leads and the label follows, in mono. A dashboard is read by
 * glancing, so the number has to be the biggest thing in the tile.
 */
export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
  tone = "default",
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  href?: string;
  tone?: "default" | "urgent" | "night";
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "eyebrow",
            tone === "night" ? "text-plum-300" : tone === "urgent" ? "text-danger-ink" : "text-ink-faint",
          )}
        >
          {label}
        </p>
        {icon ? (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
              tone === "urgent"
                ? "bg-danger-soft text-danger-ink"
                : tone === "night"
                  ? "bg-white/10 text-amber-300"
                  : "bg-tint text-brand",
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>

      <p
        className={cn(
          "mt-5 font-display text-4xl leading-none tracking-[-0.03em]",
          tone === "urgent"
            ? "text-danger-ink"
            : tone === "night"
              ? "text-white"
              : "text-heading",
        )}
      >
        {value}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2">
        {hint ? (
          <p className={cn("text-xs", tone === "night" ? "text-plum-300" : "text-ink-faint")}>
            {hint}
          </p>
        ) : (
          <span />
        )}
        {href ? (
          <ArrowUpRight
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 transition-transform duration-300 group-hover/stat:translate-x-0.5 group-hover/stat:-translate-y-0.5",
              tone === "night" ? "text-plum-300" : "text-plum-400",
            )}
          />
        ) : null}
      </div>
    </>
  );

  const className = cn(
    "group/stat rounded-card p-5 transition-all duration-300",
    tone === "urgent"
      ? "border border-danger/25 bg-danger-soft/40"
      : tone === "night"
        ? // The full hero gradient reads muddy at tile size; one soft highlight
          // in the corner is enough.
          "bg-plum-950 bg-[radial-gradient(22rem_11rem_at_100%_0%,rgb(232_163_61/0.16),transparent_62%)]"
        : "border border-line bg-surface shadow-xs",
    href && "hover:-translate-y-0.5 hover:shadow-md",
  );

  return href ? (
    <Link href={href} className={cn(className, "block")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

/* --------------------------------- table ---------------------------------- */
/**
 * Real <table> elements. Staff scan these, sort them and occasionally read
 * them with assistive technology, and the semantics matter. Horizontal
 * overflow is contained so the page never scrolls sideways on a phone.
 */

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface shadow-xs">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return <table className={cn("w-full min-w-[46rem] text-sm", className)} {...props} />;
}

export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "eyebrow border-b border-line bg-canvas px-5 py-3.5 text-left text-ink-faint",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn("border-b border-line px-5 py-4 align-middle", className)}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn("transition-colors duration-200 hover:bg-lilac/60", className)}
      {...props}
    />
  );
}

export function CaseRefCell({ href, caseRef }: { href: string; caseRef: string }) {
  return (
    <Link
      href={href}
      className="font-mono text-[0.8125rem] font-medium text-brand underline-offset-4 hover:underline"
    >
      {caseRef}
    </Link>
  );
}

/** Contact details, masked until a member of staff deliberately reveals them. */
export function MaskedValue({ value }: { value: string }) {
  const tail = value.slice(-3);
  return (
    <span className="font-mono text-ink-muted">
      {"•".repeat(Math.max(0, Math.min(10, value.length - 3)))}
      {tail}
    </span>
  );
}
