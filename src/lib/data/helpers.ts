/**
 * Date helpers for the demo store.
 *
 * Fixture dates are expressed relative to "now" so the dashboards always look
 * alive — a build from six months ago should still show today's appointments.
 */

export function daysFromNow(days: number, hour = 9, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function hoursFromNow(hours: number) {
  const d = new Date();
  d.setHours(d.getHours() + hours, 0, 0, 0);
  return d.toISOString();
}

export function isSameDay(a: string | Date, b: string | Date) {
  const x = new Date(a);
  const y = new Date(b);
  return (
    x.getFullYear() === y.getFullYear() &&
    x.getMonth() === y.getMonth() &&
    x.getDate() === y.getDate()
  );
}

export function isFuture(value: string | Date) {
  return new Date(value).getTime() > Date.now();
}

export function isPast(value: string | Date) {
  return new Date(value).getTime() < Date.now();
}

export function thisMonth(value: string | Date) {
  const d = new Date(value);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

/** Minutes since midnight for the appointment slot picker. */
export const slotMinutes = [
  9 * 60,
  10 * 60,
  11 * 60,
  12 * 60,
  14 * 60,
  15 * 60,
  16 * 60,
];
