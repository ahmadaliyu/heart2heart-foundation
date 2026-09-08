"use server";

import { cookies } from "next/headers";

import { getStaff } from "@/lib/data/staff";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * Portal sign in and sign out.
 *
 * These are Server Actions rather than route handlers because there is no API
 * in this build, and because the session cookie must stay `httpOnly` — setting
 * it from the browser would put a "who am I" value within reach of any script
 * on the page.
 *
 * This is still the DEMO session described in `src/lib/session.ts`: it verifies
 * nothing at all and simply records which staff account was picked. When the
 * NestJS API takes over authentication, these two functions call it and hand
 * back a real signed session; no screen changes.
 */

export async function signIn(staffId: string): Promise<{ ok: boolean }> {
  const member = getStaff(staffId);
  if (!member || !member.active) return { ok: false };

  const store = await cookies();
  store.set(SESSION_COOKIE, member.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return { ok: true };
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
