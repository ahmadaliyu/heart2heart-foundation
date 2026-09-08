"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Lock,
  Printer,
  Send,
  ShieldCheck,
} from "lucide-react";

import { useI18n } from "@/lib/i18n/client";
import { localePath, locales, type Locale } from "@/lib/i18n/config";
import type {
  AgeRange,
  BeneficiaryCategory,
  ContactMethod,
  SupportArea,
} from "@/lib/types";
import { ageRanges, contactMethods } from "@/lib/types";
import { Button, ButtonLink, buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Field, Select, TextArea, TextInput } from "@/components/ui/field";
import { CheckboxRow, ChoiceCard, ChoicePills } from "@/components/ui/choice";
import { cn, formatDate, formatSlot } from "@/lib/utils";
import { submitCounsellingRequest, type SubmittedRequest } from "@/lib/demo";

const SLOTS = [9 * 60, 10 * 60, 11 * 60, 12 * 60, 14 * 60, 15 * 60, 16 * 60];

const STEPS = ["about", "support", "contact", "timing", "consent", "review"] as const;
type Step = (typeof STEPS)[number];

const AREAS_BY_CATEGORY: Record<BeneficiaryCategory, SupportArea[]> = {
  SCHOOL_GIRL: [
    "EMOTIONAL",
    "ACADEMIC",
    "BULLYING",
    "SELF_ESTEEM",
    "FAMILY",
    "RELATIONSHIP",
    "SOCIAL_PRESSURE",
    "OTHER",
  ],
  MARRIED_WOMAN: [
    "MARITAL",
    "RELATIONSHIP",
    "COMMUNICATION",
    "FAMILY",
    "EMOTIONAL",
    "SOCIAL_PRESSURE",
    "OTHER",
  ],
};

const MINOR_AGES: AgeRange[] = ["UNDER_13", "13_15", "16_17"];

