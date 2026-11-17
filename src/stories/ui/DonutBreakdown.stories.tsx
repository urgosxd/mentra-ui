import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DonutBreakdown, type DonutBreakdownSegment } from '../generated/DonutBreakdown';
import { tokenValue } from './styleProbe';

const DESIGN_SEGMENTS: DonutBreakdownSegment[] = [
  { label: 'Permisos', value: 0, series: 1 },
  { label: 'Tardanzas', value: 18, series: 2 },
  { label: 'Faltas', value: 4, series: 4 },
  { label: 'Vacaciones', value: 0, series: 5 }
];

const meta = {
  title: 'UI/DonutBreakdown',
  component: DonutBreakdown,
  args: { segments: DESIGN_SEGMENTS },
  argTypes: { segments: { control: 'object' } }
} satisfies Meta<typeof DonutBreakdown>;

export default meta;

type Story = StoryObj<typeof meta>;

type LegendRow = { label: string; value: string; percent: string };

function legendRows(canvasElement: HTMLElement): LegendRow[] {
  const rows = Array.from(canvasElement.querySelectorAll('[data-legend]'));
  expect(rows.length).toBeGreaterThan(0);

  return rows.map((row) => ({
    label: row.querySelector('[data-legend-label]')?.textContent ?? '',
    value: row.querySelector('[data-legend-value]')?.textContent ?? '',
    percent: row.querySelector('[data-legend-percent]')?.textContent ?? ''
  }));
}

function arcs(canvasElement: HTMLElement): SVGCircleElement[] {
  return Array.from(canvasElement.querySelectorAll('[data-arc]')) as SVGCircleElement[];
}

/** The `stroke-dasharray` pair, in the `pathLength` scale where the ring is 100. */
function dashPair(circle: SVGCircleElement): [number, number] {
  const parts = (circle.getAttribute('stroke-dasharray') ?? '').trim().split(/\s+/);
  expect(parts).toHaveLength(2);
  return [Number(parts[0]), Number(parts[1])];
}

function total(canvasElement: HTMLElement): string {
  return canvasElement.querySelector('[data-total]')?.textContent ?? '';
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // One legend row per segment, in design order: etiqueta, valor, porcentaje.
    expect(legendRows(canvasElement)).toEqual([
      { label: 'Permisos', value: '0', percent: '0,0 %' },
      { label: 'Tardanzas', value: '18', percent: '81,8 %' },
      { label: 'Faltas', value: '4', percent: '18,2 %' },
      { label: 'Vacaciones', value: '0', percent: '0,0 %' }
    ]);

    // The hole carries the sum of the values, not a frozen mock number.
    expect(total(canvasElement)).toBe('22');

    // Zero-valued segments draw no arc, so only Tardanzas and Faltas are painted.
    const painted = arcs(canvasElement);
    expect(painted.map((arc) => arc.getAttribute('data-series'))).toEqual(['2', '4']);

    // The arc length is the share of the total: 18/22 and 4/22.
    const [first, second] = painted.map(dashPair);
    expect(first[0]).toBeCloseTo((18 / 22) * 100, 2);
    expect(first[0] + first[1]).toBeCloseTo(100, 2);
    expect(second[0]).toBeCloseTo((4 / 22) * 100, 2);
    expect(second[0] + second[1]).toBeCloseTo(100, 2);

    // The second arc continues where the first one ends instead of restarting at 12 o'clock.
    expect(Number(painted[1].getAttribute('stroke-dashoffset'))).toBeCloseTo(-(18 / 22) * 100, 2);

    // Every arc and legend dot resolves its own chart series token.
    expect(getComputedStyle(painted[0]).stroke).toBe(tokenValue('--color-chart-series-2'));
    expect(getComputedStyle(painted[1]).stroke).toBe(tokenValue('--color-chart-series-4'));
    const dots = Array.from(canvasElement.querySelectorAll('[data-legend-dot]')).map(
      (dot) => getComputedStyle(dot).backgroundColor
    );
    expect(dots).toEqual([
      tokenValue('--color-chart-series-1', 'background-color'),
      tokenValue('--color-chart-series-2', 'background-color'),
      tokenValue('--color-chart-series-4', 'background-color'),
      tokenValue('--color-chart-series-5', 'background-color')
    ]);

    // Labels: primary, percentages: muted, and the surface makes the hole opaque.
    const label = canvasElement.querySelector('[data-legend-label]') as HTMLElement;
    const percent = canvasElement.querySelector('[data-legend-percent]') as HTMLElement;
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(percent).color).toBe(tokenValue('--color-text-muted'));
    const root = canvasElement.querySelector('[data-donut-breakdown]') as HTMLElement;
    expect(getComputedStyle(root).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
  }
};

// The values are proportions, not decoration: changing them changes both the
// percentages and the painted arc lengths.
export const Segments: Story = {
  args: {
    segments: [
      { label: 'Mañana', value: 30, series: 1 },
      { label: 'Tarde', value: 10, series: 2 }
    ]
  },
  play: async ({ canvasElement }) => {
    expect(legendRows(canvasElement)).toEqual([
      { label: 'Mañana', value: '30', percent: '75,0 %' },
      { label: 'Tarde', value: '10', percent: '25,0 %' }
    ]);
    expect(total(canvasElement)).toBe('40');

    const painted = arcs(canvasElement);
    expect(painted.map((arc) => arc.getAttribute('data-series'))).toEqual(['1', '2']);
    const [first, second] = painted.map(dashPair);
    expect(first[0]).toBeCloseTo(75, 2);
    expect(second[0]).toBeCloseTo(25, 2);
    expect(getComputedStyle(painted[0]).stroke).toBe(tokenValue('--color-chart-series-1'));
    expect(getComputedStyle(painted[1]).stroke).toBe(tokenValue('--color-chart-series-2'));
  }
};

// Every value at zero is a real state of the data: no arcs, no division by zero,
// and the total still reads 0.
export const SinDatos: Story = {
  args: {
    segments: [
      { label: 'Tardanzas', value: 0, series: 2 },
      { label: 'Faltas', value: 0, series: 4 }
    ]
  },
  play: async ({ canvasElement }) => {
    expect(legendRows(canvasElement)).toEqual([
      { label: 'Tardanzas', value: '0', percent: '0,0 %' },
      { label: 'Faltas', value: '0', percent: '0,0 %' }
    ]);
    expect(arcs(canvasElement)).toHaveLength(0);
    expect(total(canvasElement)).toBe('0');
    expect(total(canvasElement)).not.toContain('NaN');
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    expect(total(canvasElement)).toBe('22');

    // The dark block repaints the surface and both text roles, so the hole cannot
    // stay white and the labels cannot stay dark-on-dark.
    const root = canvasElement.querySelector('[data-donut-breakdown]') as HTMLElement;
    expect(getComputedStyle(root).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
    expect(tokenValue('--color-bg-surface', 'background-color')).toBe(
      tokenValue('--color-slate-900', 'background-color')
    );
    const label = canvasElement.querySelector('[data-legend-label]') as HTMLElement;
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-neutral-50'));
    const percent = canvasElement.querySelector('[data-legend-percent]') as HTMLElement;
    expect(getComputedStyle(percent).color).toBe(tokenValue('--color-text-muted'));
    expect(getComputedStyle(percent).color).toBe(tokenValue('--color-slate-500'));
    const totalLabel = canvasElement.querySelector('[data-total]') as HTMLElement;
    expect(getComputedStyle(totalLabel).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(totalLabel).color).toBe(tokenValue('--color-neutral-50'));
  }
};
