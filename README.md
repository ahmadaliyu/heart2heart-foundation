# Heart2Heart Foundation — Digital Platform

Counselling, education and community support on child abuse, drug abuse, sexual
abuse and harassment, social inclusion and gender-based violence — for teenagers,
youths and married couples. Next.js frontend, installable as a Progressive Web
App, in English and Hausa.

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Node 20.9+ (see `.nvmrc` and `engines`).

`NEXT_PUBLIC_SITE_URL` is optional. If it is set, a bare hostname is fine —
`heart2heart.ng` is normalised to `https://heart2heart.ng`. If it is unset,
empty or unparseable the app falls back to the Vercel deployment URL and then to
localhost, and warns. **It can no longer break the build**, which it previously
did: `new URL()` throws without a scheme, that call sat inside
`generateMetadata`, and `generateMetadata` runs for every page during static
generation — so one missing `https://` killed the deployment with
`Error occurred prerendering page "/en/about"`, naming a page that had nothing
to do with it and redacting the real message. `scripts/env.mjs` covers the
inputs a deployment dashboard actually produces.

---

## What is here

| Area | Route | Notes |
| --- | --- | --- |
| Public website | `/[locale]` | Home, About, Services, Resources, Events, Donate, Contact |
| Emergency pathway | `/[locale]/emergency` | Verified contacts, browsing-safety guidance |
| Counselling | `/[locale]/counselling` | **Switched off.** Category choice → 6-step private intake → case reference |
| Status lookup | `/[locale]/counselling/status` | **Switched off.** Reference + access code, no account needed |
| Staff portal | `/[locale]/portal` | **Switched off.** Dashboard, requests, appointments, cases, CMS, events, donations, emergency resources, users, settings |

With the portal on, sign in at `/en/portal/login`. The demo build has no password
check — pick an account. **Hauwa Bello** is an administrator, **Dr. Amina
Yusuf** is the therapist; the two see different navigation and different data.

> **The site is currently informational.** Counselling requests and the staff
> portal are switched off in `src/lib/features.ts` — a flag each, rather than
> commented-out code across two dozen files. Their routes 404 while off, so a
> disabled feature is unreachable by URL and not merely unlinked, and the
> entry points that would have pointed at them go to Contact instead of
> nowhere. Flip a flag and run `npm run verify` to bring one back.
>
> **There is no API in this build.** Every form resolves locally against dummy
> data and nothing is recorded: submitting the intake form issues a case
> reference that will not appear in the portal, and the contact and donation
> forms send nothing. `src/lib/demo.ts` is the seam — four functions, each
> already shaped like the endpoint that will replace it, so connecting the
> NestJS API touches no screen. Sign-in is the one exception: it uses a Server
> Action so the session cookie can stay `httpOnly`.

---

## The identity

The mark is two ribbons that cross and continue past one another, tying into a
heart. **Two people met; the knot is where.** A heart-to-heart is a
conversation, not an organ, and a split-down-the-middle heart is the most
generic mark in the charity sector — so the heart here is *constructed* from two
separate strokes rather than being one shape cut in half. The plum ribbon passes
**over** the amber at the crossing, so the two are genuinely interlaced.

`public/brand/` holds the full set — horizontal and stacked lockups, reversed,
one-colour, the mark alone, favicon, app icon and share card. **All wordmark
type is outlined**, so the files carry no font dependency and can go to a
printer or into an email signature as they are.

In the app the mark is `src/components/brand/logo.tsx`. The interlace is drawn
as a third short path (the first 30% of the left ribbon, subdivided) rather than
with a `<clipPath>`, so the component needs no unique id and is safe to render
in server components and to repeat on a page.

---

## Design system

Tokens live in `src/app/globals.css` under `@theme`.

**Colour.** The brief's palette is the anchor, extended in three directions:

- Down into a **night ground** (`#180D22`–`#241634`) for the hero, footer,
  portal rail and the alternating dark bands. Long light pages read flat; the
  dark grounds are what give the site presence and let the amber carry.
- Sideways into a **warm cream** (`#FBF6EE`), so the cool lilac is not the only
  neutral and the amber has somewhere to sit.
- Into `-ink` partners for the status colours. The brief's success/warning/
  danger values sit at 3.2–3.5:1 on their own soft tints, which fails AA at the
  12px badge sizes where they actually appear, so text uses the darker partner
  while fills, borders and icons keep the original.

Two further contrast corrections: the secondary amber is **never** a button fill
or a text colour (2.3:1 on white) — it is a graphic accent with dark text on top
where it appears; and the third text tier is `#736C7E`, because `#8F8898` failed
at 3.0:1.

