"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { useI18n } from "@/lib/i18n/client";
import { localePath } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Field, TextInput } from "@/components/ui/field";
import { StatusBadge } from "@/components/portal/status-badge";
import { formatDateTime } from "@/lib/utils";
import {
  lookupCaseStatus,
  SAMPLE_ACCESS_CODE,
  SAMPLE_CASE_REF,
  type CaseStatusResult,
} from "@/lib/demo";

export function StatusLookup() {
  const { locale, t } = useI18n();
  const [caseRef, setCaseRef] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "found" | "not-found">("idle");
  const [result, setResult] = useState<CaseStatusResult | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("checking");

    try {
      // No API in this build — see src/lib/demo.ts. The lookup resolves
      // against a pair of sample cases; anything else reports not found.
      const found = await lookupCaseStatus(caseRef, accessCode);
      if (!found) {
        setState("not-found");
        setResult(null);
        return;
      }
      setResult(found);
      setState("found");
    } catch {
      setState("not-found");
    }
  }

  return (
    <div className="space-y-6">
      <Card as="form" onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
        <Field label={t("counselling.status.refField")} required>
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              required
              autoComplete="off"
              spellCheck={false}
              placeholder={t("counselling.status.refPlaceholder")}
              value={caseRef}
              onChange={(event) => setCaseRef(event.target.value.toUpperCase())}
              className="font-mono"
            />
          )}
        </Field>

        <Field label={t("counselling.status.codeField")} required>
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              aria-describedby={describedBy}
              required
              maxLength={8}
              autoComplete="off"
              spellCheck={false}
              placeholder={t("counselling.status.codePlaceholder")}
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value.toUpperCase())}
              className="font-mono tracking-[0.2em]"
            />
          )}
        </Field>

        <Button type="submit" size="lg" fullWidth disabled={state === "checking"}>
          <Search aria-hidden="true" className="size-4" />
          {state === "checking" ? t("common.loading") : t("counselling.status.check")}
        </Button>

        {/* Remove with the demo data once the API is connected. */}
        <p className="text-center text-xs text-ink-faint">
          {t("counselling.status.demoHint", {
            ref: SAMPLE_CASE_REF,
            code: SAMPLE_ACCESS_CODE,
          })}
        </p>
      </Card>

      {state === "not-found" ? (
        <Alert tone="warning" live>
          {t("counselling.status.notFound")}
        </Alert>
      ) : null}

      {state === "found" && result ? (
        <Card className="p-6 sm:p-8">
          <h2 className="text-lg">{t("counselling.status.resultTitle")}</h2>
          <p className="mt-1 font-mono text-sm text-ink-muted">{result.caseRef}</p>

          <div className="mt-5">
            <StatusBadge status={result.status} />
          </div>

          <p className="mt-4 leading-relaxed text-ink">
            {t(`counselling.status.descriptions.${result.status}`)}
          </p>

          <p className="mt-5 text-xs text-ink-faint">
            {t("counselling.status.lastUpdated")}: {formatDateTime(result.updatedAt, locale)}
          </p>
        </Card>
      ) : null}

      <p className="text-sm leading-relaxed text-ink-muted">
        {t("counselling.status.help")}{" "}
        <Link
          href={localePath(locale, "/contact")}
          className="font-semibold text-brand underline"
        >
          {t("contact.title")}
        </Link>
      </p>
    </div>
  );
}
