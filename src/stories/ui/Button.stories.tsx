import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from '../generated/Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: { style: 'Primary' },
  argTypes: {
    style: {
      control: 'select',
      options: ['Primary', 'Secondary', 'Tertiary', 'Destructive']
    }
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

// The generated Button renders one <span> per variant and relies on CSS to hide
// the inactive ones. Only one label must be visible for the active style.
async function expectOnlyVisibleLabel(canvasElement: HTMLElement, expected: string) {
  // `within(canvasElement)` exposes only bound query functions (no `.container`
  // property), so the canvas element itself is the container to inspect.
  const spans = Array.from(canvasElement.querySelectorAll('span'));
  const visible = spans.filter((span) => span.offsetParent !== null);
  expect(visible).toHaveLength(1);
  expect(visible[0].textContent).toBe(expected);
}

export const Primary: Story = {
  args: { style: 'Primary' },
  play: async ({ canvasElement }) => {
    await expectOnlyVisibleLabel(canvasElement, 'Guardar cambios');
  }
};

export const Secondary: Story = {
  args: { style: 'Secondary' },
  play: async ({ canvasElement }) => {
    await expectOnlyVisibleLabel(canvasElement, 'Cancelar');
  }
};

export const Tertiary: Story = {
  args: { style: 'Tertiary' },
  play: async ({ canvasElement }) => {
    await expectOnlyVisibleLabel(canvasElement, 'Ver detalle →');
  }
};

export const Destructive: Story = {
  args: { style: 'Destructive' },
  play: async ({ canvasElement }) => {
    await expectOnlyVisibleLabel(canvasElement, 'Eliminar insumo');
  }
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', gap: 16 }}>
      <Button style="Primary" />
      <Button style="Secondary" />
      <Button style="Tertiary" />
      <Button style="Destructive" />
    </div>
  )
};

export const DarkTheme: Story = {
  render: () => (
    <div data-semantic="dark" style={{ background: 'var(--color-bg-canvas)' }}>
      <Button style="Primary" />
    </div>
  )
};
