import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FormField } from '../generated/FormField';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/FormField',
  component: FormField,
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' }
  }
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

function getInput(canvasElement: HTMLElement): HTMLInputElement {
  const inputs = canvasElement.querySelectorAll('input');
  expect(inputs).toHaveLength(1);
  return inputs[0] as HTMLInputElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = getInput(canvasElement);
    const label = canvasElement.querySelector('label') as HTMLLabelElement;

    expect(label.textContent).toBe('Colaborador');
    // A real label/input pair: `htmlFor` points at the input's generated id, so
    // the accessible name is the design's label text.
    expect(input.id).not.toBe('');
    expect(label.htmlFor).toBe(input.id);
    expect(canvas.getByLabelText('Colaborador')).toBe(input);

    // The value the export shows is carried as the placeholder.
    expect(input.placeholder).toBe('Carlos Quispe');
    expect(input.value).toBe('');

    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(label).fontSize).toBe('10px');

    const frame = canvasElement.querySelector('[data-input-frame]') as HTMLElement;
    expect(getComputedStyle(frame).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
    expect(getComputedStyle(frame).height).toBe('32px');
    expect(getComputedStyle(input).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(input).fontSize).toBe('11.5px');
  }
};

export const Typing: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Colaborador') as HTMLInputElement;

    await userEvent.type(input, 'Ana Torres');

    expect(input.value).toBe('Ana Torres');
    expect(document.activeElement).toBe(input);
  }
};

export const CustomLabel: Story = {
  args: { label: 'Área', placeholder: 'Cocina' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Área') as HTMLInputElement;

    expect((canvasElement.querySelector('label') as HTMLLabelElement).textContent).toBe(
      'Área'
    );
    expect(input.placeholder).toBe('Cocina');
  }
};

// Two fields on the same form never share an id.
export const MultipleFields: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <FormField {...args} />
      <FormField {...args} label="Cargo" placeholder="Jefe de Cocina" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const inputs = Array.from(canvasElement.querySelectorAll('input'));
    expect(inputs).toHaveLength(2);
    expect(inputs[0].id).not.toBe(inputs[1].id);

    const labels = Array.from(canvasElement.querySelectorAll('label')).map(
      (label) => (label as HTMLLabelElement).htmlFor
    );
    expect(labels).toEqual([inputs[0].id, inputs[1].id]);

    const canvas = within(canvasElement);
    expect(canvas.getByLabelText('Colaborador')).toBe(inputs[0]);
    expect(canvas.getByLabelText('Cargo')).toBe(inputs[1]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const label = canvasElement.querySelector('label') as HTMLLabelElement;
    expect(getComputedStyle(label).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-slate-400'));

    // Field surface (slate-900) and value colour (neutral-50) both come from the
    // dark block; a frozen white frame would glow on the dark canvas.
    const frame = canvasElement.querySelector('[data-input-frame]') as HTMLElement;
    expect(getComputedStyle(frame).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
    expect(tokenValue('--color-bg-surface', 'background-color')).toBe(
      tokenValue('--color-slate-900', 'background-color')
    );
    expect(getComputedStyle(getInput(canvasElement)).color).toBe(
      tokenValue('--color-text-primary')
    );
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-50'));
  }
};
