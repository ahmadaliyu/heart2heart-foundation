import type { FoundationEvent } from "@/lib/types";
import { daysFromNow, isFuture } from "@/lib/data/helpers";

export const events: FoundationEvent[] = [
  {
    slug: "wellbeing-workshop-gwarinpa",
    title: "Wellbeing workshop for secondary-school girls",
    description:
      "A half-day workshop on managing school pressure, friendships and confidence. Open to students in SS1–SS3 and their teachers. Places are limited and lunch is provided.",
    kind: "WORKSHOP",
    startsAt: daysFromNow(9, 10),
    endsAt: daysFromNow(9, 14),
    location: "Kaduna — school venue to be confirmed",
    organiser: "Heart2Heart Foundation",
    registrationUrl: "#register",
    status: "OPEN",
    capacity: 80,
    registered: 54,
  },
  {
    slug: "marriage-and-communication-seminar",
    title: "Marriage and communication seminar",
    description:
      "An evening seminar for married women on communication patterns, family pressure and knowing when to seek support. Led by Asmau Abdu Gambo.",
    kind: "SEMINAR",
    startsAt: daysFromNow(21, 16),
    endsAt: daysFromNow(21, 18, 30),
    location: "Kaduna, Nigeria",
    organiser: "Heart2Heart Foundation",
    registrationUrl: "#register",
    status: "OPEN",
    capacity: 60,
    registered: 22,
  },
  {
    slug: "school-outreach-kubwa",
    title: "School outreach — Kubwa cluster",
    description:
      "Assembly talk followed by small-group sessions across four schools in the Kubwa area, introducing students to the Foundation's counselling service.",
    kind: "SCHOOL_OUTREACH",
    startsAt: daysFromNow(34, 8),
    location: "Kaduna — participating schools to be confirmed",
    organiser: "Heart2Heart Foundation",
    status: "UPCOMING",
  },
  {
    slug: "mental-health-awareness-day",
    title: "Community awareness day",
    description:
      "An open community day with talks, printed resources and a chance to speak privately with a member of the counselling team.",
    kind: "AWARENESS",
    startsAt: daysFromNow(48, 9),
    endsAt: daysFromNow(48, 15),
    location: "Kaduna — venue to be confirmed",
    organiser: "Heart2Heart Foundation",
    registrationUrl: "#register",
    status: "UPCOMING",
    capacity: 250,
    registered: 31,
  },
  {
    slug: "facilitator-training-cohort-3",
    title: "Volunteer facilitator training — cohort 3",
    description:
      "Two-day training for volunteers who will support school outreach. Safeguarding training is a required part of the programme.",
    kind: "FOUNDATION",
    startsAt: daysFromNow(15, 9),
    endsAt: daysFromNow(16, 16),
    location: "Kaduna, Nigeria",
    organiser: "Heart2Heart Foundation",
    status: "FULL",
    capacity: 24,
    registered: 24,
  },
  {
    slug: "parents-evening-june",
    title: "Parents' evening: supporting a teenager",
    description:
      "A practical evening for parents and guardians on noticing when a young person is struggling, and how to respond.",
    kind: "COMMUNITY",
    startsAt: daysFromNow(-16, 17),
    endsAt: daysFromNow(-16, 19),
    location: "Kaduna, Nigeria",
    organiser: "Heart2Heart Foundation",
    status: "PAST",
    capacity: 70,
    registered: 68,
  },
  {
    slug: "school-outreach-nyanya",
    title: "School outreach — Nyanya",
    description: "Assembly talk and small-group sessions at two schools in Nyanya.",
    kind: "SCHOOL_OUTREACH",
    startsAt: daysFromNow(-38, 8),
    location: "Kaduna — participating schools to be confirmed",
    organiser: "Heart2Heart Foundation",
    status: "PAST",
  },
];

export function upcomingEvents(limit?: number) {
  const list = events
    .filter((e) => isFuture(e.startsAt) && e.status !== "CANCELLED")
    .sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
  return limit ? list.slice(0, limit) : list;
}

export function pastEvents(limit?: number) {
  const list = events
    .filter((e) => !isFuture(e.startsAt))
    .sort((a, b) => +new Date(b.startsAt) - +new Date(a.startsAt));
  return limit ? list.slice(0, limit) : list;
}

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}
