# Screen component stories — Storybook coverage for the "componentes de pantalla" library

Design source: `pdf3.fig` (OpenPencil, Windows host) · page **Biblioteca de componentes** · section **Biblioteca Mentra · componentes de pantalla** (`1220615854:789`). Raw `get_jsx` dumps live in `.pi/design-jsx/screen/<Name>.jsx` (scratch, not committed).

## Specs

S1. Each of the 31 components of that section gets a hand-written Storybook story, so Storybook lists all of them: PageHeader, SearchField, Pagination, RangeChip, GhostChip, ProgressMeter, LegendItem, DetailField, PersonCell, InfoNote, AlertRow, FileStatusRow, ScheduleMatrixHeader, ScheduleRow, PanelHeader, PanelNavHeader, PanelCardHeader, FormField, Table Header · Asistencia, Table Row · Asistencia, Subtab, DetailPanelHeader, DonutBreakdown, DonutIndicator, BarColumn, MiniBarColumn, PersonCard, MonthCalendar, Summary Table Header, Summary Table Row, Product Row.

S2. Component implementations live in `src/stories/generated/<PascalCase>.tsx`, first line `// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · <node name> (<node id>)`, plain React function components styled with Tailwind v4 classes that reference design tokens only. No runtime `defineVars`, no `property()` helper, no raw hex/rgb colour in the component.

S3. Stories live in `src/stories/ui/<PascalCase>.stories.tsx` with `title: 'UI/<PascalCase>'` and are the only loaded copy: `.storybook/main.ts` keeps excluding `src/stories/generated`. Never add stories under `src/stories/generated`.

S4. Stories assert observable behaviour through the public DOM with `expect` from `storybook/test` inside `play`: one story per design variant cell of a component set (or per tone/state where the design has variants), text/slot content, aria attributes where the component is interactive, a `DarkTheme` story with `parameters: { semantic: 'dark' }` that asserts token-derived computed colours, and — where the design has hover/focus/pressed styling — the `styleProbe` helpers instead of faking a computed pseudo-class value.

S5. Shared files are read-only for this feature: `src/stories/ui/styleProbe.ts`, `src/stories/generated/app-data.ts`, `.storybook/*`. Component-local types are declared inside the component file.

S6. `npm test` (vitest project `storybook`), `npx tsc -b` and `npx oxlint` pass with the new stories, and `npm run build` still type-checks.

## Tasks

| ID | Spec | Scope | Route | Commit |
| --- | --- | --- | --- | --- |
| T1 | — | Branch, design-source scratch copy, this document | bootstrap-stories | — |
| T2 | S1-S5 | PageHeader, SearchField, Pagination, RangeChip, GhostChip | u1-navegacion-busqueda | later |
| T3 | S1-S5 | ProgressMeter, LegendItem, DetailField, PersonCell, InfoNote | u2-datos-metricas | later |
| T4 | S1-S5 | AlertRow (4 tones), FileStatusRow (2 states) | u3-filas-registro | later |
| T5 | S1-S5 | ScheduleMatrixHeader, ScheduleRow, PanelHeader, PanelNavHeader, PanelCardHeader, FormField | u4-horarios-paneles | later |
| T6 | S1-S5 | Table Header · Asistencia, Table Row · Asistencia, Subtab, DetailPanelHeader | u5-asistencia-detalle | later |
| T7 | S1-S5 | DonutBreakdown, DonutIndicator, BarColumn, MiniBarColumn, PersonCard, MonthCalendar | u6-graficos | later |
| T8 | S1-S5 | Summary Table Header, Summary Table Row, Product Row | u7-tablas-resumen | later |
| T9 | S6 | Full verification of T2-T8 | verify agent | — |
| T10 | S6 | Work-unit commits on `feat/screen-component-stories` | commit agent | yes |

## Log

L1 (user, verbatim): "se crearon nuevos componentes, usando las skiils de openpencil y desing system, crea las histories para tener todos los componentes en storybook"
L2 (user, verbatim): "puedes delegar agentes concurrentes para hacerlo mas rapido ?"
L3 (parent): the new components are the OpenPencil section `Biblioteca Mentra · componentes de pantalla` (`1220615854:789`); the three earlier library sections (base, app, and the 5 pre-existing exports) already have stories.
L4 (parent): the parent session lost `bash`/`read`; all file work is delegated. Design JSX fetched from the live document on 2026-11-17; `tokens.css` was diffed against `export_design_tokens` and is already up to date, so no token refresh is part of this feature.
