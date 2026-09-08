import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone =
  | "neutral"
  | "brand"
  | "accent"
  | "info"
  | "progress"
  | "success"
  | "warning"
  | "danger";

/**
 * Badge text uses the darker "-ink" status tokens, not the brief's base status
 * colours: at 12px on a soft tint those sit around 3.4:1, below the 4.5:1 AA
 * threshold. The base colours still carry the borders and icons.
 */
const tones: Record<BadgeTone, string> = {
  neutral: "bg-sunken text-ink-muted border-line",
  brand: "bg-tint text-brand-strong border-tint-line",
  accent: "bg-tint-strong text-accent border-amber-200",
  info: "bg-info-soft text-info-ink border-info/25",
  progress: "bg-tint-strong text-brand-strong border-tint-line",
  success: "bg-success-soft text-success-ink border-success/25",
  warning: "bg-warning-soft text-warning-ink border-warning/30",
  danger: "bg-danger-soft text-danger-ink border-danger/30",
};

export function Badge({
  tone = "neutral",
  children,
  className,
  icon,
  ...props
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
} & Omit<ComponentPropsWithoutRef<"span">, "className" | "children">) {
  return (
    <span
      {...props}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
