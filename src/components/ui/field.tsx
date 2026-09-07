"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Every input on the platform goes through Field.
 *
 * It guarantees the four things the brief calls out and forms usually get
 * wrong: a real <label> bound to the control, hint text linked by
 * aria-describedby, an error announced by aria-errormessage, and an error state
 * that is never signalled by colour alone (there is always an icon and text).
 */

export interface FieldProps {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  optionalLabel?: string;
  className?: string;
  /** Render the control with the ids it must carry. */
  children: (ids: {
    id: string;
    describedBy: string | undefined;
    invalid: boolean;
  }) => ReactNode;
}

export function Field({
  label,
  hint,
  error,
  required,
  optionalLabel,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            {" "}
            *
          </span>
        ) : optionalLabel ? (
          <span className="ml-1.5 font-normal text-ink-faint">({optionalLabel})</span>
        ) : null}
      </label>

      {hint ? (
        <p id={hintId} className="text-[0.8125rem] leading-relaxed text-ink-muted">
          {hint}
        </p>
      ) : null}

      {children({ id, describedBy, invalid: Boolean(error) })}

      {error ? (
        <p
          id={errorId}
          className="flex items-start gap-1.5 text-[0.8125rem] font-medium text-danger"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

const controlBase =
  "w-full rounded-lg border bg-surface px-3.5 py-2.5 text-[0.9375rem] text-ink " +
  "placeholder:text-ink-faint transition-colors " +
  "disabled:bg-sunken disabled:text-ink-muted";

export function inputClass(invalid?: boolean, className?: string) {
  return cn(
    controlBase,
    invalid
      ? "border-danger focus-visible:outline-danger"
      : "border-line-strong hover:border-plum-300",
    className,
  );
}

export function TextInput({
  invalid,
  className,
  ...props
}: ComponentProps<"input"> & { invalid?: boolean }) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={inputClass(invalid, className)}
      {...props}
    />
  );
}

export function TextArea({
  invalid,
  className,
  rows = 4,
  ...props
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={inputClass(invalid, cn("resize-y leading-relaxed", className))}
      {...props}
    />
  );
}

export function Select({
  invalid,
  className,
  children,
  ...props
}: ComponentProps<"select"> & { invalid?: boolean }) {
  return (
    <select
      aria-invalid={invalid || undefined}
      className={inputClass(
        invalid,
        cn("appearance-none bg-[length:1rem] pr-10", className),
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236E6577'%3E%3Cpath d='M5.5 7.5 10 12l4.5-4.5' stroke='%236E6577' stroke-width='1.75' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.875rem center",
      }}
      {...props}
    >
      {children}
    </select>
  );
}
