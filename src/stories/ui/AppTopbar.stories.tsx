import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { AppTopbar } from '../generated/AppTopbar';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/AppTopbar',
  component: AppTopbar,
  parameters: { layout: 'fullscreen' },
  args: {
    title: 'Indicadores · Ventas',
    rangeLabel: '1 – 31 Mar 2025',
    userName: 'Gerencia',
    initials: 'LC'
  },
  argTypes: {
    title: { control: 'text' },
    rangeLabel: { control: 'text' },
    userName: { control: 'text' },
    initials: { control: 'text' }
  },
  render: (args) => (
    <div className="w-[1200px] max-w-full bg-(--color-bg-canvas)">
      <AppTopbar {...args} />
    </div>
  )
} satisfies Meta<typeof AppTopbar>;

export default meta;

type Story = StoryObj<typeof meta>;

async function expectTitle(canvasElement: HTMLElement, copy: string) {
  const title = canvasElement.querySelector('header > span') as HTMLElement;
  expect(title.textContent).toBe(copy);
  expect(getComputedStyle(title).fontSize).toBe('14px');
  expect(getComputedStyle(title).color).toBe(tokenValue('--color-text-primary'));
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const header = canvasElement.querySelector('header');
    expect(header).not.toBeNull();
    expect(header?.textContent).toContain('Indicadores · Ventas');

    await expectTitle(canvasElement, 'Indicadores · Ventas');

    const buttons = canvasElement.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].getAttribute('aria-label')).toBe('Rango de fechas: 1 – 31 Mar 2025');
    expect(buttons[1].getAttribute('aria-label')).toBe('Menú de usuario: Gerencia');

    // The user block embeds the Avatar (initials) and both chevrons.
    expect(canvasElement.querySelector('[data-avatar]')?.textContent).toBe('LC');
    expect(canvasElement.querySelectorAll('svg').length).toBeGreaterThanOrEqual(3);
  }
};

export const Interactions: Story = {
  args: { onRangeClick: fn(), onUserClick: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    const buttons = canvasElement.querySelectorAll('button');

    await userEvent.click(buttons[0]);
    expect(args.onRangeClick).toHaveBeenCalledOnce();

    await userEvent.click(buttons[1]);
    expect(args.onUserClick).toHaveBeenCalledOnce();
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    await expectTitle(canvasElement, 'Indicadores · Ventas');

    // The bar surface and its hairline border both come from the dark block
    // (slate-900 / slate-700); leaving them frozen would paint a light bar on a
    // dark canvas.
    const header = canvasElement.querySelector('header') as HTMLElement;
    expect(getComputedStyle(header).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
    expect(tokenValue('--color-bg-surface', 'background-color')).toBe(
      tokenValue('--color-slate-900', 'background-color')
    );
    expect(getComputedStyle(header).borderBottomColor).toBe(
      tokenValue('--color-border-subtle')
    );

    // The range trigger keeps its surface and takes the same dark border.
    const trigger = canvasElement.querySelector('button') as HTMLElement;
    expect(getComputedStyle(trigger).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
    expect(getComputedStyle(trigger).color).toBe(tokenValue('--color-text-primary'));
  }
};
