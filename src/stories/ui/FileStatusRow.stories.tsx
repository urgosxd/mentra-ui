import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { FileStatusRow, type FileStatus } from '../generated/FileStatusRow';
import { tokenValue } from './styleProbe';

const FILE_STATES: FileStatus[] = ['Completo', 'Pendiente'];

const meta = {
  title: 'UI/FileStatusRow',
  component: FileStatusRow,
  args: { estado: 'Completo', document: 'Datos personales' },
  argTypes: {
    estado: { control: 'select', options: FILE_STATES },
    document: { control: 'text' }
  }
} satisfies Meta<typeof FileStatusRow>;

export default meta;

type Story = StoryObj<typeof meta>;

type Expectation = {
  estado: FileStatus;
  document: string;
  /** Semantic token painting the leading lucide icon. */
  icon: string;
  /** Primitive the semantic collapses to in the active theme. */
  primitive: string;
  /** Badge tone the row derives from the state. */
  badgeTone: string;
  /** Feedback surface token behind the badge. */
  badgeBg: string;
  badgeBgPrimitive: string;
  /** Semantic text token of the badge label. */
  badgeText: string;
};

async function expectFileStatusRow(canvasElement: HTMLElement, expected: Expectation) {
  const rows = canvasElement.querySelectorAll('[data-estado]');
  expect(rows).toHaveLength(1);
  const row = rows[0] as HTMLElement;
  expect(row.getAttribute('data-estado')).toBe(expected.estado);

  const parts = Array.from(row.children) as HTMLElement[];
  expect(parts).toHaveLength(3);
  const [icon, documentText, badge] = parts;

  // A real lucide graphic, not iconify's empty placeholder span for a missing icon.
  expect(icon.tagName.toLowerCase()).toBe('svg');
  expect(icon.getAttribute('aria-hidden')).toBe('true');
  expect(icon.querySelectorAll('path').length).toBeGreaterThan(0);
  expect(getComputedStyle(icon).width).toBe('13px');
  expect(getComputedStyle(icon).height).toBe('13px');
  expect(getComputedStyle(icon).color).toBe(tokenValue(expected.icon));
  expect(tokenValue(expected.icon)).toBe(tokenValue(expected.primitive));

  expect(documentText.textContent).toBe(expected.document);
  expect(getComputedStyle(documentText).color).toBe(tokenValue('--color-text-primary'));

  // The trailing badge is the shared Badge component, so the row only has to get
  // its tone and label right.
  expect(badge.tagName).toBe('DIV');
  expect(badge.getAttribute('data-tone')).toBe(expected.badgeTone);
  const badgeLabel = badge.querySelector('span') as HTMLElement;
  expect(badgeLabel).not.toBeNull();
  expect(badgeLabel.textContent).toBe(expected.estado);
  expect(getComputedStyle(badge).backgroundColor).toBe(
    tokenValue(expected.badgeBg, 'background-color')
  );
  expect(tokenValue(expected.badgeBg, 'background-color')).toBe(
    tokenValue(expected.badgeBgPrimitive, 'background-color')
  );
  expect(getComputedStyle(badgeLabel).color).toBe(tokenValue(expected.badgeText));
  expect(tokenValue(expected.badgeText)).toBe(tokenValue(expected.primitive));
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expectFileStatusRow(canvasElement, {
      estado: 'Completo',
      document: 'Datos personales',
      icon: '--color-text-success',
      primitive: '--color-green-600',
      badgeTone: 'Positivo',
      badgeBg: '--color-feedback-success-bg',
      badgeBgPrimitive: '--color-green-50',
      badgeText: '--color-text-success'
    });
  }
};

export const Completo: Story = {
  args: { estado: 'Completo' },
  play: async ({ canvasElement }) => {
    await expectFileStatusRow(canvasElement, {
      estado: 'Completo',
      document: 'Datos personales',
      icon: '--color-text-success',
      primitive: '--color-green-600',
      badgeTone: 'Positivo',
      badgeBg: '--color-feedback-success-bg',
      badgeBgPrimitive: '--color-green-50',
      badgeText: '--color-text-success'
    });
  }
};

export const Pendiente: Story = {
  args: { estado: 'Pendiente', document: 'Contrato firmado' },
  play: async ({ canvasElement }) => {
    await expectFileStatusRow(canvasElement, {
      estado: 'Pendiente',
      document: 'Contrato firmado',
      icon: '--color-text-warning',
      primitive: '--color-amber-700',
      badgeTone: 'Advertencia',
      badgeBg: '--color-feedback-warning-bg',
      badgeBgPrimitive: '--color-amber-50',
      badgeText: '--color-text-warning'
    });
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 bg-(--color-bg-canvas) p-4">
      {FILE_STATES.map((estado) => (
        <FileStatusRow key={estado} estado={estado} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = Array.from(canvasElement.querySelectorAll('[data-estado]'));
    expect(rows.map((row) => row.getAttribute('data-estado'))).toEqual(FILE_STATES);
    expect(rows.map((row) => row.querySelector('[data-tone]')?.getAttribute('data-tone'))).toEqual([
      'Positivo',
      'Advertencia'
    ]);

    // Each state pairs its own icon colour with its own feedback surface, so the
    // two rows must differ on both.
    const iconColors = rows.map((row) => getComputedStyle(row.querySelector('svg') as Element).color);
    expect(iconColors).toEqual([
      tokenValue('--color-text-success'),
      tokenValue('--color-text-warning')
    ]);
    const badgeFills = rows.map((row) =>
      getComputedStyle(row.querySelector('[data-tone]') as Element).backgroundColor
    );
    expect(badgeFills).toEqual([
      tokenValue('--color-feedback-success-bg', 'background-color'),
      tokenValue('--color-feedback-warning-bg', 'background-color')
    ]);
    expect(iconColors[0]).not.toBe(iconColors[1]);
    expect(badgeFills[0]).not.toBe(badgeFills[1]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    await expectFileStatusRow(canvasElement, {
      estado: 'Completo',
      document: 'Datos personales',
      icon: '--color-text-success',
      primitive: '--color-green-300',
      badgeTone: 'Positivo',
      badgeBg: '--color-feedback-success-bg',
      badgeBgPrimitive: '--color-green-950',
      badgeText: '--color-text-success'
    });

    // The document title follows the dark text ramp as well.
    const row = canvasElement.querySelector('[data-estado]') as HTMLElement;
    expect(getComputedStyle(row.children[1]).color).toBe(tokenValue('--color-neutral-50'));
  }
};
