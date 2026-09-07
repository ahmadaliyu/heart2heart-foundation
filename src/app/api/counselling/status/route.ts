import { NextResponse } from "next/server";

import { statusLookupSchema } from "@/lib/validation";
import { verifyAccess } from "@/lib/data";

/**
 * POST /api/counselling/status
 *
 * Returns the status of a request to whoever holds both the case reference and
 * the access code. Deliberately returns the same generic 404 for a bad
 * reference and a bad code, so the endpoint cannot be used to discover which
 * references exist.
 *
 * TODO before launch: rate-limit by IP. A six-character code is fine against a
 * person guessing and useless against a script that can try ten thousand.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = statusLookupSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const found = verifyAccess(parsed.data.caseRef, parsed.data.accessCode);
  if (!found) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Status only. Never the intake content, the contact details or the notes.
  return NextResponse.json(
    {
      caseRef: found.caseRef,
      status: found.status,
      updatedAt: found.updatedAt,
    },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, private" } },
  );
}
