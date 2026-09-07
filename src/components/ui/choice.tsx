"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Large tappable choice cards.
 *
 * The intake form is used on a phone, often quickly and sometimes with someone
 * nearby. Targets are deliberately generous, the whole card is the label, and
 * selection is shown by a tick as well as by colour.
 */

export function ChoiceCard({
  name,
  value,
  checked,
  onChange,
  title,
  description,
  icon,
  type = "radio",
  className,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  type?: "radio" | "checkbox";
  className?: string;
}) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer gap-3.5 rounded-xl border p-4 transition-colors",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-plum-500",
        checked
          ? "border-plum-500 bg-tint"
          : "border-line bg-surface hover:border-plum-300 hover:bg-tint/50",
        className,
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />

      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center border transition-colors",
          type === "radio" ? "rounded-full" : "rounded-[0.3rem]",
          checked
            ? "border-plum-700 bg-plum-700 text-white"
            : "border-line-strong bg-surface",
        )}
      >
        {checked ? (
          type === "radio" ? (
            <span className="size-2 rounded-full bg-white" />
          ) : (
            <Check className="size-3.5" strokeWidth={3} />
          )
        ) : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-[0.9375rem] font-semibold text-ink">
          {icon}
          {title}
        </span>
        {description ? (
          <span className="mt-1 block text-sm leading-relaxed text-ink-muted">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

/** Compact inline checkbox for consent and single toggles. */
export function CheckboxRow({
  checked,
  onChange,
  children,
  invalid,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  invalid?: boolean;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-plum-500",
        invalid
          ? "border-danger bg-danger-soft"
          : checked
            ? "border-plum-500 bg-tint"
            : "border-line bg-surface hover:border-plum-300",
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        aria-invalid={invalid || undefined}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[0.3rem] border",
          checked ? "border-plum-700 bg-plum-700 text-white" : "border-line-strong bg-surface",
        )}
      >
        {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
      </span>
      <span className="text-[0.9375rem] leading-relaxed text-ink">{children}</span>
    </label>
  );
}

/** Segmented control for short mutually exclusive answers (Yes / No / Not sure). */
export function ChoicePills({
  name,
  options,
  value,
  onChange,
  className,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} role="radiogroup">
      {options.map((option) => {
        const checked = value === option.value;
        return (
          <label
            key={option.value}
            className={cn(
              "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              "has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-plum-500",
              checked
                ? "border-plum-700 bg-plum-700 text-white"
                : "border-line-strong bg-surface text-ink hover:border-plum-300 hover:bg-tint",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
