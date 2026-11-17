import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { LegendItem } from '../generated/LegendItem';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/LegendItem',
  component: LegendItem,
  args: { label: 'Cocina' },
  argTypes: { label: { control: 'text' } }
} satisfies Meta<typeof LegendItem>;

export default meta;

type Story = StoryObj<typeof meta>;

function getLegendItem(canvasElement: HTMLElement) {
  const items = canvasElement.querySelectorAll('[data-legend]');
  expect(items).toHaveLength(1);
  const item = items[0] as HTMLElement;

  const dot = item.querySelector('[data-legend-dot]') as HTMLElement | null;
  if (dot === null) throw new Error('the legend item has no dot');
  const label = item.querySelector('span:not([data-legend-dot])') as HTMLElement | null;
  if (label === null) throw new Error('the legend item has no label');

  return { item, dot, label };
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const { item, dot, label } = getLegendItem(canvasElement);

    expect(label.textContent).toBe('Cocina');
    expect(label.hasAttribute('data-legend-dot')).toBe(false);

    // Row of dot + label with the export's 4px gap.
    expect(getComputedStyle(item).display).toBe('flex');
    expect(getComputedStyle(item).gap).toBe('4px');
    expect(getComputedStyle(item).alignItems).toBe('center');

    // 7px circle; the dot is decoration, the label carries the meaning.
    expect(getComputedStyle(dot).width).toBe('7px');
    expect(getComputedStyle(dot).height).toBe('7px');
    expect(getComputedStyle(dot).borderRadius).toBe('999px');
    expect(dot.getAttribute('aria-hidden')).toBe('true');

    // Series-1 dot and secondary label, both from the live theme.
    expect(getComputedStyle(dot).backgroundColor).toBe(
      tokenValue('--color-chart-series-1', 'background-color')
    );
    expect(tokenValue('--color-chart-series-1', 'background-color')).toBe(
      tokenValue('--color-blue-400', 'background-color')
    );
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-neutral-500'));
    expect(getComputedStyle(label).fontSize).toBe('10px');
  }
};

// The design repeats the item inside a chart legend: one colour per series slot,
// one label per row, all sharing the same dot size.
export const Legend: Story = {
  render: () => (
    <div className="flex items-center gap-3 bg-(--color-bg-canvas) p-4">
      <LegendItem label="Cocina" />
      <LegendItem label="Barra" />
      <LegendItem label="Salón" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = Array.from(canvasElement.querySelectorAll('[data-legend]'));
    expect(items).toHaveLength(3);
    expect(items.map((item) => item.textContent)).toEqual(['Cocina', 'Barra', 'Salón']);

    const dots = items.map((item) => item.querySelector('[data-legend-dot]') as HTMLElement);
    // The export has a single series token for this item, so every dot matches.
    expect(new Set(dots.map((dot) => getComputedStyle(dot).backgroundColor)).size).toBe(1);
    expect(getComputedStyle(dots[0]).backgroundColor).toBe(
      tokenValue('--color-chart-series-1', 'background-color')
    );
    expect(dots.map((dot) => getComputedStyle(dot).width)).toEqual(['7px', '7px', '7px']);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const { dot, label } = getLegendItem(canvasElement);
    expect(label.textContent).toBe('Cocina');

    // The dark block moves the label from neutral-500 to slate-400 and leaves the
    // chart series colour alone.
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(dot).backgroundColor).toBe(
      tokenValue('--color-chart-series-1', 'background-color')
    );
    expect(getComputedStyle(dot).backgroundColor).toBe(
      tokenValue('--color-blue-400', 'background-color')
    );
  }
};
