import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Panel } from '../generated/Panel';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/Panel',
  component: Panel,
  args: { title: 'Evolución de ventas', actionLabel: 'Ver detalle →' },
  argTypes: {
    title: { control: 'text' },
    actionLabel: { control: 'text' }
  }
} satisfies Meta<typeof Panel>;

export default meta;

type Story = StoryObj<typeof meta>;

function getPanel(canvasElement: HTMLElement): HTMLElement {
  const panels = canvasElement.querySelectorAll('section');
  expect(panels).toHaveLength(1);
  return panels[0] as HTMLElement;
}

async function expectTitle(panel: HTMLElement) {
  const title = panel.querySelector('h2') as HTMLElement;
  expect(title.textContent).toBe('Evolución de ventas');
  // `text-(length:--type-body-size)` keeps the size from overriding the colour.
  expect(getComputedStyle(title).fontSize).toBe('14px');
  expect(getComputedStyle(title).color).toBe(tokenValue('--color-text-primary'));
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const panel = getPanel(canvasElement);

    await expectTitle(panel);
    expect(panel.textContent).toContain('Contenido de la sección');

    const action = panel.querySelector('header button');
    expect(action?.textContent).toBe('Ver detalle →');
  }
};

export const CustomBody: Story = {
  args: { title: 'Margen por familia' },
  render: (args) => (
    <Panel {...args}>
      <p className="font-[Inter] text-sm text-(--color-text-primary)">Chart placeholder</p>
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const panel = getPanel(canvasElement);
    expect(panel.textContent).toContain('Chart placeholder');
    expect(panel.textContent).not.toContain('Contenido de la sección');
  }
};

// `actionLabel=""` is the design's way of omitting the header action.
export const WithoutAction: Story = {
  args: { actionLabel: '' },
  play: async ({ canvasElement }) => {
    expect(getPanel(canvasElement).querySelector('header button')).toBeNull();
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-(--color-bg-canvas) p-4">
      <Panel />
      <Panel title="Margen por familia" actionLabel="" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const panels = Array.from(canvasElement.querySelectorAll('section'));
    expect(panels).toHaveLength(2);
    expect(panels.map((panel) => panel.querySelector('h2')?.textContent)).toEqual([
      'Evolución de ventas',
      'Margen por familia'
    ]);

    // Only the panel with an action renders the header button.
    expect(panels.map((panel) => panel.querySelector('header button') === null)).toEqual([
      false,
      true
    ]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const panel = getPanel(canvasElement);
    await expectTitle(panel);

    // The section surface and the recessed body both come from the dark block
    // (slate-900 / slate-950), so a lost theme hook shows up as a light card.
    expect(getComputedStyle(panel).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
    expect(tokenValue('--color-bg-surface', 'background-color')).toBe(
      tokenValue('--color-slate-900', 'background-color')
    );
    const body = panel.querySelector('header + div') as HTMLElement;
    expect(getComputedStyle(body).backgroundColor).toBe(
      tokenValue('--color-bg-canvas', 'background-color')
    );
    expect(tokenValue('--color-bg-canvas', 'background-color')).toBe(
      tokenValue('--color-slate-950', 'background-color')
    );
    expect(getComputedStyle(panel.querySelector('header button') as HTMLElement).color).toBe(
      tokenValue('--color-action-primary')
    );
  }
};
