import { NextResponse } from "next/server";
import { getStaff } from "@/lib/data/staff";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * Demo sign-in / sign-out. See the warning in src/lib/session.ts — this
 * verifies nothing and exists so the portal can be reviewed.
 */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { staffId?: string } | null;
  const member = getStaff(body?.staffId);

  if (!member || !member.active) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, role: member.role });
  response.cookies.set(SESSION_COOKIE, member.id, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
