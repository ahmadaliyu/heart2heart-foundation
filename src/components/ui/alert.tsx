import type { ReactNode } from "react";
import { AlertTriangle, Info, ShieldCheck, CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "danger" | "privacy";

const styles: Record<Tone, { wrap: string; icon: string }> = {
  info: { wrap: "border-info/25 bg-info-soft text-ink", icon: "text-info-ink" },
  success: { wrap: "border-success/25 bg-success-soft text-ink", icon: "text-success-ink" },
  warning: { wrap: "border-warning/30 bg-warning-soft text-ink", icon: "text-warning-ink" },
  danger: { wrap: "border-danger/30 bg-danger-soft text-ink", icon: "text-danger-ink" },
  privacy: { wrap: "border-tint-line bg-tint text-ink", icon: "text-brand" },
};

const icons: Record<Tone, typeof Info> = {
  info: Info,
  success: CircleCheck,
  warning: AlertTriangle,
  danger: AlertTriangle,
  privacy: ShieldCheck,
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
  live,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Announce to screen readers when the alert appears after an action. */
  live?: boolean;
}) {
  const Icon = icons[tone];
  const style = styles[tone];

  return (
    <div
      role={live ? "status" : undefined}
      aria-live={live ? "polite" : undefined}
      className={cn("flex gap-3 rounded-xl border p-4", style.wrap, className)}
    >
      <Icon aria-hidden="true" className={cn("mt-0.5 size-5 shrink-0", style.icon)} />
      <div className="min-w-0 space-y-1 text-sm leading-relaxed">
        {title ? <p className="font-semibold text-ink">{title}</p> : null}
        {children ? <div className="text-ink-muted [&_a]:underline">{children}</div> : null}
      </div>
    </div>
  );
}
