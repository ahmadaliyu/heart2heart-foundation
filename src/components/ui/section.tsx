import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";

type Tone =
  | "default"
  | "surface"
  | "lilac"
  | "cream"
  | "sunken"
  | "night"
  | "wash";

const tones: Record<Tone, string> = {
  default: "",
  surface: "bg-surface",
  lilac: "bg-lilac",
  cream: "bg-cream",
  sunken: "bg-sunken",
  night: "bg-night-rich text-white",
  wash: "bg-wash",
};

/**
 * Vertical rhythm.
 *
 * Every section used to be one size, which meant two neighbours on the same
 * ground stacked their padding into a 224px void with nothing in it. Sections
 * now declare their weight: `lg` for the one or two moments a page is built
 * around, `md` for ordinary content, `sm` for a strip that supports the block
 * above it rather than standing on its own.
 */
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "py-11 sm:py-14",
  md: "py-14 sm:py-20",
  lg: "py-20 sm:py-28",
};

export function Section({
  className,
  tone = "default",
  size = "md",
  ...props
}: ComponentProps<"section"> & { tone?: Tone; size?: Size }) {
  return (
    <section className={cn(sizes[size], tones[tone], className)} {...props} />
  );
}

/** Small mono label with an amber tick. The section marker of the system. */
export function Eyebrow({
  children,
  className,
  onDark = false,
}: {
  children: ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <p
      className={cn(
        "eyebrow flex items-center gap-2.5",
        onDark ? "text-amber-300" : "text-accent",
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-6 shrink-0 bg-amber-400" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  onDark = false,
  className,
  as: Tag = "h2",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow
          onDark={onDark}
          className={cn("mb-5", align === "center" && "justify-center")}
        >
          {eyebrow}
        </Eyebrow>
      ) : null}
      <Tag
        className={cn(
          Tag === "h1" ? "text-display" : "text-title",
          onDark && "text-white",
        )}
      >
        {title}
      </Tag>
      {body ? (
        <p
          className={cn(
            "mt-5 text-lead",
            onDark ? "text-plum-200" : "text-ink-muted",
          )}
        >
          {body}
        </p>
      ) : null}
    </Reveal>
  );
}

/** Inner-page header. Sits on the wash, with the eyebrow doing the labelling. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
  image,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  image?: string;
}) {
  return (
    <header className="bpa-page-header">
      {image && (
        <div className="bpa-breadcrumb container-page">
          <span>Heart2Heart</span>
          <span aria-hidden="true">/</span>
          <span>{eyebrow ?? title}</span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {image && (
        <img
          className="bpa-page-photo"
          src={image}
          alt=""
          width={1600}
          height={600}
          fetchPriority="high"
        />
      )}
      <div className="bpa-page-title">
        {eyebrow && image && <span className="bpa-page-label">{eyebrow}</span>}
        <h1>{title}</h1>
      </div>
      {(lede || children) && (
        <div className="container-page bpa-page-intro">
          {lede && <p>{lede}</p>}
          {children && <div>{children}</div>}
        </div>
      )}
    </header>
  );
}
