import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

// The original Inter faces are embedded by Brilliant in its SVG export.
// Keep these assets rather than substituting a different Inter release.
const svg = readFileSync(new URL("../artifacts/fidelity/deals-export.svg", import.meta.url), "utf8");
const directory = new URL("../public/crm/fonts/", import.meta.url);
mkdirSync(directory, { recursive: true });
for (const match of svg.matchAll(/@font-face\{[^}]*font-weight:(\d+);src:url\(data:font\/ttf;base64,([A-Za-z0-9+/=]+)\)/g)) {
  writeFileSync(new URL(`Inter-${match[1]}.ttf`, directory), Buffer.from(match[2], "base64"));
  console.log(`Extracted original Inter ${match[1]}`);
}
