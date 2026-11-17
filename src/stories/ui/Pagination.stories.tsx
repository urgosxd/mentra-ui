import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { Pagination } from '../generated/Pagination';
import { TRANSPARENT, tokenValue } from './styleProbe';

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  args: { range: 'Página 1 de 2', page: 1, totalPages: 2 },
  argTypes: {
    range: { control: 'text' },
    page: { control: 'number' },
    totalPages: { control: 'number' }
  }
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

function getNav(canvasElement: HTMLElement): HTMLElement {
  const navs = canvasElement.querySelectorAll('nav');
  expect(navs).toHaveLength(1);
  return navs[0];
}

/** `[previous, …page cells…, next]`. */
function getButtons(nav: HTMLElement): HTMLButtonElement[] {
  const buttons = Array.from(nav.querySelectorAll('button'));
  expect(buttons).toHaveLength(4);
  return buttons;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement);
    const buttons = getButtons(nav);

    expect(nav.getAttribute('aria-label')).toBe('Paginación');

    // The range label is the first child; the cells are buttons after it.
    const range = nav.children[0] as HTMLElement;
    expect(range.textContent).toBe('Página 1 de 2');
    expect(getComputedStyle(range).fontSize).toBe('10px');
    expect(getComputedStyle(range).color).toBe(tokenValue('--color-text-secondary'));

    // Only the current page announces itself, and only the arrows carry a name.
    expect(buttons.map((button) => button.getAttribute('type'))).toEqual([
      'button',
      'button',
      'button',
      'button'
    ]);
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Página anterior',
      null,
      null,
      'Página siguiente'
    ]);
    expect(buttons.map((button) => button.getAttribute('aria-current'))).toEqual([
      null,
      'page',
      null,
      null
    ]);
    expect(buttons.map((button) => button.textContent)).toEqual(['', '1', '2', '']);

    // The active cell is the brand fill with on-brand text; the idle cell is a
    // hairline outline on the page background.
    const current = getComputedStyle(buttons[1]);
    expect(current.backgroundColor).toBe(
      tokenValue('--color-action-primary', 'background-color')
    );
    expect(current.color).toBe(tokenValue('--color-text-on-brand'));
    expect(current.fontWeight).toBe('600');
    expect(current.width).toBe('26px');
    expect(current.height).toBe('26px');

    const idle = getComputedStyle(buttons[2]);
    expect(idle.backgroundColor).toBe(TRANSPARENT);
    expect(idle.color).toBe(tokenValue('--color-text-primary'));
    expect(idle.borderTopColor).toBe(tokenValue('--color-border-subtle'));

    // Two chevron glyphs, no other icon.
    expect(nav.querySelectorAll('svg')).toHaveLength(2);
  }
};

export const SecondPage: Story = {
  args: { range: 'Página 2 de 2', page: 2 },
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement);
    const buttons = getButtons(nav);

    expect((nav.children[0] as HTMLElement).textContent).toBe('Página 2 de 2');
    expect(buttons.map((button) => button.getAttribute('aria-current'))).toEqual([
      null,
      null,
      'page',
      null
    ]);
    expect(getComputedStyle(buttons[2]).backgroundColor).toBe(
      tokenValue('--color-action-primary', 'background-color')
    );
    expect(getComputedStyle(buttons[1]).backgroundColor).toBe(TRANSPARENT);
  }
};

export const ManyPages: Story = {
  args: { range: 'Página 3 de 5', page: 3, totalPages: 5 },
  play: async ({ canvasElement }) => {
    const nav = getNav(canvasElement);
    const buttons = Array.from(nav.querySelectorAll('button'));

    expect(buttons).toHaveLength(7);
    expect(buttons.slice(1, 6).map((button) => button.textContent)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5'
    ]);
    expect(buttons.map((button) => button.getAttribute('aria-current'))).toEqual([
      null,
      null,
      null,
      'page',
      null,
      null,
      null
    ]);
  }
};

export const Interactions: Story = {
  args: { onPageChange: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    const buttons = getButtons(getNav(canvasElement));

    await userEvent.click(buttons[2]);
    expect(args.onPageChange).toHaveBeenCalledWith(2);

    await userEvent.click(buttons[3]);
    expect(args.onPageChange).toHaveBeenLastCalledWith(2);

    await userEvent.click(buttons[1]);
    expect(args.onPageChange).toHaveBeenLastCalledWith(1);

    expect(args.onPageChange).toHaveBeenCalledTimes(3);
  }
};

export const PreviousPage: Story = {
  args: { range: 'Página 2 de 2', page: 2, onPageChange: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    const buttons = getButtons(getNav(canvasElement));

    await userEvent.click(buttons[0]);
    expect(args.onPageChange).toHaveBeenCalledOnce();
    expect(args.onPageChange).toHaveBeenCalledWith(1);
  }
};

export const Focus: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const buttons = getButtons(getNav(canvasElement));

    // An element with `outline-style: none` still reports a 3px `outline-width` in
    // Chromium, so the rest state is "no ring painted", which only the style can
    // show. Every cell shares the same ring, so the first button stands for all.
    expect(getComputedStyle(buttons[0]).outlineStyle).toBe('none');

    await userEvent.tab();
    expect(document.activeElement).toBe(buttons[0]);

    const focused = getComputedStyle(buttons[0]);
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

    const nav = getNav(canvasElement);
    const buttons = getButtons(nav);

    // The active cell follows the dark action pair: brand-800 -> brand-300 fill
    // with on-brand text; the idle cell keeps a dark hairline.
    expect(getComputedStyle(buttons[1]).backgroundColor).toBe(
      tokenValue('--color-action-primary', 'background-color')
    );
    expect(tokenValue('--color-action-primary', 'background-color')).toBe(
      tokenValue('--color-brand-300', 'background-color')
    );
    expect(getComputedStyle(buttons[1]).color).toBe(tokenValue('--color-text-on-brand'));
    expect(getComputedStyle(buttons[2]).borderTopColor).toBe(
      tokenValue('--color-border-subtle')
    );
    expect(getComputedStyle(nav.children[0] as HTMLElement).color).toBe(
      tokenValue('--color-text-secondary')
    );

    const icon = nav.querySelector('svg') as SVGElement;
    expect(getComputedStyle(icon).color).toBe(tokenValue('--color-icon-muted'));
  }
};
