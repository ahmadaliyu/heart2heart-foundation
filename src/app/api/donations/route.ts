import { NextResponse } from "next/server";
import { donationSchema } from "@/lib/validation";

/**
 * POST /api/donations
 *
 * Creates a donation intent and returns its reference.
 *
 * IMPLEMENTATION NOTE — payments are not wired up. The provider must be chosen
 * against Nigerian payment and regulatory requirements (Paystack and Flutterwave
 * are the usual candidates). When it is:
 *
 *   1. This handler initialises the transaction server-side and returns the
 *      provider's authorisation URL. It must never see card details.
 *   2. A separate webhook route verifies the provider's signature and is the
 *      ONLY place a donation is marked SUCCESSFUL — never the browser redirect,
 *      which anyone can replay.
 *   3. Amounts stay integer kobo end to end.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = donationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }

  const reference = `H2H-DN-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({ reference, status: "PENDING" }, { status: 201 });
}
