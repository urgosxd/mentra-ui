# Generated components

Components in this folder mirror the OpenPencil `pdf3.fig` document, page
**Biblioteca de componentes**. Each file states the node it comes from in its
first line; the Storybook stories that exercise them live in `src/stories/ui`
and are the ones loaded by `.storybook/main.ts`.

## Source of truth

- Design file: `pdf3.fig`
- Page: `Biblioteca de componentes`
- Base layer section: `Biblioteca Mentra · componente base`
- App layer section: `Biblioteca Mentra · componentes de app`

`openpencil/…/tokens.css` and `fonts.css` are exported from the same page. The
token file is the only place where design variables enter the app: refresh it
whenever the design adds variables (for example the `color/shift/*`, `radius/chip`
and `component/shift-chip/*` tokens that the attendance components need).

## Naming

One component per file, PascalCase, node name normalised:

| OpenPencil node | File |
| --- | --- |
| Nav Item | `NavItem.tsx` |
| Tab | `Tab.tsx` |
| Filter Chip | `FilterChip.tsx` |
| Avatar | `Avatar.tsx` |
| Ai Fab | `AiFab.tsx` |
| App Topbar | `AppTopbar.tsx` |
| Panel | `Panel.tsx` |
| App Sidebar | `AppSidebar.tsx` |
| Sección sidebar | `SidebarSection.tsx` |
| Table Header · Personal | `TableHeaderPersonal.tsx` |
| Table Row · Personal | `TableRowPersonal.tsx` |
| Shift Chip | `ShiftChip.tsx` |
| Attendance Status | `AttendanceStatus.tsx` |
| Shift Template Row | `ShiftTemplateRow.tsx` |

`app-data.ts` holds the value lists and default sidebar data shared with the
stories, so component files keep exporting components only (Fast Refresh).

## Typography classes

Use `text-(length:--type-body-size)` / `text-(length:--type-label-size)` for
font sizes. The shorter `text-(--type-body-size)` is ambiguous in Tailwind v4
and compiles to `color: var(--type-body-size)`, which silently overrides the
real text colour (buttons rendered black-on-green before this was fixed).
Only colour tokens belong in `text-(--color-…)`.

## Regeneration

The CLI storybook export (`openpencil export pdf3.fig -f storybook`) writes a
`pdf3/<Component>` Storybook baseline next to each component. Those baseline
files are intentionally excluded from Storybook because the `src/stories/ui`
stories are the maintained ones, with interaction and accessibility assertions.

When the design changes:

1. Re-export `tokens.css` from the page (tokens are safe to overwrite).
2. Read the node with `get_jsx` and update the component.
3. Update its story in `src/stories/ui` and run `npm test`.
