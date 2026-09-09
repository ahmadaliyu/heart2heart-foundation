import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircleHeart, Phone } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { features } from "@/lib/features";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/section";
import { ContactForm } from "@/components/contact/contact-form";
import { foundationLine } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.contact.title, description: dict.contact.lede };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const line = foundationLine();

  return (
    <>
      <PageHeader image="/images/support.jpg" title={t("contact.title")} lede={t("contact.lede")} />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.2fr] lg:gap-14 lg:py-16">
        <div className="space-y-6">
          {/* People looking for counselling often land on Contact first, so
              this normally sends them to the private form rather than letting
              them describe something sensitive in a general enquiry inbox.
              With counselling switched off there is no form to send them to,
              and pointing at a disabled route would be worse than saying
              nothing — so the card only appears with the feature. */}
          {features.counselling ? (
            <Card className="border-tint-line bg-tint p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-surface text-brand">
                <MessageCircleHeart aria-hidden="true" className="size-5" />
              </div>
              <h2 className="mt-4 text-lg">{t("contact.counsellingRedirect")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {t("counselling.landingLede")}
              </p>
              <div className="mt-5">
                <ButtonLink href={localePath(locale, "/counselling")}>
                  {t("contact.counsellingRedirectCta")}
                </ButtonLink>
              </div>
            </Card>
          ) : null}

          <Card className="p-6">
            {/* Each dt/dd pair stays adjacent inside its wrapper — putting the
                icon between them breaks description-list semantics. */}
            <dl className="space-y-5">
              {[
                {
                  icon: MapPin,
                  label: t("contact.officeTitle"),
                  value: "Kaduna, Nigeria",
                },
                line
                  ? {
                      icon: Phone,
                      label: t("contact.phoneTitle"),
                      value: (
                        <a
                          href={`tel:${line.phone.replace(/\s/g, "")}`}
                          className="hover:underline"
                        >
                          {line.phone}
                        </a>
                      ),
                    }
                  : null,
                ...["08029175028", "08132943547"].map(phone => ({ icon: Phone, label: `${t("contact.phoneTitle")} · ${phone}`, value: <a href={`tel:${phone}`}>{phone}</a> })),
                {
                  icon: Mail,
                  label: t("contact.emailTitle"),
                  value: (
                    <a href="mailto:hello@heart2heart.ng" className="hover:underline">
                      hello@heart2heart.ng
                    </a>
                  ),
                },
                { icon: Clock, label: t("contact.hoursTitle"), value: t("contact.hours") },
              ]
                .filter((row): row is NonNullable<typeof row> => row !== null)
                .map((row) => (
                  <div key={row.label}>
                    <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                      <row.icon aria-hidden="true" className="size-4 shrink-0 text-plum-500" />
                      {row.label}
                    </dt>
                    <dd className="mt-1 pl-6 text-sm text-ink">{row.value}</dd>
                  </div>
                ))}
            </dl>
          </Card>
        </div>

        <ContactForm />
      </div>
    </>
  );
}

