import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { horarios } from '../../prototype/fixtures/horarios';
import { Horarios } from '../../prototype/screens/Horarios';

const meta = {
  title: 'Pages/03 · Horarios',
  component: Horarios,
  parameters: { layout: 'fullscreen' },
  args: { data: horarios },
  render: (args) => (
    <div className="h-[1180px] w-[1440px] bg-(--color-bg-canvas)">
      <Horarios {...args} />
    </div>
  )
} satisfies Meta<typeof Horarios>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Copy the design draws in frame 1462934304:56, verbatim, region by region. */
const DESIGN_TEXTS = [
  // Topbar chrome
  'Horarios · Planificación semanal',
  '1 – 31 Mar 2025',
  'Gerencia',
  // Page header + actions
  'RRHH / Horarios',
  'Horarios',
  'Planifica y controla los horarios de tu equipo por semana, área y turno.',
  'Opciones',
  'Crear horario',
  // KPI row
  'Total de colaboradores',
  'Activos 15 · Vacaciones 1 · Suspendidos 1',
  'Horas programadas',
  '▲ 2,5 % vs. semana anterior',
  'Horas extra',
  '▲ 50,0 % vs. semana anterior',
  'Cobertura de turnos',
  '42 de 42 turnos cubiertos',
  // Module tabs and shift legend
  'Vista de horario',
  'Turnos y plantillas',
  'Control de horas',
  'Reportes',
  'Turnos:',
  'Descanso',
  'Libre',
  // Week panel
  'Semana 24 – 30 de marzo 2025 · 10 de 17 colaboradores',
  'Hoy',
  'Todas las áreas',
  'Todos los turnos',
  'Semana',
  '⎙ Imprimir',
  'Colaborador / cargo',
  'Lun',
  'Dom',
  'Total',
  'Haz clic en una celda para cambiar el turno asignado',
  'Mostrando 1 – 10 de 17',
  // Assign-shift panel
  'Asignar o editar turno',
  'Colaborador',
  'Fecha',
  '24/03/2025',
  'Turno',
  'Mañana',
  'Observaciones',
  'Cancelar',
  'Guardar turno',
  // Shift templates panel
  'Turnos predefinidos',
  'Gestionar',
  '08:00 – 16:00 · 8 h',
  '14:00 – 22:00 · 8 h',
  '16:00 – 00:00 · 8 h',
  // Area summary panel
  'Resumen por área',
  'Ver todas',
  'Cocina',
  'Salón',
  'Barra',
  'Caja',
  'Administración',
  '3,3 %',
  '0,0 %',
  '2,9 %',
  'Barra concentra el 22 % de las horas extra de la semana.',
  // Coverage panel
  '100 %',
  // Alerts panel
  'Alertas y observaciones',
  '3 turnos sin cubrir',
  'Revisar personal de salón para el 29/03',
  '24/03',
  '2 solicitudes de cambio',
  'Pendiente de aprobación',
  '1 colaborador con horas extra',
  'Luis Mamani (+4 h esta semana)',
  'Recordatorio',
  'Revisar vacaciones de abril',
  '22/03'
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

    // Header actions, module tabs and the shift-tone legend.
    const tabs = content.querySelectorAll('[role="tab"]');
    expect(tabs).toHaveLength(4);
    expect([...tabs].filter((tab) => tab.getAttribute('aria-selected') === 'true')).toHaveLength(1);
    expect(content.querySelectorAll('[data-turno]')).toHaveLength(7 * 10 + 5);

    // Ten collaborator rows under the matrix header, seven day cells each.
    const weekPanel = content.querySelector('[data-panel="Semana 24 – 30 de marzo 2025 · 10 de 17 colaboradores"]');
    expect(weekPanel).not.toBeNull();
    const matrix = content.querySelector('[role="table"]');
    const matrixRows = matrix?.querySelectorAll('[role="rowgroup"] [role="row"]') ?? [];
    // The column-header row plus the ten collaborator rows.
    expect(matrixRows).toHaveLength(11);
    expect(matrix?.querySelectorAll('[role="columnheader"]')).toHaveLength(9);
    expect(matrix?.querySelectorAll('[role="rowgroup"] [role="cell"]')).toHaveLength(10 * 9);
    expect(content.textContent).toContain('Carlos Quispe');
    expect(content.textContent).toContain('Lucía Bravo');
    expect(content.textContent).toContain('08–16');
    expect(content.textContent).toContain('16–00');
    expect(content.textContent).toContain('48 h');
    expect(content.textContent).toContain('40 h');

    // Four KPI cards, four shift templates, four alerts, six summary rows.
    expect(content.querySelectorAll('[data-kpi-card]')).toHaveLength(4);
    expect(content.querySelectorAll('[data-tono]')).toHaveLength(3);
    // `data-tone` marks both the alert rows and every badge, so each is scoped.
    expect(content.querySelectorAll('[data-panel="Alertas y observaciones"] [data-tone]')).toHaveLength(4);
    expect(content.querySelectorAll('[data-panel="Resumen por área"] [data-tone]')).toHaveLength(5);
    const summaryRows = content.querySelectorAll('[data-panel="Resumen por área"] [role="row"]');
    expect(summaryRows).toHaveLength(7);

    // Coverage chart: seven day columns over a five-area legend.
    expect(content.querySelectorAll('[data-coverage-column]')).toHaveLength(7);
    expect(content.querySelectorAll('[data-legend]')).toHaveLength(5);

    // The search-free form of the design still needs its four field captions.
    const fields = content.querySelectorAll('input');
    expect(fields).toHaveLength(2);
    expect(content.querySelector('input[placeholder="Agregar observaciones…"]')).not.toBeNull();

    // Geometry of the export: 279px KPI cards, a 796px week panel over a 344px
    // side column, and three 376px panels in the lower row.
    const kpiCards = content.querySelectorAll('[data-kpi-card]');
    expect(kpiCards[0].getBoundingClientRect().width).toBe(279);
    expect(kpiCards[0].getBoundingClientRect().height).toBe(138);

    expect(weekPanel?.getBoundingClientRect().width).toBe(796);
    expect(content.querySelector('[data-panel="Asignar o editar turno"]')?.getBoundingClientRect().width).toBe(344);
    expect(content.querySelector('[data-panel="Turnos predefinidos"]')?.getBoundingClientRect().width).toBe(344);
    expect(content.querySelector('[data-panel="Resumen por área"]')?.getBoundingClientRect().width).toBe(376);
    expect(content.querySelector('[data-panel="Cobertura de turnos"]')?.getBoundingClientRect().width).toBe(376);
    expect(content.querySelector('[data-panel="Alertas y observaciones"]')?.getBoundingClientRect().width).toBe(376);
    expect(matrixRows[1].getBoundingClientRect().width).toBe(764);

    // The chrome is drawn once by the shared layout.
    expect(content.querySelectorAll('aside')).toHaveLength(1);
    expect(content.querySelectorAll('button[aria-label="Asistente IA"]')).toHaveLength(1);
  }
};
