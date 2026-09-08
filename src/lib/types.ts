/**
 * Domain model for the Heart2Heart platform.
 *
 * These types mirror the contract the NestJS API is expected to expose. The
 * demo store in src/lib/data implements the same shapes so screens can be
 * built and reviewed before the backend exists.
 */

import type { Locale } from "@/lib/i18n/config";

/* -------------------------------------------------------------------------- */
/* Counselling                                                                 */
/* -------------------------------------------------------------------------- */

export const beneficiaryCategories = ["TEEN_YOUTH", "MARRIED_COUPLE"] as const;
export type BeneficiaryCategory = (typeof beneficiaryCategories)[number];

export const ageRanges = [
  "UNDER_13",
  "13_15",
  "16_17",
  "18_24",
  "25_34",
  "35_44",
  "45_PLUS",
] as const;
export type AgeRange = (typeof ageRanges)[number];

export const contactMethods = ["PHONE", "WHATSAPP", "SMS", "EMAIL", "IN_PERSON"] as const;
export type ContactMethod = (typeof contactMethods)[number];

export const supportAreas = [
  "EMOTIONAL",
  "RELATIONSHIP",
  "FAMILY",
  "MARITAL",
  "ACADEMIC",
  "BULLYING",
  "SELF_ESTEEM",
  "COMMUNICATION",
  "SOCIAL_PRESSURE",
  "OTHER",
] as const;
export type SupportArea = (typeof supportAreas)[number];

/**
 * Appointment / case lifecycle, exactly as set out in the blueprint.
 * Transitions are enforced in src/lib/status.ts — never set a status directly.
 */
export const appointmentStatuses = [
  "REQUESTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "SCHEDULED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
  "FOLLOW_UP",
  "CLOSED",
] as const;
export type AppointmentStatus = (typeof appointmentStatuses)[number];

export const priorities = ["STANDARD", "PRIORITY", "URGENT"] as const;
export type Priority = (typeof priorities)[number];

/**
 * A counselling request as staff see it.
 *
 * Note what is NOT here: no free-text disclosure field is surfaced to list
 * views, and `reason` is a short, general statement only. Detailed clinical
 * content lives in CaseNote, which is therapist-scoped.
 */
export interface CounsellingRequest {
  id: string;
  caseRef: string;
  preferredName: string;
  category: BeneficiaryCategory;
  ageRange: AgeRange;
  contactMethod: ContactMethod;
  /** Stored server-side only; masked in list views. */
  contactValue: string;
  supportAreas: SupportArea[];
  reason: string;
  preferredLanguage: Locale;
  preferredDate: string;
  preferredTimeSlot: number;
  priority: Priority;
  status: AppointmentStatus;
  /** Beneficiary confirmed they have read the confidentiality notice. */
  consentGiven: boolean;
  /** Set when the intake safety question was answered "yes". */
  safeguardingFlag: boolean;
  guardianAware?: boolean;
  assignedTherapistId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  caseRef: string;
  requestId: string;
  therapistId: string;
  scheduledFor: string;
  durationMinutes: number;
  mode: "IN_PERSON" | "PHONE" | "VIDEO";
  location?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface CaseNote {
  id: string;
  caseRef: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  body: string;
  kind: "SESSION" | "FOLLOW_UP" | "REFERRAL" | "ADMIN";
}

export interface Referral {
  id: string;
  caseRef: string;
  organisation: string;
  contact: string;
  reason: string;
  referredAt: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

export interface CounsellingCase {
  caseRef: string;
  requestId: string;
  category: BeneficiaryCategory;
  preferredName: string;
  status: AppointmentStatus;
  assignedTherapistId?: string;
  openedAt: string;
  closedAt?: string;
  appointments: Appointment[];
  notes: CaseNote[];
  referrals: Referral[];
}

/* -------------------------------------------------------------------------- */
/* Staff                                                                       */
/* -------------------------------------------------------------------------- */

export type StaffRole = "ADMIN" | "THERAPIST";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  title: string;
  active: boolean;
  lastActiveAt?: string;
}

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

export const contentStatuses = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const;
export type ContentStatus = (typeof contentStatuses)[number];

export const articleCategories = [
  "EMOTIONAL_WELLBEING",
  "HEALTHY_RELATIONSHIPS",
  "COMMUNICATION",
  "SELF_ESTEEM",
  "MARRIAGE",
  "FAMILY",
  "SUPPORTING_YOUNG_PEOPLE",
  "MENTAL_HEALTH_AWARENESS",
  "PERSONAL_DEVELOPMENT",
] as const;
export type ArticleCategory = (typeof articleCategories)[number];

export interface Article {
  slug: string;
  title: string;
  /** Cover art. Placeholder SVGs live in /public/covers — see scripts/covers.py. */
  image: string;
  excerpt: string;
  body: string[];
  category: ArticleCategory;
  author: string;
  readingMinutes: number;
  status: ContentStatus;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
}

export interface VideoResource {
  id: string;
  title: string;
  /** Thumbnail. Placeholder SVGs live in /public/covers. */
  image: string;
  description: string;
  durationMinutes: number;
  kind: "EDUCATIONAL" | "AWARENESS" | "EXPERT" | "FOUNDATION";
  status: ContentStatus;
  publishedAt: string;
}

export interface MaterialResource {
  id: string;
  title: string;
  description: string;
  format: "GUIDE" | "PDF" | "INFOGRAPHIC" | "WORKSHEET" | "AWARENESS";
  sizeKb: number;
  status: ContentStatus;
  publishedAt: string;
}

/* -------------------------------------------------------------------------- */
/* Events                                                                      */
/* -------------------------------------------------------------------------- */

export const eventKinds = [
  "SCHOOL_OUTREACH",
  "WORKSHOP",
  "SEMINAR",
  "COMMUNITY",
  "AWARENESS",
  "FOUNDATION",
] as const;
export type EventKind = (typeof eventKinds)[number];

export interface FoundationEvent {
  slug: string;
  title: string;
  description: string;
  kind: EventKind;
  startsAt: string;
  endsAt?: string;
  location: string;
  organiser: string;
  registrationUrl?: string;
  status: "UPCOMING" | "OPEN" | "FULL" | "PAST" | "CANCELLED";
  capacity?: number;
  registered?: number;
}

/* -------------------------------------------------------------------------- */
/* Donations                                                                   */
/* -------------------------------------------------------------------------- */

export interface Donation {
  id: string;
  reference: string;
  /** Kobo. Always integer. */
  amount: number;
  donorName: string;
  donorEmail?: string;
  anonymous: boolean;
  recurring: boolean;
  designation: "GENERAL" | "COUNSELLING" | "SCHOOL_OUTREACH" | "RESOURCES";
  status: "PENDING" | "SUCCESSFUL" | "FAILED" | "REFUNDED";
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Emergency                                                                   */
/* -------------------------------------------------------------------------- */

export interface EmergencyContact {
  id: string;
  name: string;
  description: string;
  phone: string;
  whatsapp?: string;
  hours: string;
  scope: "NATIONAL" | "STATE" | "FOUNDATION";
  category: "GENERAL" | "DOMESTIC_VIOLENCE" | "ABUSE" | "MENTAL_HEALTH" | "CHILD";
  /** Only verified entries are shown publicly. */
  verified: boolean;
  verifiedAt?: string;
}
