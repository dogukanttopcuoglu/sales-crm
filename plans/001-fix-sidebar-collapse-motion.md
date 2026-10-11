# 001 — Fix sidebar collapse motion

- **Status**: TODO
- **Commit**: 254c886
- **Severity**: MEDIUM
- **Category**: Performance, Interruptibility, Accessibility
- **Estimated scope**: 2 files, small

## Problem

The sidebar collapse is implemented as a layout-width transition in
`components/crm/shell.tsx:18`:

```tsx
return <div className={`relative flex min-h-full flex-col bg-crm-surface-sidebar transition-[width] duration-150 ${collapsed ? "w-[72px]" : "w-crm-layout-sidebar-width"}`}>
```

The parent grid also switches immediately between
`lg:grid-cols-[72px_minmax(0,1fr)]` and
`lg:grid-cols-[var(--crm-layout-sidebar-width)_minmax(0,1fr)]` in
`components/crm/shell.tsx:39`, while labels change to `sr-only` in the same
render. This makes the sidebar content snap/disappear while the outer layout
is still moving, and the width transition is not interruptible as a single
coordinated state. The motion is also not gated for users who prefer reduced
motion.

## Target

Keep the existing layout behavior and collapse states, but make the transition
coherent and accessible:

```tsx
const sidebarMotion = "transition-[width] duration-200 ease-out";
```

Use the same `duration-200 ease-out` timing for the sidebar width and the
desktop grid track. Keep the existing 72px collapsed width and the existing
`var(--crm-layout-sidebar-width)` expanded width. Add a reduced-motion rule in
`app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .crm-sidebar-motion,
  .crm-sidebar-motion * {
    transition-duration: 0.01ms !important;
  }
}
```

Apply `crm-sidebar-motion` to the sidebar and the outer desktop grid. Do not
animate label visibility; labels may remain instant/sr-only as they do now.

## Repo conventions to follow

- The project currently uses Tailwind transition utilities directly in
  `components/crm/shell.tsx:18`; keep the change local and do not add a motion
  dependency.
- The product is a crisp dashboard. Use the audit-approved strong ease-out
  behavior and keep UI motion under 300ms.
- Existing reduced-motion CSS belongs in `app/globals.css`, next to the other
  global interaction rules.

## Steps

1. In `components/crm/shell.tsx`, add the shared class
   `crm-sidebar-motion transition-[width] duration-200 ease-out` to the outer
   desktop grid element and to the sidebar width element. Preserve the current
   conditional width classes and all navigation behavior.
2. In `app/globals.css`, add the exact reduced-motion rule shown above so the
   collapse does not animate for users with `prefers-reduced-motion: reduce`.
3. Do not change the sidebar’s markup, icon layout, labels, routes, or mobile
   dialog behavior.

## Boundaries

- Do NOT add Framer Motion, Motion, GSAP, or any other dependency.
- Do NOT animate `padding`, `margin`, transforms, or each individual nav item.
- Do NOT alter the collapsed width (72px), expanded width token, or mobile
  navigation behavior.
- If `components/crm/shell.tsx:18` or `:39` no longer contains the cited
  width/state code, stop and report drift instead of improvising.

## Verification

- **Mechanical**: run `npm run lint`; expect exit code 0.
- **Feel check**: open `/companies`, click the sidebar logo to collapse and
  expand it repeatedly. Confirm the outer content and sidebar width move
  together, the transition completes in about 200ms, and no child content
  visibly drags behind the panel.
- Toggle the button mid-transition several times. Confirm CSS transitions
  retarget from the current width instead of restarting from the expanded or
  collapsed endpoint.
- In DevTools, slow animations to 10% and confirm the width/grid movement uses
  ease-out rather than ease-in or a keyframe restart.
- Enable `prefers-reduced-motion: reduce` in the Rendering panel and confirm
  collapse/expand becomes effectively immediate while the control still works.
- **Done when**: desktop collapse and expand are visually synchronized,
  repeated toggles remain interruptible, lint passes, and reduced motion has no
  visible layout animation.
