/**
 * Case references, in the Foundation's format: AAGF-2026-000001.
 *
 * The reference is deliberately meaningless on its own — it carries no name,
 * no category and no clinical hint — so it can be written down, texted or read
 * out over the phone without exposing anything about the person it belongs to.
 */

const PREFIX = "AAGF";
const PATTERN = /^AAGF-(\d{4})-(\d{6})$/;

export function formatCaseRef(year: number, sequence: number) {
  return `${PREFIX}-${year}-${String(sequence).padStart(6, "0")}`;
}

export function parseCaseRef(ref: string) {
  const match = PATTERN.exec(ref.trim().toUpperCase());
  if (!match) return null;
  return { year: Number(match[1]), sequence: Number(match[2]) };
}

export function isValidCaseRef(ref: string) {
  return PATTERN.test(ref.trim().toUpperCase());
}

export function normaliseCaseRef(ref: string) {
  return ref.trim().toUpperCase().replace(/\s+/g, "");
}

/**
 * Six-character access code paired with the case reference so a beneficiary can
 * check their own request status without an account. Excludes characters that
 * are easily confused when read aloud (0/O, 1/I/L).
 */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateAccessCode(length = 6) {
  const bytes =
    typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? crypto.getRandomValues(new Uint32Array(length))
      : Array.from({ length }, () => Math.floor(Math.random() * 2 ** 32));
  return Array.from(bytes, (n) => CODE_ALPHABET[n % CODE_ALPHABET.length]).join("");
}
