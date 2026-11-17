import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { MonthCalendar } from '../generated/MonthCalendar';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/MonthCalendar',
  component: MonthCalendar,
  args: { month: 3, year: 2025 },
  argTypes: {
    month: { control: { type: 'number', min: 1, max: 12 } },
    year: { control: 'number' },
    mes: { control: 'text' },
    selectedDay: { control: 'number' }
  }
} satisfies Meta<typeof MonthCalendar>;

export default meta;

type Story = StoryObj<typeof meta>;

function dayCells(canvasElement: HTMLElement): HTMLElement[] {
  return Array.from(canvasElement.querySelectorAll('[data-day]')) as HTMLElement[];
}

function cells(canvasElement: HTMLElement): HTMLElement[] {
  return Array.from(canvasElement.querySelectorAll('[data-cell]')) as HTMLElement[];
}

function weeks(canvasElement: HTMLElement): HTMLElement[] {
  return Array.from(canvasElement.querySelectorAll('[data-week]')) as HTMLElement[];
}

function dayNumber(cell: HTMLElement): HTMLElement {
  return cell.querySelector('[data-day-number]') as HTMLElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // Month label from `month`/`year`, in the export's Spanish copy.
    const mes = canvasElement.querySelector('[data-mes]') as HTMLElement;
    expect(mes.textContent).toBe('Marzo 2025');
    expect(getComputedStyle(mes).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(mes).fontSize).toBe('11px');
    expect(getComputedStyle(mes).fontWeight).toBe('600');

    // Two muted navigation chevrons, from the offline lucide set.
    const icons = Array.from(canvasElement.querySelectorAll('svg'));
    expect(icons).toHaveLength(2);
    for (const icon of icons) {
      expect(getComputedStyle(icon).color).toBe(tokenValue('--color-icon-muted'));
      expect(getComputedStyle(icon).width).toBe('12px');
    }

    // Monday-first weekday header, exactly as exported.
    const weekdays = Array.from(canvasElement.querySelectorAll('[data-weekday]'));
    expect(weekdays.map((day) => day.textContent)).toEqual(['L', 'M', 'M', 'J', 'V', 'S', 'D']);
    expect(getComputedStyle(weekdays[0] as HTMLElement).color).toBe(
      tokenValue('--color-text-secondary')
    );
    expect(getComputedStyle(weekdays[0] as HTMLElement).fontSize).toBe('10px');

    // March 2025 starts on a Saturday and has 31 days: six rows of seven cells,
    // five leading blanks, then 1..31 and six trailing blanks.
    expect(weeks(canvasElement)).toHaveLength(6);
    expect(cells(canvasElement)).toHaveLength(42);
    const days = dayCells(canvasElement);
    expect(days).toHaveLength(31);
    expect(days.map((day) => Number(day.getAttribute('data-day')))).toEqual(
      Array.from({ length: 31 }, (_, index) => index + 1)
    );
    expect(cells(canvasElement)[5].getAttribute('data-day')).toBe('1');
    expect(cells(canvasElement)[0].hasAttribute('data-day')).toBe(false);
    expect(cells(canvasElement)[35].getAttribute('data-day')).toBe('31');
    expect(cells(canvasElement)[36].hasAttribute('data-day')).toBe(false);

    // Cell height and number styling come from the export.
    expect(getComputedStyle(cells(canvasElement)[0]).height).toBe('20px');
    expect(getComputedStyle(dayNumber(days[0])).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(dayNumber(days[0])).fontSize).toBe('10px');
    expect(getComputedStyle(dayNumber(days[0])).textAlign).toBe('center');
  }
};

// The design has no highlighted cell, so the prop is what introduces one.
export const DiaSeleccionado: Story = {
  args: { selectedDay: 17 },
  play: async ({ canvasElement }) => {
    const selected = cells(canvasElement).filter(
      (cell) => cell.getAttribute('data-selected') === 'true'
    );
    expect(selected).toHaveLength(1);
    expect(selected[0].getAttribute('data-day')).toBe('17');

    const number = dayNumber(selected[0]);
    expect(number.textContent).toBe('17');
    expect(getComputedStyle(number).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(getComputedStyle(number).color).toBe(tokenValue('--color-text-on-brand'));

    // The other days keep the plain primary text role.
    const plain = dayNumber(dayCells(canvasElement)[0]);
    expect(getComputedStyle(plain).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(plain).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  }
};

// Another month proves the grid is computed from the calendar, not hardcoded:
// April 2025 starts on a Tuesday and has 30 days.
export const Abril: Story = {
  args: { month: 4 },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-mes]')?.textContent).toBe('Abril 2025');
    expect(weeks(canvasElement)).toHaveLength(5);
    const days = dayCells(canvasElement);
    expect(days).toHaveLength(30);
    expect(days[29].getAttribute('data-day')).toBe('30');
    expect(cells(canvasElement)[1].getAttribute('data-day')).toBe('1');

    // A highlighted day outside the month cannot highlight anything.
    expect(cells(canvasElement).every((cell) => cell.getAttribute('data-selected') === null)).toBe(
      true
    );
  }
};

// February 2025 is a 28-day month starting on a Saturday: five rows in total.
export const Febrero: Story = {
  args: { month: 2 },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-mes]')?.textContent).toBe('Febrero 2025');
    expect(weeks(canvasElement)).toHaveLength(5);
    expect(cells(canvasElement)).toHaveLength(35);
    expect(dayCells(canvasElement)).toHaveLength(28);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    expect(canvasElement.querySelector('[data-mes]')?.textContent).toBe('Marzo 2025');
    expect(dayCells(canvasElement)).toHaveLength(31);

    // Label, weekday letters and chevrons all move to their dark values.
    const mes = canvasElement.querySelector('[data-mes]') as HTMLElement;
    expect(getComputedStyle(mes).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(mes).color).toBe(tokenValue('--color-neutral-50'));

    const weekday = canvasElement.querySelector('[data-weekday]') as HTMLElement;
    expect(getComputedStyle(weekday).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(weekday).color).toBe(tokenValue('--color-slate-400'));

    const icon = canvasElement.querySelector('svg') as SVGElement;
    expect(getComputedStyle(icon).color).toBe(tokenValue('--color-icon-muted'));
    expect(getComputedStyle(icon).color).toBe(tokenValue('--color-slate-400'));
  }
};
