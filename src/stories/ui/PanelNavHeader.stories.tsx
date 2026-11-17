import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { PanelNavHeader } from '../generated/PanelNavHeader';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/PanelNavHeader',
  component: PanelNavHeader,
  argTypes: {
    title: { control: 'text' },
    previousLabel: { control: 'text' },
    nextLabel: { control: 'text' }
  }
} satisfies Meta<typeof PanelNavHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

function getNavButtons(canvasElement: HTMLElement): HTMLElement[] {
  return Array.from(canvasElement.querySelectorAll('button'));
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const title = canvasElement.querySelector('h2') as HTMLElement;
    expect(title.textContent).toBe(
      'Semana 24 – 30 de marzo 2025 · 10 de 17 colaboradores'
    );
    expect(getComputedStyle(title).fontSize).toBe('16px');
    expect(getComputedStyle(title).fontWeight).toBe('600');
    expect(getComputedStyle(title).color).toBe(tokenValue('--color-text-primary'));

    // Two square step controls, each a real button named for screen readers.
    const buttons = getNavButtons(canvasElement);
    expect(buttons).toHaveLength(2);
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      'Semana anterior',
      'Semana siguiente'
    ]);
    expect(buttons.map((button) => button.getAttribute('type'))).toEqual(['button', 'button']);

    // A real chevron svg per button proves the offline icon collection renders.
    expect(buttons.map((button) => button.querySelectorAll('svg').length)).toEqual([1, 1]);

    const style = getComputedStyle(buttons[0]);
    expect(style.width).toBe('28px');
    expect(style.height).toBe('28px');
    expect(style.borderTopColor).toBe(
      tokenValue('--color-border-subtle', 'background-color')
    );

    // The slot only holds the design's GhostChip instance when a caller passes one.
    expect(canvasElement.querySelector('[data-slot="actions"]')).toBeNull();
  }
};

export const Navigation: Story = {
  args: { onPrevious: fn(), onNext: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    const [previous, next] = getNavButtons(canvasElement);

    await userEvent.click(previous);
    expect(args.onPrevious).toHaveBeenCalledOnce();
    expect(args.onNext).not.toHaveBeenCalled();

    await userEvent.click(next);
    expect(args.onNext).toHaveBeenCalledOnce();
  }
};

export const CustomActions: Story = {
  args: { previousLabel: 'Día anterior', nextLabel: 'Día siguiente' },
  render: (args) => (
    <PanelNavHeader {...args}>
      <button type="button" className="text-xs font-semibold">
        Hoy
      </button>
    </PanelNavHeader>
  ),
  play: async ({ canvasElement }) => {
    // The custom labels reach the accessible name of the step controls.
    const labels = Array.from(canvasElement.querySelectorAll('button')).map((button) =>
      button.getAttribute('aria-label')
    );
    expect(labels).toEqual(['Día anterior', 'Día siguiente', null]);

    const actions = canvasElement.querySelector('[data-slot="actions"]') as HTMLElement;
    expect(actions.textContent).toBe('Hoy');
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const title = canvasElement.querySelector('h2') as HTMLElement;
    expect(getComputedStyle(title).color).toBe(tokenValue('--color-text-primary'));
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-50'));

    const [previous] = getNavButtons(canvasElement);
    expect(getComputedStyle(previous).borderTopColor).toBe(
      tokenValue('--color-border-subtle', 'background-color')
    );
    expect(tokenValue('--color-border-subtle', 'background-color')).toBe(
      tokenValue('--color-slate-700', 'background-color')
    );

    // The chevron uses the muted icon token, which also moves in the dark block.
    expect(getComputedStyle(previous.querySelector('svg') as SVGElement).color).toBe(
      tokenValue('--color-icon-muted')
    );
    expect(tokenValue('--color-icon-muted')).toBe(tokenValue('--color-slate-400'));
  }
};
