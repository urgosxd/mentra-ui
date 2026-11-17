import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { BarColumn } from '../generated/BarColumn';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/BarColumn',
  component: BarColumn,
  args: { valor: '17', dia: 'Lun' },
  argTypes: {
    valor: { control: 'text' },
    dia: { control: 'text' },
    segments: { control: 'object' },
    trackHeight: { control: 'number' }
  }
} satisfies Meta<typeof BarColumn>;

export default meta;

type Story = StoryObj<typeof meta>;

function segments(canvasElement: HTMLElement): HTMLElement[] {
  const found = Array.from(canvasElement.querySelectorAll('[data-segment]')) as HTMLElement[];
  expect(found.length).toBeGreaterThan(0);
  return found;
}

function track(canvasElement: HTMLElement): HTMLElement {
  const found = canvasElement.querySelector('[data-track]') as HTMLElement | null;
  expect(found).not.toBeNull();
  return found as HTMLElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // Valor above the bar, día below it.
    expect(canvasElement.querySelector('[data-valor]')?.textContent).toBe('17');
    expect(canvasElement.querySelector('[data-dia]')?.textContent).toBe('Lun');

    // The bar area is the design's 193px column and the three segments fill it.
    expect(getComputedStyle(track(canvasElement)).height).toBe('193px');

    const painted = segments(canvasElement);
    expect(painted.map((segment) => segment.getAttribute('data-series'))).toEqual(['1', '2', '3']);

    // Each segment height is its own share of the stack (64 / 64 / 65), not a
    // pixel height copied from the mock.
    const heights = painted.map((segment) => Number.parseFloat(segment.style.height));
    expect(heights[0]).toBeCloseTo((64 / 193) * 100, 2);
    expect(heights[1]).toBeCloseTo((64 / 193) * 100, 2);
    expect(heights[2]).toBeCloseTo((65 / 193) * 100, 2);
    expect(heights[0] + heights[1] + heights[2]).toBeCloseTo(100, 2);

    // Series colours come from the chart ramp; only the outer ends are rounded.
    expect(getComputedStyle(painted[0]).backgroundColor).toBe(
      tokenValue('--color-chart-series-1', 'background-color')
    );
    expect(getComputedStyle(painted[1]).backgroundColor).toBe(
      tokenValue('--color-chart-series-2', 'background-color')
    );
    expect(getComputedStyle(painted[2]).backgroundColor).toBe(
      tokenValue('--color-chart-series-3', 'background-color')
    );
    expect(getComputedStyle(painted[0]).borderTopLeftRadius).toBe('2px');
    expect(getComputedStyle(painted[0]).borderTopRightRadius).toBe('2px');
    expect(getComputedStyle(painted[0]).borderBottomLeftRadius).toBe('0px');
    expect(getComputedStyle(painted[1]).borderTopLeftRadius).toBe('0px');
    expect(getComputedStyle(painted[1]).borderBottomLeftRadius).toBe('0px');
    expect(getComputedStyle(painted[2]).borderBottomLeftRadius).toBe('2px');
    expect(getComputedStyle(painted[2]).borderBottomRightRadius).toBe('2px');
    expect(getComputedStyle(painted[2]).borderTopLeftRadius).toBe('0px');

    // Both labels use the secondary text role.
    const valor = canvasElement.querySelector('[data-valor]') as HTMLElement;
    const dia = canvasElement.querySelector('[data-dia]') as HTMLElement;
    expect(getComputedStyle(valor).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(dia).color).toBe(tokenValue('--color-text-secondary'));
  }
};

// Uneven values are the normal case: the segment proportions must follow the data.
export const Proporciones: Story = {
  args: {
    valor: '100',
    segments: [
      { series: 1, value: 30 },
      { series: 2, value: 10 },
      { series: 3, value: 60 }
    ]
  },
  play: async ({ canvasElement }) => {
    const heights = segments(canvasElement).map((segment) =>
      Number.parseFloat(segment.style.height)
    );
    expect(heights).toHaveLength(3);
    expect(heights[0]).toBeCloseTo(30, 2);
    expect(heights[1]).toBeCloseTo(10, 2);
    expect(heights[2]).toBeCloseTo(60, 2);
    expect(getComputedStyle(track(canvasElement)).height).toBe('193px');
  }
};

// A taller column keeps the same proportions inside the new bar area.
export const BarraAlta: Story = {
  args: { trackHeight: 300, valor: '24' },
  play: async ({ canvasElement }) => {
    expect(getComputedStyle(track(canvasElement)).height).toBe('300px');
    const heights = segments(canvasElement).map((segment) =>
      Number.parseFloat(segment.style.height)
    );
    expect(heights[0] + heights[1] + heights[2]).toBeCloseTo(100, 2);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    expect(canvasElement.querySelector('[data-valor]')?.textContent).toBe('17');
    expect(canvasElement.querySelector('[data-dia]')?.textContent).toBe('Lun');

    // The dark block only redefines the text role; the chart ramp is shared.
    const valor = canvasElement.querySelector('[data-valor]') as HTMLElement;
    expect(getComputedStyle(valor).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(valor).color).toBe(tokenValue('--color-slate-400'));
    const painted = segments(canvasElement);
    expect(getComputedStyle(painted[0]).backgroundColor).toBe(
      tokenValue('--color-chart-series-1', 'background-color')
    );
  }
};
