/**
 * Dark-token sync check.
 *
 * The dark palette is declared twice in globals.css: once under
 * [data-theme="dark"] for an explicit choice, and once under
 * prefers-color-scheme for a reader who has not made one. Declaring it twice is
 * what lets the dark theme be correct from the first byte of CSS with no
 * JavaScript involved — but two copies drift, and a drift would show as one
 * theme being subtly wrong for half the audience.
 *
 * This fails if they stop matching.
 *
 *   node scripts/tokens.mjs
 */
import { readFileSync } from "fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

/** Pull the declarations out of a block, given the text its selector starts at. */
function declarations(from) {
  const open = css.indexOf("{", from);
  let depth = 0;
  let i = open;
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) break;
  }
  return css
    .slice(open + 1, i)
    .split(";")
    .map((line) => line.replace(/\/\*[\s\S]*?\*\//g, "").trim())
    .filter((line) => line.startsWith("--"))
    .sort();
}

const explicit = declarations(css.indexOf('[data-theme="dark"] {'));
const system = declarations(css.indexOf(':root:not([data-theme="light"])'));

const missing = explicit.filter((d) => !system.includes(d));
const extra = system.filter((d) => !explicit.includes(d));

if (!explicit.length || !system.length) {
  console.error("Could not find both dark blocks in globals.css.");
  process.exit(1);
}

if (missing.length || extra.length) {
  console.error("Dark token blocks have drifted.\n");
  for (const d of missing) console.error(`  only in [data-theme="dark"]:      ${d}`);
  for (const d of extra) console.error(`  only in prefers-color-scheme:     ${d}`);
  console.error(`\n${missing.length + extra.length} difference(s).`);
  process.exit(1);
}

console.log(`Dark tokens in sync — ${explicit.length} declarations in both blocks.`);