interface FormState {
  preferredName: string;
  category: BeneficiaryCategory | "";
  ageRange: AgeRange | "";
  supportAreas: SupportArea[];
  reason: string;
  contactMethod: ContactMethod | "";
  contactValue: string;
  contactNotes: string;
  safeToContact: "" | "YES" | "NO" | "UNSURE";
  preferredLanguage: Locale;
  preferredDate: string;
  preferredTimeSlot: number | null;
  safetyAnswer: "" | "YES" | "NO" | "UNSURE";
  guardianAware: "" | "YES" | "NO" | "UNSURE";
  consentGiven: boolean;
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function IntakeForm({
  initialCategory,
}: {
  initialCategory?: BeneficiaryCategory;
}) {
  const { locale, t } = useI18n();

  /**
   * Form state lives here and nowhere else.
   *
   * There is deliberately no draft saved to localStorage or a cookie. Someone
   * may be filling this in on a shared or borrowed phone; a half-finished
   * disclosure sitting in browser storage for the next person to find is a
   * safeguarding risk that outweighs the convenience of restoring a draft.
   */
  const [form, setForm] = useState<FormState>({
    preferredName: "",
    category: initialCategory ?? "",
    ageRange: "",
    supportAreas: [],
    reason: "",
    contactMethod: "",
    contactValue: "",
    contactNotes: "",
    safeToContact: "",
    preferredLanguage: locale,
    preferredDate: "",
    preferredTimeSlot: null,
    safetyAnswer: "",
    guardianAware: "",
    consentGiven: false,
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<SubmittedRequest | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const step = STEPS[stepIndex];
  const isMinor = MINOR_AGES.includes(form.ageRange as AgeRange);

  const areas = useMemo(
    () => (form.category ? AREAS_BY_CATEGORY[form.category] : []),
    [form.category],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  function validate(target: Step): Record<string, string> {
    const next: Record<string, string> = {};
    const e = (key: string) => t(`counselling.errors.${key}`);

    if (target === "about") {
      if (form.preferredName.trim().length === 0) next.preferredName = e("preferredNameRequired");
      else if (form.preferredName.trim().length < 2) next.preferredName = e("preferredNameShort");
      if (!form.category) next.category = e("categoryRequired");
      if (!form.ageRange) next.ageRange = e("ageRequired");
    }

    if (target === "support") {
      if (form.reason.length > 1000) next.reason = e("reasonLong");
    }

    if (target === "contact") {
      if (!form.contactMethod) next.contactMethod = e("contactMethodRequired");
      else if (form.contactMethod !== "IN_PERSON") {
        const value = form.contactValue.trim();
        if (!value) next.contactValue = e("contactValueRequired");
        else if (form.contactMethod === "EMAIL") {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
            next.contactValue = e("contactValueInvalidEmail");
        } else if (!/^\+?[\d\s()-]{7,20}$/.test(value)) {
          next.contactValue = e("contactValueInvalidPhone");
        }
      }
    }

    if (target === "timing") {
      if (!form.preferredDate) next.preferredDate = e("dateRequired");
      else if (form.preferredDate < todayISO()) next.preferredDate = e("datePast");
      if (form.preferredTimeSlot === null) next.preferredTimeSlot = e("timeRequired");
    }

    if (target === "consent") {
      if (!form.consentGiven) next.consentGiven = t("counselling.consent.required");
    }

    return next;
  }

  function goTo(index: number) {
    setStepIndex(index);
    setErrors({});
    // Move focus to the new step heading so screen-reader and keyboard users
    // are not left at the bottom of the previous step.
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function handleNext() {
    const found = validate(step);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    goTo(Math.min(stepIndex + 1, STEPS.length - 1));
  }

  async function handleSubmit() {
    // Re-run every step's rules before sending, not just the last one.
    const all = STEPS.reduce<Record<string, string>>(
      (acc, s) => ({ ...acc, ...validate(s) }),
      {},
    );
    if (Object.keys(all).length) {
      setErrors(all);
      const firstBroken = STEPS.findIndex((s) => Object.keys(validate(s)).length > 0);
      if (firstBroken >= 0) goTo(firstBroken);
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      // No API in this build — see src/lib/demo.ts. The answers below are
      // held in component state only and are discarded when this page closes;
      // the reference issued here is not recorded and will not appear in the
      // portal. The request body the real endpoint expects is assembled in
      // `payload` so the contract stays visible at the call site.
      const payload = {
        preferredName: form.preferredName.trim(),
        category: form.category,
        ageRange: form.ageRange,
        supportAreas: form.supportAreas,
        reason: form.reason.trim(),
        contactMethod: form.contactMethod,
        contactValue: form.contactValue.trim(),
        contactNotes: form.contactNotes.trim() || undefined,
        safeToContact: form.safeToContact || undefined,
        preferredLanguage: form.preferredLanguage,
        preferredDate: form.preferredDate,
        preferredTimeSlot: form.preferredTimeSlot,
        consentGiven: true,
        safeguardingFlag: form.safetyAnswer === "YES",
        guardianAware:
          form.guardianAware === "" ? undefined : form.guardianAware === "YES",
      } satisfies Record<string, unknown>;
      void payload;

      const data = await submitCounsellingRequest();
      setSubmitted(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError(t("counselling.errors.generic"));
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <SubmittedPanel result={submitted} />;
  }

  return (
    <div className="container-page max-w-2xl py-10 sm:py-14">
      <Stepper current={stepIndex} onSelect={goTo} />

      <Card className="mt-7 p-6 sm:p-8">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-2xl outline-none sm:text-[1.75rem]"
        >
          {t(`counselling.steps.${step}`)}
        </h1>

        <div className="mt-7 space-y-7">
          {/* ------------------------------------------------------ about */}
          {step === "about" ? (
            <>
              <Field
                label={t("counselling.fields.preferredName")}
                hint={t("counselling.fields.preferredNameHint")}
                error={errors.preferredName}
                required
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    autoComplete="off"
                    maxLength={60}
                    value={form.preferredName}
                    onChange={(event) => update("preferredName", event.target.value)}
                  />
                )}
              </Field>

              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  {t("counselling.fields.category")}
                  <span className="text-danger" aria-hidden="true">
                    {" "}
                    *
                  </span>
                </legend>
                <div className="mt-3 grid gap-3">
                  {(["SCHOOL_GIRL", "MARRIED_WOMAN"] as const).map((value) => (
                    <ChoiceCard
                      key={value}
                      name="category"
                      value={value}
                      checked={form.category === value}
                      onChange={() => {
                        update("category", value);
                        // Support areas are category-specific; drop any that no
                        // longer apply rather than silently submitting them.
                        setForm((prev) => ({
                          ...prev,
                          category: value,
                          supportAreas: prev.supportAreas.filter((area) =>
                            AREAS_BY_CATEGORY[value].includes(area),
                          ),
                        }));
                      }}
                      title={t(`enums.category.${value}`)}
                    />
                  ))}
                </div>
                {errors.category ? (
                  <p className="mt-2 text-[0.8125rem] font-medium text-danger">
                    {errors.category}
                  </p>
                ) : null}
              </fieldset>

              <Field
                label={t("counselling.fields.ageRange")}
                hint={t("counselling.fields.ageRangeHint")}
                error={errors.ageRange}
                required
              >
                {({ id, describedBy, invalid }) => (
                  <Select
                    id={id}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    value={form.ageRange}
                    onChange={(event) => update("ageRange", event.target.value as AgeRange)}
                  >
                    <option value="">—</option>
                    {ageRanges.map((value) => (
                      <option key={value} value={value}>
                        {t(`enums.ageRange.${value}`)}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </>
          ) : null}

          {/* ---------------------------------------------------- support */}
          {step === "support" ? (
            <>
              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  {t("counselling.fields.supportAreas")}
                </legend>
                <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
                  {t("counselling.fields.supportAreasHint")}
                </p>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {areas.map((area) => (
                    <ChoiceCard
                      key={area}
                      type="checkbox"
                      name="supportAreas"
                      value={area}
                      checked={form.supportAreas.includes(area)}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          supportAreas: prev.supportAreas.includes(area)
                            ? prev.supportAreas.filter((item) => item !== area)
                            : [...prev.supportAreas, area],
                        }))
                      }
                      title={t(`enums.supportArea.${area}`)}
                    />
                  ))}
                </div>
              </fieldset>

              <Field
                label={t("counselling.fields.reason")}
                hint={t("counselling.fields.reasonHint")}
                error={errors.reason}
                optionalLabel={t("common.optional")}
              >
                {({ id, describedBy, invalid }) => (
                  <>
                    <TextArea
                      id={id}
                      aria-describedby={describedBy}
                      invalid={invalid}
                      rows={5}
                      maxLength={1000}
                      placeholder={t("counselling.fields.reasonPlaceholder")}
                      value={form.reason}
                      onChange={(event) => update("reason", event.target.value)}
                    />
                    <p className="text-right text-xs text-ink-faint">
                      {form.reason.length}/1000
                    </p>
                  </>
                )}
              </Field>
            </>
          ) : null}

          {/* ---------------------------------------------------- contact */}
          {step === "contact" ? (
            <>
              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  {t("counselling.fields.contactMethod")}
                  <span className="text-danger" aria-hidden="true">
                    {" "}
                    *
                  </span>
                </legend>
                <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
                  {t("counselling.fields.contactMethodHint")}
                </p>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {contactMethods.map((method) => (
                    <ChoiceCard
                      key={method}
                      name="contactMethod"
                      value={method}
                      checked={form.contactMethod === method}
                      onChange={() => update("contactMethod", method)}
                      title={t(`enums.contactMethod.${method}`)}
                    />
                  ))}
                </div>
                {errors.contactMethod ? (
                  <p className="mt-2 text-[0.8125rem] font-medium text-danger">
                    {errors.contactMethod}
                  </p>
                ) : null}
              </fieldset>

              {form.contactMethod && form.contactMethod !== "IN_PERSON" ? (
                <Field
                  label={t("counselling.fields.contactValue")}
                  hint={
                    form.contactMethod === "EMAIL"
                      ? t("counselling.fields.contactValueHintEmail")
                      : t("counselling.fields.contactValueHintPhone")
                  }
                  error={errors.contactValue}
                  required
                >
                  {({ id, describedBy, invalid }) => (
                    <TextInput
                      id={id}
                      aria-describedby={describedBy}
                      invalid={invalid}
                      inputMode={form.contactMethod === "EMAIL" ? "email" : "tel"}
                      type={form.contactMethod === "EMAIL" ? "email" : "tel"}
                      autoComplete="off"
                      value={form.contactValue}
                      onChange={(event) => update("contactValue", event.target.value)}
                    />
                  )}
                </Field>
              ) : null}

              {/* Safety question about the contact channel itself. On this
                  platform, "can we reach you" and "is it safe to reach you"
                  are two different questions. */}
              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  {t("counselling.fields.safeToContact")}
                </legend>
                <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
                  {t("counselling.fields.safeToContactHint")}
                </p>
                <div className="mt-3">
                  <ChoicePills
                    name="safeToContact"
                    value={form.safeToContact || undefined}
                    onChange={(value) =>
                      update("safeToContact", value as FormState["safeToContact"])
                    }
                    options={[
                      { value: "YES", label: t("common.yes") },
                      { value: "NO", label: t("common.no") },
                      { value: "UNSURE", label: t("common.notSure") },
                    ]}
                  />
                </div>
              </fieldset>

              <Field
                label={t("counselling.fields.contactNotes")}
                optionalLabel={t("common.optional")}
              >
                {({ id, describedBy }) => (
                  <TextArea
                    id={id}
                    aria-describedby={describedBy}
                    rows={3}
                    maxLength={300}
                    placeholder={t("counselling.fields.contactNotesPlaceholder")}
                    value={form.contactNotes}
                    onChange={(event) => update("contactNotes", event.target.value)}
                  />
                )}
              </Field>
            </>
          ) : null}

          {/* ----------------------------------------------------- timing */}
          {step === "timing" ? (
            <>
              <Field
                label={t("counselling.fields.preferredDate")}
                hint={t("counselling.fields.preferredDateHint")}
                error={errors.preferredDate}
                required
              >
                {({ id, describedBy, invalid }) => (
                  <TextInput
                    id={id}
                    type="date"
                    min={todayISO()}
                    aria-describedby={describedBy}
                    invalid={invalid}
                    value={form.preferredDate}
                    onChange={(event) => update("preferredDate", event.target.value)}
                  />
                )}
              </Field>

              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  {t("counselling.fields.preferredTime")}
                  <span className="text-danger" aria-hidden="true">
                    {" "}
                    *
                  </span>
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {SLOTS.map((slot) => {
                    const active = form.preferredTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        aria-pressed={active}
                        onClick={() => update("preferredTimeSlot", slot)}
                        className={cn(
                          "rounded-xl border px-3 py-3 text-sm font-semibold transition-colors",
                          active
                            ? "border-plum-700 bg-plum-700 text-white"
                            : "border-line-strong bg-surface text-ink hover:border-plum-300 hover:bg-tint",
                        )}
                      >
                        {formatSlot(slot, locale)}
                      </button>
                    );
                  })}
                </div>
                {errors.preferredTimeSlot ? (
                  <p className="mt-2 text-[0.8125rem] font-medium text-danger">
                    {errors.preferredTimeSlot}
                  </p>
                ) : null}
              </fieldset>

              <Field label={t("counselling.fields.language")}>
                {({ id, describedBy }) => (
                  <Select
                    id={id}
                    aria-describedby={describedBy}
                    value={form.preferredLanguage}
                    onChange={(event) =>
                      update("preferredLanguage", event.target.value as Locale)
                    }
                  >
                    {locales.map((code) => (
                      <option key={code} value={code}>
                        {code === "en" ? "English" : "Hausa"}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>
            </>
          ) : null}

          {/* ---------------------------------------------------- consent */}
          {step === "consent" ? (
            <>
              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  {t("counselling.fields.safetyQuestion")}
                </legend>
                <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
                  {t("counselling.fields.safetyQuestionHint")}
                </p>
                <div className="mt-3">
                  <ChoicePills
                    name="safetyAnswer"
                    value={form.safetyAnswer || undefined}
                    onChange={(value) =>
                      update("safetyAnswer", value as FormState["safetyAnswer"])
                    }
                    options={[
                      { value: "YES", label: t("common.yes") },
                      { value: "NO", label: t("common.no") },
                      { value: "UNSURE", label: t("common.notSure") },
                    ]}
                  />
                </div>

                {form.safetyAnswer === "YES" ? (
                  <Alert tone="danger" live className="mt-4">
                    <p>{t("emergency.lede")}</p>
                    <p className="mt-3">
                      <Link
                        href={localePath(locale, "/emergency")}
                        className="font-semibold text-danger underline"
                      >
                        {t("nav.emergency")}
                      </Link>
                    </p>
                  </Alert>
                ) : null}
              </fieldset>

              {/* Only asked when the age range indicates a minor. */}
              {isMinor ? (
                <fieldset>
                  <legend className="text-sm font-semibold text-ink">
                    {t("counselling.fields.guardianAware")}
                  </legend>
                  <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
                    {t("counselling.fields.guardianAwareHint")}
                  </p>
                  <div className="mt-3">
                    <ChoicePills
                      name="guardianAware"
                      value={form.guardianAware || undefined}
                      onChange={(value) =>
                        update("guardianAware", value as FormState["guardianAware"])
                      }
                      options={[
                        { value: "YES", label: t("common.yes") },
                        { value: "NO", label: t("common.no") },
                        { value: "UNSURE", label: t("common.notSure") },
                      ]}
                    />
                  </div>
                </fieldset>
              ) : null}

              <div className="rounded-2xl border border-tint-line bg-tint p-5">
                <h2 className="flex items-center gap-2 text-base font-semibold text-heading">
                  <ShieldCheck aria-hidden="true" className="size-5 text-brand" />
                  {t("counselling.consent.title")}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">{t("counselling.consent.body")}</p>
                <ul className="mt-4 space-y-2.5">
                  {t.list("counselling.consent.points").map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-ink">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-plum-500"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={localePath(locale, "/safeguarding")}
                  className="mt-4 inline-block text-sm font-semibold text-brand underline"
                >
                  {t("counselling.consent.safeguardingLink")}
                </Link>
              </div>

              <div>
                <CheckboxRow
                  checked={form.consentGiven}
                  invalid={Boolean(errors.consentGiven)}
                  onChange={(checked) => update("consentGiven", checked)}
                >
                  {t("counselling.consent.checkbox")}
                </CheckboxRow>
                {errors.consentGiven ? (
                  <p className="mt-2 text-[0.8125rem] font-medium text-danger">
                    {errors.consentGiven}
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {/* ----------------------------------------------------- review */}
          {step === "review" ? (
            <>
              <p className="text-sm leading-relaxed text-ink-muted">
                {t("counselling.review.body")}
              </p>

              <dl className="divide-y divide-line rounded-xl border border-line">
                {[
                  {
                    step: 0,
                    label: t("counselling.fields.preferredName"),
                    value: form.preferredName,
                  },
                  {
                    step: 0,
                    label: t("counselling.fields.category"),
                    value: form.category ? t(`enums.category.${form.category}`) : "—",
                  },
                  {
                    step: 0,
                    label: t("counselling.fields.ageRange"),
                    value: form.ageRange ? t(`enums.ageRange.${form.ageRange}`) : "—",
                  },
                  {
                    step: 1,
                    label: t("counselling.fields.supportAreas"),
                    value:
                      form.supportAreas.length > 0
                        ? form.supportAreas
                            .map((area) => t(`enums.supportArea.${area}`))
                            .join(", ")
                        : "—",
                  },
                  {
                    step: 1,
                    label: t("counselling.fields.reason"),
                    value: form.reason || "—",
                  },
                  {
                    step: 2,
                    label: t("counselling.fields.contactMethod"),
                    value: form.contactMethod
                      ? t(`enums.contactMethod.${form.contactMethod}`)
                      : "—",
                  },
                  {
                    step: 2,
                    label: t("counselling.fields.contactValue"),
                    value: form.contactValue || "—",
                  },
                  {
                    step: 3,
                    label: t("counselling.fields.preferredDate"),
                    value: form.preferredDate
                      ? formatDate(`${form.preferredDate}T09:00:00`, locale)
                      : "—",
                  },
                  {
                    step: 3,
                    label: t("counselling.fields.preferredTime"),
                    value:
                      form.preferredTimeSlot !== null
                        ? formatSlot(form.preferredTimeSlot, locale)
                        : "—",
                  },
                  {
                    step: 4,
                    label: t("counselling.fields.safetyQuestion"),
                    value:
                      form.safetyAnswer === "YES"
                        ? t("common.yes")
                        : form.safetyAnswer === "NO"
                          ? t("common.no")
                          : form.safetyAnswer === "UNSURE"
                            ? t("common.notSure")
                            : "—",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-3"
                  >
                    <dt className="w-full text-xs font-semibold uppercase tracking-wide text-ink-faint sm:w-40">
                      {row.label}
                    </dt>
                    <dd className="flex-1 text-sm text-ink">{row.value}</dd>
                    <button
                      type="button"
                      onClick={() => goTo(row.step)}
                      className="text-xs font-semibold text-brand underline"
                    >
                      {t("counselling.review.editStep")}
                      <span className="sr-only"> — {row.label}</span>
                    </button>
                  </div>
                ))}
              </dl>

              {formError ? (
                <Alert tone="danger" live>
                  {formError}
                </Alert>
              ) : null}
            </>
          ) : null}
        </div>

        {/* ------------------------------------------------------ actions */}
        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
          {stepIndex > 0 ? (
            <Button variant="quiet" onClick={() => goTo(stepIndex - 1)}>
              <ArrowLeft aria-hidden="true" className="size-4" />
              {t("common.back")}
            </Button>
          ) : (
            <ButtonLink href={localePath(locale, "/counselling")} variant="quiet">
              <ArrowLeft aria-hidden="true" className="size-4" />
              {t("common.back")}
            </ButtonLink>
          )}

          {step === "review" ? (
            <Button size="lg" onClick={handleSubmit} disabled={submitting}>
              <Send aria-hidden="true" className="size-4" />
              {submitting ? t("counselling.review.sending") : t("counselling.review.send")}
            </Button>
          ) : (
            <Button size="lg" onClick={handleNext}>
              {t("common.continue")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          )}
        </div>
      </Card>

      <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
        <Lock aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
        {t("counselling.landingLede")}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Stepper({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (index: number) => void;
}) {
  const { t } = useI18n();

  return (
    <nav aria-label={t("common.step")}>
      <p className="eyebrow text-ink-faint">
        {t("common.step")} {current + 1} {t("common.of")} {STEPS.length}
      </p>

      <ol className="mt-3 flex gap-1.5">
        {STEPS.map((step, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li key={step} className="flex-1">
              <button
                type="button"
                onClick={() => (done ? onSelect(index) : undefined)}
                disabled={!done}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "h-1.5 w-full rounded-full transition-colors",
                  active
                    ? "bg-plum-700"
                    : done
                      ? "cursor-pointer bg-plum-400 hover:bg-plum-500"
                      : "bg-line-strong",
                )}
              >
                <span className="sr-only">
                  {t(`counselling.steps.${step}`)}
                  {done ? ` — ${t("common.back")}` : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Confirmation is rendered in place rather than on a separate route.
 *
 * The case reference and access code are the only things standing between the
 * beneficiary and their record, so they are never put in a URL (which lands in
 * browser history and referrer headers) and never written to browser storage.
 * The trade-off — a refresh loses them — is stated plainly on the page.
 */
function SubmittedPanel({ result }: { result: SubmittedRequest }) {
  const { locale, t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${result.caseRef} / ${result.accessCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the values are visible on screen anyway */
    }
  }

  return (
    <div className="container-page max-w-2xl py-10 sm:py-14">
      <Card className="p-6 sm:p-9">
        <div className="flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <Check aria-hidden="true" className="size-7" strokeWidth={2.5} />
        </div>

        <h1 className="mt-6 text-3xl">{t("counselling.submitted.title")}</h1>
        <p className="mt-3 leading-relaxed text-ink-muted">
          {t("counselling.submitted.body")}
        </p>

        <div className="mt-8 rounded-2xl border-2 border-dashed border-plum-300 bg-tint p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                {t("counselling.submitted.refLabel")}
              </p>
              <p className="mt-1.5 font-mono text-lg font-bold text-heading">
                {result.caseRef}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                {t("counselling.submitted.codeLabel")}
              </p>
              <p className="mt-1.5 font-mono text-lg font-bold tracking-[0.2em] text-heading">
                {result.accessCode}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink">
            {t("counselling.submitted.refHint")}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Button size="sm" variant="secondary" onClick={copy}>
              {copied ? (
                <Check aria-hidden="true" className="size-4" />
              ) : (
                <Copy aria-hidden="true" className="size-4" />
              )}
              {copied ? t("common.copied") : t("common.copy")}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => window.print()}>
              <Printer aria-hidden="true" className="size-4" />
              {t("counselling.submitted.printNote")}
            </Button>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-lg">{t("counselling.submitted.whatNextTitle")}</h2>
          <ol className="mt-4 space-y-3">
            {t.list("counselling.submitted.whatNext").map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink">
                <span
                  aria-hidden="true"
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-tint-strong text-xs font-bold text-brand-strong"
                >
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </section>

        <Alert tone="warning" className="mt-7">
          {t("counselling.submitted.urgentNote")}{" "}
          <Link
            href={localePath(locale, "/emergency")}
            className="font-semibold underline"
          >
            {t("nav.emergency")}
          </Link>
        </Alert>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={localePath(locale, "/counselling/status")}
            className={buttonClass({ variant: "secondary" })}
          >
            {t("counselling.submitted.checkStatus")}
          </Link>
          <Link href={localePath(locale, "/")} className={buttonClass({ variant: "quiet" })}>
            {t("counselling.submitted.backHome")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
