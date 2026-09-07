import { NextResponse } from "next/server";
import { contactMessageSchema } from "@/lib/validation";

/**
 * POST /api/contact — general enquiries only.
 *
 * This inbox is not for counselling. If someone describes a personal
 * difficulty here it should be routed to the counselling team by a human, not
 * merged into the counselling data store.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactMessageSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation_failed" }, { status: 422 });
  }

  // The NestJS API will queue this for delivery to the Foundation's inbox.
  return NextResponse.json({ ok: true }, { status: 202 });
}
