import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { NavItem } from '../../components/ui/NavItem';
import {
  TRANSPARENT,
  declaredStateValues,
  resolveDeclaration,
  tokenValue
} from './styleProbe';

const meta = {
  title: 'UI/NavItem',
  component: NavItem,
  args: { label: 'Indicadores', selected: false },
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' }
  },
  // The row is designed for the dark brand sidebar and its label is
  // `color/text/on-brand`, so every story paints it on the brand background it
  // was measured against. Storybook's own canvas is light.
  render: (args) => (
    <div className="w-60 bg-(--color-bg-brand) p-4">
      <NavItem {...args} />
    </div>
  )
} satisfies Meta<typeof NavItem>;

export default meta;

type Story = StoryObj<typeof meta>;

function getItem(canvasElement: HTMLElement): HTMLButtonElement {
  const items = canvasElement.querySelectorAll('button');
  expect(items).toHaveLength(1);
  return items[0] as HTMLButtonElement;
}

function getLabel(item: HTMLButtonElement): HTMLElement {
  const labels = Array.from(item.querySelectorAll('span')).filter(
    (span) => (span.textContent ?? '').trim() !== ''
  );
  expect(labels).toHaveLength(1);
  return labels[0] as HTMLElement;
}

// The design fixes the row geometry in every state; asserting it once keeps the
// three state stories about their state instead of repeating four numbers each.
function expectGeometry(item: HTMLButtonElement) {
  const rect = item.getBoundingClientRect();
  expect(Math.round(rect.width)).toBe(208);
  expect(Math.round(rect.height)).toBe(32);

  const style = getComputedStyle(item);
  expect(style.display).toBe('flex');
  expect(style.flexDirection).toBe('row');
  expect(style.alignItems).toBe('center');
  expect(style.columnGap).toBe('10px');
  expect(style.paddingLeft).toBe('12px');
  expect(style.paddingRight).toBe('12px');
  expect(style.borderTopLeftRadius).toBe('8px');
}

export const Default: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, userEvent, args }) => {
    const item = getItem(canvasElement);
    const label = getLabel(item);

    expect(item.getAttribute('type')).toBe('button');
    expect(item.getAttribute('data-state')).toBe('default');
    expect(item.hasAttribute('aria-current')).toBe(false);
    expect(item.textContent).toBe('Indicadores');

    expectGeometry(item);

    // Rest state: no fill, and the on-brand label at 72% is the only thing that
    // makes the row visible on the sidebar.
    expect(getComputedStyle(item).backgroundColor).toBe(TRANSPARENT);
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-on-brand'));
    expect(getComputedStyle(label).opacity).toBe('0.72');
    expect(getComputedStyle(label).fontWeight).toBe('400');
    expect(getComputedStyle(label).fontSize).toBe('12px');

    // The row is a real button: clicks reach the handler the parent passes.
    await userEvent.click(item);
    expect(args.onClick).toHaveBeenCalledOnce();
  }
};

// Hover is a `:hover` rule, not a prop: the only way to reach it is a pointer,
// and the only way to prove it is that the fill it applies actually resolves.
// See `declaredStateStyle` for why the pseudo-class cannot be computed here.
export const Hover: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, userEvent }) => {
    const item = getItem(canvasElement);
    const label = getLabel(item);

    expect(getComputedStyle(item).backgroundColor).toBe(TRANSPARENT);
    expect(getComputedStyle(label).opacity).toBe('0.72');

    await userEvent.hover(item);

    // The wash is brand-muted at 55%: the token must be the one the rule names,
    // and it must resolve to a translucent fill rather than the opaque selected
    // background.
    const washes = declaredStateValues(item, 'background-color').filter((value) =>
      value.includes('--color-bg-brand-muted')
    );
    const wash = washes.at(-1);
    if (wash === undefined) {
      throw new Error(
        `the row declares no brand-muted :hover background on ${item.className}`
      );
    }
    const resolvedWash = resolveDeclaration('background-color', wash);
    expect(resolvedWash).not.toBe(TRANSPARENT);
    expect(resolvedWash).not.toBe(tokenValue('--color-bg-brand-muted', 'background-color'));

    // Label at 90% and medium weight once hovered.
    expect(
      declaredStateValues(label, 'opacity').map((value) => resolveDeclaration('opacity', value))
    ).toContain('0.9');
    expect(
      declaredStateValues(label, 'font-weight').map((value) =>
        resolveDeclaration('font-weight', value)
      )
    ).toContain('500');
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-on-brand'));
  }
};

export const Selected: Story = {
  args: { selected: true },
  play: async ({ canvasElement }) => {
    const item = getItem(canvasElement);
    const label = getLabel(item);

    expect(item.getAttribute('data-state')).toBe('selected');
    expect(item.getAttribute('aria-current')).toBe('page');
    expect(item.textContent).toBe('Indicadores');

    expectGeometry(item);

    // Full-opacity brand-muted fill: the selected cell is the only opaque one.
    expect(getComputedStyle(item).backgroundColor).toBe(
      tokenValue('--color-bg-brand-muted', 'background-color')
    );
    expect(getComputedStyle(label).opacity).toBe('1');
    expect(getComputedStyle(label).fontWeight).toBe('600');
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-on-brand'));
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex w-60 flex-col gap-2 bg-(--color-bg-brand) p-4">
      <NavItem label="Dashboard" />
      <NavItem label="Indicadores" selected />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const items = Array.from(canvasElement.querySelectorAll('button'));
    expect(items.map((item) => item.getAttribute('data-state'))).toEqual([
      'default',
      'selected'
    ]);
    expect(items.map((item) => item.getAttribute('aria-current'))).toEqual([null, 'page']);

    // Only the selected row is filled while nothing is hovered.
    const fills = items.map((item) => getComputedStyle(item).backgroundColor);
    expect(fills[0]).toBe(TRANSPARENT);
    expect(fills[1]).toBe(tokenValue('--color-bg-brand-muted', 'background-color'));
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const item = getItem(canvasElement);
    const label = getLabel(item);

    // The dark block redefines on-brand; the label must follow it and keep the
    // design's 0.72 opacity, which is theme-independent.
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-on-brand'));
    expect(tokenValue('--color-text-on-brand')).toBe(tokenValue('--color-neutral-50'));
    expect(tokenValue('--color-text-on-brand')).not.toBe(tokenValue('--color-neutral-0'));
    expect(getComputedStyle(label).opacity).toBe('0.72');
    expect(getComputedStyle(item).backgroundColor).toBe(TRANSPARENT);
  }
};
