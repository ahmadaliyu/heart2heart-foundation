"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";

import { useI18n } from "@/lib/i18n/client";
import { localePath } from "@/lib/i18n/config";
import { Button, buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale, t } = useI18n();

  useEffect(() => {
    // Only the digest is logged. Anything a beneficiary typed into the
    // counselling form must never reach an error report.
    console.error("[h2h] render error", error.digest ?? "no-digest");
  }, [error]);

  return (
    <div className="container-page flex min-h-[70dvh] items-center justify-center py-16">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-warning-soft text-warning">
          <TriangleAlert aria-hidden="true" className="size-7" />
        </div>
        <h1 className="mt-6 text-2xl">{t("error.title")}</h1>
        <p className="mt-3 leading-relaxed text-ink-muted">{t("error.body")}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>{t("error.retry")}</Button>
          <Link
            href={localePath(locale, "/")}
            className={buttonClass({ variant: "secondary" })}
          >
            {t("error.home")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
