import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { MiniBarColumn } from '../generated/MiniBarColumn';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/MiniBarColumn',
  component: MiniBarColumn,
  args: { valor: '6.8K', dia: 'Lun' },
  argTypes: {
    valor: { control: 'text' },
    dia: { control: 'text' },
    height: { control: 'number' },
    trackHeight: { control: 'number' }
  }
} satisfies Meta<typeof MiniBarColumn>;

export default meta;

type Story = StoryObj<typeof meta>;

function bar(canvasElement: HTMLElement): HTMLElement {
  const found = canvasElement.querySelector('[data-bar]') as HTMLElement | null;
  expect(found).not.toBeNull();
  return found as HTMLElement;
}

function track(canvasElement: HTMLElement): HTMLElement {
  const found = canvasElement.querySelector('[data-track]') as HTMLElement | null;
  expect(found).not.toBeNull();
  return found as HTMLElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-valor]')?.textContent).toBe('6.8K');
    expect(canvasElement.querySelector('[data-dia]')?.textContent).toBe('Lun');

    // 35x150 column holding a 120px track.
    const root = canvasElement.querySelector('[data-mini-bar-column]') as HTMLElement;
    expect(getComputedStyle(root).width).toBe('35px');
    expect(getComputedStyle(root).height).toBe('150px');
    expect(getComputedStyle(track(canvasElement)).height).toBe('120px');

    // The filled height is the prop, not a frozen 38.
    const relleno = bar(canvasElement);
    expect(relleno.style.height).toBe('38px');
    expect(getComputedStyle(relleno).backgroundColor).toBe(
      tokenValue('--color-brand-800', 'background-color')
    );
    expect(getComputedStyle(relleno).borderTopLeftRadius).toBe('3px');

    // Both labels are the 8px neutral legend text of the export.
    const valor = canvasElement.querySelector('[data-valor]') as HTMLElement;
    const dia = canvasElement.querySelector('[data-dia]') as HTMLElement;
    expect(getComputedStyle(valor).color).toBe(tokenValue('--color-neutral-500'));
    expect(getComputedStyle(valor).fontSize).toBe('8px');
    expect(getComputedStyle(valor).fontWeight).toBe('700');
    expect(getComputedStyle(dia).color).toBe(tokenValue('--color-neutral-500'));
    expect(getComputedStyle(dia).fontSize).toBe('8px');
  }
};

// A tall value grows the fill inside the same track; it never overflows it.
export const BarraAlta: Story = {
  args: { height: 96, valor: '19.4K' },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-valor]')?.textContent).toBe('19.4K');
    const relleno = bar(canvasElement);
    expect(relleno.style.height).toBe('96px');
    expect(getComputedStyle(relleno).backgroundColor).toBe(
      tokenValue('--color-brand-800', 'background-color')
    );
    expect(getComputedStyle(track(canvasElement)).height).toBe('120px');
  }
};

// The full track: the bar covers the whole plot area.
export const BarraLlena: Story = {
  args: { height: 120, valor: '24K' },
  play: async ({ canvasElement }) => {
    expect(bar(canvasElement).style.height).toBe('120px');
    expect(getComputedStyle(track(canvasElement)).height).toBe('120px');
  }
};

// The export has no dark mode for this node, so the primitive tokens hold in both
// themes: assert that instead of pretending a semantic override exists.
export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    expect(canvasElement.querySelector('[data-valor]')?.textContent).toBe('6.8K');
    expect(bar(canvasElement).style.height).toBe('38px');
    expect(getComputedStyle(bar(canvasElement)).backgroundColor).toBe(
      tokenValue('--color-brand-800', 'background-color')
    );
    const valor = canvasElement.querySelector('[data-valor]') as HTMLElement;
    expect(getComputedStyle(valor).color).toBe(tokenValue('--color-neutral-500'));
  }
};
