import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PersonCell } from '../generated/PersonCell';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/PersonCell',
  component: PersonCell,
  args: { iniciales: 'CQ', nombre: 'Carlos Quispe', cargo: 'Jefe de Cocina · Cocina' },
  argTypes: {
    iniciales: { control: 'text' },
    nombre: { control: 'text' },
    cargo: { control: 'text' }
  }
} satisfies Meta<typeof PersonCell>;

export default meta;

type Story = StoryObj<typeof meta>;

function getCell(canvasElement: HTMLElement) {
  const cells = canvasElement.querySelectorAll('[data-person-cell]');
  expect(cells).toHaveLength(1);
  const cell = cells[0] as HTMLElement;

  const avatar = cell.querySelector('[data-person-avatar]') as HTMLElement | null;
  const name = cell.querySelector('[data-person-name]') as HTMLElement | null;
  const role = cell.querySelector('[data-person-role]') as HTMLElement | null;
  if (avatar === null || name === null || role === null) {
    throw new Error('the cell is missing its avatar, name or role');
  }

  return { cell, avatar, name, role };
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const { cell, avatar, name, role } = getCell(canvasElement);

    expect(avatar.textContent).toBe('CQ');
    expect(name.textContent).toBe('Carlos Quispe');
    expect(role.textContent).toBe('Jefe de Cocina · Cocina');

    // Row of avatar + stacked texts, 8px apart, 252 wide in the export.
    expect(getComputedStyle(cell).display).toBe('flex');
    expect(getComputedStyle(cell).alignItems).toBe('center');
    expect(getComputedStyle(cell).gap).toBe('8px');
    expect(cell.getBoundingClientRect().width).toBe(252);

    // 32px brand circle holding the initials in the on-brand tone.
    expect(getComputedStyle(avatar).width).toBe('32px');
    expect(getComputedStyle(avatar).height).toBe('32px');
    expect(getComputedStyle(avatar).borderRadius).toBe('999px');
    expect(getComputedStyle(avatar).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(tokenValue('--color-bg-brand', 'background-color')).toBe(
      tokenValue('--color-brand-800', 'background-color')
    );
    const initials = avatar.querySelector('span') as HTMLElement;
    expect(getComputedStyle(initials).color).toBe(tokenValue('--color-text-on-brand'));
    expect(tokenValue('--color-text-on-brand')).toBe(tokenValue('--color-neutral-0'));
    expect(getComputedStyle(initials).fontSize).toBe('10px');
    expect(getComputedStyle(initials).fontWeight).toBe('600');

    // Name 12px semibold primary, role 10px secondary.
    expect(getComputedStyle(name).fontSize).toBe('12px');
    expect(getComputedStyle(name).fontWeight).toBe('600');
    expect(getComputedStyle(name).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(role).fontSize).toBe('10px');
    expect(getComputedStyle(role).color).toBe(tokenValue('--color-text-secondary'));
  }
};

// The design repeats the cell inside table rows: props drive every text slot.
export const TwoPeople: Story = {
  render: () => (
    <div className="flex flex-col gap-2 bg-(--color-bg-canvas) p-4">
      <PersonCell iniciales="CQ" nombre="Carlos Quispe" cargo="Jefe de Cocina · Cocina" />
      <PersonCell iniciales="LM" nombre="Lucía Márquez" cargo="Cajera · Barra" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const cells = Array.from(canvasElement.querySelectorAll('[data-person-cell]'));
    expect(cells).toHaveLength(2);

    expect(cells.map((cell) => cell.querySelector('[data-person-avatar]')?.textContent)).toEqual([
      'CQ',
      'LM'
    ]);
    expect(cells.map((cell) => cell.querySelector('[data-person-name]')?.textContent)).toEqual([
      'Carlos Quispe',
      'Lucía Márquez'
    ]);
    expect(cells.map((cell) => cell.querySelector('[data-person-role]')?.textContent)).toEqual([
      'Jefe de Cocina · Cocina',
      'Cajera · Barra'
    ]);
    // Both cells keep the brand circle and the 32px size.
    expect(
      cells.map((cell) => getComputedStyle(cell.querySelector('[data-person-avatar]') as HTMLElement).width)
    ).toEqual(['32px', '32px']);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const { avatar, name, role } = getCell(canvasElement);
    expect(name.textContent).toBe('Carlos Quispe');

    // Every tone of the cell flips in the dark block: brand-800 -> slate-800,
    // neutral-900 -> neutral-50, neutral-500 -> slate-400, neutral-0 -> neutral-50.
    expect(getComputedStyle(avatar).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(getComputedStyle(avatar).backgroundColor).toBe(
      tokenValue('--color-slate-800', 'background-color')
    );
    const initials = avatar.querySelector('span') as HTMLElement;
    expect(getComputedStyle(initials).color).toBe(tokenValue('--color-text-on-brand'));
    expect(getComputedStyle(initials).color).toBe(tokenValue('--color-neutral-50'));
    expect(getComputedStyle(name).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(name).color).toBe(tokenValue('--color-neutral-50'));
    expect(getComputedStyle(role).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(role).color).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(avatar).borderRadius).toBe('999px');
  }
};
