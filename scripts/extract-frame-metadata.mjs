import { readdirSync, readFileSync, writeFileSync } from "node:fs";
const directory = new URL("../artifacts/fidelity/", import.meta.url);
const frames = {};
for (const filename of readdirSync(directory).filter(name => name.endsWith(".bl"))) {
  const slug = filename.slice(0, -3), nodes = [], stack = [];
  for (const line of readFileSync(new URL(filename, directory), "utf8").split("\n")) {
    const match = line.match(/^(\s*)([\da-f]{16})\s+(.*)$/);
    if (!match) continue;
    const depth = match[1].length / 2, body = match[3];
    const p = body.match(/\sp\(([-\d.]+),([-\d.]+)\)/);
    const s = body.match(/\ss\(([^,)]+),([^)]*)\)/);
    const text = body.match(/\bt\(("(?:[^"\\]|\\.)*")/);
    const name = body.match(/"([^"\n]*)"\s*$/)?.[1];
    const node = { id: match[2], name, depth, icon: body.match(/svg\(icon:([^)]*)\)/)?.[1], text: text ? JSON.parse(text[1]) : undefined,
      x: p ? Number(p[1]) : 0, y: p ? Number(p[2]) : 0,
      width: s ? Number(s[1].replace("hug:", "")) : null,
      height: s ? Number(s[2].replace("hug:", "")) : null,
      fontSize: Number(body.match(/,(\d+(?:\.\d+)?):\$font.size/)?.[1]) || undefined,
      color: body.match(/\sf\[\([^,]+,tok\([^,]+,(#[\da-fA-F]+)\)/)?.[1], children: [] };
    if (depth > 0) stack[depth - 1]?.children.push(node);
    stack[depth] = node;
    nodes.push(node);
  }
  frames[slug] = nodes.filter(node => node.depth === 1);
}
writeFileSync(new URL("metadata.json", directory), JSON.stringify(frames, null, 2));
const metrics = {};
for (const [slug, nodes] of Object.entries(frames)) {
  metrics[slug] = nodes.filter(node => node.y === 218 && node.height === 64).map(node => {
    const children = node.children.filter(child => child.text);
    return { label: children[0].text, value: children[1].text, caption: children[2].text, captionX: children[2].x, captionColor: `var(--crm-color-palette-c${children[2].color.slice(1).toLowerCase()})` };
  });
}
writeFileSync(new URL("../components/crm/frame-metrics.json", import.meta.url), JSON.stringify(metrics, null, 2));
const headers = {};
const { tokens } = JSON.parse(readFileSync(new URL("../design-system/sales-crm-dark.tokens.json", import.meta.url), "utf8"));
const color = value => {
  const key = Object.keys(tokens).find(key => key.startsWith("color.palette") && String(tokens[key]).toLowerCase() === value?.toLowerCase()) || Object.keys(tokens).find(key => key.startsWith("color.") && String(tokens[key]).toLowerCase() === value?.toLowerCase());
  return key ? `var(--crm-${key.replaceAll(".", "-")})` : value;
};
for (const nodes of Object.values(frames)) {
  const header = nodes.find(node => /header/i.test(node.name));
  const title = header.children.find(child => child.text && child.x === 20 && child.y === 26);
  if (!title) continue;
  const badge = header.children.find(child => child.y === 26 && child.children.some(text => text.text));
  const badgeText = badge?.children.find(child => child.text);
  const buttons = header.children.filter(child => child.y === 20 && child.height === 36);
  const updated = header.children.find(child => child.text && child.y > 26 && child.y < 50 && child.x > 200);
  headers[title.text] = { badge: badge ? { gap: badge.x - title.x - title.width, width: badge.width, height: badge.height,
    textColor: color(badgeText.color), fontSize: badgeText.fontSize, dot: badge.children.some(child => !child.text), dotSize: badge.children.find(child => !child.text)?.width ?? 4 } : null,
    updatedGap: updated && buttons[0] ? buttons[0].x - updated.x - updated.width : undefined,
    primaryWidth: buttons.at(-1)?.width, secondaryWidth: buttons.length > 1 ? buttons[0].width : undefined,
    actionGap: buttons.length > 1 ? buttons[1].x - buttons[0].x - buttons[0].width : 12,
    filters: Object.fromEntries(header.children.filter(child => child.y === 145 && child.height === 37 && child.children.length && !/switcher/i.test(child.name)).map(child => [child.children.find(child => child.text)?.text.split(/\s{2,}/)[0], child.width])) };
}
writeFileSync(new URL("../components/crm/frame-headers.json", import.meta.url), JSON.stringify(headers, null, 2));
console.log("Extracted original metric text and positions for " + Object.keys(frames).length + " frames.");
