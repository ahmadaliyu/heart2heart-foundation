import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStaff, staff } from "@/lib/data/staff";
import type { StaffUser } from "@/lib/types";

/**
 * DEMO SESSION — NOT AUTHENTICATION.
 *
 * This stores a staff id in an httpOnly cookie so the portal can be reviewed
 * end to end. It performs no verification whatsoever and must be replaced
 * before the portal touches real counselling data.
 *
 * The real implementation belongs on the NestJS side and needs, at minimum:
 *   - password hashing (argon2id) and a rate-limited login endpoint
 *   - signed, rotating, httpOnly + Secure + SameSite=Strict session cookies
 *   - short idle timeout — a portal open on a desk shows case notes
 *   - second factor for accounts that can read clinical notes
 *   - an append-only access log: who opened which case record, and when
 *
 * The shape below (getSession / requireSession) is what the pages consume, so
 * swapping the body out does not touch any screen.
 */

const COOKIE = "h2h_staff";

export async function getSession(): Promise<StaffUser | null> {
  const store = await cookies();
  const id = store.get(COOKIE)?.value;
  if (!id) return null;
  return getStaff(id) ?? null;
}

export async function requireSession(): Promise<StaffUser> {
  const session = await getSession();
  if (!session) {
    // The portal layout normally redirects first. This is the backstop for the
    // race where a session expires between the layout and the page rendering —
    // send the user to sign in rather than surfacing an error screen over
    // what is, to them, just a page that timed out.
    redirect("/portal/login");
  }
  return session;
}

export function demoAccounts() {
  return staff.filter((member) => member.active && member.id !== "usr_admin_2");
}

export const SESSION_COOKIE = COOKIE;
