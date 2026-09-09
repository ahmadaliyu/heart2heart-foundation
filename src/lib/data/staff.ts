import type { StaffUser } from "@/lib/types";
import { daysFromNow, hoursFromNow } from "@/lib/data/helpers";

/**
 * The Foundation currently has one qualified therapist. The model, the portal
 * navigation and the assignment controls are all multi-therapist already, so
 * adding the second is a data change rather than a rebuild.
 */
export const staff: StaffUser[] = [
  {
    id: "usr_admin",
    name: "Ahmad Aliyu",
    email: "admin@heart2heart.ng",
    role: "ADMIN",
    title: "Chief Technology Officer",
    active: true,
    lastActiveAt: hoursFromNow(-1),
  },
  {
    id: "usr_therapist_1",
    name: "Asmau Abdu Gambo",
    email: "therapist@heart2heart.ng",
    role: "THERAPIST",
    title: "Lead Counselling Psychologist",
    active: true,
    lastActiveAt: hoursFromNow(-3),
  },
  {
    id: "usr_admin_2",
    name: "Zainab Sani",
    email: "outreach@heart2heart.ng",
    role: "ADMIN",
    title: "Outreach & Events Coordinator",
    active: false,
    lastActiveAt: daysFromNow(-2, 16),
  },
  {
    id: "usr_therapist_2",
    name: "Fatima Ibrahim",
    email: "fatima@heart2heart.ng",
    role: "THERAPIST",
    title: "Counsellor (pending onboarding)",
    active: false,
  },
];

export function getStaff(id?: string) {
  return staff.find((member) => member.id === id);
}

export function therapists() {
  return staff.filter((member) => member.role === "THERAPIST" && member.active);
}

export function staffName(id?: string) {
  return getStaff(id)?.name;
}
