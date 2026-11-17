import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { AiFab } from '../generated/AiFab';
import { declaredStateStyle, tokenValue } from './styleProbe';

const meta = {
  title: 'UI/AiFab',
  component: AiFab,
  args: { label: 'Asistente IA' },
  argTypes: { label: { control: 'text' } }
} satisfies Meta<typeof AiFab>;

export default meta;

type Story = StoryObj<typeof meta>;

function getFab(canvasElement: HTMLElement): HTMLButtonElement {
  const fabs = canvasElement.querySelectorAll('button');
  expect(fabs).toHaveLength(1);
  return fabs[0] as HTMLButtonElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const fab = getFab(canvasElement);

    expect(fab.getAttribute('type')).toBe('button');
    expect(fab.getAttribute('aria-label')).toBe('Asistente IA');
    // Icon-only control: the accessible name cannot depend on visible text.
    expect(fab.textContent).toBe('');
    expect(fab.querySelectorAll('svg')).toHaveLength(1);
  }
};

export const Click: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    await userEvent.click(getFab(canvasElement));
    expect(args.onClick).toHaveBeenCalledOnce();
  }
};

// The fab's designed press feedback is a transform, not a colour: `:hover` grows
// it to 105% and `:active` shrinks it to 95%. The browser derives those
// pseudo-classes from real pointer input only, so the interaction is performed and
// the declarations the matching rules carry are read back (see
// `declaredStateStyle`). Tailwind may serialize the scale as a percentage or as a
// unitless factor, so either form counts and losing both fails the story.
function declaresScale(
  fab: HTMLElement,
  pseudo: ':hover' | ':active',
  expected: { factor: string; percent: string }
): boolean {
  return Object.values(declaredStateStyle(fab, pseudo))
    .flat()
    .some(
      (value) => value.includes(expected.percent) || value.includes(expected.factor)
    );
}

export const Hover: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const fab = getFab(canvasElement);
    const rest = getComputedStyle(fab).scale;

    await userEvent.hover(fab);

    expect(
      declaresScale(fab, ':hover', { factor: '1.05', percent: '105%' }),
      'hover grows the fab'
    ).toBe(true);
    // Synthetic pointer events never satisfy `:hover`, so the computed transform
    // must still be at rest: the declarations above are the only evidence of the
    // state, never a faked computed value.
    expect(getComputedStyle(fab).scale).toBe(rest);
  }
};

export const Pressed: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const fab = getFab(canvasElement);

    await userEvent.pointer([{ target: fab, keys: '[MouseLeft>]' }]);
    expect(
      declaresScale(fab, ':active', { factor: '0.95', percent: '95%' }),
      'pressed shrinks the fab'
    ).toBe(true);
    await userEvent.pointer([{ keys: '[/MouseLeft]' }]);
  }
};

// Focus is real: the keyboard moves it, so `:focus-visible` resolves normally and
// the 2px ring is a computed value instead of a declaration lookup.
export const Focus: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const fab = getFab(canvasElement);
    const restOutline = getComputedStyle(fab).outlineWidth;

    await userEvent.tab();
    expect(document.activeElement).toBe(fab);

    const focused = getComputedStyle(fab);
    expect(focused.outlineWidth).not.toBe(restOutline);
    expect(focused.outlineWidth).toBe('2px');
    expect(focused.outlineColor).toBe(tokenValue('--color-border-focus'));
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const fab = getFab(canvasElement);
    expect(fab.getAttribute('aria-label')).toBe('Asistente IA');
    expect(fab.querySelectorAll('svg')).toHaveLength(1);

    // The sparkles glyph paints with `color/bg-brand-deep`, which the dark block
    // moves from brand-900 to slate-950: resolving both proves the fab follows the
    // active theme instead of a frozen light colour.
    const glyph = fab.querySelector('svg') as SVGElement;
    expect(getComputedStyle(glyph).color).toBe(tokenValue('--color-bg-brand-deep'));
    expect(tokenValue('--color-bg-brand-deep')).toBe(tokenValue('--color-slate-950'));
    // The gold surface is a theme-independent accent and must not move.
    expect(getComputedStyle(fab).backgroundColor).toBe(
      tokenValue('--color-action-secondary', 'background-color')
    );
  }
};
