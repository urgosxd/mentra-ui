import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TableRowAsistencia } from '../generated/TableRowAsistencia';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/TableRowAsistencia',
  component: TableRowAsistencia,
  parameters: { layout: 'padded' },
  args: {
    iniciales: 'CQ',
    nombre: 'Carlos Quispe',
    cargo: 'Jefe de Cocina · Cocina',
    turno: 'Mañana',
    dias: '26',
    tardanzas: '1',
    faltas: '0',
    horas: '208',
    puntualidad: '96,3 %'
  },
  argTypes: {
    iniciales: { control: 'text' },
    nombre: { control: 'text' },
    cargo: { control: 'text' },
    turno: { control: 'text' },
    dias: { control: 'text' },
    tardanzas: { control: 'text' },
    faltas: { control: 'text' },
    horas: { control: 'text' },
    puntualidad: { control: 'text' }
  },
  render: (args) => (
    <div role="table" aria-label="Asistencia" className="w-[764px]">
      <div role="rowgroup">
        <TableRowAsistencia {...args} />
      </div>
    </div>
  )
} satisfies Meta<typeof TableRowAsistencia>;

export default meta;

type Story = StoryObj<typeof meta>;

function getRow(canvasElement: HTMLElement) {
  const row = canvasElement.querySelector('[role="row"]') as HTMLElement;
  expect(row).not.toBeNull();
  const cells = Array.from(row.querySelectorAll<HTMLElement>('[role="cell"]'));
  // Six data columns plus the chevron column the design composes in the row.
  expect(cells).toHaveLength(8);
  return { row, cells };
}

async function expectFilledRow(canvasElement: HTMLElement) {
  const { row, cells } = getRow(canvasElement);

  // Density and divider the design fixes for every row.
  expect(Math.round(row.getBoundingClientRect().height)).toBe(32);
  const rowStyle = getComputedStyle(row);
  expect(rowStyle.borderBottomWidth).toBe('1px');
  expect(rowStyle.borderBottomColor).toBe(tokenValue('--color-border-divider'));
  expect(rowStyle.gridTemplateColumns).toBe('200px 76px 52px 56px 52px 56px 78px 14px');

  // Column 1: identity block with the brand avatar and the two text lines.
  expect(cells[0].textContent).toContain('Carlos Quispe');
  expect(cells[0].textContent).toContain('Jefe de Cocina · Cocina');
  const avatar = cells[0].querySelector('[data-avatar]') as HTMLElement | null;
  expect(avatar).not.toBeNull();
  const avatarRect = (avatar as HTMLElement).getBoundingClientRect();
  expect(Math.round(avatarRect.width)).toBe(26);
  expect(Math.round(avatarRect.height)).toBe(26);
  expect(getComputedStyle(avatar as HTMLElement).backgroundColor).toBe(
    tokenValue('--color-bg-brand', 'background-color')
  );
  expect(getComputedStyle(avatar as HTMLElement).borderRadius).toBe('999px');
  const initials = cells[0].querySelector('[data-avatar] span') as HTMLElement;
  expect(initials.textContent).toBe('CQ');
  expect(getComputedStyle(initials).fontSize).toBe('10px');
  expect(getComputedStyle(initials).color).toBe(tokenValue('--color-text-on-brand'));

  const nombre = cells[0].querySelector('[data-name]') as HTMLElement;
  const cargo = cells[0].querySelector('[data-cargo]') as HTMLElement;
  expect(nombre.textContent).toBe('Carlos Quispe');
  expect(cargo.textContent).toBe('Jefe de Cocina · Cocina');
  expect(getComputedStyle(nombre).color).toBe(tokenValue('--color-text-primary'));
  expect(getComputedStyle(cargo).color).toBe(tokenValue('--color-text-secondary'));

  // Columns 2 to 6: turno and días are plain text, tardanzas is a warning badge,
  // faltas and horas are plain text again — exactly the mix the design draws.
  expect(cells[1].textContent).toBe('Mañana');
  expect(getComputedStyle(cells[1]).color).toBe(tokenValue('--color-text-secondary'));
  expect(cells[2].textContent).toBe('26');
  expect(getComputedStyle(cells[2]).color).toBe(tokenValue('--color-text-primary'));
  expect(cells[4].textContent).toBe('0');
  expect(getComputedStyle(cells[4]).color).toBe(tokenValue('--color-text-primary'));
  expect(cells[5].textContent).toBe('208');
  expect(getComputedStyle(cells[5]).color).toBe(tokenValue('--color-text-primary'));

  const tardanzas = cells[3].querySelector('[data-tone]') as HTMLElement;
  expect(tardanzas.getAttribute('data-tone')).toBe('Advertencia');
  expect(tardanzas.textContent).toBe('1');
  expect(getComputedStyle(tardanzas).backgroundColor).toBe(
    tokenValue('--color-feedback-warning-bg', 'background-color')
  );
  expect(getComputedStyle(tardanzas.firstElementChild as HTMLElement).color).toBe(
    tokenValue('--color-text-warning')
  );

  const puntualidad = cells[6].querySelector('[data-tone]') as HTMLElement;
  expect(puntualidad.getAttribute('data-tone')).toBe('Positivo');
  expect(puntualidad.textContent).toBe('96,3 %');
  expect(getComputedStyle(puntualidad).backgroundColor).toBe(
    tokenValue('--color-feedback-success-bg', 'background-color')
  );
  expect(getComputedStyle(puntualidad.firstElementChild as HTMLElement).color).toBe(
    tokenValue('--color-text-success')
  );

  // Column 8: the disclosure chevron, painted with icon/muted.
  const chevron = cells[7].querySelector('svg') as SVGSVGElement | null;
  expect(chevron).not.toBeNull();
  expect(Math.round((chevron as SVGSVGElement).getBoundingClientRect().width)).toBe(12);
  expect(getComputedStyle(chevron as SVGSVGElement).color).toBe(
    tokenValue('--color-icon-muted')
  );
}

