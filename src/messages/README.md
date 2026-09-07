# Translations

One JSON file per locale. `en.json` is the source of truth for the message
*shape*: `src/lib/i18n/dictionary.ts` types every other locale against it, so a
missing or misspelt key is a compile error rather than a blank space on a live
page.

## Adding a language

1. Add the code to `locales` and `localeNames` in `src/lib/i18n/config.ts`.
2. Copy `en.json` to `<code>.json` and translate the values — never the keys.
3. Run `npm run typecheck`. Any key you missed will be reported.

No page, route or component needs to change.

## Rules

- Translate values only. Keys, and the `{placeholder}` tokens inside values,
  stay exactly as they are.
- Keep arrays the same length and in the same order — several are rendered as
  numbered steps.
- Plain language. This is read by people in difficulty, some of them 13 years
  old. Short sentences, no clinical jargon, no legal register.
- Do not soften the safeguarding copy. Where the English says a professional
  "may need to involve someone who can help keep you safe", the translation
  must say the same thing just as plainly.

## Hausa — status

`ha.json` is a **first draft** and must be reviewed by a native Hausa speaker
before launch, with particular attention to:

- `counselling.consent.*` — this is what a person agrees to.
- `counselling.fields.safetyQuestion` and its hint.
- `safeguarding.*` and `privacy.*`.
- `emergency.*` — read under pressure, so wording has to be unambiguous.

The typeface stack covers Hausa Boko orthography (ɓ ɗ ƙ ƴ) — see the font notes
in `src/app/globals.css`. Write the hooked letters directly; do not substitute
`b'`, `d'` or `k'`.
