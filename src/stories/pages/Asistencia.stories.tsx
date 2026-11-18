import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { asistencia } from '../../prototype/fixtures/asistencia';
import { Asistencia } from '../../prototype/screens/Asistencia';

const meta = {
  title: 'Pages/04 · Asistencia',
  component: Asistencia,
  parameters: { layout: 'fullscreen' },
  args: { data: asistencia },
  render: (args) => (
    <div className="h-[1180px] w-[1440px] bg-(--color-bg-canvas)">
      <Asistencia {...args} />
    </div>
  )
} satisfies Meta<typeof Asistencia>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Copy the design draws in frame 1462934304:4592, verbatim, region by region. */
const DESIGN_TEXTS = [
  // Topbar chrome
  'Asistencia · Control del personal',
  '1 – 31 Mar 2025',
  'Gerencia',
  // Page header + actions
  'RRHH / Asistencia',
  'Asistencia',
  'Registra y controla la asistencia: ingresos, salidas, tardanzas, ausencias y horas trabajadas.',
  'Exportar',
  'Registrar asistencia',
  // KPI row
  'Puntualidad del mes',
  '87,6 %',
  '▲ 4,2 pp vs. mes anterior',
  'Tardanzas',
  '18',
  '▼ 28,0 % vs. mes anterior',
  'Faltas',
  '4',
  '▼ 42,9 % vs. mes anterior',
  'Horas trabajadas',
  '2 568',
  '▲ 6,3 % vs. mes anterior',
  // Module tabs and attendance legend
  'Registro',
  'Resumen mensual',
  'Incidencias',
  'Justificaciones',
  'Asistió',
  'Tardanza',
  'Falta',
  'Permiso',
  // Register panel
  'Asistencia del 1 al 31 de marzo 2025',
  '17 colaboradores · 22 incidencias registradas',
  'Marzo 2025',
  'Todas las áreas',
  'Todos los turnos',
  'Todos los estados',
  'Tard.',
  'Falt.',
  'Punt.',
  'Mostrando 1 – 10 de 17 colaboradores',
  'Página 1 de 2',
  // Table cells of the export
  'Carlos Quispe',
  'Jefe de Cocina · Cocina',
  'Mañana',
  '208',
  '96,3 %',
  'María Fernández',
  '91,7 %',
  'Intermedio',
  'Lucía Bravo',
  '90,9 %',
  // Detail column
  'Marcaciones · lun 24',
  '+3 min',
  'Ingreso',
  'Horario: 08:00',
  '08:03',
  'Salida a almuerzo',
  '45 min',
  '12:58',
  'Reingreso',
  'Horario: 14:00',
  '14:02',
  'Salida',
  'Total: 13 h 03 min',
  '22:05',
  // Lower row
  'Asistencia diaria',
  'Presentes',
  '01 mar',
  '15 mar',
  '31 mar',
  'Puntualidad por área',
  '96,2 %',
  '89,4 %',
  '84,6 %',
  '100 %',
  'Barra está 15,4 pp por debajo del objetivo de 100 %.',
  'Tipos de incidencias',
  'Ver todas',
  'Permisos',
  'Vacaciones',
  '81,8 %',
  '18,2 %',
  '0,0 %'
];

function screen(canvasElement: HTMLElement): HTMLElement {
  const root = canvasElement.firstElementChild;
  expect(root).not.toBeNull();
  return root as HTMLElement;
}

