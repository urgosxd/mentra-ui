import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { personal } from '../../prototype/fixtures/personal';
import { Personal } from '../../prototype/screens/Personal';

const meta = {
  title: 'Pages/02 · Personal',
  component: Personal,
  parameters: { layout: 'fullscreen' },
  args: { data: personal },
  render: (args) => (
    <div className="h-[1180px] w-[1440px] bg-(--color-bg-canvas)">
      <Personal {...args} />
    </div>
  )
} satisfies Meta<typeof Personal>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Copy the design draws in frame 367078803:5257, verbatim, region by region. */
const DESIGN_TEXTS = [
  '1 – 31 Mar 2025',
  'Gerencia',
  // Page header + actions
  'RRHH / Personal',
  'Personal',
  'Enviar onboarding',
  '＋ Nuevo colaborador',
  // KPI row
  'Total de colaboradores',
  '17',
  '▲ 6,3 %',
  'En planilla',
  '12',
  '70,6 % del total',
  'Fuera de planilla',
  '29,4 % del total',
  'Documentación completa',
  '82,4 %',
  '▲ 12,4 pp',
  // List panel
  'Lista de colaboradores',
  'Mostrando 1 – 10 de 17',
  'Área',
  'Cargo',
  'Tipo',
  'Estado',
  // The column headers are drawn uppercase by the CSS of the generated header row.
  'Colaborador',
  'Cargo',
  'Sueldo',
  'Estado',
  'Docs',
  'Ver organigrama',
  'Página 1 de 2',
  // Detail panel
  'Detalle del colaborador',
  'Carlos Quispe',
  'Jefe de Cocina · Cocina · Planilla',
  '+51 987 654 321 · carlos.quispe@alitasperu.com',
  'Información',
  'Documentos',
  'Contrato',
  'Capacitación',
  'Desempeño',
  'Datos personales',
  'Información laboral',
  'Editar ficha',
  'Enviar mensaje',
];
// The topbar title deliberately departs from canvas node 0:504, which carries
// `Horarios · Planificación semanal` on frame 367078803:5257 (a copy/paste leftover); 01, 03 and 04 name their own module.

function screen(canvasElement: HTMLElement): HTMLElement {
  const root = canvasElement.firstElementChild;
  expect(root).not.toBeNull();
  return root as HTMLElement;
}

export const Default: Story = {
  play: async ({ canvasElement, parameters }) => {
    // Layout guard. This runner renders stories through portable stories, where the
    // preview never applies the `sb-main-*` class to the document body: with
    // `parameters.layout: 'fullscreen'` set here, `document.body.className` is still
    // empty. The resolved parameter is asserted from the story context instead, so a
    // typo such as `{ layout: 'bogus' }` (type-loose in Storybook 10.6) still fails.
    expect(parameters.layout).toBe('fullscreen');

    const content = screen(canvasElement);

    for (const text of DESIGN_TEXTS) {
      expect(content.textContent).toContain(text);
    }

    // Ten staff rows under the column header, one document bar each.
    const rows = content.querySelectorAll('[role="table"] [role="rowgroup"] [role="row"]');
    expect(rows).toHaveLength(11);
    expect(
      content.querySelectorAll('[role="progressbar"][aria-label="Documentación"]')
    ).toHaveLength(10);
    expect(content.textContent).toContain('María Fernández');
    expect(content.textContent).toContain('Lucía Bravo');
    expect(content.textContent).toContain('5/6');
    expect(content.textContent).toContain('3/4');

    // The search field draws its copy as the input placeholder.
    expect(
      content.querySelector('input[placeholder="Buscar colaborador…"]')
    ).not.toBeNull();

    // Both planilla cards close with a share ring, and only those two.
    expect(content.querySelectorAll('[role="img"][data-share-ring]')).toHaveLength(2);

    // The documentation checklist lists the five exported documents.
    expect(content.querySelectorAll('[data-document]')).toHaveLength(5);
    expect(content.textContent).toContain('5 de 5 completados');

    // Geometry of the export: 279px KPI cards over a 690px list and a 450px detail panel.
    const kpiCards = content.querySelectorAll('[data-kpi-card]');
    expect(kpiCards).toHaveLength(4);
    expect(kpiCards[0].getBoundingClientRect().width).toBe(279);
    expect(kpiCards[0].getBoundingClientRect().height).toBe(110);

    const listPanel = content.querySelector('[data-panel="Lista de colaboradores"]');
    const detailPanel = content.querySelector('[data-panel="Detalle del colaborador"]');
    expect(listPanel?.getBoundingClientRect().width).toBe(690);
    expect(detailPanel?.getBoundingClientRect().width).toBe(450);
    expect(listPanel?.getBoundingClientRect().height).toBe(898);

    // The chrome is drawn once by the shared layout.
    expect(content.querySelectorAll('aside')).toHaveLength(1);
    expect(content.querySelectorAll('button[aria-label="Asistente IA"]')).toHaveLength(1);
  }
};

export const StandaloneInertRail: Story = {
  // Pins the standalone screen: rendered outside the shell it gets no sidebar handler,
  // so the rail stays inert and only its own fixture item is `aria-current="page"`.
  play: async ({ canvasElement }) => {
    const content = screen(canvasElement);
    const user = userEvent.setup();
    await user.click(within(content).getByRole('button', { name: 'Horarios' }));
    expect(content.textContent).toContain('RRHH / Personal');
    expect(within(content).getByRole('button', { name: 'Personal' }).getAttribute('aria-current')).toBe('page');
    expect(within(content).getByRole('button', { name: 'Horarios' }).getAttribute('aria-current')).toBeNull();
  }
};
