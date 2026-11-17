import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { FilterChip } from '../generated/FilterChip';
import {
  TRANSPARENT,
  declaredStateValues,
  resolveDeclaration,
  tokenValue
} from './styleProbe';

const meta = {
  title: 'UI/FilterChip',
  component: FilterChip,
  args: { label: 'Todas las áreas' },
  argTypes: {
    label: { control: 'text' },
    expanded: { control: 'boolean' }
  }
} satisfies Meta<typeof FilterChip>;

export default meta;

type Story = StoryObj<typeof meta>;

function getChip(canvasElement: HTMLElement): HTMLButtonElement {
  const chips = canvasElement.querySelectorAll('button');
  expect(chips).toHaveLength(1);
  return chips[0] as HTMLButtonElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const chip = getChip(canvasElement);

    expect(chip.getAttribute('type')).toBe('button');
    expect(chip.hasAttribute('aria-expanded')).toBe(false);
    expect(chip.hasAttribute('aria-haspopup')).toBe(false);
    expect(chip.textContent).toBe('Todas las áreas');

    // A real lucide svg proves the offline icon collection is registered.
    expect(chip.querySelectorAll('svg')).toHaveLength(1);
  }
};

// When the chip controls a menu it must announce the state of that menu.
export const Expanded: Story = {
  args: { expanded: true },
  play: async ({ canvasElement }) => {
    const chip = getChip(canvasElement);

    expect(chip.getAttribute('aria-expanded')).toBe('true');
    expect(chip.getAttribute('aria-haspopup')).toBe('listbox');
  }
};

export const Click: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    await userEvent.click(getChip(canvasElement));
    expect(args.onClick).toHaveBeenCalledOnce();
  }
};

// Hover is a `:hover` wash over the surface and focus is real: the chip repaints
// its border on `:focus-visible`. See `declaredStateStyle` for why the hovered
// pseudo-class cannot be computed here.
export const Hover: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const chip = getChip(canvasElement);
    const rest = getComputedStyle(chip).backgroundColor;
    expect(rest).not.toBe(TRANSPARENT);

    await userEvent.hover(chip);

    const wash = declaredStateValues(chip, 'background-color')
      .filter((value) => value.includes('--color-bg-sunken'))
      .at(-1);
    if (wash === undefined) throw new Error('the chip declares no bg/sunken :hover background');

    const resolved = resolveDeclaration('background-color', wash);
    expect(resolved).not.toBe(TRANSPARENT);
    expect(resolved).not.toBe(rest);
  }
};

export const Focus: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const chip = getChip(canvasElement);
    // The chip keeps its hairline border and gains a 2px outline on focus, so the
    // outline (not the border) is what has to move.
    expect(getComputedStyle(chip).borderTopWidth).toBe('1px');
    const restOutline = getComputedStyle(chip).outlineWidth;

    await userEvent.tab();
    expect(document.activeElement).toBe(chip);

    const focused = getComputedStyle(chip);
    expect(focused.outlineWidth).not.toBe(restOutline);
    expect(focused.outlineWidth).toBe('2px');
    expect(focused.outlineColor).toBe(tokenValue('--color-border-focus'));
    expect(focused.borderTopWidth).toBe('1px');
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-2 bg-(--color-bg-canvas) p-4">
      <FilterChip />
      <FilterChip label="Área · Ventas" expanded />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const chips = Array.from(canvasElement.querySelectorAll('button'));
    expect(chips).toHaveLength(2);
    expect(chips.map((chip) => chip.textContent)).toEqual(['Todas las áreas', 'Área · Ventas']);

    // Only the chip that controls a menu announces the state of that menu; an
    // uncontrolled chip reports nothing at all rather than a fake `false`.
    expect(chips.map((chip) => chip.getAttribute('aria-expanded'))).toEqual([null, 'true']);
    expect(chips.map((chip) => chip.getAttribute('aria-haspopup'))).toEqual([null, 'listbox']);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const chip = getChip(canvasElement);
    expect(chip.textContent).toBe('Todas las áreas');
    expect(chip.querySelectorAll('svg')).toHaveLength(1);

    // Surface and label both come from the dark block (slate-900 / neutral-50),
    // so the chip cannot keep a frozen light fill or a dark-on-dark label.
    expect(getComputedStyle(chip).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
    expect(tokenValue('--color-bg-surface', 'background-color')).toBe(
      tokenValue('--color-slate-900', 'background-color')
    );
    expect(getComputedStyle(chip).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(chip).color).toBe(tokenValue('--color-neutral-50'));
  }
};
