import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { CardKpi } from '../generated/CardKpi';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/CardKpi',
  component: CardKpi,
  args: {
    tone: 'Positivo',
    'título': 'Ventas del día',
    valor: 'S/ 14 820',
    detalle: '+8,4 % vs. mes anterior'
  },
  argTypes: {
    tone: { control: 'select', options: ['Positivo', 'Negativo', 'Neutro'] },
    'título': { control: 'text' },
    valor: { control: 'text' },
    detalle: { control: 'text' }
  }
} satisfies Meta<typeof CardKpi>;

export default meta;

type Story = StoryObj<typeof meta>;

// The card is three text nodes in order: título, valor, detalle. Asserting the
// rendered strings (and that the card is not clipping them) keeps the story on
// observable behaviour instead of utility classes.
async function expectCard(
  canvasElement: HTMLElement,
  expected: { tone: string; título: string; valor: string; detalle: string }
) {
  const cards = canvasElement.querySelectorAll('[data-tone]');
  expect(cards).toHaveLength(1);
  const card = cards[0] as HTMLElement;

  expect(card.getAttribute('data-tone')).toBe(expected.tone);
  expect(card.textContent).toBe(`${expected.título}${expected.valor}${expected.detalle}`);

  const lines = Array.from(card.querySelectorAll('span'))
    .map((span) => span.textContent)
    .filter((text) => (text ?? '') !== '');
  expect(lines).toEqual([expected.título, expected.valor, expected.detalle]);
}

export const Positivo: Story = {
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, {
      tone: 'Positivo',
      título: 'Ventas del día',
      valor: 'S/ 14 820',
      detalle: '+8,4 % vs. mes anterior'
    });
  }
};

export const Negativo: Story = {
  args: {
    tone: 'Negativo',
    'título': 'Mermas del mes',
    valor: '-S/ 1 240',
    detalle: '-3,1 % vs. mes anterior'
  },
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, {
      tone: 'Negativo',
      título: 'Mermas del mes',
      valor: '-S/ 1 240',
      detalle: '-3,1 % vs. mes anterior'
    });
  }
};

export const Neutro: Story = {
  args: {
    tone: 'Neutro',
    'título': 'Tickets emitidos',
    valor: '1 284',
    detalle: 'sin comparación'
  },
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, {
      tone: 'Neutro',
      título: 'Tickets emitidos',
      valor: '1 284',
      detalle: 'sin comparación'
    });
  }
};

// Long copy: the card is a fixed w-60 with wrapping text and no truncation
// utilities, so it must grow vertically instead of ellipsizing. The clipping
// check (scrollHeight within clientHeight) is the observable form of "nothing is
// silently cut".
export const LongValues: Story = {
  args: {
    'título': 'Ventas netas acumuladas del trimestre en curso por familia de producto',
    valor: 'S/ 1 284 930,45',
    detalle:
      '+18,4 % vs. el mismo trimestre del año anterior, impulsado por la campaña mayorista'
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-tone]') as HTMLElement;

    expect(card.textContent).toContain('S/ 1 284 930,45');
    expect(card.textContent).toContain('impulsado por la campaña mayorista');
    expect(card.scrollHeight).toBeLessThanOrEqual(card.clientHeight + 1);
    expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth + 1);
  }
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', gap: 16, alignItems: 'flex-start' }}>
      <CardKpi />
      <CardKpi tone="Negativo" título="Mermas del mes" valor="-S/ 1 240" detalle="-3,1 %" />
      <CardKpi tone="Neutro" título="Tickets emitidos" valor="1 284" detalle="sin comparación" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tones = Array.from(canvasElement.querySelectorAll('[data-tone]')).map((card) =>
      card.getAttribute('data-tone')
    );
    expect(tones).toEqual(['Positivo', 'Negativo', 'Neutro']);

    // The tone only paints the `detalle` line; each one must resolve its own
    // token instead of falling back to the shared default.
    const detalleColors = Array.from(canvasElement.querySelectorAll('[data-tone]')).map((card) => {
      const lines = Array.from(card.querySelectorAll('span')).filter(
        (span) => (span.textContent ?? '') !== ''
      );
      return getComputedStyle(lines[lines.length - 1]).color;
    });
    expect(detalleColors).toEqual([
      tokenValue('--color-text-success'),
      tokenValue('--color-text-danger'),
      tokenValue('--color-text-secondary')
    ]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  render: () => <CardKpi />,
  play: async ({ canvasElement }) => {
    await expectCard(canvasElement, {
      tone: 'Positivo',
      título: 'Ventas del día',
      valor: 'S/ 14 820',
      detalle: '+8,4 % vs. mes anterior'
    });
  }
};
