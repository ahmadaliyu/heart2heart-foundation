"use server";

import { revalidatePath } from "next/cache";

import {
  addNote,
  addReferral,
  assignTherapist,
  scheduleAppointment,
  updateRequestStatus,
} from "@/lib/data";
import { requireSession } from "@/lib/session";
import type { AppointmentStatus } from "@/lib/types";
import { appointmentStatuses } from "@/lib/types";

/**
 * Portal mutations.
 *
 * Every one of these re-checks the session server-side. Hiding a button in the
 * UI is presentation; this is the boundary. When the NestJS API takes over, the
 * same checks have to exist there — these actions become thin proxies.
 */

function refresh(caseRef: string) {
  revalidatePath("/[locale]/portal/(app)/requests", "page");
  revalidatePath(`/[locale]/portal/(app)/requests/${caseRef}`, "page");
  revalidatePath("/[locale]/portal/(app)/cases", "page");
  revalidatePath(`/[locale]/portal/(app)/cases/${caseRef}`, "page");
  revalidatePath("/[locale]/portal/(app)/dashboard", "page");
  revalidatePath("/[locale]/portal/(app)/appointments", "page");
}

export async function advanceStatusAction(formData: FormData) {
  await requireSession();

  const caseRef = String(formData.get("caseRef") ?? "");
  const to = String(formData.get("status") ?? "");

  if (!caseRef || !appointmentStatuses.includes(to as AppointmentStatus)) return;

  // updateRequestStatus refuses transitions the process does not allow, so an
  // out-of-order request (a replayed form post, say) changes nothing.
  updateRequestStatus(caseRef, to as AppointmentStatus);
  refresh(caseRef);
}

export async function assignTherapistAction(formData: FormData) {
  await requireSession();

  const caseRef = String(formData.get("caseRef") ?? "");
  const therapistId = String(formData.get("therapistId") ?? "");
  if (!caseRef || !therapistId) return;

  assignTherapist(caseRef, therapistId);
  refresh(caseRef);
}

export async function scheduleAppointmentAction(formData: FormData) {
  const user = await requireSession();

  const caseRef = String(formData.get("caseRef") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const mode = String(formData.get("mode") ?? "IN_PERSON");
  const location = String(formData.get("location") ?? "");
  const therapistId = String(formData.get("therapistId") ?? user.id);

  if (!caseRef || !date || !time) return;

  scheduleAppointment({
    caseRef,
    therapistId,
    scheduledFor: new Date(`${date}T${time}:00`).toISOString(),
    mode: mode as "IN_PERSON" | "PHONE" | "VIDEO",
    location: location || undefined,
  });
  refresh(caseRef);
}

export async function addNoteAction(formData: FormData) {
  const user = await requireSession();

  const caseRef = String(formData.get("caseRef") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const kind = String(formData.get("kind") ?? "SESSION");

  if (!caseRef || !body) return;

  addNote({
    caseRef,
    authorId: user.id,
    authorName: user.name,
    body,
    kind: kind as "SESSION" | "FOLLOW_UP" | "REFERRAL" | "ADMIN",
  });
  refresh(caseRef);
}

export async function addReferralAction(formData: FormData) {
  await requireSession();

  const caseRef = String(formData.get("caseRef") ?? "");
  const organisation = String(formData.get("organisation") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!caseRef || !organisation) return;

  addReferral({ caseRef, organisation, contact, reason });
  refresh(caseRef);
}
