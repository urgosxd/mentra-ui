import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Badge } from '../generated/Badge';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  args: { tone: 'Positivo', label: 'Activo' },
  argTypes: {
    tone: {
      control: 'select',
      options: ['Positivo', 'Advertencia', 'Negativo', 'Informativo', 'Neutro']
    },
    label: { control: 'text' }
  }
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

// The re-exported Badge renders a single <div> carrying data-tone and one label
// <span>; the old per-tone hidden spans are gone. Asserting the tone attribute is
// the contract the styling branches on, without asserting class names.
async function expectBadge(
  canvasElement: HTMLElement,
  expected: { tone: string; label: string }
) {
  const badges = canvasElement.querySelectorAll('[data-tone]');
  expect(badges).toHaveLength(1);
  const badge = badges[0];

  expect(badge.tagName).toBe('DIV');
  expect(badge.getAttribute('data-tone')).toBe(expected.tone);
  expect(badge.textContent).toBe(expected.label);

  const labels = Array.from(badge.querySelectorAll('span')).filter(
    (span) => (span.textContent ?? '').trim() !== ''
  );
  expect(labels).toHaveLength(1);
  expect(labels[0].textContent).toBe(expected.label);
}

export const Positivo: Story = {
  play: async ({ canvasElement }) => {
    await expectBadge(canvasElement, { tone: 'Positivo', label: 'Activo' });
  }
};

export const Advertencia: Story = {
  args: { tone: 'Advertencia', label: 'Stock bajo' },
  play: async ({ canvasElement }) => {
    await expectBadge(canvasElement, { tone: 'Advertencia', label: 'Stock bajo' });
  }
};

export const Negativo: Story = {
  args: { tone: 'Negativo', label: 'Sobre objetivo' },
  play: async ({ canvasElement }) => {
    await expectBadge(canvasElement, { tone: 'Negativo', label: 'Sobre objetivo' });
  }
};

export const Informativo: Story = {
  args: { tone: 'Informativo', label: 'Programado' },
  play: async ({ canvasElement }) => {
    await expectBadge(canvasElement, { tone: 'Informativo', label: 'Programado' });
  }
};

export const Neutro: Story = {
  args: { tone: 'Neutro', label: 'Pendiente' },
  play: async ({ canvasElement }) => {
    await expectBadge(canvasElement, { tone: 'Neutro', label: 'Pendiente' });
  }
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', gap: 16 }}>
      <Badge tone="Positivo" />
      <Badge tone="Advertencia" label="Stock bajo" />
      <Badge tone="Negativo" label="Sobre objetivo" />
      <Badge tone="Informativo" label="Programado" />
      <Badge tone="Neutro" label="Pendiente" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tones = Array.from(canvasElement.querySelectorAll('[data-tone]')).map((badge) =>
      badge.getAttribute('data-tone')
    );
    expect(tones).toEqual(['Positivo', 'Advertencia', 'Negativo', 'Informativo', 'Neutro']);

    // Every tone also paints its label with its own token; a tone that lost its
    // colour would collapse onto its neighbour here.
    const colors = Array.from(canvasElement.querySelectorAll('[data-tone] > span')).map(
      (label) => getComputedStyle(label).color
    );
    expect(colors).toEqual([
      tokenValue('--color-text-success'),
      tokenValue('--color-text-warning'),
      tokenValue('--color-text-danger'),
      tokenValue('--color-text-info'),
      tokenValue('--color-text-secondary')
    ]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  render: () => <Badge tone="Neutro" label="Pendiente" />,
  play: async ({ canvasElement }) => {
    await expectBadge(canvasElement, { tone: 'Neutro', label: 'Pendiente' });
  }
};
