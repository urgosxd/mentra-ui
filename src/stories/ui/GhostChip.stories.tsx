import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { GhostChip } from '../generated/GhostChip';
import { TRANSPARENT, tokenValue } from './styleProbe';

const meta = {
  title: 'UI/GhostChip',
  component: GhostChip,
  args: { label: 'Hoy' },
  argTypes: { label: { control: 'text' } }
} satisfies Meta<typeof GhostChip>;

export default meta;

type Story = StoryObj<typeof meta>;

function getChip(canvasElement: HTMLElement): HTMLButtonElement {
  const chips = canvasElement.querySelectorAll('button');
  expect(chips).toHaveLength(1);
  return chips[0];
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const chip = getChip(canvasElement);

    expect(chip.getAttribute('type')).toBe('button');
    expect(chip.textContent).toBe('Hoy');

    const style = getComputedStyle(chip);
    expect(style.height).toBe('28px');
    expect(style.paddingLeft).toBe('10px');
    expect(style.borderTopLeftRadius).toBe('8px');
    expect(style.borderTopWidth).toBe('1px');
    expect(style.borderTopColor).toBe(tokenValue('--color-border-subtle'));
    expect(style.color).toBe(tokenValue('--color-text-primary'));
    expect(style.fontSize).toBe('11px');

    // Ghost means no fill at all: the chip must not paint a surface of its own.
    expect(style.backgroundColor).toBe(TRANSPARENT);
    // And the design gives it no glyph.
    expect(chip.querySelectorAll('svg')).toHaveLength(0);
  }
};

export const CustomLabel: Story = {
  args: { label: 'Últimos 7 días' },
  play: async ({ canvasElement }) => {
    const chip = getChip(canvasElement);
    expect(chip.textContent).toBe('Últimos 7 días');
    expect(getComputedStyle(chip).backgroundColor).toBe(TRANSPARENT);
  }
};

export const Click: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    await userEvent.click(getChip(canvasElement));
    expect(args.onClick).toHaveBeenCalledOnce();
  }
};

export const Focus: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const chip = getChip(canvasElement);
    // An element with `outline-style: none` still reports a 3px `outline-width` in
    // Chromium, so the width cannot say whether a ring is painted -- only the style
    // can. At rest the chip must carry no ring at all.
    expect(getComputedStyle(chip).outlineStyle).toBe('none');

    await userEvent.tab();
    expect(document.activeElement).toBe(chip);

    const focused = getComputedStyle(chip);
    // The ring is real: a painted style, the designed width and the focus token.
    expect(focused.outlineStyle).toBe('solid');
    expect(focused.outlineWidth).toBe('2px');
    expect(focused.outlineColor).toBe(tokenValue('--color-border-focus'));
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const chip = getChip(canvasElement);
    expect(chip.textContent).toBe('Hoy');

    // The dark hairline is slate-700 instead of neutral-200, and the label flips
    // to neutral-50; the ghost fill stays transparent in both themes.
    expect(getComputedStyle(chip).borderTopColor).toBe(tokenValue('--color-border-subtle'));
    expect(tokenValue('--color-border-subtle')).toBe(tokenValue('--color-slate-700'));
    expect(getComputedStyle(chip).color).toBe(tokenValue('--color-text-primary'));
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-50'));
    expect(getComputedStyle(chip).backgroundColor).toBe(TRANSPARENT);
  }
};
