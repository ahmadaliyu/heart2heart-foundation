import { CircleCheck } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { PageHeader } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

const COMMITMENTS = [
  "Every page can be operated with a keyboard alone, and focus is always visible.",
  "Text meets or exceeds WCAG AA contrast against its background.",
  "Every form field has a real label, and errors are described in words, never by colour alone.",
  "Images that carry meaning have alternative text; decorative artwork is hidden from screen readers.",
  "Headings follow a logical order so screen-reader users can navigate by structure.",
  "Animation is minimal, and is switched off entirely when your device asks for reduced motion.",
  "Language is kept plain, and the site is available in English and Hausa.",
];

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);

  return (
    <>
      <PageHeader title={t("accessibility.title")} lede={t("accessibility.lede")} />

      <div className="container-page max-w-3xl py-12">
        <p className="text-lg leading-relaxed text-ink">{t("accessibility.body")}</p>

        <ul className="mt-8 space-y-3">
          {COMMITMENTS.map((item) => (
            <li key={item} className="flex gap-3">
              <CircleCheck
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-success"
              />
              <span className="leading-relaxed text-ink-muted">{item}</span>
            </li>
          ))}
        </ul>

        <Card className="mt-10 border-tint-line bg-tint p-6">
          <h2 className="text-lg">Something not working?</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Tell us what happened and what you were trying to do. Accessibility
            problems are treated as faults, not feature requests.
          </p>
          <div className="mt-5">
            <ButtonLink href={localePath(locale, "/contact")}>
              {t("contact.title")}
            </ButtonLink>
          </div>
        </Card>
      </div>
    </>
  );
}
