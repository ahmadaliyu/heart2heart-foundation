import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarPlus, Lock, Share2 } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { getCase, staffName, therapists } from "@/lib/data";
import { Card, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, TextArea, TextInput } from "@/components/ui/field";
import { StatusBadge } from "@/components/portal/status-badge";
import { PortalPageHeader } from "@/components/portal/portal-ui";
import {
  addNoteAction,
  addReferralAction,
  scheduleAppointmentAction,
} from "../../actions";
import { formatDate, formatDateTime, formatTime } from "@/lib/utils";

const NOTE_KINDS = ["SESSION", "FOLLOW_UP", "REFERRAL", "ADMIN"] as const;

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; caseRef: string }>;
}) {
  const resolved = await params;
  const { locale, t } = await getTranslations(params);
  const user = await requireSession();

  const record = getCase(decodeURIComponent(resolved.caseRef));
  if (!record) notFound();

  const p = (path: string) => localePath(locale as Locale, path);

  return (
    <>
      <Link
        href={p("/portal/cases")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t("portal.common.backTo")} {t("portal.cases.title").toLowerCase()}
      </Link>

      <PortalPageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xl sm:text-2xl">{record.caseRef}</span>
            <StatusBadge status={record.status} />
          </span>
        }
        lede={`${record.preferredName} · ${t(`enums.category.${record.category}`)}`}
      />

      <Alert tone="privacy" className="mb-6" title={t("portal.cases.confidentialNotice")}>
        {t("portal.login.confidentialityNote")}
      </Alert>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {/* ------------------------------------------------ case notes */}
          <Card>
            <CardHeader
              title={t("portal.cases.notes")}
              description={`${record.notes.length}`}
            />

            <form action={addNoteAction} className="space-y-3 border-b border-line p-5">
              <input type="hidden" name="caseRef" value={record.caseRef} />
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <TextArea
                  name="body"
                  rows={3}
                  required
                  maxLength={4000}
                  placeholder={t("portal.cases.notePlaceholder")}
                  aria-label={t("portal.cases.addNote")}
                />
                <div className="space-y-2 sm:w-44">
                  <Select name="kind" aria-label={t("portal.cases.noteKind")}>
                    {NOTE_KINDS.map((kind) => (
                      <option key={kind} value={kind}>
                        {kind === "SESSION"
                          ? t("portal.cases.notes")
                          : kind === "FOLLOW_UP"
                            ? t("portal.nav.followUps")
                            : kind === "REFERRAL"
                              ? t("portal.nav.referrals")
                              : t("portal.common.actions")}
                      </option>
                    ))}
                  </Select>
                  <Button type="submit" fullWidth>
                    {t("portal.cases.saveNote")}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-ink-faint">
                {t("portal.common.accessLogged")} · {user.name}
              </p>
            </form>

            <div className="p-5">
              {record.notes.length ? (
                <ol className="space-y-4">
                  {record.notes.map((note) => (
                    <li
                      key={note.id}
                      className="rounded-xl border border-line bg-canvas p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-ink">{note.authorName}</p>
                        <div className="flex items-center gap-2">
                          <Badge tone="brand">{note.kind.replace("_", " ")}</Badge>
                          <time
                            dateTime={note.createdAt}
                            className="text-xs text-ink-faint"
                          >
                            {formatDateTime(note.createdAt, locale as Locale)}
                          </time>
                        </div>
                      </div>
                      <p className="mt-2.5 leading-relaxed text-ink">{note.body}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState
                  icon={<Lock aria-hidden="true" className="size-5" />}
                  title={t("common.noResults")}
                />
              )}
            </div>
          </Card>

          {/* --------------------------------------- appointment history */}
          <Card>
            <CardHeader title={t("portal.cases.appointmentHistory")} />
            <div className="p-5">
              {record.appointments.length ? (
                <ol className="relative space-y-4 border-l border-line pl-5">
                  {record.appointments.map((appointment) => (
                    <li key={appointment.id} className="relative">
                      <span
                        aria-hidden="true"
                        className="absolute -left-[1.6875rem] top-1.5 size-2.5 rounded-full bg-plum-400 ring-4 ring-surface"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-ink">
                          {formatDate(appointment.scheduledFor, locale as Locale)} ·{" "}
                          {formatTime(appointment.scheduledFor, locale as Locale)}
                        </p>
                        <StatusBadge status={appointment.status} />
                      </div>
                      <p className="mt-1 text-sm text-ink-muted">
                        {t(`enums.appointmentMode.${appointment.mode}`)}
                        {appointment.location ? ` · ${appointment.location}` : ""} ·{" "}
                        {staffName(appointment.therapistId)}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <EmptyState title={t("portal.appointments.empty")} />
              )}
            </div>
          </Card>
        </div>

        {/* --------------------------------------------------------- side */}
        <div className="space-y-6">
          <Card>
            <CardHeader title={t("portal.appointments.newAppointment")} />
            <form action={scheduleAppointmentAction} className="space-y-3 p-5">
              <input type="hidden" name="caseRef" value={record.caseRef} />

              <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {t("portal.appointments.date")}
                <TextInput name="date" type="date" required className="mt-1.5" />
              </label>

              <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {t("portal.appointments.time")}
                <TextInput name="time" type="time" required defaultValue="10:00" className="mt-1.5" />
              </label>

              <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {t("portal.appointments.mode")}
                <Select name="mode" className="mt-1.5" defaultValue="IN_PERSON">
                  {(["IN_PERSON", "PHONE", "VIDEO"] as const).map((mode) => (
                    <option key={mode} value={mode}>
                      {t(`enums.appointmentMode.${mode}`)}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {t("portal.appointments.location")}
                <TextInput
                  name="location"
                  className="mt-1.5"
                  defaultValue="Foundation Centre, Wuse II"
                />
              </label>

              <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {t("portal.appointments.therapist")}
                <Select
                  name="therapistId"
                  className="mt-1.5"
                  defaultValue={record.assignedTherapistId ?? user.id}
                >
                  {therapists().map((therapist) => (
                    <option key={therapist.id} value={therapist.id}>
                      {therapist.name}
                    </option>
                  ))}
                </Select>
              </label>

              <Button type="submit" fullWidth>
                <CalendarPlus aria-hidden="true" className="size-4" />
                {t("portal.appointments.newAppointment")}
              </Button>
            </form>
          </Card>

          <Card>
            <CardHeader title={t("portal.cases.referrals")} />

            <div className="space-y-3 p-5">
              {record.referrals.length ? (
                <ul className="space-y-3">
                  {record.referrals.map((referral) => (
                    <li
                      key={referral.id}
                      className="rounded-xl border border-line p-3.5 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-ink">{referral.organisation}</p>
                        <Badge
                          tone={referral.status === "ACCEPTED" ? "success" : "warning"}
                        >
                          {referral.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-ink-muted">{referral.reason}</p>
                      <p className="mt-1 text-xs text-ink-faint">
                        {formatDate(referral.referredAt, locale as Locale)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}

              <form action={addReferralAction} className="space-y-2.5 border-t border-line pt-4">
                <input type="hidden" name="caseRef" value={record.caseRef} />
                <TextInput
                  name="organisation"
                  required
                  placeholder={t("portal.cases.referralOrg")}
                  aria-label={t("portal.cases.referralOrg")}
                />
                <TextInput
                  name="contact"
                  placeholder={t("portal.cases.referralContact")}
                  aria-label={t("portal.cases.referralContact")}
                />
                <TextArea
                  name="reason"
                  rows={2}
                  placeholder={t("portal.cases.referralReason")}
                  aria-label={t("portal.cases.referralReason")}
                />
                <Button type="submit" fullWidth variant="secondary">
                  <Share2 aria-hidden="true" className="size-4" />
                  {t("portal.cases.addReferral")}
                </Button>
              </form>
            </div>
          </Card>

          <Card>
            <CardHeader title={t("portal.cases.timeline")} />
            <dl className="space-y-3 p-5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">{t("portal.cases.openedOn")}</dt>
                <dd className="text-ink">
                  {formatDate(record.openedAt, locale as Locale)}
                </dd>
              </div>
              {record.closedAt ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-muted">{t("portal.cases.closedOn")}</dt>
                  <dd className="text-ink">
                    {formatDate(record.closedAt, locale as Locale)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt className="text-ink-muted">{t("portal.common.assignedTo")}</dt>
                <dd className="text-ink">
                  {staffName(record.assignedTherapistId) ??
                    t("portal.requests.unassigned")}
                </dd>
              </div>
            </dl>

            <div className="border-t border-line p-5">
              <Link
                href={p(`/portal/requests/${record.caseRef}`)}
                className="text-sm font-semibold text-brand hover:underline"
              >
                {t("portal.requests.detailTitle")}
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