export const Default: Story = {
  play: async ({ canvasElement, parameters }) => {
    // Layout guard. The `sb-main-fullscreen` class this parameter is supposed to
    // apply never reaches a body reachable from `play` in this runner: portable
    // stories render into their own container, so `document.body.className`,
    // `documentElement.className` and `canvasElement.className` are all empty here
    // (measured: `"true|||"`). The resolved parameter is asserted from the story
    // context instead, so a typo such as `{ layout: 'bogus' }` (type-loose in
    // Storybook 10.6) still fails.
    expect(parameters.layout).toBe('fullscreen');

    const content = screen(canvasElement);

    for (const text of DESIGN_TEXTS) {
      expect(content.textContent).toContain(text);
    }

    // Tab strip card: four module tabs, one selected, and the four attendance
    // states as 104px chips.
    const tabs = content.querySelectorAll('[role="tab"]');
    expect(tabs).toHaveLength(4);
    expect([...tabs].filter((tab) => tab.getAttribute('aria-selected') === 'true')).toHaveLength(1);
    expect([...tabs][0].getAttribute('aria-selected')).toBe('true');
    const states = content.querySelectorAll('[data-tab-strip] [data-estado]');
    expect(states).toHaveLength(4);
    expect([...states].map((state) => state.getAttribute('data-estado'))).toEqual([
      'Asistió',
      'Tardanza',
      'Falta',
      'Permiso'
    ]);

    // Register panel: seven labelled columns, ten rows of eight cells each.
    const register = content.querySelector('[data-panel="Asistencia del 1 al 31 de marzo 2025"]');
    expect(register).not.toBeNull();
    const panel = register as HTMLElement;
    expect(panel.querySelectorAll('[role="columnheader"]')).toHaveLength(7);
    const rows = panel.querySelectorAll('[role="rowgroup"] [role="row"]');
    // The column header row plus the ten collaborator rows.
    expect(rows).toHaveLength(11);
    expect(panel.querySelectorAll('[role="rowgroup"] [role="cell"]')).toHaveLength(10 * 8);
    expect(panel.querySelector('input[placeholder="Buscar colaborador…"]')).not.toBeNull();

    // Badge tones are data: the export paints a neutral tardanzas badge for a zero
    // count and a warning punctuality badge below 96 %, while rows that agree with
    // the library's hard-coded tones keep them.
    const dataRows = [...rows].slice(1);
    expect(dataRows).toHaveLength(10);
    const badgesOf = (row: Element) => [...row.querySelectorAll('[role="cell"] [data-tone]')] as HTMLElement[];
    expect(dataRows.map((row) => badgesOf(row).length)).toEqual(Array(10).fill(2));
    const paint = (element: HTMLElement) => getComputedStyle(element).backgroundColor;
    // Ana Torres (zero tardanzas) and María Fernández (91,7 % punctuality) are the
    // two cells the design repaints away from the library tones.
    expect(paint(badgesOf(dataRows[3])[0])).not.toBe(paint(badgesOf(dataRows[0])[0]));
    expect(paint(badgesOf(dataRows[1])[1])).not.toBe(paint(badgesOf(dataRows[0])[1]));
    expect(paint(badgesOf(dataRows[1])[0])).toBe(paint(badgesOf(dataRows[0])[0]));
    expect(paint(badgesOf(dataRows[3])[1])).toBe(paint(badgesOf(dataRows[0])[1]));

    // Detail column: the identity card pill, the March grid and four markings.
    expect(content.querySelectorAll('[data-panel="Ficha colaborador"] [data-estado]')).toHaveLength(1);
    const calendar = content.querySelector('[data-panel="Ficha colaborador"]') as HTMLElement;
    expect(calendar.querySelectorAll('[data-cell]')).toHaveLength(6 * 7);
    expect(calendar.querySelectorAll('[data-day-number]')).toHaveLength(31);
    const markings = content.querySelector('[data-panel="Marcaciones · lun 24"]') as HTMLElement;
    expect(markings.querySelectorAll('[data-marking]')).toHaveLength(4);
    expect(markings.querySelectorAll('[data-marking-tone]')).toHaveLength(4);

    // Daily chart: 31 day columns of a present bar plus the day's incident.
    const columns = content.querySelectorAll('[data-daily-column]');
    expect(columns).toHaveLength(31);
    expect(content.querySelectorAll('[data-daily-segment="presente"]')).toHaveLength(31);
    expect(content.querySelectorAll('[data-daily-segment="tardanza"]')).toHaveLength(18);
    expect(content.querySelectorAll('[data-daily-segment="falta"]')).toHaveLength(4);
    expect(content.querySelectorAll('[data-panel="Asistencia diaria"] [data-legend]')).toHaveLength(3);

    // Punctuality meters: five tracks with the share the export fills.
    const bars = content.querySelectorAll('[role="progressbar"]');
    expect(bars).toHaveLength(5);
    expect([...bars].map((bar) => bar.getAttribute('aria-valuenow'))).toEqual([
      '96.2',
      '89.4',
      '84.6',
      '100',
      '100'
    ]);
    const fills = [...content.querySelectorAll('[data-meter-fill]')].map((fill) =>
      Math.round(fill.getBoundingClientRect().width)
    );
    // The shared card model spends 2px on the surface border, so the 344px track of
    // the export measures 342 here and each fill scales with it.
    expect(fills).toEqual([329, 306, 289, 342, 342]);

    // Incident donut: two painted arcs over a hole carrying the 22 of the month.
    expect(content.querySelectorAll('[data-arc]')).toHaveLength(2);
    expect(content.querySelector('[data-total]')?.textContent).toBe('22');
    expect(content.querySelectorAll('[data-donut-breakdown] [data-legend]')).toHaveLength(4);

    // Geometry of the export: 279x138 KPI cards, a 796px register panel over a
    // 344px detail column and three 376px panels in the lower row.
    const kpiCards = content.querySelectorAll('[data-kpi-card]');
    expect(kpiCards).toHaveLength(4);
    expect(kpiCards[0].getBoundingClientRect().width).toBe(279);
    expect(kpiCards[0].getBoundingClientRect().height).toBe(138);

    expect(panel.getBoundingClientRect().width).toBe(796);
    expect(panel.getBoundingClientRect().height).toBe(508);
    expect(content.querySelector('[data-panel="Ficha colaborador"]')?.getBoundingClientRect().height).toBe(290);
    expect(content.querySelector('[data-panel="Marcaciones · lun 24"]')?.getBoundingClientRect().height).toBe(206);
    for (const label of ['Asistencia diaria', 'Puntualidad por área', 'Tipos de incidencias']) {
      const lower = content.querySelector(`[data-panel="${label}"]`) as HTMLElement;
      expect(lower.getBoundingClientRect().width).toBe(376);
      expect(lower.getBoundingClientRect().height).toBe(277);
    }
    expect(rows[1].getBoundingClientRect().height).toBe(32);
    expect(rows[0].getBoundingClientRect().height).toBe(30);
    expect(content.querySelector('[data-tab-strip]')?.getBoundingClientRect().height).toBe(44);
    // The chrome is drawn once by the shared layout.
    expect(content.querySelectorAll('aside')).toHaveLength(1);
    expect(content.querySelectorAll('button[aria-label="Asistente IA"]')).toHaveLength(1);
  }
};
