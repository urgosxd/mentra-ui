import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Badge } from '../generated/Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  args: { tone: 'Positivo' },
  argTypes: {
    tone: {
      control: 'select',
      options: ['Positivo', 'Advertencia', 'Negativo', 'Informativo', 'Neutro']
    }
  }
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

// The generated Badge renders one <span> per tone and relies on CSS to hide the
// inactive ones. Only one label must be visible for the active tone.
async function expectOnlyVisibleLabel(canvasElement: HTMLElement, expected: string) {
  // `within(canvasElement)` exposes only bound query functions (no `.container`
  // property), so the canvas element itself is the container to inspect.
  const spans = Array.from(canvasElement.querySelectorAll('span'));
  const visible = spans.filter((span) => span.offsetParent !== null);
  expect(visible).toHaveLength(1);
  expect(visible[0].textContent).toBe(expected);
}

export const Positivo: Story = {
  args: { tone: 'Positivo' },
  play: async ({ canvasElement }) => {
    await expectOnlyVisibleLabel(canvasElement, 'Activo');
  }
};

export const Advertencia: Story = {
  args: { tone: 'Advertencia' },
  play: async ({ canvasElement }) => {
    await expectOnlyVisibleLabel(canvasElement, 'Stock bajo');
  }
};

export const Negativo: Story = {
  args: { tone: 'Negativo' },
  play: async ({ canvasElement }) => {
    await expectOnlyVisibleLabel(canvasElement, 'Sobre objetivo');
  }
};

export const Informativo: Story = {
  args: { tone: 'Informativo' },
  play: async ({ canvasElement }) => {
    await expectOnlyVisibleLabel(canvasElement, 'Programado');
  }
};

export const Neutro: Story = {
  args: { tone: 'Neutro' },
  play: async ({ canvasElement }) => {
    await expectOnlyVisibleLabel(canvasElement, 'Pendiente');
  }
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', gap: 16 }}>
      <Badge tone="Positivo" />
      <Badge tone="Advertencia" />
      <Badge tone="Negativo" />
      <Badge tone="Informativo" />
      <Badge tone="Neutro" />
    </div>
  )
};

export const DarkTheme: Story = {
  render: () => (
    <div data-semantic="dark" style={{ background: 'var(--color-bg-canvas)' }}>
      <Badge tone="Neutro" />
    </div>
  )
};
