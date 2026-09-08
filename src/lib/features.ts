/**
 * Feature switches.
 *
 * The Foundation's site is currently informational: it describes the work and
 * how to make contact, and nothing on it starts a process. Counselling requests
 * and the staff portal are built and tested, but switched off here rather than
 * commented out across two dozen files — a flag can be turned back on in one
 * line and reviewed in a diff, whereas commented-out JSX rots quietly and stops
 * compiling the moment anything around it changes.
 *
 * Turning one back on:
 *   1. flip it to `true`
 *   2. `npm run verify`
 *
 * Every entry point checks the flag, and the routes themselves 404 while it is
 * off, so a disabled feature cannot be reached by typing the URL.
 */
export const features = {
  /**
   * The counselling request journey: the "Get support" actions, the category
   * chooser, the intake form and the status lookup.
   */
  counselling: false,

  /**
   * Staff sign-in and everything behind it — dashboard, requests, cases, the
   * content and donation admin.
   */
  staffPortal: false,
} as const;
