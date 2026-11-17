import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { SearchField } from '../generated/SearchField';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/SearchField',
  component: SearchField,
  args: { placeholder: 'Buscar colaborador…' },
  argTypes: { placeholder: { control: 'text' } }
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj<typeof meta>;

function getField(canvasElement: HTMLElement): HTMLInputElement {
  const fields = canvasElement.querySelectorAll('input');
  expect(fields).toHaveLength(1);
  return fields[0];
}

function getShell(field: HTMLInputElement): HTMLElement {
  const shell = field.parentElement as HTMLElement;
  expect(shell).not.toBeNull();
  return shell;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const field = getField(canvasElement);
    const shell = getShell(field);

    // A real search input: the design's text is its placeholder, not a label overlay.
    expect(field.type).toBe('search');
    expect(field.placeholder).toBe('Buscar colaborador…');
    expect(field.disabled).toBe(false);

    const shellStyle = getComputedStyle(shell);
    expect(shellStyle.width).toBe('196px');
    expect(shellStyle.height).toBe('34px');
    expect(shellStyle.columnGap).toBe('6px');
    expect(shellStyle.paddingLeft).toBe('10px');
    expect(shellStyle.borderTopLeftRadius).toBe('8px');
    expect(shellStyle.backgroundColor).toBe(tokenValue('--color-bg-surface', 'background-color'));
    expect(shellStyle.borderTopColor).toBe(tokenValue('--color-border-subtle'));
    expect(shellStyle.borderTopWidth).toBe('1px');

    // Font size is a length token-free literal; the trap is asserting the colour
    // actually landed instead of being overridden by a `text-(--…)` utility.
    expect(getComputedStyle(field).fontSize).toBe('11px');
    expect(getComputedStyle(field).color).toBe(tokenValue('--color-text-primary'));

    // One real lucide glyph, painted with the muted icon token.
    const icons = shell.querySelectorAll('svg');
    expect(icons).toHaveLength(1);
    expect(getComputedStyle(icons[0]).color).toBe(tokenValue('--color-icon-muted'));
    expect(getComputedStyle(icons[0]).width).toBe('13px');
  }
};

export const CustomPlaceholder: Story = {
  args: { placeholder: 'Buscar área…' },
  play: async ({ canvasElement }) => {
    const field = getField(canvasElement);
    expect(field.placeholder).toBe('Buscar área…');
    expect(getShell(field).querySelectorAll('svg')).toHaveLength(1);
  }
};

export const Typing: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const field = getField(canvasElement);

    await userEvent.type(field, 'Lucía');
    await expect(field).toHaveValue('Lucía');
  }
};

// The field is a wrapper plus the native input, so focus is real: the wrapper
// repaints its outline on `:focus-within` while the hairline border stays put.
export const Focus: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const field = getField(canvasElement);
    const shell = getShell(field);

    // An element with `outline-style: none` still reports a 3px `outline-width` in
    // Chromium, so the width cannot say whether a ring is painted -- only the style
    // can. At rest the pill carries no ring, just its hairline border.
    expect(getComputedStyle(shell).outlineStyle).toBe('none');

    await userEvent.click(field);
    expect(document.activeElement).toBe(field);

    const focused = getComputedStyle(shell);
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

    const field = getField(canvasElement);
    const shell = getShell(field);

    // Surface, hairline and icon all come from the dark block
    // (slate-900 / slate-700 / slate-400); a frozen light value would paint a
    // white box on a dark canvas.
    expect(getComputedStyle(shell).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
    expect(tokenValue('--color-bg-surface', 'background-color')).toBe(
      tokenValue('--color-slate-900', 'background-color')
    );
    expect(getComputedStyle(shell).borderTopColor).toBe(tokenValue('--color-border-subtle'));
    expect(getComputedStyle(field).color).toBe(tokenValue('--color-text-primary'));
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-50'));

    const icon = shell.querySelector('svg') as SVGElement;
    expect(getComputedStyle(icon).color).toBe(tokenValue('--color-icon-muted'));
    expect(tokenValue('--color-icon-muted')).toBe(tokenValue('--color-slate-400'));
  }
};
