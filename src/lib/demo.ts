/**
 * THE BACKEND SEAM.
 *
 * There is no API in this build. Every form below resolves locally against
 * dummy data so the interface can be reviewed end to end, and nothing is
 * recorded anywhere — submitting the intake form twice produces two unrelated
 * references, and neither appears in the portal.
 *
 * When the NestJS API lands, these are the only functions that change. Each one
 * already has the shape its endpoint is expected to return, so no screen has to
 * be touched:
 *
 *   submitCounsellingRequest  ->  POST /counselling/requests
 *   lookupCaseStatus          ->  POST /counselling/status
 *   submitContactMessage      ->  POST /contact
 *   submitDonation            ->  POST /donations
 *
 * Everything here runs in the browser. Nothing in this file may import
 * `server-only` modules or the demo store.
 */

import { formatCaseRef, generateAccessCode, normaliseCaseRef } from "@/lib/case-ref";
import type { AppointmentStatus } from "@/lib/types";

/**
 * A short pause so the interface's pending states are actually exercised —
 * spinners, disabled buttons and "sending…" copy are part of what is being
 * reviewed, and an instant resolve hides all of them.
 */
function settle<T>(value: T, ms = 650): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export interface SubmittedRequest {
  caseRef: string;
  accessCode: string;
}

/**
 * Issues a case reference and access code for the confirmation screen.
 *
 * The sequence is random rather than incremental because nothing is stored to
 * count from. The real endpoint allocates this from the database, which is also
 * the only place it can be done safely — two people submitting at the same
 * moment must not receive the same reference.
 */
export function submitCounsellingRequest(): Promise<SubmittedRequest> {
  return settle({
    caseRef: formatCaseRef(new Date().getFullYear(), 1 + Math.floor(Math.random() * 999999)),
    accessCode: generateAccessCode(),
  });
}

export interface CaseStatusResult {
  caseRef: string;
  status: AppointmentStatus;
  updatedAt: string;
}

/**
 * Sample cases the status lookup can find, so the screen can be demonstrated.
 * Any other reference correctly reports "not found".
 */
const SAMPLE_CASES: Record<string, { code: string; result: CaseStatusResult }> = {
  "AAGF-2026-000001": {
    code: "K7HMQ4",
    result: {
      caseRef: "AAGF-2026-000001",
      status: "CONFIRMED",
      updatedAt: "2026-09-04T09:15:00.000Z",
    },
  },
  "AAGF-2026-000002": {
    code: "R3PXTB",
    result: {
      caseRef: "AAGF-2026-000002",
      status: "UNDER_REVIEW",
      updatedAt: "2026-09-02T14:40:00.000Z",
    },
  },
};

export function lookupCaseStatus(
  caseRef: string,
  accessCode: string,
): Promise<CaseStatusResult | null> {
  const entry = SAMPLE_CASES[normaliseCaseRef(caseRef)];
  const match = entry && entry.code === accessCode.trim().toUpperCase() ? entry.result : null;
  return settle(match);
}

/** The reference shown on the sample lookup, for the hint on that screen. */
export const SAMPLE_CASE_REF = "AAGF-2026-000001";
export const SAMPLE_ACCESS_CODE = "K7HMQ4";

/**
 * Takes the payload the real endpoint expects, so the contract stays visible at
 * the call site even though nothing is sent anywhere.
 */
export function submitContactMessage(
  _message: Record<string, unknown>,
): Promise<{ ok: true }> {
  return settle({ ok: true });
}

export function submitDonation(
  _donation?: Record<string, unknown>,
): Promise<{ reference: string }> {
  return settle({
    reference: `H2H-${new Date().getFullYear()}-${generateAccessCode(8)}`,
  });
}
