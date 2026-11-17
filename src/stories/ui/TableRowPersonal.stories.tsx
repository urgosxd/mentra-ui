import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TableRowPersonal } from '../generated/TableRowPersonal';

const meta = {
  title: 'UI/TableRowPersonal',
  component: TableRowPersonal,
  parameters: { layout: 'padded' },
  args: {
    estado: 'Activo',
    documentacion: 'Completa',
    nombre: 'Ana Alvarez',
    area: 'Salón · Mozo',
    cargo: 'Mozo',
    sueldo: '1 800',
    iniciales: 'AA'
  },
  argTypes: {
    estado: { control: 'select', options: ['Activo', 'Vacaciones'] },
    documentacion: { control: 'select', options: ['Completa', 'Pendiente'] },
    nombre: { control: 'text' },
    area: { control: 'text' },
    cargo: { control: 'text' },
    sueldo: { control: 'text' },
    iniciales: { control: 'text' }
  },
  render: (args) => (
    <div role="table" aria-label="Personal" className="w-[658px]">
      <div role="rowgroup">
        <TableRowPersonal {...args} />
      </div>
    </div>
  )
} satisfies Meta<typeof TableRowPersonal>;

export default meta;

type Story = StoryObj<typeof meta>;

function getRow(canvasElement: HTMLElement) {
  const row = canvasElement.querySelector('[role="row"]') as HTMLElement;
  expect(row).not.toBeNull();
  const cells = row.querySelectorAll('[role="cell"]');
  expect(cells).toHaveLength(5);
  return { row, cells: Array.from(cells) };
}

async function expectRow(
  canvasElement: HTMLElement,
  expected: {
    estado: string;
    documentacion: string;
    tone: string;
    percent: number;
    docs: string;
  }
) {
  const { row, cells } = getRow(canvasElement);

  expect(row.getAttribute('data-estado')).toBe(expected.estado);
  expect(row.getAttribute('data-documentacion')).toBe(expected.documentacion);
  expect(row.textContent).toContain('Ana Alvarez');
  expect(row.textContent).toContain('Salón · Mozo');

  const badge = cells[3].querySelector('[data-tone]');
  expect(badge?.getAttribute('data-tone')).toBe(expected.tone);
  expect(badge?.textContent).toBe(expected.estado);

  const progress = cells[4].querySelector('[role="progressbar"]') as HTMLElement | null;
  expect(progress).not.toBeNull();
  const bar = progress as HTMLElement;
  expect(bar.getAttribute('aria-valuenow')).toBe(String(expected.percent));
  expect((bar.firstElementChild as HTMLElement).style.width).toBe(`${expected.percent}%`);
  expect(cells[4].textContent).toContain(expected.docs);
}

export const ActivoCompleta: Story = {
  play: async ({ canvasElement }) => {
    await expectRow(canvasElement, {
      estado: 'Activo',
      documentacion: 'Completa',
      tone: 'Positivo',
      percent: 100,
      docs: '3/3'
    });
  }
};

export const ActivoPendiente: Story = {
  args: { documentacion: 'Pendiente' },
  play: async ({ canvasElement }) => {
    await expectRow(canvasElement, {
      estado: 'Activo',
      documentacion: 'Pendiente',
      tone: 'Positivo',
      percent: 60,
      docs: '3/5'
    });
  }
};

export const VacacionesCompleta: Story = {
  args: { estado: 'Vacaciones' },
  play: async ({ canvasElement }) => {
    await expectRow(canvasElement, {
      estado: 'Vacaciones',
      documentacion: 'Completa',
      tone: 'Advertencia',
      percent: 100,
      docs: '3/3'
    });
  }
};

export const VacacionesPendiente: Story = {
  args: { estado: 'Vacaciones', documentacion: 'Pendiente' },
  play: async ({ canvasElement }) => {
    await expectRow(canvasElement, {
      estado: 'Vacaciones',
      documentacion: 'Pendiente',
      tone: 'Advertencia',
      percent: 60,
      docs: '3/5'
    });
  }
};

// Explicit copy/percent win over the documentación-derived defaults.
export const Overrides: Story = {
  args: { docsLabel: '2/4', docsPercent: 50 },
  play: async ({ canvasElement }) => {
    const { cells } = getRow(canvasElement);
    const progress = cells[4].querySelector('[role="progressbar"]');
    expect(progress?.getAttribute('aria-valuenow')).toBe('50');
    expect(cells[4].textContent).toContain('2/4');
  }
};

export const AllStates: Story = {
  render: () => (
    <div role="table" aria-label="Personal" className="w-[658px]">
      <div role="rowgroup">
        <TableRowPersonal />
        <TableRowPersonal documentacion="Pendiente" />
        <TableRowPersonal estado="Vacaciones" />
        <TableRowPersonal estado="Vacaciones" documentacion="Pendiente" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = Array.from(canvasElement.querySelectorAll('[role="row"]'));
    expect(
      rows.map((row) => [row.getAttribute('data-estado'), row.getAttribute('data-documentacion')])
    ).toEqual([
      ['Activo', 'Completa'],
      ['Activo', 'Pendiente'],
      ['Vacaciones', 'Completa'],
      ['Vacaciones', 'Pendiente']
    ]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    await expectRow(canvasElement, {
      estado: 'Activo',
      documentacion: 'Completa',
      tone: 'Positivo',
      percent: 100,
      docs: '3/3'
    });
  }
};
