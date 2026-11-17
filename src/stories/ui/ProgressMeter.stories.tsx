import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ProgressMeter } from '../generated/ProgressMeter';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/ProgressMeter',
  component: ProgressMeter,
  args: { label: 'Cocina', valueLabel: '96,3 %', value: 96.3 },
  argTypes: {
    label: { control: 'text' },
    valueLabel: { control: 'text' },
    value: { control: { type: 'range', min: 0, max: 100, step: 0.1 } }
  }
} satisfies Meta<typeof ProgressMeter>;

export default meta;

type Story = StoryObj<typeof meta>;

type Meter = { meter: HTMLElement; track: HTMLElement; fill: HTMLElement; label: HTMLElement; value: HTMLElement };

function getMeter(canvasElement: HTMLElement): Meter {
  const meters = canvasElement.querySelectorAll('[data-meter]');
  expect(meters).toHaveLength(1);
  const meter = meters[0] as HTMLElement;

  const track = meter.querySelector('[role="progressbar"]') as HTMLElement | null;
  const fill = meter.querySelector('[data-meter-fill]') as HTMLElement | null;
  if (track === null || fill === null) throw new Error('the meter has no track/fill pair');

  const spans = Array.from(meter.querySelectorAll('span'));
  expect(spans).toHaveLength(2);

  return { meter, track, fill, label: spans[0], value: spans[1] };
}

/** Painted width of the fill relative to the full track, read from layout, not classes. */
function fillRatio(track: HTMLElement, fill: HTMLElement): number {
  const trackWidth = track.getBoundingClientRect().width;
  expect(trackWidth).toBeGreaterThan(0);
  return fill.getBoundingClientRect().width / trackWidth;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const { track, fill, label, value } = getMeter(canvasElement);

    expect(label.textContent).toBe('Cocina');
    expect(value.textContent).toBe('96,3 %');
    // 10.5px in the export; the value side is the semibold half of the pair.
    expect(getComputedStyle(label).fontSize).toBe('10.5px');
    expect(getComputedStyle(label).fontWeight).toBe('400');
    expect(getComputedStyle(value).fontSize).toBe('10.5px');
    expect(getComputedStyle(value).fontWeight).toBe('600');
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(value).color).toBe(tokenValue('--color-text-primary'));

    // The track is the meter: it announces the proportion it paints.
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
    expect(track.getAttribute('aria-valuenow')).toBe('96.3');
    expect(track.getAttribute('aria-valuetext')).toBe('96,3 %');
    expect(track.getAttribute('aria-label')).toBe('Cocina');

    // Track and fill resolve through the chart tokens, not through a frozen colour.
    expect(getComputedStyle(track).backgroundColor).toBe(
      tokenValue('--color-chart-track', 'background-color')
    );
    expect(tokenValue('--color-chart-track', 'background-color')).toBe(
      tokenValue('--color-neutral-100', 'background-color')
    );
    expect(getComputedStyle(fill).backgroundColor).toBe(
      tokenValue('--color-chart-series-5', 'background-color')
    );
    expect(tokenValue('--color-chart-series-5', 'background-color')).toBe(
      tokenValue('--color-green-600', 'background-color')
    );

    // 331 of the export's 344 track: the fill width is the value.
    expect(fillRatio(track, fill)).toBeCloseTo(0.963, 2);

    expect(getComputedStyle(track).height).toBe('7px');
    expect(getComputedStyle(track).borderTopLeftRadius).toBe('4px');
    expect(getComputedStyle(fill).borderTopLeftRadius).toBe('4px');
  }
};

// The same component at a different value: the painted slice follows `value`.
export const PartialFill: Story = {
  args: { label: 'Ventas', valueLabel: '22 %', value: 22 },
  play: async ({ canvasElement }) => {
    const { track, fill, label, value } = getMeter(canvasElement);

    expect(label.textContent).toBe('Ventas');
    expect(value.textContent).toBe('22 %');
    expect(track.getAttribute('aria-valuenow')).toBe('22');
    expect(track.getAttribute('aria-valuetext')).toBe('22 %');
    expect(track.getAttribute('aria-label')).toBe('Ventas');

    expect(fillRatio(track, fill)).toBeCloseTo(0.22, 2);
    // Both meters keep the same track width, so the slice is what shrank.
    expect(getComputedStyle(fill).backgroundColor).toBe(
      tokenValue('--color-chart-series-5', 'background-color')
    );
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const { track, fill, label } = getMeter(canvasElement);
    expect(label.textContent).toBe('Cocina');

    // The dark block repaints the track (neutral-100 -> slate-700) and the label
    // (neutral-900 -> neutral-50); the series fill keeps its green.
    expect(getComputedStyle(track).backgroundColor).toBe(
      tokenValue('--color-chart-track', 'background-color')
    );
    expect(tokenValue('--color-chart-track', 'background-color')).toBe(
      tokenValue('--color-slate-700', 'background-color')
    );
    expect(getComputedStyle(fill).backgroundColor).toBe(
      tokenValue('--color-chart-series-5', 'background-color')
    );
    expect(getComputedStyle(fill).backgroundColor).toBe(
      tokenValue('--color-green-600', 'background-color')
    );
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-neutral-50'));
  }
};
