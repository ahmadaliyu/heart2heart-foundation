import { z } from "zod";
import {
  ageRanges,
  beneficiaryCategories,
  contactMethods,
  supportAreas,
} from "@/lib/types";
import { locales } from "@/lib/i18n/config";

/**
 * Validation shared by the intake form and the API route.
 *
 * The rules are deliberately permissive about identity and strict about the
 * things that determine whether we can actually help: a way to reach the
 * person, a date we can act on, and explicit consent. We never require a real
 * name, an email address, or a reason for seeking support.
 */

const phonePattern = /^\+?[\d\s()-]{7,20}$/;

export const counsellingRequestSchema = z
  .object({
    preferredName: z
      .string()
      .trim()
      .min(2, "preferredNameShort")
      .max(60),
    category: z.enum(beneficiaryCategories),
    ageRange: z.enum(ageRanges),
    supportAreas: z.array(z.enum(supportAreas)).max(10).default([]),
    reason: z.string().trim().max(1000, "reasonLong").default(""),
    contactMethod: z.enum(contactMethods),
    contactValue: z.string().trim().min(1, "contactValueRequired").max(120),
    contactNotes: z.string().trim().max(300).optional(),
    safeToContact: z.enum(["YES", "NO", "UNSURE"]).optional(),
    preferredLanguage: z.enum(locales),
    preferredDate: z.string().min(1, "dateRequired"),
    preferredTimeSlot: z.number().int().min(0).max(1439),
    consentGiven: z.literal(true),
    safeguardingFlag: z.boolean().default(false),
    guardianAware: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    // Contact value has to match the method the person chose, or we will not
    // reach them — the single most consequential field on the form.
    if (value.contactMethod === "EMAIL") {
      if (!z.string().email().safeParse(value.contactValue).success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["contactValue"],
          message: "contactValueInvalidEmail",
        });
      }
    } else if (value.contactMethod !== "IN_PERSON") {
      if (!phonePattern.test(value.contactValue)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["contactValue"],
          message: "contactValueInvalidPhone",
        });
      }
    }

    const chosen = new Date(value.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(chosen.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["preferredDate"],
        message: "dateRequired",
      });
    } else if (chosen < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["preferredDate"],
        message: "datePast",
      });
    }
  });

export type CounsellingRequestInput = z.infer<typeof counsellingRequestSchema>;

export const statusLookupSchema = z.object({
  caseRef: z.string().trim().min(1),
  accessCode: z.string().trim().min(4).max(12),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional(),
  subject: z.enum(["GENERAL", "PARTNERSHIP", "VOLUNTEER", "MEDIA", "OTHER"]),
  message: z.string().trim().min(10).max(2000),
});

export const donationSchema = z.object({
  amount: z.number().int().min(10_000), // ₦100 minimum, in kobo
  donorName: z.string().trim().min(1).max(80),
  donorEmail: z.string().trim().email().optional(),
  anonymous: z.boolean().default(false),
  recurring: z.boolean().default(false),
  designation: z.enum(["GENERAL", "COUNSELLING", "SCHOOL_OUTREACH", "RESOURCES"]),
});

/** Maps a Zod issue path + message onto a translation key under counselling.errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (!result[field]) result[field] = issue.message;
  }
  return result;
}
