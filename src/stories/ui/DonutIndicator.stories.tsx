import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DonutIndicator } from '../generated/DonutIndicator';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/DonutIndicator',
  component: DonutIndicator,
  args: { percent: 70.6, cifra: '70,6 %', label: 'del total' },
  argTypes: {
    percent: { control: { type: 'range', min: 0, max: 100, step: 0.1 } },
    cifra: { control: 'text' },
    label: { control: 'text' }
  }
} satisfies Meta<typeof DonutIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

function track(canvasElement: HTMLElement): SVGCircleElement {
  const circle = canvasElement.querySelector('[data-track]');
  expect(circle).not.toBeNull();
  return circle as SVGCircleElement;
}

function arc(canvasElement: HTMLElement): SVGCircleElement {
  const circle = canvasElement.querySelector('[data-arc]');
  expect(circle).not.toBeNull();
  return circle as SVGCircleElement;
}

/** The `stroke-dasharray` pair, in the `pathLength` scale where the ring is 100. */
function dashPair(circle: SVGCircleElement): [number, number] {
  const parts = (circle.getAttribute('stroke-dasharray') ?? '').trim().split(/\s+/);
  expect(parts).toHaveLength(2);
  return [Number(parts[0]), Number(parts[1])];
}

function texts(canvasElement: HTMLElement): { cifra: string; label: string } {
  return {
    cifra: canvasElement.querySelector('[data-cifra]')?.textContent ?? '',
    label: canvasElement.querySelector('[data-label]')?.textContent ?? ''
  };
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    expect(texts(canvasElement)).toEqual({ cifra: '70,6 %', label: 'del total' });

    // The ring is a 7px stroke; the track is the unfilled remainder.
    const pista = track(canvasElement);
    expect(getComputedStyle(pista).strokeWidth).toBe('7px');
    expect(getComputedStyle(pista).stroke).toBe(tokenValue('--color-chart-track'));

    // The filled share is the percentage prop, not a frozen arc angle.
    const valor = arc(canvasElement);
    const [filled, rest] = dashPair(valor);
    expect(filled).toBeCloseTo(70.6, 3);
    expect(rest).toBeCloseTo(100 - 70.6, 3);
    expect(getComputedStyle(valor).stroke).toBe(tokenValue('--color-chart-series-5'));

    // Both centre lines resolve their own text role.
    const cifra = canvasElement.querySelector('[data-cifra]') as HTMLElement;
    const label = canvasElement.querySelector('[data-label]') as HTMLElement;
    expect(getComputedStyle(cifra).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-secondary'));
  }
};

// Changing the proportion moves the fill and the default figure together.
export const Percent: Story = {
  args: { percent: 25, cifra: undefined },
  play: async ({ canvasElement }) => {
    const [filled, rest] = dashPair(arc(canvasElement));
    expect(filled).toBeCloseTo(25, 3);
    expect(rest).toBeCloseTo(75, 3);
    expect(texts(canvasElement)).toEqual({ cifra: '25,0 %', label: 'del total' });
  }
};

// Full ring: the dash pattern has to cover the whole circumference, never leave a seam.
export const Full: Story = {
  args: { percent: 100, cifra: undefined },
  play: async ({ canvasElement }) => {
    const [filled, rest] = dashPair(arc(canvasElement));
    expect(filled).toBeCloseTo(100, 3);
    expect(rest).toBeCloseTo(0, 3);
    expect(texts(canvasElement).cifra).toBe('100,0 %');
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    expect(texts(canvasElement)).toEqual({ cifra: '70,6 %', label: 'del total' });

    // The track and the two text roles are all redefined by the dark block.
    expect(getComputedStyle(track(canvasElement)).stroke).toBe(
      tokenValue('--color-chart-track')
    );
    expect(tokenValue('--color-chart-track')).toBe(tokenValue('--color-slate-700'));

    const cifra = canvasElement.querySelector('[data-cifra]') as HTMLElement;
    expect(getComputedStyle(cifra).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(cifra).color).toBe(tokenValue('--color-neutral-50'));
    const label = canvasElement.querySelector('[data-label]') as HTMLElement;
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-slate-400'));
  }
};
