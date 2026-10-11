import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { PNG } = require("../node_modules/playwright-core/lib/utilsBundle.js");
const phase = process.argv[2] || "after";
const measurements = JSON.parse(readFileSync(`artifacts/fidelity/${phase}-measurements.json`, "utf8")).filter(item => item.width === 1440);
const report = measurements.map(({ route }) => {
  const a = PNG.sync.read(readFileSync(`artifacts/fidelity/reference-${route}.png`));
  const b = PNG.sync.read(readFileSync(`artifacts/fidelity/${phase}-${route}-1440.png`));
  const diff = new PNG({ width: a.width, height: a.height });
  let changed = 0, totalDelta = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    let delta = 0;
    for (let channel = 0; channel < 3; channel++) delta = Math.max(delta, Math.abs(a.data[i + channel] - b.data[i + channel]));
    if (delta > 20) changed++;
    totalDelta += delta;
    diff.data[i] = delta > 20 ? 255 : b.data[i] * 0.4;
    diff.data[i + 1] = delta > 20 ? 60 : b.data[i + 1] * 0.4;
    diff.data[i + 2] = delta > 20 ? 100 : b.data[i + 2] * 0.4;
    diff.data[i + 3] = 255;
  }
  writeFileSync(`artifacts/fidelity/difference-${route}.png`, PNG.sync.write(diff));
  return { route, changedPixelsOver20: Number((changed * 100 / (a.width * a.height)).toFixed(3)), meanMaxChannelDelta: Number((totalDelta / (a.width * a.height)).toFixed(3)) };
});
writeFileSync(`artifacts/fidelity/${phase}-comparison.json`, JSON.stringify({ reference: "Fresh Brilliant MCP PNG exports at 1440 × 1024. Differences include canvas/browser text rasterization.", report }, null, 2));
console.table(report);
