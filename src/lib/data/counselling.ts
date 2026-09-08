import type {
  Appointment,
  AppointmentStatus,
  CaseNote,
  CounsellingCase,
  CounsellingRequest,
  Referral,
} from "@/lib/types";
import { canTransition } from "@/lib/status";
import { formatCaseRef, generateAccessCode } from "@/lib/case-ref";
import { daysFromNow, isSameDay } from "@/lib/data/helpers";

/* -------------------------------------------------------------------------- */
/* In-memory store                                                             */
/* -------------------------------------------------------------------------- */
/**
 * Stands in for the NestJS + Prisma backend so the whole product can be built
 * and reviewed end to end. Replacing it means swapping the functions below for
 * fetch calls — the components import only from here, never from the fixtures.
 *
 * NOT PERSISTENT. Every server restart resets it, and in a multi-instance
 * deployment each instance would hold its own copy. That is deliberate: no real
 * counselling data should ever live in an in-memory demo store.
 */

interface Store {
  requests: CounsellingRequest[];
  appointments: Appointment[];
  notes: CaseNote[];
  referrals: Referral[];
  accessCodes: Map<string, string>;
  sequence: number;
}

const globalStore = globalThis as unknown as { __h2hStore?: Store };

function seed(): Store {
  const year = new Date().getFullYear();

  const requests: CounsellingRequest[] = [
    {
      id: "req_1",
      caseRef: formatCaseRef(year, 1),
      preferredName: "Halima",
      category: "MARRIED_COUPLE",
      ageRange: "25_34",
      contactMethod: "WHATSAPP",
      contactValue: "+234 803 000 0011",
      supportAreas: ["MARITAL", "COMMUNICATION"],
      reason:
        "My husband and I keep having the same argument and I don't know how to break the cycle.",
      preferredLanguage: "en",
      preferredDate: daysFromNow(2, 10),
      preferredTimeSlot: 10 * 60,
      priority: "STANDARD",
      status: "CONFIRMED",
      consentGiven: true,
      safeguardingFlag: false,
      assignedTherapistId: "usr_therapist_1",
      createdAt: daysFromNow(-9, 14),
      updatedAt: daysFromNow(-4, 11),
    },
    {
      id: "req_2",
      caseRef: formatCaseRef(year, 2),
      preferredName: "Aisha",
      category: "TEEN_YOUTH",
      ageRange: "16_17",
      contactMethod: "PHONE",
      contactValue: "+234 806 000 0022",
      supportAreas: ["ACADEMIC", "SELF_ESTEEM"],
      reason: "Exams are close and I can't concentrate. I feel like I'm failing everyone.",
      preferredLanguage: "en",
      preferredDate: daysFromNow(0, 14),
      preferredTimeSlot: 14 * 60,
      priority: "PRIORITY",
      status: "CONFIRMED",
      consentGiven: true,
      safeguardingFlag: false,
      guardianAware: true,
      assignedTherapistId: "usr_therapist_1",
      createdAt: daysFromNow(-6, 9),
      updatedAt: daysFromNow(-3, 10),
    },
    {
      id: "req_3",
      caseRef: formatCaseRef(year, 3),
      preferredName: "Zara",
      category: "MARRIED_COUPLE",
      ageRange: "35_44",
      contactMethod: "PHONE",
      contactValue: "+234 809 000 0033",
      supportAreas: ["FAMILY", "EMOTIONAL"],
      reason: "There is a lot of pressure at home and I have nobody to talk to about it.",
      preferredLanguage: "ha",
      preferredDate: daysFromNow(3, 11),
      preferredTimeSlot: 11 * 60,
      priority: "URGENT",
      status: "REQUESTED",
      consentGiven: true,
      safeguardingFlag: true,
      createdAt: daysFromNow(-1, 20),
      updatedAt: daysFromNow(-1, 20),
    },
    {
      id: "req_4",
      caseRef: formatCaseRef(year, 4),
      preferredName: "Ngozi",
      category: "TEEN_YOUTH",
      ageRange: "13_15",
      contactMethod: "SMS",
      contactValue: "+234 802 000 0044",
      supportAreas: ["BULLYING", "EMOTIONAL"],
      reason: "Some girls at school have been making things difficult for me for a long time.",
      preferredLanguage: "en",
      preferredDate: daysFromNow(4, 15),
      preferredTimeSlot: 15 * 60,
      priority: "PRIORITY",
      status: "UNDER_REVIEW",
      consentGiven: true,
      safeguardingFlag: false,
      guardianAware: false,
      assignedTherapistId: "usr_therapist_1",
      createdAt: daysFromNow(-2, 17),
      updatedAt: daysFromNow(0, 9),
    },
    {
      id: "req_5",
      caseRef: formatCaseRef(year, 5),
      preferredName: "Blessing",
      category: "MARRIED_COUPLE",
      ageRange: "18_24",
      contactMethod: "EMAIL",
      contactValue: "blessing.private@example.com",
      supportAreas: ["RELATIONSHIP", "EMOTIONAL"],
      reason: "I have been feeling low since I got married and I don't understand why.",
      preferredLanguage: "en",
      preferredDate: daysFromNow(6, 9),
      preferredTimeSlot: 9 * 60,
      priority: "STANDARD",
      status: "APPROVED",
      consentGiven: true,
      safeguardingFlag: false,
      assignedTherapistId: "usr_therapist_1",
      createdAt: daysFromNow(-3, 12),
      updatedAt: daysFromNow(-1, 9),
    },
    {
      id: "req_6",
      caseRef: formatCaseRef(year, 6),
      preferredName: "Amina K.",
      category: "TEEN_YOUTH",
      ageRange: "16_17",
      contactMethod: "WHATSAPP",
      contactValue: "+234 807 000 0066",
      supportAreas: ["FAMILY", "SOCIAL_PRESSURE"],
      reason: "Pressure at home about my future and I feel like nobody is listening.",
      preferredLanguage: "ha",
      preferredDate: daysFromNow(-5, 11),
      preferredTimeSlot: 11 * 60,
      priority: "STANDARD",
      status: "COMPLETED",
      consentGiven: true,
      safeguardingFlag: false,
      guardianAware: true,
      assignedTherapistId: "usr_therapist_1",
      createdAt: daysFromNow(-21, 10),
      updatedAt: daysFromNow(-5, 12),
    },
    {
      id: "req_7",
      caseRef: formatCaseRef(year, 7),
      preferredName: "Maryam",
      category: "MARRIED_COUPLE",
      ageRange: "25_34",
      contactMethod: "PHONE",
      contactValue: "+234 805 000 0077",
      supportAreas: ["MARITAL", "EMOTIONAL"],
      reason: "I would like to keep talking to someone after the first session.",
      preferredLanguage: "en",
      preferredDate: daysFromNow(8, 16),
      preferredTimeSlot: 16 * 60,
      priority: "STANDARD",
      status: "FOLLOW_UP",
      consentGiven: true,
      safeguardingFlag: false,
      assignedTherapistId: "usr_therapist_1",
      createdAt: daysFromNow(-30, 11),
      updatedAt: daysFromNow(-7, 15),
    },
    {
      id: "req_8",
      caseRef: formatCaseRef(year, 8),
      preferredName: "Grace",
      category: "TEEN_YOUTH",
      ageRange: "16_17",
      contactMethod: "PHONE",
      contactValue: "+234 808 000 0088",
      supportAreas: ["EMOTIONAL"],
      reason: "Things have improved and I don't think I need more sessions for now.",
      preferredLanguage: "en",
      preferredDate: daysFromNow(-40, 10),
      preferredTimeSlot: 10 * 60,
      priority: "STANDARD",
      status: "CLOSED",
      consentGiven: true,
      safeguardingFlag: false,
      guardianAware: true,
      assignedTherapistId: "usr_therapist_1",
      createdAt: daysFromNow(-62, 10),
      updatedAt: daysFromNow(-38, 16),
    },
  ];

  const appointments: Appointment[] = [
    {
      id: "apt_1",
      caseRef: requests[1].caseRef,
      requestId: "req_2",
      therapistId: "usr_therapist_1",
      scheduledFor: daysFromNow(0, 14),
      durationMinutes: 50,
      mode: "IN_PERSON",
      location: "Foundation Centre, Wuse II",
      status: "CONFIRMED",
      createdAt: daysFromNow(-3, 10),
    },
    {
      id: "apt_2",
      caseRef: requests[0].caseRef,
      requestId: "req_1",
      therapistId: "usr_therapist_1",
      scheduledFor: daysFromNow(0, 16),
      durationMinutes: 50,
      mode: "PHONE",
      status: "CONFIRMED",
      createdAt: daysFromNow(-4, 11),
    },
    {
      id: "apt_3",
      caseRef: requests[0].caseRef,
      requestId: "req_1",
      therapistId: "usr_therapist_1",
      scheduledFor: daysFromNow(2, 10),
      durationMinutes: 50,
      mode: "IN_PERSON",
      location: "Foundation Centre, Wuse II",
      status: "SCHEDULED",
      createdAt: daysFromNow(-2, 9),
    },
    {
      id: "apt_4",
      caseRef: requests[6].caseRef,
      requestId: "req_7",
      therapistId: "usr_therapist_1",
      scheduledFor: daysFromNow(8, 16),
      durationMinutes: 50,
      mode: "IN_PERSON",
      location: "Foundation Centre, Wuse II",
      status: "SCHEDULED",
      createdAt: daysFromNow(-7, 15),
    },
    {
      id: "apt_5",
      caseRef: requests[5].caseRef,
      requestId: "req_6",
      therapistId: "usr_therapist_1",
      scheduledFor: daysFromNow(-5, 11),
      durationMinutes: 50,
      mode: "IN_PERSON",
      location: "Foundation Centre, Wuse II",
      status: "COMPLETED",
      createdAt: daysFromNow(-14, 10),
    },
    {
      id: "apt_6",
      caseRef: requests[7].caseRef,
      requestId: "req_8",
      therapistId: "usr_therapist_1",
      scheduledFor: daysFromNow(-40, 10),
      durationMinutes: 50,
      mode: "PHONE",
      status: "COMPLETED",
      createdAt: daysFromNow(-48, 10),
    },
    {
      id: "apt_7",
      caseRef: requests[6].caseRef,
      requestId: "req_7",
      therapistId: "usr_therapist_1",
      scheduledFor: daysFromNow(-18, 16),
      durationMinutes: 50,
      mode: "IN_PERSON",
      location: "Foundation Centre, Wuse II",
      status: "COMPLETED",
      createdAt: daysFromNow(-25, 12),
    },
  ];

  const notes: CaseNote[] = [
    {
      id: "note_1",
      caseRef: requests[0].caseRef,
      authorId: "usr_therapist_1",
      authorName: "Dr. Amina Yusuf",
      createdAt: daysFromNow(-4, 12),
      kind: "SESSION",
      body: "First contact made by phone. Beneficiary is articulate about the pattern she wants to change and is motivated to attend. Agreed an in-person session. No safeguarding concerns raised.",
    },
    {
      id: "note_2",
      caseRef: requests[5].caseRef,
      authorId: "usr_therapist_1",
      authorName: "Dr. Amina Yusuf",
      createdAt: daysFromNow(-5, 12),
      kind: "SESSION",
      body: "Session held in Hausa at the beneficiary's preference. Discussed family expectations and coping strategies. Guardian is aware and supportive. Follow-up offered; beneficiary will confirm.",
    },
    {
      id: "note_3",
      caseRef: requests[6].caseRef,
      authorId: "usr_therapist_1",
      authorName: "Dr. Amina Yusuf",
      createdAt: daysFromNow(-18, 17),
      kind: "FOLLOW_UP",
      body: "Second session. Progress on communication strategies agreed previously. Follow-up scheduled in four weeks.",
    },
    {
      id: "note_4",
      caseRef: requests[7].caseRef,
      authorId: "usr_therapist_1",
      authorName: "Dr. Amina Yusuf",
      createdAt: daysFromNow(-38, 16),
      kind: "ADMIN",
      body: "Beneficiary reports improvement and does not wish to continue at this time. Case closed with an open invitation to return.",
    },
  ];

  const referrals: Referral[] = [
    {
      id: "ref_1",
      caseRef: requests[6].caseRef,
      organisation: "FCT Family Support Services",
      contact: "referrals@example.org",
      reason: "Additional practical and legal support alongside counselling.",
      referredAt: daysFromNow(-17, 10),
      status: "ACCEPTED",
    },
  ];

  const accessCodes = new Map<string, string>(
    requests.map((r, i) => [r.caseRef, ["H2H4KD", "P7RMQ2", "T9XBW4", "K3NDY8", "R6VZM5", "L2QJF7", "W8HKC3", "M5TPD9"][i]]),
  );

  return { requests, appointments, notes, referrals, accessCodes, sequence: requests.length };
}

