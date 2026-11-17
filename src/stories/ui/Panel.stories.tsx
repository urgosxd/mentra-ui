import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Panel } from '../generated/Panel';

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

// Resolve a token through the browser so the same guard works in both themes.
function tokenColor(variable: string): string {
  const probe = document.createElement('span');
  probe.style.color = `var(${variable})`;
  document.body.append(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
}

async function expectTitle(panel: HTMLElement) {
  const title = panel.querySelector('h2') as HTMLElement;
  expect(title.textContent).toBe('Evolución de ventas');
  // `text-(length:--type-body-size)` keeps the size from overriding the colour.
  expect(getComputedStyle(title).fontSize).toBe('14px');
  expect(getComputedStyle(title).color).toBe(tokenColor('--color-text-primary'));
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

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    await expectTitle(getPanel(canvasElement));
  }
};
