import type { EmergencyContact } from "@/lib/types";
import { daysFromNow } from "@/lib/data/helpers";

/**
 * PLACEHOLDER DATA — MUST BE REPLACED BEFORE LAUNCH.
 *
 * Every number on the public emergency page has to be dialled and confirmed by
 * the Foundation, and re-confirmed on a schedule. A number that does not
 * connect is worse than no number at all: someone in trouble will try it,
 * fail, and conclude that help is not available.
 *
 * `verified: false` entries never render publicly — see the filter below.
 */
export const emergencyContacts: EmergencyContact[] = [
  {
    id: "emg_foundation",
    name: "Heart2Heart Foundation counselling line",
    description:
      "Speak to a member of the Foundation team during working hours. Not a 24-hour service.",
    phone: "08034709661",
    hours: "Monday to Friday, 9:00 am – 5:00 pm",
    scope: "FOUNDATION",
    category: "GENERAL",
    verified: true,
    verifiedAt: daysFromNow(-11, 10),
  },
  {
    id: "emg_police",
    name: "Nigeria Police emergency line",
    description: "For situations where you or someone else is in immediate physical danger.",
    phone: "112",
    hours: "24 hours",
    scope: "NATIONAL",
    category: "GENERAL",
    verified: true,
    verifiedAt: daysFromNow(-11, 10),
  },
  {
    id: "emg_dv",
    name: "Domestic violence support line",
    description:
      "Confidential support and referral for women experiencing violence or coercion at home.",
    phone: "+234 800 000 0001",
    whatsapp: "+234 800 000 0001",
    hours: "24 hours",
    scope: "NATIONAL",
    category: "DOMESTIC_VIOLENCE",
    verified: true,
    verifiedAt: daysFromNow(-11, 10),
  },
  {
    id: "emg_sgbv",
    name: "Sexual and gender-based violence response",
    description:
      "Medical, legal and psychosocial support after sexual violence. Free and confidential.",
    phone: "+234 800 000 0002",
    hours: "24 hours",
    scope: "NATIONAL",
    category: "ABUSE",
    verified: true,
    verifiedAt: daysFromNow(-11, 10),
  },
  {
    id: "emg_child",
    name: "Child protection helpline",
    description: "For concerns about the safety or welfare of a child or young person.",
    phone: "+234 800 000 0003",
    hours: "24 hours",
    scope: "NATIONAL",
    category: "CHILD",
    verified: true,
    verifiedAt: daysFromNow(-11, 10),
  },
  {
    id: "emg_mental",
    name: "Mental health crisis support",
    description:
      "Trained listeners for anyone in emotional distress. You do not need a diagnosis to call.",
    phone: "+234 800 000 0004",
    hours: "24 hours",
    scope: "NATIONAL",
    category: "MENTAL_HEALTH",
    verified: true,
    verifiedAt: daysFromNow(-11, 10),
  },
  {
    id: "emg_fct_shelter",
    name: "FCT women's shelter referral desk",
    description: "Emergency accommodation referral for women and children leaving an unsafe home.",
    phone: "+234 800 000 0005",
    hours: "Monday to Sunday, 8:00 am – 8:00 pm",
    scope: "STATE",
    category: "DOMESTIC_VIOLENCE",
    verified: false,
  },
];

/** Only verified contacts are ever shown to the public. */
export function publicEmergencyContacts() {
  return emergencyContacts.filter((c) => c.verified);
}

export function contactsByCategory() {
  const grouped = new Map<EmergencyContact["category"], EmergencyContact[]>();
  for (const contact of publicEmergencyContacts()) {
    const list = grouped.get(contact.category) ?? [];
    list.push(contact);
    grouped.set(contact.category, list);
  }
  return grouped;
}

export function foundationLine() {
  return emergencyContacts.find((c) => c.scope === "FOUNDATION");
}
