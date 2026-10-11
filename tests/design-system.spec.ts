import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const snapshot = JSON.parse(readFileSync("design-system/sales-crm-dark.tokens.json", "utf8"));

test("Brilliant scalar tokens are available with their original values", async ({ page }) => {
  await page.goto("/companies");
  const mismatches = await page.evaluate(tokens => {
    const style = getComputedStyle(document.documentElement);
    return Object.entries(tokens).flatMap(([key, raw]) => {
      if (key.startsWith("$")) return [];
      const value = raw && typeof raw === "object" && "$default" in raw ? raw.$default : raw;
      if (typeof value !== "number" && typeof value !== "string") return [];
      const name = key.replaceAll(".", "-").replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      const actual = style.getPropertyValue(`--crm-${name}`).trim();
      if (key.startsWith("font.family")) return actual.includes("Inter") ? [] : [{ key, actual }];
      const unit = /^(spacing|radius|stroke\.width|font\.size|size|layout)(\.|$)/.test(key) ? "px" : key.startsWith("font.letterSpacing") ? "em" : "";
      const expected = `${value}${typeof value === "number" ? unit : ""}`;
      // Production CSS minifies hex and decimal notation without changing values.
      const normalize = (text: string) => /^#[\da-f]{3}$/i.test(text) ? `#${text.slice(1).split("").map(letter => letter + letter).join("")}`.toLowerCase() : text.toLowerCase();
      const equal = typeof value === "number"
        ? Math.abs(parseFloat(actual) - value) < 0.0001 && (unit ? actual.endsWith(unit) || value === 0 : !/[a-z]/i.test(actual))
        : normalize(actual) === normalize(expected);
      return equal ? [] : [{ key, actual, expected }];
    });
  }, snapshot.tokens);
  expect(mismatches).toEqual([]);
});

test("Brilliant composite styles and aliases respond to semantic token updates", async ({ page }) => {
  await page.goto("/forecast");
  const result = await page.evaluate(() => {
    const root = document.documentElement;
    root.style.setProperty("--crm-color-surface-container", "#123456");
    root.style.setProperty("--crm-radius-panel", "15px");
    root.style.setProperty("--crm-color-primary", "#abcdef");
    const panel = getComputedStyle(document.querySelector(".crm-card-panel")!);
    const style = getComputedStyle(root);
    return { background: panel.backgroundColor, radius: panel.borderRadius,
      selected: style.getPropertyValue("--crm-color-timeline-selected").trim() };
  });
  expect(result).toEqual({ background: "rgb(18, 52, 86)", radius: "15px", selected: "#abcdef" });
});
