import type { Metadata } from "next";
import { BadgeCheck, Clock, EyeOff, MessageCircle, Phone, TriangleAlert } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { supportHref } from "@/lib/support-link";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/config";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { contactsByCategory, foundationLine } from "@/lib/data";
import type { EmergencyContact } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.emergency.title, description: dict.emergency.lede };
}

const CATEGORY_ORDER: EmergencyContact["category"][] = [
  "GENERAL",
  "DOMESTIC_VIOLENCE",
  "ABUSE",
  "MENTAL_HEALTH",
  "CHILD",
];

export default async function EmergencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const grouped = contactsByCategory();
  const line = foundationLine();

  return (
    <>
      {/* The page opens with the action, not with an explanation. Someone who
          reaches here in a hurry should be able to dial before reading. */}
      <header className="bg-emergency text-white">
        <div className="container-page py-12 sm:py-16">
          <div className="flex items-center gap-3">
            <TriangleAlert aria-hidden="true" className="size-6 shrink-0" />
            <h1 className="text-3xl text-white sm:text-4xl">{t("emergency.title")}</h1>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {t("emergency.lede")}
          </p>

          {line ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${line.phone.replace(/\s/g, "")}`}
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl bg-white px-7 text-base font-bold text-emergency shadow-sm transition-colors hover:bg-white/90"
              >
                <Phone aria-hidden="true" className="size-5" />
                {t("emergency.callNow")}
              </a>
              {line.whatsapp ? (
                <a
                  href={`https://wa.me/${line.whatsapp.replace(/\D/g, "")}`}
                  rel="noopener noreferrer"
                  className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border-2 border-white/60 px-7 text-base font-bold text-white transition-colors hover:bg-white/15"
                >
                  <MessageCircle aria-hidden="true" className="size-5" />
                  {t("emergency.whatsapp")}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <Section className="py-10 sm:py-14">
        <div className="container-page space-y-8">
          <Alert tone="warning" title={t("emergency.notEmergencyService")} />

          <div>
            <h2 className="text-2xl">{t("emergency.contactsTitle")}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">
              {t("emergency.contactsNote")}
            </p>
          </div>

          <div className="space-y-10">
            {CATEGORY_ORDER.map((category) => {
              const contacts = grouped.get(category);
              if (!contacts?.length) return null;

              return (
                <section key={category} aria-labelledby={`emg-${category}`}>
                  <h3
                    id={`emg-${category}`}
                    className="text-sm font-bold uppercase tracking-[0.14em] text-ink-muted"
                  >
                    {t(`emergency.categories.${category}`)}
                  </h3>

                  <ul className="mt-4 grid gap-4 md:grid-cols-2">
                    {contacts.map((contact) => (
                      <li key={contact.id}>
                        <Card className="flex h-full flex-col p-5 sm:p-6">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h4 className="text-base font-semibold text-ink">
                              {contact.name}
                            </h4>
                            <Badge
                              tone="success"
                              icon={<BadgeCheck aria-hidden="true" className="size-3.5" />}
                            >
                              {t("common.verified")}
                            </Badge>
                          </div>

                          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                            {contact.description}
                          </p>

                          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-faint">
                            <Clock aria-hidden="true" className="size-3.5" />
                            {contact.hours}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <a
                              href={`tel:${contact.phone.replace(/\s/g, "")}`}
                              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-plum-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-plum-800"
                            >
                              <Phone aria-hidden="true" className="size-4" />
                              {contact.phone}
                            </a>
                            {contact.whatsapp ? (
                              <a
                                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                                rel="noopener noreferrer"
                                aria-label={`${t("emergency.whatsapp")} — ${contact.name}`}
                                className="inline-flex size-11 items-center justify-center rounded-lg border border-line-strong text-brand-strong transition-colors hover:bg-tint"
                              >
                                <MessageCircle aria-hidden="true" className="size-4" />
                              </a>
                            ) : null}
                          </div>

                          {contact.verifiedAt ? (
                            <p className="mt-3 text-[0.6875rem] text-ink-faint">
                              {t("portal.emergency.lastVerified")}:{" "}
                              {formatDate(contact.verifiedAt, locale)}
                            </p>
                          ) : null}
                        </Card>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          {/* Browsing-safety note. It says what the site can and cannot do —
              overstating this would be dangerous. */}
          <Card className="flex gap-4 border-tint-line bg-tint p-6">
            <EyeOff aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
            <div>
              <h3 className="text-base font-semibold text-heading">
                {t("emergency.privacyTip")}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {t("emergency.privacyTipBody")}
              </p>
            </div>
          </Card>

          <div className="rounded-2xl border border-line bg-surface p-7 text-center">
            <h3 className="text-xl">{t("emergency.urgentRequest")}</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
              {t("emergency.urgentRequestNote")}
            </p>
            <div className="mt-6">
              <ButtonLink href={supportHref(locale)} size="lg">
                {t("emergency.urgentRequest")}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
