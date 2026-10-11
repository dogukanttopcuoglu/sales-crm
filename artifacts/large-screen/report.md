# EMEA large-screen layout validation

Historical report for the large-screen task. The subsequent page-completion task implemented all five missing routes, removed the prefetch-error allowance, and passed all 54 production tests. The missing-route failures described below are now resolved.

Scope: the existing EMEA Enterprise page at /. No other CRM pages, shared controls, fonts, or navigation were changed in this task.

## Diagnosis

The shell has a deliberate 288px sidebar, but the page had no maximum content width. Its percentage-based panel grid and table columns expanded across all remaining space. At a 2560×1440 CSS viewport, main content was 2272px wide, the pipeline panel 1466.56px, the target panel 745.42px, and the opportunities table 2230px. Fixed type sizes, row heights, and compact controls did not grow with these panels, making related values too far apart. No global transform or CSS zoom was involved.

The user's existing in-app tab reported a CSS viewport of 515×884, visual viewport 500×884, DPR 1, visual viewport scale 1, and CSS zoom 1. These readings do not establish the operating system's physical monitor resolution or an independently available browser zoom setting.

## Change

The EMEA page now has a centered 1440px maximum width within the area beside the sidebar. Above a 1440px viewport, its target column stays at 368px and the pipeline uses the remainder. The opportunities table grows with the bounded page. Existing typography, controls, spacing, heights, and mobile navigation behavior are preserved.

Only these source files were changed or created for this task:

- components/crm/emea-overview.tsx
- app/globals.css — one media rule scoped to the EMEA panel grid
- tests/large-screen.spec.ts

The files in this directory are generated screenshots, measurements, network diagnostics, image comparisons, and this report. Other working-tree changes predate this request.

## Measured final dimensions

| CSS viewport | Main width | Main x | Pipeline width | Target width | Table width |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1440×1024 | 1152 | 288 | 724 | 368 | 1110 |
| 1680×1050 | 1392 | 288 | 964 | 368 | 1350 |
| 1920×1080 | 1440 | 384 | 1012 | 368 | 1398 |
| 2560×1440 | 1440 | 704 | 1012 | 368 | 1398 |

All screenshots were inspected. On wide displays the bounded content is centered in the space beside navigation. Empty space below the short dataset remains intentional; panels and text are not enlarged to fill viewport height. At 390×844, navigation opens and closes, panels stack, and the dense table scrolls within its own region without horizontal page overflow. The existing 768px check also passed in development.

## Validation results

- Before-change development captures: 5/5 passed.
- Final development run: 9/9 passed (five viewport checks and four existing EMEA checks).
- Production build completed successfully; TypeScript check and focused ESLint check passed.
- Initial combined production run: 4 passed, 5 failed. All five failures were console errors from existing unfinished sidebar route prefetches; the layout assertions passed.
- Final production layout suite: 5/5 passed at 1440×1024, 1680×1050, 1920×1080, 2560×1440, and 390×844. It explicitly records the five known missing-route prefetch errors in the *-network.json files and still fails on other console or runtime errors.
- Existing EMEA production suite: 3 passed, 1 failed at desktop because its strict console check includes those same missing-route prefetches. This suite was not modified.

The known unfinished routes are /q1-forecast, /slipping-deals, /north-america, /emea-enterprise, and /apac-expansion. They remain outside this layout task.

## Reference fidelity

At 1440×1024, before and after development screenshots have exactly zero changed pixels. Comparison with the exported Brilliant frame was also performed: the final production screenshot has mean RGB difference 2.1223/255; 3.2038% of pixels differ by more than 25 in at least one RGB channel. This is a descriptive comparison, not a pixel-perfect pass threshold. Existing minor typography, control/icon, and spacing differences remain; this task introduces no visual change at the reference size.

See comparison.json and reference-difference.png for the measurements and difference image. The after-*.png files are the final production captures. Before screenshots contain the development toolbar; production screenshots do not.
