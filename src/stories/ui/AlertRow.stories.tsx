import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { AlertRow, type AlertTone } from '../generated/AlertRow';
import { tokenValue } from './styleProbe';

const ALERT_TONES: AlertTone[] = ['Negativo', 'Advertencia', 'Informativo', 'Positivo'];

const meta = {
  title: 'UI/AlertRow',
  component: AlertRow,
  args: {
    tone: 'Negativo',
    label: '3 turnos sin cubrir',
    detail: 'Revisar personal de salón para el 29/03',
    date: '24/03'
  },
  argTypes: {
    tone: { control: 'select', options: ALERT_TONES },
    label: { control: 'text' },
    detail: { control: 'text' },
    date: { control: 'text' }
  }
} satisfies Meta<typeof AlertRow>;

export default meta;

type Story = StoryObj<typeof meta>;

type Expectation = {
  tone: AlertTone;
  label: string;
  detail: string;
  date: string;
  /** Semantic colour token the tone dot paints with. */
  dot: string;
  /** Primitive the semantic collapses to in the active theme. */
  primitive: string;
};

async function expectAlertRow(canvasElement: HTMLElement, expected: Expectation) {
  const rows = canvasElement.querySelectorAll('[data-tone]');
  expect(rows).toHaveLength(1);
  const row = rows[0] as HTMLElement;
  expect(row.getAttribute('data-tone')).toBe(expected.tone);

  const parts = Array.from(row.children) as HTMLElement[];
  expect(parts).toHaveLength(3);
  const [dot, stack, date] = parts;

  // The 7px dot is decoration: the tone reaches assistive tech through the title
  // copy, never as an unlabelled colour square.
  expect(dot.getAttribute('aria-hidden')).toBe('true');
  expect(getComputedStyle(dot).backgroundColor).toBe(tokenValue(expected.dot, 'background-color'));
  expect(tokenValue(expected.dot, 'background-color')).toBe(
    tokenValue(expected.primitive, 'background-color')
  );

  const texts = Array.from(stack.children) as HTMLElement[];
  expect(texts).toHaveLength(2);
  const [title, detail] = texts;
  expect(title.textContent).toBe(expected.label);
  expect(detail.textContent).toBe(expected.detail);
  expect(date.textContent).toBe(expected.date);

  // Three different text weights of hierarchy, each from its own semantic token.
  expect(getComputedStyle(title).color).toBe(tokenValue('--color-text-primary'));
  expect(getComputedStyle(detail).color).toBe(tokenValue('--color-text-secondary'));
  expect(getComputedStyle(date).color).toBe(tokenValue('--color-text-muted'));
  expect(getComputedStyle(title).fontWeight).toBe('600');
  expect(getComputedStyle(detail).fontWeight).toBe('400');

  // The separator is a hairline in the divider token, not a colour literal.
  expect(getComputedStyle(row).borderBottomWidth).toBe('1px');
  expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-border-divider'));
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expectAlertRow(canvasElement, {
      tone: 'Negativo',
      label: '3 turnos sin cubrir',
      detail: 'Revisar personal de salón para el 29/03',
      date: '24/03',
      dot: '--color-text-danger',
      primitive: '--color-red-600'
    });
  }
};

export const Advertencia: Story = {
  args: { tone: 'Advertencia' },
  play: async ({ canvasElement }) => {
    await expectAlertRow(canvasElement, {
      tone: 'Advertencia',
      label: '3 turnos sin cubrir',
      detail: 'Revisar personal de salón para el 29/03',
      date: '24/03',
      dot: '--color-text-warning',
      primitive: '--color-amber-700'
    });
  }
};

export const Informativo: Story = {
  args: { tone: 'Informativo' },
  play: async ({ canvasElement }) => {
    await expectAlertRow(canvasElement, {
      tone: 'Informativo',
      label: '3 turnos sin cubrir',
      detail: 'Revisar personal de salón para el 29/03',
      date: '24/03',
      dot: '--color-text-info',
      primitive: '--color-blue-600'
    });
  }
};

export const Positivo: Story = {
  args: {
    tone: 'Positivo',
    label: 'Dotación completa',
    detail: 'Todos los turnos del 24/03 quedaron cubiertos',
    date: '25/03'
  },
  play: async ({ canvasElement }) => {
    await expectAlertRow(canvasElement, {
      tone: 'Positivo',
      label: 'Dotación completa',
      detail: 'Todos los turnos del 24/03 quedaron cubiertos',
      date: '25/03',
      dot: '--color-text-success',
      primitive: '--color-green-600'
    });
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex max-w-[712px] flex-wrap gap-6 bg-(--color-bg-canvas) p-4">
      {ALERT_TONES.map((tone) => (
        <AlertRow key={tone} tone={tone} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = Array.from(canvasElement.querySelectorAll('[data-tone]'));
    expect(rows.map((row) => row.getAttribute('data-tone'))).toEqual(ALERT_TONES);

    // Four tones, four distinct dot colours: a tone that lost its own token would
    // collapse onto its neighbour here.
    const dots = rows.map((row) => getComputedStyle(row.children[0]).backgroundColor);
    expect(dots).toEqual([
      tokenValue('--color-text-danger', 'background-color'),
      tokenValue('--color-text-warning', 'background-color'),
      tokenValue('--color-text-info', 'background-color'),
      tokenValue('--color-text-success', 'background-color')
    ]);
    expect(new Set(dots).size).toBe(ALERT_TONES.length);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    await expectAlertRow(canvasElement, {
      tone: 'Negativo',
      label: '3 turnos sin cubrir',
      detail: 'Revisar personal de salón para el 29/03',
      date: '24/03',
      dot: '--color-text-danger',
      primitive: '--color-red-300'
    });

    // The dark block also repaints the divider (slate-800) and the primary copy
    // (neutral-50), so neither can stay frozen at its light value.
    const row = canvasElement.querySelector('[data-tone]') as HTMLElement;
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-slate-800'));
    const title = row.children[1].children[0] as HTMLElement;
    expect(getComputedStyle(title).color).toBe(tokenValue('--color-neutral-50'));
  }
};