"Danger" is reserved for form and validation errors. Emergency pathways use a
separate, deeper crimson so a mistyped phone number never looks like a crisis.

**Type.** Fraunces is a variable face with a real optical-size axis, and the
system uses **two instances of it** rather than one stretched across every size:

| Face | Job |
| --- | --- |
| **Fraunces** opsz 144, WONK on, 600 | Display only, 1.875rem and up. High thick/thin contrast and character. |
| **Fraunces** opsz 12, WONK off, 600 | Headings 1rem–1.625rem. Sturdier stems, flatter forms, same voice. |
| **Plus Jakarta Sans** 400/600/700 | Interface, body, controls. |
| **IBM Plex Mono** 500 | Eyebrows, case references, figures, table labels. |

**The size picks the cut, not the tag.** This is what the first version got
wrong: it mapped `h1`/`h2`/`h3` to the display face and then set `h3` at 18px
and `h2` at 14px, where a face drawn for 144pt has hairlines that disappear —
which is a large part of why the pages read as thin and unconsidered. Headings
now default to the text cut and step up to the display cut only at
`.text-title` and above; at `.text-sm` and below they fall through to the sans.
The rule is enforced in `globals.css`, not by remembering to apply a class.

Self-hosted from `public/fonts` as subset WOFF2, ~216 KB for the whole set. No
third-party round trip on a slow connection, no visitor IP handed to another
party to render a typeface, and the build does not depend on an external service
being reachable. Neither design face covers the Hausa Boko letters **ɓ ɗ ƙ ƴ**,
so an 8 KB Noto slice is declared last under the same family names with a narrow
`unicode-range` — those characters, and only those, fall through to Noto.

**Shape.** Actions are pills; cards are `1.25rem`, feature panels `1.75rem`,
hero surfaces `2.25rem`. One decision (pill actions) sets most of the language.

**Rhythm.** `<Section>` takes a `size` — `sm` / `md` / `lg`. Every section used
to be one size, so two neighbours on the same ground stacked their padding into
a ~290px void with nothing in it. `npm run test:gaps` measures this: it renders
each page, finds the horizontal bands that contain no *ink* (text, images,
vector graphics — not backgrounds, which would hide the gaps it is looking
for), and reports every empty run over the threshold with the content on either
side. It is how the spacing was fixed, rather than by squinting at
screenshots.

**Motion** lives in `src/components/motion.tsx` and is restrained by design —
the brief rules out excessive animation:

- `<Reveal>` fades and lifts content the first time it scrolls in, staggered by
  a `delay` prop.
- `<CountUp>` animates the statistics. The final value is server-rendered and
  never removed from the DOM, so JavaScript-off and reduced-motion readers just
  see the number.
- The header goes transparent-over-hero → solid-on-scroll.
- Cards lift on hover; nav underlines grow from the left; the logo draws itself
  once in the hero.

Nothing loops in the reader's peripheral vision, and everything is switched off
by the `prefers-reduced-motion` block. The `Reveal` observer bails out entirely
under reduced motion, so content is never left hidden.

---

## Dark theme

Not an inversion. The light ground is a cool near-white; the dark ground is the
same aubergine night the hero already uses, so the two themes are recognisably
the same brand rather than a design and its negative. Elevation runs the other
way — in the dark, surfaces get *lighter* as they come forward, because a shadow
on a dark ground does almost nothing.

Tailwind v4 utilities compile to `var(--color-x)`, so redefining those variables
under `[data-theme="dark"]` re-themes every utility at once. There is no `dark:`
prefix on the hundreds of places that use a semantic token — which is why the
tokens are split into two kinds:

- **Semantic** (`surface`, `ink`, `line`, `heading`, `brand`, `tint`, `accent`,
  the status `-soft`/`-ink` pairs) — anything sitting *on the page ground*.
  These are redefined for dark.
- **Ramp** (`plum-*`, `amber-*`, `night`, `emergency`) — the *object* colours: a
  filled button, an avatar, the night bands, the emergency strip. A filled brand
  object should not change colour when the page does, so these stay fixed. Text
  on a permanently-white pill therefore takes `text-plum-900`, never
  `text-heading`.

**How the theme is resolved, and why it is arranged this way.**

The dark palette is declared **twice** in `globals.css` — once under
`[data-theme="dark"]`, once under `prefers-color-scheme`. That duplication is
the point: a reader whose system asks for dark gets the right theme from the
first byte of CSS, with no JavaScript involved at all. `npm run test:tokens`
fails if the two blocks drift.

The inline script therefore only has to handle an **explicit** override, and it
stamps `data-theme` on `<html>` before first paint.

