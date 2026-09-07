import { NextResponse } from "next/server";

import { counsellingRequestSchema, fieldErrors } from "@/lib/validation";
import { createRequest } from "@/lib/data";

/**
 * POST /api/counselling/requests
 *
 * Creates a counselling request and returns only the case reference and access
 * code. Nothing the beneficiary typed is echoed back, and nothing about the
 * request is logged — an error report containing intake text would be exactly
 * the leak this platform is built to prevent.
 *
 * Replace the createRequest() call with a POST to the NestJS API; the contract
 * on both sides of this handler stays the same.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = counsellingRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", fields: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const { request: created, accessCode } = createRequest({
    preferredName: parsed.data.preferredName,
    category: parsed.data.category,
    ageRange: parsed.data.ageRange,
    contactMethod: parsed.data.contactMethod,
    contactValue: parsed.data.contactValue,
    supportAreas: parsed.data.supportAreas,
    reason: parsed.data.reason,
    preferredLanguage: parsed.data.preferredLanguage,
    preferredDate: parsed.data.preferredDate,
    preferredTimeSlot: parsed.data.preferredTimeSlot,
    consentGiven: parsed.data.consentGiven,
    safeguardingFlag: parsed.data.safeguardingFlag,
    guardianAware: parsed.data.guardianAware,
  });

  return NextResponse.json(
    { caseRef: created.caseRef, accessCode },
    {
      status: 201,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, private" },
    },
  );
}
