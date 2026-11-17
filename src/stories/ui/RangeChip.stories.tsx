import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { RangeChip } from '../generated/RangeChip';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/RangeChip',
  component: RangeChip,
  args: { label: 'Marzo 2025' },
  argTypes: {
    label: { control: 'text' },
    expanded: { control: 'boolean' }
  }
} satisfies Meta<typeof RangeChip>;

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
    expect(chip.textContent).toBe('Marzo 2025');
    // Uncontrolled: the chip must not claim to control a popup it never opened.
    expect(chip.hasAttribute('aria-expanded')).toBe(false);
    expect(chip.hasAttribute('aria-haspopup')).toBe(false);

    const style = getComputedStyle(chip);
    expect(style.height).toBe('28px');
    expect(style.paddingLeft).toBe('10px');
    expect(style.columnGap).toBe('6px');
    expect(style.borderTopLeftRadius).toBe('8px');
    expect(style.backgroundColor).toBe(tokenValue('--color-bg-surface', 'background-color'));
    expect(style.borderTopColor).toBe(tokenValue('--color-border-subtle'));
    expect(style.borderTopWidth).toBe('1px');
    expect(style.color).toBe(tokenValue('--color-text-primary'));
    expect(style.fontSize).toBe('11px');

    // Calendar + chevron, both painted with the muted icon token.
    const icons = chip.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
    for (const icon of Array.from(icons)) {
      expect(getComputedStyle(icon).color).toBe(tokenValue('--color-icon-muted'));
      expect(getComputedStyle(icon).width).toBe('12px');
    }
  }
};

export const CustomRange: Story = {
  args: { label: '1 – 31 Mar 2025' },
  play: async ({ canvasElement }) => {
    const chip = getChip(canvasElement);
    expect(chip.textContent).toBe('1 – 31 Mar 2025');
    expect(chip.querySelectorAll('svg')).toHaveLength(2);
  }
};

// The chevron means the chip opens a picker, so an expanded one has to announce it.
export const Expanded: Story = {
  args: { expanded: true },
  play: async ({ canvasElement }) => {
    const chip = getChip(canvasElement);
    expect(chip.getAttribute('aria-expanded')).toBe('true');
    expect(chip.getAttribute('aria-haspopup')).toBe('dialog');
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
    // can. At rest the chip carries no ring, just its hairline border.
    expect(getComputedStyle(chip).outlineStyle).toBe('none');

    await userEvent.tab();
    expect(document.activeElement).toBe(chip);

    const focused = getComputedStyle(chip);
    // The ring is real: a painted style, the designed width and the focus token.
    expect(focused.outlineStyle).toBe('solid');
    expect(focused.outlineWidth).toBe('2px');
    expect(focused.outlineColor).toBe(tokenValue('--color-border-focus'));
    expect(focused.borderTopWidth).toBe('1px');
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const chip = getChip(canvasElement);
    expect(chip.textContent).toBe('Marzo 2025');

    // Surface, hairline, label and icons all flip with the theme; a frozen light
    // value would paint a white chip with invisible glyphs.
    expect(getComputedStyle(chip).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
    expect(tokenValue('--color-bg-surface', 'background-color')).toBe(
      tokenValue('--color-slate-900', 'background-color')
    );
    expect(getComputedStyle(chip).borderTopColor).toBe(tokenValue('--color-border-subtle'));
    expect(getComputedStyle(chip).color).toBe(tokenValue('--color-text-primary'));
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-50'));

    const icons = chip.querySelectorAll('svg');
    expect(icons).toHaveLength(2);
    for (const icon of Array.from(icons)) {
      expect(getComputedStyle(icon).color).toBe(tokenValue('--color-icon-muted'));
      expect(tokenValue('--color-icon-muted')).toBe(tokenValue('--color-slate-400'));
    }
  }
};
