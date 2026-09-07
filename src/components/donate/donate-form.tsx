"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartHandshake, Lock } from "lucide-react";

import { useI18n } from "@/lib/i18n/client";
import { localePath } from "@/lib/i18n/config";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Select, TextInput } from "@/components/ui/field";
import { CheckboxRow, ChoicePills } from "@/components/ui/choice";
import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { Donation } from "@/lib/types";

const PRESETS = [5_000, 15_000, 50_000, 150_000];
const DESIGNATIONS: Donation["designation"][] = [
  "GENERAL",
  "COUNSELLING",
  "SCHOOL_OUTREACH",
  "RESOURCES",
];

export function DonateForm() {
  const { locale, t } = useI18n();
  const router = useRouter();

  const [amount, setAmount] = useState<number | null>(15_000);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<"ONE_TIME" | "MONTHLY">("ONE_TIME");
  const [designation, setDesignation] = useState<Donation["designation"]>("GENERAL");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveAmount = amount ?? (Number(custom.replace(/\D/g, "")) || 0);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (effectiveAmount < 100) {
      setError(t("donate.amountLabel"));
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount * 100, // kobo
          donorName: anonymous ? "Anonymous" : name.trim(),
          donorEmail: email.trim() || undefined,
          anonymous,
          recurring: frequency === "MONTHLY",
          designation,
        }),
      });
      if (!response.ok) throw new Error("failed");
      const data = (await response.json()) as { reference: string };
      router.push(
        `${localePath(locale, "/donate/thank-you")}?ref=${encodeURIComponent(data.reference)}`,
      );
    } catch {
      setError(t("contact.error"));
      setSubmitting(false);
    }
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className="p-6 sm:p-8">
      <fieldset>
        <legend className="text-sm font-semibold text-ink">{t("donate.amountLabel")}</legend>
        <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {PRESETS.map((preset) => {
            const active = amount === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(preset);
                  setCustom("");
                }}
                aria-pressed={active}
                className={cn(
                  "rounded-xl border px-3 py-3 text-center font-display text-lg font-semibold transition-colors",
                  active
                    ? "border-plum-700 bg-plum-700 text-white"
                    : "border-line-strong bg-surface text-brand-strong hover:border-plum-300 hover:bg-tint",
                )}
              >
                {t("donate.currency")}
                {preset.toLocaleString()}
              </button>
            );
          })}
        </div>

        <div className="mt-3">
          <Field label={t("donate.customAmount")} optionalLabel={t("common.optional")}>
            {({ id, describedBy }) => (
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center font-semibold text-ink-muted">
                  {t("donate.currency")}
                </span>
                <TextInput
                  id={id}
                  aria-describedby={describedBy}
                  inputMode="numeric"
                  value={custom}
                  onChange={(event) => {
                    setCustom(event.target.value.replace(/\D/g, ""));
                    setAmount(null);
                  }}
                  className="pl-8"
                  placeholder="0"
                />
              </div>
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="text-sm font-semibold text-ink">{t("donate.frequencyLabel")}</legend>
        <div className="mt-3">
          <ChoicePills
            name="frequency"
            value={frequency}
            onChange={(value) => setFrequency(value as typeof frequency)}
            options={[
              { value: "ONE_TIME", label: t("donate.oneTime") },
              { value: "MONTHLY", label: t("donate.monthly") },
            ]}
          />
        </div>
        {frequency === "MONTHLY" ? (
          <p className="mt-3 text-sm text-ink-muted">{t("donate.monthlyNote")}</p>
        ) : null}
      </fieldset>

      <div className="mt-7">
        <Field label={t("donate.designationLabel")}>
          {({ id, describedBy }) => (
            <Select
              id={id}
              aria-describedby={describedBy}
              value={designation}
              onChange={(event) =>
                setDesignation(event.target.value as Donation["designation"])
              }
            >
              {DESIGNATIONS.map((value) => (
                <option key={value} value={value}>
                  {t(`donate.designations.${value}`)}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>

      <div className="mt-8 border-t border-line pt-7">
        <h3 className="text-base font-semibold text-ink">{t("donate.donorTitle")}</h3>

        <div className="mt-4 space-y-4">
          <Field label={t("donate.donorName")} required={!anonymous}>
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                aria-describedby={describedBy}
                autoComplete="name"
                disabled={anonymous}
                value={anonymous ? "" : name}
                onChange={(event) => setName(event.target.value)}
              />
            )}
          </Field>

          <Field label={t("donate.donorEmail")} hint={t("donate.donorEmailHint")}>
            {({ id, describedBy }) => (
              <TextInput
                id={id}
                type="email"
                aria-describedby={describedBy}
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            )}
          </Field>

          <CheckboxRow checked={anonymous} onChange={setAnonymous}>
            <span className="font-semibold">{t("donate.anonymous")}</span>
            <span className="mt-0.5 block text-sm text-ink-muted">
              {t("donate.anonymousHint")}
            </span>
          </CheckboxRow>
        </div>
      </div>

      {error ? (
        <Alert tone="danger" live className="mt-6">
          {error}
        </Alert>
      ) : null}

      <div className="mt-7">
        <Button type="submit" size="lg" fullWidth disabled={submitting}>
          <HeartHandshake aria-hidden="true" className="size-5" />
          {submitting ? t("contact.sending") : t("donate.cta")}
        </Button>
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
          <Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          {t("donate.paymentNote")}
        </p>
      </div>
    </Card>
  );
}
