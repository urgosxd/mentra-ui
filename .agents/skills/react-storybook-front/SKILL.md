---
name: react-storybook-front
description: Use when working in the ERP frontend (front/) with React 19, Vite 8, TypeScript, and Storybook 10 — for component/story work, running stories or Vitest browser tests, using the Storybook/Chrome/Playwright/Context7 MCP servers, or deciding where a UI file belongs.
---

# ERP frontend: React + Storybook

## Stack (installed, do not upgrade unasked)

- React 19 + TypeScript 7, built by Vite 8 (`@vitejs/plugin-react`)
- Storybook 10.6 with `@storybook/react-vite`, `@storybook/addon-docs`, `addon-a11y`,
  `@storybook/addon-vitest`, `@storybook/addon-mcp`, `@chromatic-com/storybook`
- Tests: Vitest browser mode via Playwright/Chromium, driven by the Storybook test plugin
  (`vite.config.ts` → projects `storybook`)
- Lint: oxlint (`npm run lint`)

## Commands

- `npm run dev` — Vite app on :5173
- `npm run build` — `tsc -b` typecheck + production build
- `npm run lint`
- `npm run storybook` — dev server on :6006 (also serves the MCP endpoint `/mcp`)
- `npm run test` — one batch run of every story test (`vitest run`)
- `npm run test:watch`

## Story conventions

Two layers, do not mix them:

- `src/stories/generated/**` — OpenPencil export from `openpencil/pdf.fig` (see
  `.openpencil-stories.json`). **Never hand-edit**: a re-export overwrites it, including its
  `*.stories.ts` and `tokens.css`/`fonts.css`. Titles are `pdf/<Component>` and carry
  `tags: ['openpencil']` plus a `design` link back to the `.fig` node. Treat it as the design
  baseline you diff against, not as the product story set.
- `src/stories/ui/**` — hand-written stories. Titles are `UI/<Component>`, importing components
  from `../generated/<Component>`. This is where enriched coverage lives.

Rules for `src/stories/ui/`:

- CSF3: `satisfies Meta<typeof Foo>`, `export default meta`, then `Story = StoryObj<typeof meta>`.
- One story per meaningful state, plus an `All<Variants>` render and a `DarkTheme` story for
  components driven by semantic tokens.
- `play` only when it asserts something real. The standing case: the generated components render
  **one label `<span>` per variant and hide the inactive ones with CSS**, so each variant story
  asserts that exactly one span is visible and its copy is correct — that is the regression guard
  for the whole Tailwind/token pipeline, because it fails hard if the utilities stop compiling.
  Reuse the `expectOnlyVisibleLabel` helper idiom from `src/stories/ui/Button.stories.tsx`.
- Import test utilities from `storybook/test` (not `@storybook/test`, which is not installed).
  `within(el)` returns only bound queries, no `.container`: use `el.querySelectorAll(...)` on
  `canvasElement` and filter by `offsetParent !== null`.
- Never assert on class names.
- `a11y.test` is `'todo'` in `.storybook/preview.tsx`: violations are visible in the test UI but
  do not fail the run. Raise it to `'error'` only on explicit request.
- Shared providers and global CSS belong in `.storybook/preview.tsx`. Fix the shared preview
  instead of per-story workarounds.

## Tailwind v4 + design tokens

- Tailwind v4 via `@tailwindcss/vite` (Vite plugin, no `tailwind.config.js`, no PostCSS).
  `@storybook/react-vite` picks up the project's Vite config, so no `viteFinal` is needed.
- Single stylesheet entry: `src/styles/design-system.css` imports, in this order,
  `tailwindcss` → generated `tokens.css` → generated `fonts.css`. It is imported by
  `src/main.tsx` (before `./index.css`) and by `.storybook/preview.tsx`.
- **Do not restyle tokens per story.** Add or change a token in the OpenPencil design and
  re-export; the app and Storybook read the same `tokens.css`. Dark mode is the
  `[data-semantic="dark"]` block — toggle it with a wrapper `div`, not with a second token file.
- Generated components use arbitrary-value utilities (`bg-(--color-bg-brand)`,
  `h-(--component-button-height-md)`) and variant attributes (`data-[style=Secondary]`,
  `group-data-[tone=Neutro]/badge:`). Those compile to `var(--token)` lookups, so a missing
  `tokens.css` import means silently unstyled components, not a build error.
- The pipeline itself is guarded by `TokenPipeline` in `src/stories/ui/DesignSystem.stories.tsx`:
  it asserts the token is defined, the utility resolves it to a real background, the dark block
  overrides it, and `tailwindcss` is the first import in `design-system.css`. Per-variant `play`
  functions only see visible labels — they stay green with a broken token, so do not treat them as
  proof that the styling works.
- Generated `Button`/`Badge` render a `<div>` with no `role`/`tabIndex`: not focusable, no keyboard
  activation, no button semantics. Do **not** patch it in `ui/` with wrapper attributes — it belongs
  upstream in the OpenPencil component. `a11y.test: 'todo'` means axe never fails a run either.

## Storybook's own agent skills (authoritative, project-tailored)

This Storybook serves skill text generated for this exact config. Prefer it over memory:

- `npx storybook skills --all` — every skill
- `npx storybook skills stories` — mandatory ordered workflow for UI changes
- `npx storybook skills write-story` — imports/patterns for this project
- `npx storybook skills setup` — one-time project preparation (preview, MSW, real stories)

## MCP servers available

Global (`~/.pi/agent/mcp.json`):

- `storybook` (project entry in `.pi/mcp.json`, `http://localhost:6006/mcp`, streamable HTTP) —
  list components/props, read usage docs, generate and run stories. **Only reachable while
  `npm run storybook` is running**; if it shows disconnected, start the dev server.
- `chrome-devtools` — console/network errors, DOM+CSS inspection, performance traces, Lighthouse
  audits of a live page. Deferred exposure: discover with `tool_search` before calling.
- `playwright` — drive a real browser through a flow (navigate, click, type, a11y snapshot).
  Deferred exposure.
- `context7` — version-accurate docs for React, Storybook, Vite, TanStack, etc. Use it instead of
  guessing APIs. Direct exposure.
- `engram` — persistent project memory (search before resuming interrupted work).

Which one: debugging a rendered page → `chrome-devtools`; proving a user flow still works →
`playwright`; verifying a component in isolation or writing stories → `storybook`.

## Rules of engagement

- Discover code with `read`/`grep`/`find`, never shell `cat`/`sed`/`find`; edit with `edit`.
- Never read or grep `node_modules`.
- Batch the test loop: write the stories, run `npm run test` once, then fix.
- UI changes are not done until `npm run lint`, `npm run build`, and `npm run test` pass.