export const Filled: Story = {
  play: async ({ canvasElement }) => {
    await expectFilledRow(canvasElement);
  }
};

// The placeholder values from the design are the defaults, so the bare export is
// the same row the design file composes.
export const DesignDefaults: Story = {
  render: () => (
    <div role="table" aria-label="Asistencia" className="w-[764px]">
      <div role="rowgroup">
        <TableRowAsistencia />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const { row, cells } = getRow(canvasElement);
    expect(row.textContent).toContain('Carlos Quispe');
    expect(row.textContent).toContain('Jefe de Cocina · Cocina');
    expect(cells[1].textContent).toBe('Mañana');
    expect(cells[2].textContent).toBe('26');
    expect(cells[3].textContent).toBe('1');
    expect(cells[4].textContent).toBe('0');
    expect(cells[5].textContent).toBe('208');
    expect(cells[6].textContent).toBe('96,3 %');
  }
};

// Cell copy is prop-driven: every text column follows its own prop.
export const CustomValues: Story = {
  args: {
    iniciales: 'MR',
    nombre: 'María Rojas',
    cargo: 'Mozo · Salón',
    turno: 'Tarde',
    dias: '24',
    tardanzas: '3',
    faltas: '2',
    horas: '192',
    puntualidad: '88,5 %'
  },
  play: async ({ canvasElement }) => {
    const { cells } = getRow(canvasElement);
    expect(cells[0].textContent).toContain('María Rojas');
    expect(cells[0].textContent).toContain('Mozo · Salón');
    expect(cells[0].querySelector('[data-avatar] span')?.textContent).toBe('MR');
    expect(cells[1].textContent).toBe('Tarde');
    expect(cells[2].textContent).toBe('24');
    expect(cells[3].textContent).toBe('3');
    expect(cells[4].textContent).toBe('2');
    expect(cells[5].textContent).toBe('192');
    expect(cells[6].textContent).toBe('88,5 %');
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const { row, cells } = getRow(canvasElement);
    expect(row.textContent).toContain('Carlos Quispe');

    // Divider, avatar and both text tiers come from the dark block; the row keeps
    // its density and the badge tones keep their semantic fills.
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-border-divider'));
    expect(tokenValue('--color-border-divider')).toBe(tokenValue('--color-slate-800'));

    const avatar = cells[0].querySelector('[data-avatar]') as HTMLElement;
    expect(getComputedStyle(avatar).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(tokenValue('--color-bg-brand', 'background-color')).toBe(
      tokenValue('--color-slate-800', 'background-color')
    );

    const nombre = cells[0].querySelector('[data-name]') as HTMLElement;
    expect(getComputedStyle(nombre).color).toBe(tokenValue('--color-text-primary'));
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-50'));

    const tardanzas = cells[3].querySelector('[data-tone]') as HTMLElement;
    expect(getComputedStyle(tardanzas).backgroundColor).toBe(
      tokenValue('--color-feedback-warning-bg', 'background-color')
    );
    expect(tokenValue('--color-feedback-warning-bg', 'background-color')).toBe(
      tokenValue('--color-amber-950', 'background-color')
    );

    const chevron = cells[7].querySelector('svg') as SVGSVGElement;
    expect(getComputedStyle(chevron).color).toBe(tokenValue('--color-icon-muted'));
    expect(tokenValue('--color-icon-muted')).toBe(tokenValue('--color-slate-400'));
  }
};
