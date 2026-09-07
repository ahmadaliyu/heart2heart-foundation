import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "raised" | "flat" | "night" | "glass" | "cream" | "outline";

const tones: Record<Tone, string> = {
  default: "bg-surface border border-line shadow-xs",
  raised: "bg-surface border border-line shadow-md",
  flat: "bg-surface border border-line",
  night: "bg-plum-950 border border-white/10 text-white",
  glass: "glass text-white",
  cream: "bg-cream border border-sand",
  outline: "bg-transparent border border-line",
};

type CardProps<T extends ElementType> = {
  as?: T;
  tone?: Tone;
  /** Adds the hover lift. Use on cards that are themselves links. */
  interactive?: boolean;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/**
 * Polymorphic so a card can be the <form> or <article> it represents rather
 * than wrapping one in a decorative div.
 */
export function Card<T extends ElementType = "div">({
  className,
  as,
  tone = "default",
  interactive = false,
  ...props
}: CardProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      className={cn("rounded-card", tones[tone], interactive && "lift", className)}
      {...props}
    />
  );
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="font-sans text-[0.9375rem] font-bold tracking-[-0.01em] text-heading">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
