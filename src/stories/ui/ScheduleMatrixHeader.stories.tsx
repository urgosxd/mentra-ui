import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ScheduleMatrixHeader } from '../generated/ScheduleMatrixHeader';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/ScheduleMatrixHeader',
  component: ScheduleMatrixHeader,
  // The export is the header row of a schedule matrix; the table/rowgroup wrapper
  // is the caller's job, so the story provides the ARIA context it needs.
  render: (args) => (
    <div role="table" aria-label="Horarios del equipo" className="w-[764px]">
      <div role="rowgroup">
        <ScheduleMatrixHeader {...args} />
      </div>
    </div>
  ),
  argTypes: {
    personLabel: { control: 'text' },
    days: { control: 'object' },
    totalLabel: { control: 'text' }
  }
} satisfies Meta<typeof ScheduleMatrixHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

function getHeaders(canvasElement: HTMLElement): HTMLElement[] {
  return Array.from(canvasElement.querySelectorAll('[role="columnheader"]'));
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // One header row with a leading person column, seven day columns and total.
    expect(canvasElement.querySelectorAll('[role="row"]')).toHaveLength(1);

    const headers = getHeaders(canvasElement);
    expect(headers).toHaveLength(9);
    expect(headers.map((header) => header.textContent)).toEqual([
      'Colaborador / cargo',
      'Lun',
      'Mar',
      'Mié',
      'Jue',
      'Vie',
      'Sáb',
      'Dom',
      'Total'
    ]);

    // The design uppercases the row through textCase; assert the computed
    // transform instead of requiring the copy to be typed in caps.
    expect(getComputedStyle(headers[0]).textTransform).toBe('uppercase');
    expect(getComputedStyle(headers[1]).textTransform).toBe('uppercase');

    const day = getComputedStyle(headers[1]);
    expect(day.fontSize).toBe('10px');
    expect(day.fontWeight).toBe('600');
    expect(day.letterSpacing).toBe('1.2px');
    expect(day.textAlign).toBe('center');
    expect(day.color).toBe(tokenValue('--color-text-secondary'));

    // Only the trailing total column is right aligned.
    expect(getComputedStyle(headers[8]).textAlign).toBe('right');
    expect(getComputedStyle(headers[0]).textAlign).not.toBe('right');
  }
};

// The week is data, not layout: a caller can label its own columns.
export const CustomDays: Story = {
  args: {
    personLabel: 'Equipo',
    days: ['Turno A', 'Turno B'],
    totalLabel: 'Hs'
  },
  play: async ({ canvasElement }) => {
    const headers = getHeaders(canvasElement);
    expect(headers.map((header) => header.textContent)).toEqual([
      'Equipo',
      'Turno A',
      'Turno B',
      'Hs'
    ]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const headers = getHeaders(canvasElement);
    expect(headers).toHaveLength(9);

    // Label colour comes from the dark block (slate-400), so a frozen light grey
    // would disappear against the dark canvas.
    expect(getComputedStyle(headers[1]).color).toBe(
      tokenValue('--color-text-secondary')
    );
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(headers[8]).textAlign).toBe('right');
  }
};
