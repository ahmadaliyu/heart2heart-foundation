"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

import { useI18n } from "@/lib/i18n/client";
import { localePath } from "@/lib/i18n/config";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  const { locale, t } = useI18n();

  return (
    <div className="container-page flex min-h-[70dvh] items-center justify-center py-16">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-tint text-brand">
          <Compass aria-hidden="true" className="size-7" />
        </div>
        <h1 className="mt-6 text-2xl">{t("notFound.title")}</h1>
        <p className="mt-3 leading-relaxed text-ink-muted">{t("notFound.body")}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={localePath(locale, "/")} className={buttonClass()}>
            {t("notFound.home")}
          </Link>
          <Link
            href={localePath(locale, "/counselling")}
            className={buttonClass({ variant: "secondary" })}
          >
            {t("notFound.support")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
