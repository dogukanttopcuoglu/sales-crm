import { readFileSync, writeFileSync } from "node:fs";

// Brilliant's resolved export is snapshotted so builds never depend on the editor.
const directory = new URL("../design-system/", import.meta.url);
const { tokens } = JSON.parse(readFileSync(new URL("sales-crm-dark.tokens.json", directory), "utf8"));
const source = readFileSync(new URL("sales-crm-dark.ds", directory), "utf8");
const name = key => key.replaceAll(".", "-").replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
const variable = key => `--crm-${name(key)}`;
const unwrap = value => value && typeof value === "object" && "$default" in value ? value.$default : value;
const unit = key => /^(spacing|radius|stroke\.width|font\.size|size|layout)(\.|$)/.test(key) ? "px" : key.startsWith("font.letterSpacing") ? "em" : "";
const roots = [], theme = [], utilities = [], references = {};
const aliases = Object.fromEntries([...source.matchAll(/^([\w.]+):\s*([\w.]+)\s*$/gm)].filter(match => match[2] in tokens).map(match => [match[1], match[2]]));

for (const [key, raw] of Object.entries(tokens)) {
  if (key.startsWith("$")) continue;
  const value = unwrap(raw), cssName = variable(key);
  if (typeof value === "number" || typeof value === "string") {
    const cssValue = aliases[key] ? `var(${variable(aliases[key])})` : key.startsWith("font.family") ? 'var(--font-inter), Inter, Arial, sans-serif' : `${value}${typeof value === "number" ? unit(key) : ""}`;
    roots.push(` ${cssName}: ${cssValue};`);
    references[key] = `var(${cssName})`;
    if (typeof value === "string" && value.startsWith("#")) theme.push(` --color-crm-${name(key.replace(/^color\./, ""))}: var(${cssName});`);
    else if (key.startsWith("spacing.")) theme.push(` --spacing-crm-${name(key.slice(8))}: var(${cssName});`);
    else if (key.startsWith("radius.")) theme.push(` --radius-crm-${name(key.slice(7))}: var(${cssName});`);
    else if (key.startsWith("font.size.")) theme.push(` --text-crm-${name(key.slice(10))}: var(${cssName});`);
    else if (key.startsWith("font.weight.")) theme.push(` --font-weight-crm-${name(key.slice(12))}: var(${cssName});`);
    else if (key.startsWith("font.lineHeight.")) theme.push(` --leading-crm-${name(key.slice("font.lineHeight.".length))}: var(${cssName});`);
    else if (key.startsWith("font.letterSpacing.")) theme.push(` --tracking-crm-${name(key.slice("font.letterSpacing.".length))}: var(${cssName});`);
    else if (key.startsWith("visibility.")) utilities.push(`@utility opacity-crm-${name(key.slice(11))} { opacity: var(${cssName}); }`);
    else if (key.startsWith("stroke.width.")) utilities.push(`@utility border-crm-width-${name(key.slice(13))} { border-width: var(${cssName}); }`);
    else if (key.startsWith("size.") || key.startsWith("layout.")) theme.push(` --spacing-crm-${name(key)}: var(${cssName});`);
    continue;
  }
  if (!value || Array.isArray(value)) continue;
  const escapedKey = key.replaceAll(".", "\\.");
  const compositeSource = source.match(new RegExp(`${escapedKey}:\\s*\\{([^}]+)\\}`))?.[1] || "";
  const declarations = [];
  for (const [property, propertyValue] of Object.entries(value)) {
    if (["fontSize", "fontWeight", "fontFamily", "lineHeight", "letterSpacing", "radius"].includes(property)) {
      const propertyName = name(property), tokenName = `${cssName}-${propertyName}`;
      const reference = compositeSource.match(new RegExp(`\\b${property}:\\s*([\\w.]+)`))?.[1];
      const cssValue = reference && reference in tokens ? `var(${variable(reference)})` : property === "fontFamily" ? 'var(--font-inter), Inter, Arial, sans-serif' : `${propertyValue}${["fontSize", "radius"].includes(property) ? "px" : property === "letterSpacing" ? "em" : ""}`;
      roots.push(` ${tokenName}: ${cssValue};`);
      declarations.push(` ${property === "radius" ? "border-radius" : propertyName}: var(${tokenName});`);
    } else if (property === "fills" && propertyValue?.[0]?.color) {
      const reference = compositeSource.match(/\bfills:\s*\[([\w.]+)\]/)?.[1];
      roots.push(` ${cssName}-fill: ${reference && reference in tokens ? `var(${variable(reference)})` : propertyValue[0].color};`);
      declarations.push(` background-color: var(${cssName}-fill);`);
    } else if (property === "effects" && (!propertyValue || propertyValue.length === 0)) declarations.push(" box-shadow: none;");
  }
  if (declarations.length) utilities.push(`@utility crm-${name(key)} {\n${declarations.join("\n")}\n}`);
}

theme.push(
 " --spacing: var(--crm-spacing-xs);",
 " --font-sans: var(--crm-font-family);",
 ...Object.entries({ background: "surface", panel: "surface.container", control: "surface.container.high", line: "outline", muted: "text.muted", secondary: "text.secondary", foreground: "text.primary" }).map(([alias, key]) => ` --color-${alias}: var(${variable(`color.${key}`)});`),
 " --font-weight-normal: var(--crm-font-weight-regular);",
 " --font-weight-medium: var(--crm-font-weight-medium);",
 " --font-weight-semibold: var(--crm-font-weight-semibold);",
 " --font-weight-bold: var(--crm-font-weight-bold);",
 " --text-xs: var(--crm-font-size-link);",
 " --text-xs--line-height: var(--crm-spacing-lg);",
 " --text-sm: var(--crm-font-size-control);",
 " --text-sm--line-height: var(--crm-spacing-xl);",
 " --text-base: var(--crm-font-size-section);",
 " --text-base--line-height: var(--crm-spacing-2xl);",
 " --text-lg: var(--crm-font-size-large);",
 " --text-lg--line-height: var(--crm-font-size-target);",
 " --text-xl: var(--crm-font-size-page);",
 " --text-xl--line-height: var(--crm-font-size-target);",
 " --spacing-crm-panel-inset: calc(var(--crm-spacing-panel-side) - var(--crm-stroke-width-control));",
 " --spacing-crm-panel-content-top: calc(var(--crm-spacing-panel-top) - var(--crm-stroke-width-control));"
);
const banner = "/* Generated from sales-crm-dark.tokens.json, resolved by Brilliant. Run npm run design-system:generate. */";
writeFileSync(new URL("sales-crm-dark.css", directory), `${banner}\n:root {\n color-scheme: dark;\n${roots.join("\n")}\n}\n@theme inline {\n${theme.join("\n")}\n}\n${utilities.join("\n")}\n`);
writeFileSync(new URL("tokens.ts", directory), `// Generated CSS references for dynamic styles.\nexport const designTokens = ${JSON.stringify(references, null, 2)} as const;\nexport type DesignToken = keyof typeof designTokens;\n`);
console.log(`Generated ${Object.keys(references).length} scalar references and ${utilities.length} utilities from ${Object.keys(tokens).length} Brilliant entries.`);
