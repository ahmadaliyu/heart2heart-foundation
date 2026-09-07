/**
 * Appointment / case status machine.
 *
 * The blueprint lists the statuses as a sequence; in practice they form a
 * graph. Encoding the legal transitions in one place means a dashboard button
 * can never put a case into a state the Foundation's process doesn't allow —
 * e.g. marking a session COMPLETED before it was ever CONFIRMED.
 */

import type { AppointmentStatus } from "@/lib/types";

export const statusTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  REQUESTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["SCHEDULED", "CANCELLED"],
  REJECTED: ["CLOSED"],
  SCHEDULED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "NO_SHOW", "CANCELLED"],
  COMPLETED: ["FOLLOW_UP", "CLOSED"],
  NO_SHOW: ["SCHEDULED", "CLOSED"],
  FOLLOW_UP: ["SCHEDULED", "CLOSED"],
  CANCELLED: ["SCHEDULED", "CLOSED"],
  CLOSED: [],
};

export function canTransition(from: AppointmentStatus, to: AppointmentStatus) {
  return statusTransitions[from].includes(to);
}

export function nextStatuses(from: AppointmentStatus) {
  return statusTransitions[from];
}

/** Tone used by the StatusBadge component. Never red for ordinary states. */
export type StatusTone = "neutral" | "info" | "progress" | "success" | "warning" | "danger";

export const statusTone: Record<AppointmentStatus, StatusTone> = {
  REQUESTED: "info",
  UNDER_REVIEW: "info",
  APPROVED: "progress",
  REJECTED: "neutral",
  SCHEDULED: "progress",
  CONFIRMED: "progress",
  COMPLETED: "success",
  CANCELLED: "neutral",
  NO_SHOW: "warning",
  FOLLOW_UP: "warning",
  CLOSED: "neutral",
};

/** Statuses that mean "a person is still waiting on us". Drives dashboard counts. */
export const openStatuses: AppointmentStatus[] = [
  "REQUESTED",
  "UNDER_REVIEW",
  "APPROVED",
  "SCHEDULED",
  "CONFIRMED",
  "FOLLOW_UP",
];

export function isOpen(status: AppointmentStatus) {
  return openStatuses.includes(status);
}
