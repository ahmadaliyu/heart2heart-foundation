import type { Donation } from "@/lib/types";
import { daysFromNow, thisMonth } from "@/lib/data/helpers";

/** Amounts are in kobo — integers only, never floats. */
export const donations: Donation[] = [
  { id: "don_1", reference: "H2H-DN-100241", amount: 5_000_00, donorName: "Ibrahim Musa", donorEmail: "i.musa@example.com", anonymous: false, recurring: false, designation: "COUNSELLING", status: "SUCCESSFUL", createdAt: daysFromNow(-1, 11) },
  { id: "don_2", reference: "H2H-DN-100240", amount: 25_000_00, donorName: "Anonymous", anonymous: true, recurring: false, designation: "GENERAL", status: "SUCCESSFUL", createdAt: daysFromNow(-2, 15) },
  { id: "don_3", reference: "H2H-DN-100239", amount: 15_000_00, donorName: "Chidinma Okafor", donorEmail: "c.okafor@example.com", anonymous: false, recurring: true, designation: "COUNSELLING", status: "SUCCESSFUL", createdAt: daysFromNow(-4, 9) },
  { id: "don_4", reference: "H2H-DN-100238", amount: 50_000_00, donorName: "Ridwan Bala", donorEmail: "r.bala@example.com", anonymous: false, recurring: false, designation: "SCHOOL_OUTREACH", status: "SUCCESSFUL", createdAt: daysFromNow(-6, 13) },
  { id: "don_5", reference: "H2H-DN-100237", amount: 10_000_00, donorName: "Anonymous", anonymous: true, recurring: false, designation: "RESOURCES", status: "SUCCESSFUL", createdAt: daysFromNow(-8, 10) },
  { id: "don_6", reference: "H2H-DN-100236", amount: 150_000_00, donorName: "Sahel Trust", donorEmail: "giving@example.org", anonymous: false, recurring: true, designation: "GENERAL", status: "SUCCESSFUL", createdAt: daysFromNow(-12, 16) },
  { id: "don_7", reference: "H2H-DN-100235", amount: 7_500_00, donorName: "Halima Abubakar", anonymous: false, recurring: false, designation: "COUNSELLING", status: "PENDING", createdAt: daysFromNow(-1, 18) },
  { id: "don_8", reference: "H2H-DN-100234", amount: 20_000_00, donorName: "Emeka Nwosu", donorEmail: "e.nwosu@example.com", anonymous: false, recurring: false, designation: "GENERAL", status: "SUCCESSFUL", createdAt: daysFromNow(-19, 12) },
  { id: "don_9", reference: "H2H-DN-100233", amount: 5_000_00, donorName: "Anonymous", anonymous: true, recurring: false, designation: "GENERAL", status: "FAILED", createdAt: daysFromNow(-21, 14) },
  { id: "don_10", reference: "H2H-DN-100232", amount: 35_000_00, donorName: "Aisha Lawal", donorEmail: "a.lawal@example.com", anonymous: false, recurring: true, designation: "SCHOOL_OUTREACH", status: "SUCCESSFUL", createdAt: daysFromNow(-34, 10) },
  { id: "don_11", reference: "H2H-DN-100231", amount: 12_000_00, donorName: "Tunde Adeyemi", anonymous: false, recurring: false, designation: "RESOURCES", status: "SUCCESSFUL", createdAt: daysFromNow(-41, 9) },
  { id: "don_12", reference: "H2H-DN-100230", amount: 60_000_00, donorName: "Anonymous", anonymous: true, recurring: false, designation: "COUNSELLING", status: "SUCCESSFUL", createdAt: daysFromNow(-52, 11) },
];

export function listDonations(limit?: number) {
  const list = [...donations].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return limit ? list.slice(0, limit) : list;
}

const successful = () => donations.filter((d) => d.status === "SUCCESSFUL");

export function donationStats() {
  const all = successful();
  const month = all.filter((d) => thisMonth(d.createdAt));
  const total = all.reduce((sum, d) => sum + d.amount, 0);
  return {
    total,
    thisMonth: month.reduce((sum, d) => sum + d.amount, 0),
    count: all.length,
    average: all.length ? Math.round(total / all.length) : 0,
    recurringDonors: new Set(all.filter((d) => d.recurring).map((d) => d.donorName)).size,
  };
}
