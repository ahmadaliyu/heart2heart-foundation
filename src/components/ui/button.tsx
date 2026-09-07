import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "inverse"
  | "secondary"
  | "outlineLight"
  | "ghost"
  | "quiet"
  | "emergency"
  | "danger";
type Size = "sm" | "md" | "lg" | "xl";

/**
 * Actions are pills. It is a warmer, more human shape than a rounded rectangle,
 * and it is the one place a whole design language can be set with one decision.
 *
 * Amber is never a button fill: at 2.3:1 on white it cannot carry white text,
 * and dark text on amber reads as a warning. It stays a graphic accent.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-plum-700 text-white border border-transparent shadow-sm " +
    "hover:bg-plum-800 hover:shadow-md active:bg-plum-900",
  inverse:
    "bg-white text-plum-900 border border-transparent shadow-sm " +
    "hover:bg-tint-strong hover:shadow-md",
  secondary:
    "bg-surface text-brand-strong border border-line-strong shadow-xs " +
    "hover:border-plum-400 hover:bg-tint",
  outlineLight:
    "bg-transparent text-white border border-white/35 " +
    "hover:bg-white/12 hover:border-white/60",
  ghost: "bg-transparent text-brand-strong border border-transparent hover:bg-tint",
  quiet:
    "bg-transparent text-ink-muted border border-transparent hover:bg-sunken hover:text-ink",
  emergency:
    "bg-emergency text-white border border-transparent shadow-sm hover:bg-emergency-dark",
  danger: "bg-surface text-danger-ink border border-danger/40 hover:bg-danger-soft",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.8125rem] gap-1.5",
  md: "h-11 px-5 text-[0.9375rem] gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
  xl: "h-15 px-9 text-[1.0625rem] gap-3",
};

const base =
  "group/btn inline-flex items-center justify-center rounded-full font-semibold " +
  "whitespace-nowrap select-none transition-all duration-250 ease-[var(--ease-out-soft)] " +
  "active:scale-[0.98] disabled:opacity-55 disabled:pointer-events-none disabled:active:scale-100";

export function buttonClass({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClass({ variant, size, fullWidth, className })}
      {...props}
    />
  );
}

export interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClass({ variant, size, fullWidth, className })} {...props} />;
}

/** Nudges a trailing icon on hover. Pair with an icon inside a Button. */
export const iconShift =
  "transition-transform duration-250 ease-[var(--ease-out-soft)] group-hover/btn:translate-x-0.5";
