import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/section";

/**
 * Shared shell for the privacy, safeguarding and terms pages.
 *
 * These are the pages a beneficiary reads when deciding whether to trust the
 * Foundation with something difficult, so they get the same care as the rest of
 * the site rather than a wall of legal text: numbered sections, generous
 * measure, a contents list on wide screens.
 */
export function PolicyPage({
  title,
  lede,
  intro,
  sections,
  children,
}: {
  title: string;
  lede?: string;
  intro?: string;
  sections: { title: string; body: string }[];
  children?: ReactNode;
}) {
  return (
    <>
      <PageHeader title={title} lede={lede} />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[16rem_1fr] lg:gap-16 lg:py-16">
        <nav aria-label={title} className="hidden lg:block">
          <ol className="sticky top-24 space-y-2 border-l border-line pl-5 text-sm">
            {sections.map((section, index) => (
              <li key={section.title}>
                <a
                  href={`#section-${index + 1}`}
                  className="text-ink-muted transition-colors hover:text-brand-strong"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-2xl">
          {intro ? (
            <p className="text-lg leading-relaxed text-ink">{intro}</p>
          ) : null}

          <ol className="mt-8 space-y-8">
            {sections.map((section, index) => (
              <li key={section.title} id={`section-${index + 1}`} className="scroll-mt-24">
                <h2 className="flex gap-3 text-xl">
                  <span
                    aria-hidden="true"
                    /* amber-500 sits at 2.8:1 on white; amber-700 clears AA. */
                    className="font-display text-base font-semibold text-accent"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                <p className="mt-2.5 leading-[1.75] text-ink-muted">{section.body}</p>
              </li>
            ))}
          </ol>

          {children ? <div className="mt-10">{children}</div> : null}

          <Card className="mt-10 bg-canvas p-5 text-sm text-ink-muted">
            <p>
              This page describes the Foundation&rsquo;s commitments. It is not a
              substitute for the full policy documents held by the Foundation, which
              are available on request.
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
