/**
 * Single entry point for data access.
 *
 * Components import from here and nowhere else. When the NestJS API lands,
 * these functions become fetch calls and no screen has to change.
 */

export * from "@/lib/data/helpers";
export * from "@/lib/data/staff";
export * from "@/lib/data/content";
export * from "@/lib/data/events";
export * from "@/lib/data/emergency";
export * from "@/lib/data/counselling";
export * from "@/lib/data/donations";

import {
  followUpsDue,
  listRequests,
  pendingRequests,
  todaysAppointments,
  upcomingAppointments,
} from "@/lib/data/counselling";
import { donationStats } from "@/lib/data/donations";
import { upcomingEvents } from "@/lib/data/events";
import { articles } from "@/lib/data/content";
import { thisMonth } from "@/lib/data/helpers";

/** Aggregates for the admin and therapist dashboards. */
export function dashboardStats(therapistId?: string) {
  const requests = listRequests(therapistId ? { therapistId } : undefined);
  const completed = requests.filter((r) => r.status === "COMPLETED");

  return {
    pending: pendingRequests().length,
    today: todaysAppointments(therapistId).length,
    upcoming: upcomingAppointments(therapistId, 50).length,
    completed: completed.length,
    followUps: followUpsDue().length,
    urgent: requests.filter((r) => r.priority === "URGENT" || r.safeguardingFlag).length,
    newThisMonth: requests.filter((r) => thisMonth(r.createdAt)).length,
    sessionsThisMonth: completed.filter((r) => thisMonth(r.updatedAt)).length,
    closedThisMonth: requests.filter((r) => r.status === "CLOSED" && thisMonth(r.updatedAt)).length,
    donations: donationStats(),
    events: upcomingEvents(3),
    recentContent: [...articles]
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
      .slice(0, 4),
  };
}