That script lives as the first child of **`<body>`, not `<head>`.** React 19
hoists and dedupes the scripts and links inside a server-rendered `<head>`, so
an inline `<script>` there can be reordered between the server HTML and the
client — which surfaces as a hydration mismatch attributed to that script. As
the first child of `<body>` it is an ordinary element React renders identically
on both sides.

`data-theme` on `<html>` is the one mismatch that cannot be avoided — the server
cannot know the reader's theme — and `suppressHydrationWarning` on `<html>` is
what it is for. Nothing else writes to `<html>`: an earlier version also added a
`theme-ready` class to gate colour transitions, which turned out to be
unnecessary (a CSS transition does not run on an element's first computed style)
and was a second mismatch for no benefit.

**Nothing in `ThemeToggle` may depend on the theme until it has mounted.** The
server cannot know the reader's theme, so it renders a neutral state; `mounted`
starts `false` on both sides, which makes the hydration render identical to the
server HTML *by construction*. This is not belt-and-braces: `theme` comes from a
provider high in the tree, and with selective hydration the provider's effect
can commit *before* the button hydrates, so the button would hydrate against an
already-updated context. Deriving `title`/`aria-label` straight from `theme` did
exactly that and produced a genuine, intermittent attribute mismatch.

`npm run test:a11y` audits **both themes**, and asserts that the theme actually
applied before trusting the result — otherwise the dark pass would silently
become a second light pass that always agrees.

---

## The four decisions that shape this codebase

**1. Counselling data is not website content.** The blueprint's core principle
is enforced structurally:

- `/[locale]/counselling/*` and `/[locale]/portal/*` are separate layout
  branches with their own chrome, marked `noindex`.
- `next.config.ts` sends `no-store` on those paths and on `/api/*`.
- `public/sw.js` keeps an explicit exclusion list — never read from or written to
  any cache, and existing matching entries are purged on activation.
- The intake form keeps its answers in component state only. Nothing is written
  to `localStorage`: a half-finished disclosure left in browser storage on a
  shared phone is a safeguarding risk, not a convenience.
- The confirmation renders in place. The case reference and access code never
  enter a URL (history, referrer headers) or browser storage.

**2. The status machine lives in one file.** `src/lib/status.ts` defines every
legal transition. The portal renders action buttons *from* that graph and the
server action re-checks it, so a button can never put a case into a state the
Foundation's process does not allow — a replayed form post included.

**3. Data access goes through two modules, and only two.** Server-rendered
screens import from `src/lib/data` (the in-memory fixtures); anything a form
submits goes through `src/lib/demo.ts`. Neither is imported from a fixture file
directly, so connecting the real API means editing those functions and nothing
else.

**Photography: the slots are ready, the pictures are not.** Every image on the
site resolves through `src/lib/data/images.ts` — a list of paths. Each can be a
local file or a remote URL (`images.unsplash.com` is already allowed in
`next.config.ts`), so putting real photographs in is that one file and nothing
else. It currently holds generated placeholders.

**Cover art is abstract on purpose.** Stock photography of distressed women is
the last thing this audience should meet before asking for help, so article and
video covers are generated brand shapes — the mark's two crossing ribbons at
texture scale — produced by `scripts/covers.py` and stable per slug. Real
photography can replace them file for file; the constraint that should survive
is the subject matter, not the format.

**4. Accessibility is a build output.** `npm run test:a11y` runs axe-core
(WCAG 2.1 A + AA) across 25 pages — both locales, the signed-in portal, and
both themes — and reports **zero violations**.

---

## Internationalisation

English and Hausa, with no hard-coded interface text.

- Message files: `src/messages/en.json`, `src/messages/ha.json`
- English is the source of truth for the message *shape*; every other locale is
  typed against it, so a missing or misspelt key is a compile error rather than
  a blank space in production.
- Adding a language: add the code to `src/lib/i18n/config.ts` and a matching
  JSON file. No page, route or component changes.

> **Before launch:** the Hausa translation is a first draft and needs review by
> a native speaker — particularly the counselling, consent and safeguarding
> sections, where the wording carries clinical and legal weight.

---

## PWA

`public/manifest.webmanifest` and `public/sw.js`. Installable, mobile-first,
with app shortcuts to the emergency page and the counselling form.

Caching is deliberately split: public pages, articles, events and emergency
contacts are cached so they load on a poor connection — someone looking for a
helpline should not meet a blank page. Counselling, portal and API paths are
never cached, in either direction. The service worker registers in production
builds only.

---

## Testing

```bash
npm run verify        # typecheck + lint + production build
npm run build && npm start &
npm run test:smoke    # end-to-end: intake → case ref → portal review
npm run test:a11y      # axe-core WCAG 2.1 AA, 25 pages × both themes
npm run test:gaps      # vertical-whitespace audit
npm run test:hydration # server HTML vs hydrated DOM
npm run test:tokens    # the two dark-token blocks have not drifted
npm run test:env       # no dashboard-shaped env value can break the build
```

`npm run verify` runs the static half of that (typecheck, lint, tokens, env,
build) and needs no server.

`scripts/smoke.mjs` is written against invariants rather than fixed starting
states — the demo store lives in the server process, so a case advanced by one
run is still advanced on the next. It asserts that the transitions on offer are
always the legal moves from wherever a case currently is, which holds every run.
It walks the real journey: a beneficiary completes the intake
form, receives a case reference, checks their own status (and is correctly
refused with a wrong code), then a therapist signs in, finds the request, is
blocked from admin-only pages, reveals the masked contact details and advances
the status. 32 checks.

`scripts/a11y.mjs` audits both locales, the signed-in portal and both themes —
50 page renders, **zero violations**. Automated checks catch roughly a third of
real accessibility problems, so this is a floor: keyboard and screen-reader
testing on the counselling flow still has to be done by a person.

`scripts/gaps.mjs` reports vertical dead space.

`scripts/hydration.mjs` compares the server HTML against the hydrated DOM,
element by element, and reports attribute differences. React only warns about a
hydration mismatch if you happen to load the page in the state that triggers
one, which is a bad way to find them: this makes the divergence visible whether
or not React noticed.

It checks **`<html>`'s own attributes** as well as `<body>`. An earlier version
walked `<body>` only, and that blind spot hid a real mismatch for two rounds —
so the omission is now called out in the script itself. `<head>` is deliberately
not compared: the framework owns it, and the fix for a mismatch attributed to a
`<head>` child is to move the element out of `<head>`, not to detect it.

`scripts/shots.mjs` takes screenshots for design review.

---

## What must happen before this handles real counselling data

These are marked in the code at the point they matter.

0. **The API itself.** `src/lib/demo.ts` answers every form locally. Connect
   NestJS there.
1. **Authentication.** `src/lib/session.ts` and
   `src/app/[locale]/portal/session-actions.ts` are demo stand-ins that verify
   nothing. The real implementation needs argon2id password hashing, a
   rate-limited login endpoint, signed rotating session cookies, a short idle
   timeout, a second factor for accounts that read clinical notes, and an
   append-only access log recording who opened which case record.
2. **Authorisation in the API.** Role-scoped navigation and the redirects on
   admin pages are presentation. The NestJS API has to enforce the same
   boundary — a therapist must not be able to fetch donation records by
   guessing the endpoint.
3. **Rate limiting** on `/api/counselling/status`. A six-character access code
   is fine against a person guessing and useless against a script.
4. **Emergency contacts.** Every number in `src/lib/data/emergency.ts` is a
   placeholder. Each must be dialled, confirmed and put on a re-verification
   schedule. Unverified entries are already hidden from the public page.
5. **Payments.** `/api/donations` creates a reference and nothing else. Choose
   a provider against Nigerian payment and regulatory requirements, initialise
   transactions server-side, and mark a donation successful **only** from a
   signature-verified webhook — never from the browser redirect.
6. **Data retention.** The period in portal settings is a placeholder and must
   be set against the Foundation's professional and legal obligations.
7. **Hausa review**, as above.
8. **Safeguarding procedures.** The platform surfaces flags and escalation
   points; the Foundation still needs the written procedures behind them.

---

## Structure

```
src/
  app/
    [locale]/
      (site)/            public website
      counselling/       private intake — own chrome, noindex, no-store
      portal/            staff portal — (app) group is session-gated
    globals.css          design tokens, @font-face, utilities, motion
  components/
    brand/               the mark and lockup
    motion.tsx           Reveal, CountUp, useScrolled
    layout/  ui/  portal/  counselling/  donate/  contact/
  lib/
    i18n/                locale config, dictionaries, server + client translators
    data/                demo store — the single data access point
    demo.ts              THE BACKEND SEAM — every form resolves here
    status.ts            appointment/case transition graph
    case-ref.ts          AAGF-YYYY-NNNNNN references and access codes
    validation.ts        zod schemas shared by the form and the API
    session.ts           DEMO session — replace before launch
  messages/              en.json, ha.json
public/
  brand/  covers/  fonts/  sw.js  manifest.webmanifest
scripts/                 smoke.mjs, a11y.mjs, hydration.mjs, gaps.mjs,
                         covers.py, shots.mjs
```

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · zod · lucide-react.
No UI component library — the primitives in `src/components/ui` are small and
owned here, which is what let every form field carry a real label, linked hint
text and a non-colour error state without fighting a third party's markup.

The backend, per the blueprint, is NestJS + PostgreSQL + Prisma.