function store(): Store {
  if (!globalStore.__h2hStore) globalStore.__h2hStore = seed();
  return globalStore.__h2hStore;
}

/* -------------------------------------------------------------------------- */
/* Queries                                                                     */
/* -------------------------------------------------------------------------- */

export function listRequests(filter?: {
  status?: AppointmentStatus;
  category?: CounsellingRequest["category"];
  priority?: CounsellingRequest["priority"];
  therapistId?: string;
  search?: string;
}) {
  let list = [...store().requests];
  if (filter?.status) list = list.filter((r) => r.status === filter.status);
  if (filter?.category) list = list.filter((r) => r.category === filter.category);
  if (filter?.priority) list = list.filter((r) => r.priority === filter.priority);
  if (filter?.therapistId) list = list.filter((r) => r.assignedTherapistId === filter.therapistId);
  if (filter?.search) {
    const q = filter.search.trim().toUpperCase();
    list = list.filter(
      (r) => r.caseRef.includes(q) || r.preferredName.toUpperCase().includes(q),
    );
  }
  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getRequest(caseRef: string) {
  return store().requests.find((r) => r.caseRef === caseRef);
}

export function pendingRequests() {
  return listRequests().filter((r) => r.status === "REQUESTED" || r.status === "UNDER_REVIEW");
}

export function listAppointments(filter?: { therapistId?: string; caseRef?: string }) {
  let list = [...store().appointments];
  if (filter?.therapistId) list = list.filter((a) => a.therapistId === filter.therapistId);
  if (filter?.caseRef) list = list.filter((a) => a.caseRef === filter.caseRef);
  return list.sort((a, b) => +new Date(a.scheduledFor) - +new Date(b.scheduledFor));
}

export function todaysAppointments(therapistId?: string) {
  return listAppointments({ therapistId }).filter(
    (a) => isSameDay(a.scheduledFor, new Date()) && a.status !== "CANCELLED",
  );
}

export function upcomingAppointments(therapistId?: string, limit = 5) {
  return listAppointments({ therapistId })
    .filter(
      (a) =>
        new Date(a.scheduledFor).getTime() > Date.now() &&
        (a.status === "SCHEDULED" || a.status === "CONFIRMED"),
    )
    .slice(0, limit);
}

export function getCase(caseRef: string): CounsellingCase | undefined {
  const request = getRequest(caseRef);
  if (!request) return undefined;
  const s = store();
  return {
    caseRef,
    requestId: request.id,
    category: request.category,
    preferredName: request.preferredName,
    status: request.status,
    assignedTherapistId: request.assignedTherapistId,
    openedAt: request.createdAt,
    closedAt: request.status === "CLOSED" ? request.updatedAt : undefined,
    appointments: s.appointments
      .filter((a) => a.caseRef === caseRef)
      .sort((a, b) => +new Date(b.scheduledFor) - +new Date(a.scheduledFor)),
    notes: s.notes
      .filter((n) => n.caseRef === caseRef)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    referrals: s.referrals.filter((r) => r.caseRef === caseRef),
  };
}

export function listCases(filter?: { therapistId?: string; status?: AppointmentStatus }) {
  return listRequests(filter)
    .map((r) => getCase(r.caseRef))
    .filter((c): c is CounsellingCase => Boolean(c));
}

export function followUpsDue() {
  return listRequests().filter((r) => r.status === "FOLLOW_UP");
}

export function allReferrals() {
  return [...store().referrals].sort((a, b) => +new Date(b.referredAt) - +new Date(a.referredAt));
}

/* -------------------------------------------------------------------------- */
/* Mutations                                                                   */
/* -------------------------------------------------------------------------- */

export interface NewRequestInput {
  preferredName: string;
  category: CounsellingRequest["category"];
  ageRange: CounsellingRequest["ageRange"];
  contactMethod: CounsellingRequest["contactMethod"];
  contactValue: string;
  supportAreas: CounsellingRequest["supportAreas"];
  reason: string;
  preferredLanguage: CounsellingRequest["preferredLanguage"];
  preferredDate: string;
  preferredTimeSlot: number;
  consentGiven: boolean;
  safeguardingFlag: boolean;
  guardianAware?: boolean;
}

const MINOR_AGES: CounsellingRequest["ageRange"][] = ["UNDER_13", "13_15", "16_17"];

export function isMinor(ageRange: CounsellingRequest["ageRange"]) {
  return MINOR_AGES.includes(ageRange);
}

export function createRequest(input: NewRequestInput) {
  const s = store();
  s.sequence += 1;
  const caseRef = formatCaseRef(new Date().getFullYear(), s.sequence);
  const accessCode = generateAccessCode();
  const now = new Date().toISOString();

  // A safety flag at intake, or a beneficiary under 18, raises the priority so
  // the request surfaces at the top of the therapist's queue.
  const priority: CounsellingRequest["priority"] = input.safeguardingFlag
    ? "URGENT"
    : isMinor(input.ageRange)
      ? "PRIORITY"
      : "STANDARD";

  const request: CounsellingRequest = {
    ...input,
    id: `req_${s.sequence}`,
    caseRef,
    priority,
    status: "REQUESTED",
    createdAt: now,
    updatedAt: now,
  };

  s.requests.unshift(request);
  s.accessCodes.set(caseRef, accessCode);
  return { request, accessCode };
}

export function verifyAccess(caseRef: string, accessCode: string) {
  const stored = store().accessCodes.get(caseRef.trim().toUpperCase());
  if (!stored) return undefined;
  if (stored.toUpperCase() !== accessCode.trim().toUpperCase()) return undefined;
  return getRequest(caseRef.trim().toUpperCase());
}

/** Applies a status change, refusing any transition the process doesn't allow. */
export function updateRequestStatus(caseRef: string, to: AppointmentStatus) {
  const request = getRequest(caseRef);
  if (!request) return { ok: false as const, reason: "not_found" as const };
  if (!canTransition(request.status, to)) {
    return { ok: false as const, reason: "illegal_transition" as const, from: request.status };
  }
  request.status = to;
  request.updatedAt = new Date().toISOString();

  // Keep the live appointment in step with the case.
  const appointment = store()
    .appointments.filter((a) => a.caseRef === caseRef)
    .sort((a, b) => +new Date(b.scheduledFor) - +new Date(a.scheduledFor))[0];
  if (appointment && ["CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"].includes(to)) {
    appointment.status = to;
  }

  return { ok: true as const, request };
}

export function assignTherapist(caseRef: string, therapistId: string) {
  const request = getRequest(caseRef);
  if (!request) return undefined;
  request.assignedTherapistId = therapistId;
  request.updatedAt = new Date().toISOString();
  return request;
}

export function scheduleAppointment(input: {
  caseRef: string;
  therapistId: string;
  scheduledFor: string;
  durationMinutes?: number;
  mode?: Appointment["mode"];
  location?: string;
}) {
  const request = getRequest(input.caseRef);
  if (!request) return undefined;
  const s = store();
  const appointment: Appointment = {
    id: `apt_${s.appointments.length + 1}`,
    caseRef: input.caseRef,
    requestId: request.id,
    therapistId: input.therapistId,
    scheduledFor: input.scheduledFor,
    durationMinutes: input.durationMinutes ?? 50,
    mode: input.mode ?? "IN_PERSON",
    location: input.location,
    status: "SCHEDULED",
    createdAt: new Date().toISOString(),
  };
  s.appointments.push(appointment);
  if (canTransition(request.status, "SCHEDULED")) {
    request.status = "SCHEDULED";
    request.updatedAt = appointment.createdAt;
  }
  return appointment;
}

export function addNote(input: Omit<CaseNote, "id" | "createdAt">) {
  const s = store();
  const note: CaseNote = {
    ...input,
    id: `note_${s.notes.length + 1}`,
    createdAt: new Date().toISOString(),
  };
  s.notes.unshift(note);
  return note;
}

export function addReferral(input: Omit<Referral, "id" | "referredAt" | "status">) {
  const s = store();
  const referral: Referral = {
    ...input,
    id: `ref_${s.referrals.length + 1}`,
    referredAt: new Date().toISOString(),
    status: "PENDING",
  };
  s.referrals.push(referral);
  return referral;
}
