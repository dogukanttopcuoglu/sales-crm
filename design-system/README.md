# Brilliant → Tailwind

Source: `Styles/sales-crm-dark.ds` in the Brilliant **sales crm** project. Theme: dark; density: compact.

`sales-crm-dark.ds` is the source snapshot read through Brilliant MCP. `sales-crm-dark.tokens.json` contains Brilliant's resolved export, including generated color ramps. Neither file is a live connection to the editor.

Run `npm run design-system:generate` to regenerate the CSS and typed references. To update from Brilliant, refresh both snapshots from the editor's source and resolved export, then run this command. Builds use the checked-in snapshots and do not require Brilliant to be running.

Global CSS imports `sales-crm-dark.css`. Examples:

```tsx
<section className="crm-card-panel border border-crm-outline text-crm-text-primary">
  <h1 className="text-crm-page font-crm-medium">Forecast</h1>
  <button className="crm-button-primary">Create</button>
</section>
```

Use `designTokens` from `tokens.ts` for dynamic chart colors and inline styles. Semantic and composite aliases retain their CSS variable relationships. Existing generic Tailwind sizes retain their previous dimensions; explicit `crm-*` sizes use Brilliant's scale.

The export contains 556 scalar tokens and 27 composite styles, plus export metadata. Page geometry remains page-specific, including the previously requested shorter header and responsive layouts; the original header height token is available without overriding those changes.

## Migration files and verification

Created: this README, `sales-crm-dark.ds`, `sales-crm-dark.tokens.json`, `sales-crm-dark.css`, `tokens.ts`, `scripts/generate-design-system.mjs`, and `tests/design-system.spec.ts`.

Modified: `app/globals.css`, `package.json`, and these files in `components/crm/`: `activities.tsx`, `apac-expansion-data.json`, `companies.tsx`, `contacts.tsx`, `data-table.tsx`, `deals-data.json`, `deals.tsx`, `design-header.tsx`, `emea-overview.tsx`, `forecast.tsx`, `header.tsx`, `north-america-data.json`, `primitives.tsx`, `q1-forecast.tsx`, `report-panels.tsx`, `routes.ts`, `sequences.tsx`, `shell.tsx`, `slipping-deals.tsx`, `team-overview.tsx`.

Validation: production build and ESLint passed. The existing 111 Playwright page, navigation, filter, and responsive checks passed. Both new token checks passed after correcting the test's handling of CSS minification (short hex notation, decimals, and numeric precision). Viewport widths: 390, 768, 1440, 1680, 1920, and 2560.

The 28 image comparisons in `artifacts/design-system/comparison.json` use captures from the previous validated implementation as the baseline. They verify this migration's effect, rather than pixel identity with the original Brilliant frames after the user's earlier layout changes. Companies, Forecast, and EMEA are identical at both compared widths. Other exact RGB differences range up to 1.9627% at 1440 and 0.5933% at 2560, including intentional semantic status color corrections. Original SVGs and avatars were retained. No new dependencies or backend were introduced.
