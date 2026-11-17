import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { indicadoresVentas } from '../../prototype/fixtures/indicadores';
import { IndicadoresVentas } from '../../prototype/screens/IndicadoresVentas';

const meta = {
  title: 'Pages/01 · Indicadores · Ventas',
  component: IndicadoresVentas,
  parameters: { layout: 'fullscreen' },
  args: { data: indicadoresVentas },
  render: (args) => (
    <div className="h-[1180px] w-[1440px] bg-(--color-bg-canvas)">
      <IndicadoresVentas {...args} />
    </div>
  )
} satisfies Meta<typeof IndicadoresVentas>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Copy the design draws in frame 367078803:4393, verbatim, region by region. */
const DESIGN_TEXTS = [
  // Module tabs + KPI row
  'Ventas',
  'Ventas totales',
  'S/ 82 450',
  '▲ 8,2 % vs. mes anterior',
  'Clientes (PAX)',
  '1 940',
  'Ticket promedio',
  'S/ 42,50',
  'Órdenes',
  '2 060',
  // Panels
  'Evolución de ventas',
  'Ventas por canal',
  'Ventas por día',
  'Ventas por hora',
  'Top 10 productos',
  'Matriz BCG de la carta',
  'Categorías BCG',
  // Topbar chrome
  'Indicadores · Ventas',
  '1 – 31 Mar 2025',
  'Gerencia'
];

function screen(canvasElement: HTMLElement): HTMLElement {
  const root = canvasElement.firstElementChild;
  expect(root).not.toBeNull();
  return root as HTMLElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const content = screen(canvasElement);

    for (const text of DESIGN_TEXTS) {
      expect(content.textContent).toContain(text);
    }

    // The products ranking draws ten rows, each with its participation bar.
    expect(
      content.querySelectorAll('[role="progressbar"][aria-label="Participación en ventas"]')
    ).toHaveLength(10);
    expect(content.textContent).toContain('Mostrando 10 de 42 productos de la carta');
  }
};

// The chrome is drawn once by the shared layout: a screen that copies it would ship
// a second rail, topbar or FAB into the same 1440x1180 frame.
export const ChromeSingleton: Story = {
  play: async ({ canvasElement }) => {
    const content = screen(canvasElement);
    expect(content.getBoundingClientRect().width).toBe(1440);
    expect(content.getBoundingClientRect().height).toBe(1180);

    const sidebars = content.querySelectorAll('aside');
    expect(sidebars).toHaveLength(1);
    expect(sidebars[0].getBoundingClientRect().width).toBe(248);
    expect(sidebars[0].getBoundingClientRect().height).toBe(1180);

    const topbars = content.querySelectorAll('header');
    expect(topbars).toHaveLength(1);
    expect(topbars[0].getBoundingClientRect().width).toBe(1192);
    expect(topbars[0].getBoundingClientRect().height).toBe(64);

    const fabs = content.querySelectorAll('button[aria-label="Asistente IA"]');
    expect(fabs).toHaveLength(1);
    expect(fabs[0].getBoundingClientRect().width).toBe(54);
    expect(fabs[0].getBoundingClientRect().height).toBe(54);

    // One navigation landmark for the rail, plus the module tabs of the screen.
    expect(content.querySelectorAll('nav[aria-label="Navegación principal"]')).toHaveLength(1);
  }
};
