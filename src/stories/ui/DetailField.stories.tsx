import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DetailField } from '../generated/DetailField';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/DetailField',
  component: DetailField,
  args: { label: 'Nombres', value: 'Carlos' },
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' }
  }
} satisfies Meta<typeof DetailField>;

export default meta;

type Story = StoryObj<typeof meta>;

function getField(canvasElement: HTMLElement) {
  const fields = canvasElement.querySelectorAll('[data-detail-field]');
  expect(fields).toHaveLength(1);
  const field = fields[0] as HTMLElement;

  const term = field.querySelector('dt');
  const definition = field.querySelector('dd');
  if (term === null || definition === null) throw new Error('the field is not a term/definition pair');

  return { field, term, definition };
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const { field, term, definition } = getField(canvasElement);

    expect(term.textContent).toBe('Nombres');
    expect(definition.textContent).toBe('Carlos');
    // The pair is a description list, so the label names the value.
    expect(field.querySelectorAll('dt')).toHaveLength(1);
    expect(field.querySelectorAll('dd')).toHaveLength(1);

    // Label 10px in the secondary tone, value 11px semibold in the primary one.
    expect(getComputedStyle(term).fontSize).toBe('10px');
    expect(getComputedStyle(term).fontWeight).toBe('400');
    expect(getComputedStyle(term).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-neutral-500'));

    expect(getComputedStyle(definition).fontSize).toBe('11px');
    expect(getComputedStyle(definition).fontWeight).toBe('600');
    expect(getComputedStyle(definition).color).toBe(tokenValue('--color-text-primary'));
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-900'));

    // Column with the export's 1px gap, label above value.
    expect(getComputedStyle(field).display).toBe('flex');
    expect(getComputedStyle(field).flexDirection).toBe('column');
    expect(getComputedStyle(field).gap).toBe('1px');
  }
};

// A detail panel stacks several fields; each pair keeps its own label and value.
export const FieldGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-3 bg-(--color-bg-canvas) p-4">
      <DetailField label="Nombres" value="Carlos" />
      <DetailField label="Apellidos" value="Quispe Rojas" />
      <DetailField label="Área" value="Cocina" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const fields = Array.from(canvasElement.querySelectorAll('[data-detail-field]'));
    expect(fields).toHaveLength(3);

    expect(fields.map((field) => field.querySelector('dt')?.textContent)).toEqual([
      'Nombres',
      'Apellidos',
      'Área'
    ]);
    expect(fields.map((field) => field.querySelector('dd')?.textContent)).toEqual([
      'Carlos',
      'Quispe Rojas',
      'Cocina'
    ]);
    // Every field resolves the value to the primary tone, none inherits a stale one.
    const colours = fields.map(
      (field) => getComputedStyle(field.querySelector('dd') as HTMLElement).color
    );
    expect(new Set(colours)).toEqual(new Set([tokenValue('--color-text-primary')]));
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const { term, definition } = getField(canvasElement);
    expect(term.textContent).toBe('Nombres');
    expect(definition.textContent).toBe('Carlos');

    // Both tones flip in the dark block: neutral-500 -> slate-400 and
    // neutral-900 -> neutral-50.
    expect(getComputedStyle(term).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(term).color).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(definition).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(definition).color).toBe(tokenValue('--color-neutral-50'));
  }
};
