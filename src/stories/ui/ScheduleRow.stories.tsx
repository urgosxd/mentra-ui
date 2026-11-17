import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ScheduleRow } from '../generated/ScheduleRow';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/ScheduleRow',
  component: ScheduleRow,
  // Same ARIA context as the matrix header it sits under.
  render: (args) => (
    <div role="table" aria-label="Horarios del equipo" className="w-[764px]">
      <div role="rowgroup">
        <ScheduleRow {...args} />
      </div>
    </div>
  ),
  argTypes: {
    iniciales: { control: 'text' },
    nombre: { control: 'text' },
    cargo: { control: 'text' },
    days: { control: 'object' },
    total: { control: 'text' }
  }
} satisfies Meta<typeof ScheduleRow>;

export default meta;

type Story = StoryObj<typeof meta>;

function getRow(canvasElement: HTMLElement): HTMLElement {
  const rows = canvasElement.querySelectorAll('[role="row"]');
  expect(rows).toHaveLength(1);
  return rows[0] as HTMLElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const row = getRow(canvasElement);

    // Person cell, seven day cells and the hour total: the same column count the
    // ScheduleMatrixHeader advertises.
    const cells = Array.from(row.querySelectorAll('[role="cell"]'));
    expect(cells).toHaveLength(9);

    expect(row.textContent).toContain('Carlos Quispe');
    expect(row.textContent).toContain('Jefe de Cocina · Cocina');

    // Brand circle with the initials from the export.
    const avatar = row.querySelector('[data-avatar]') as HTMLElement;
    expect(avatar.textContent).toBe('CQ');
    expect(getComputedStyle(avatar).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(getComputedStyle(avatar.querySelector('span') as HTMLElement).color).toBe(
      tokenValue('--color-text-on-brand')
    );

    // Seven shift chips, Monday first, each carrying its shift tone.
    const chips = Array.from(row.querySelectorAll('[data-turno]'));
    expect(chips.map((chip) => chip.getAttribute('data-turno'))).toEqual([
      'Mañana',
      'Mañana',
      'Tarde',
      'Tarde',
      'Tarde',
      'Mañana',
      'Descanso'
    ]);
    expect(chips.map((chip) => chip.textContent)).toEqual([
      '08–16',
      '08–16',
      '14–22',
      '14–22',
      '14–22',
      '08–16',
      'Desc.'
    ]);

    // A chip never paints outside its day column.
    const chipWidth = chips[0].getBoundingClientRect().width;
    const dayWidth = (chips[0].parentElement as HTMLElement).getBoundingClientRect().width;
    expect(chipWidth).toBeLessThanOrEqual(dayWidth + 0.5);

    // The total closes the row, right aligned.
    const total = cells[8];
    expect(total.textContent).toBe('48 h');
    expect(getComputedStyle(total).textAlign).toBe('right');
    expect(getComputedStyle(total).color).toBe(tokenValue('--color-text-primary'));
  }
};

// The week is data: a caller supplies its own shifts and labels.
export const CustomShifts: Story = {
  args: {
    nombre: 'Lucía Ramírez',
    iniciales: 'LR',
    cargo: 'Cajera · Salón',
    total: '40 h',
    days: [
      { turno: 'Tarde', label: '14–22' },
      { turno: 'Tarde', label: '14–22' },
      { turno: 'Libre', label: 'Libre' },
      { turno: 'Noche', label: '22–06' },
      { turno: 'Noche', label: '22–06' },
      { turno: 'Descanso', label: 'Desc.' },
      { turno: 'Descanso', label: 'Desc.' }
    ]
  },
  play: async ({ canvasElement }) => {
    const row = getRow(canvasElement);
    expect(row.textContent).toContain('Lucía Ramírez');
    expect(row.textContent).toContain('40 h');

    const chips = Array.from(row.querySelectorAll('[data-turno]'));
    expect(chips.map((chip) => chip.getAttribute('data-turno'))).toEqual([
      'Tarde',
      'Tarde',
      'Libre',
      'Noche',
      'Noche',
      'Descanso',
      'Descanso'
    ]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const row = getRow(canvasElement);

    // Name, avatar and chips all move with the dark block: the row would read as a
    // frozen light row if any of them kept its light value.
    const name = row.querySelector('[data-avatar] + div span') as HTMLElement;
    expect(name.textContent).toBe('Carlos Quispe');
    expect(getComputedStyle(name).color).toBe(tokenValue('--color-text-primary'));
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-50'));

    const avatar = row.querySelector('[data-avatar]') as HTMLElement;
    expect(getComputedStyle(avatar).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(tokenValue('--color-bg-brand', 'background-color')).toBe(
      tokenValue('--color-slate-800', 'background-color')
    );

    const morningChip = row.querySelector('[data-turno="Mañana"]') as HTMLElement;
    expect(getComputedStyle(morningChip).backgroundColor).toBe(
      tokenValue('--color-shift-morning-bg', 'background-color')
    );
    expect(tokenValue('--color-shift-morning-bg', 'background-color')).toBe(
      tokenValue('--color-blue-950', 'background-color')
    );
  }
};
