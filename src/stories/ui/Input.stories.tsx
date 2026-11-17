import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Input } from '../generated/Input';
import {
  declaredStateValues,
  resolveDeclaration,
  tokenValue
} from './styleProbe';

const meta = {
  title: 'UI/Input',
  component: Input,
  args: { defaultValue: 'Harina sin preparar', disabled: false, invalid: false },
  argTypes: {
    defaultValue: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' }
  }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

// The export wraps a real <input> in a styled <div> that mirrors the state as
// data-invalid / data-disabled. Assertions stay on those DOM facts plus the
// native <input> behaviour, never on the utility classes.
function getField(canvasElement: HTMLElement): HTMLInputElement {
  const fields = canvasElement.querySelectorAll('input');
  expect(fields).toHaveLength(1);
  const field = fields[0];
  expect(field.tagName).toBe('INPUT');
  return field;
}

export const Default: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const field = getField(canvasElement);
    const wrapper = field.parentElement as HTMLElement;

    expect(field.disabled).toBe(false);
    expect(field.getAttribute('aria-invalid')).toBeNull();
    expect(wrapper.hasAttribute('data-invalid')).toBe(false);
    expect(wrapper.hasAttribute('data-disabled')).toBe(false);

    // Real interaction: the rendered <input> must accept and keep typed text.
    await userEvent.clear(field);
    expect(field).toHaveValue('');
    await userEvent.type(field, 'Azúcar rubia');
    await expect(field).toHaveValue('Azúcar rubia');
  }
};

export const WithValue: Story = {
  args: { defaultValue: 'Harina sin preparar' },
  play: async ({ canvasElement, userEvent }) => {
    const field = getField(canvasElement);

    expect(field).toHaveValue('Harina sin preparar');
    await userEvent.type(field, ' integral');
    await expect(field).toHaveValue('Harina sin preparar integral');
  }
};

export const Invalid: Story = {
  args: { invalid: true },
  play: async ({ canvasElement }) => {
    const field = getField(canvasElement);
    const wrapper = field.parentElement as HTMLElement;

    expect(field.getAttribute('aria-invalid')).toBe('true');
    expect(wrapper.getAttribute('data-invalid')).toBe('true');
  }
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const field = getField(canvasElement);
    const wrapper = field.parentElement as HTMLElement;

    expect(field.disabled).toBe(true);
    expect(wrapper.getAttribute('data-disabled')).toBe('true');
  }
};

// Hover is a `:hover` rule on the wrapper (the label warms to text/primary) and
// focus is real: the wrapper repaints on `:focus-within`. See `declaredStateStyle`
// for why the hovered pseudo-class cannot be computed here.
export const Hover: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const field = getField(canvasElement);
    const wrapper = field.parentElement as HTMLElement;

    expect(getComputedStyle(field).color).toBe(tokenValue('--color-text-secondary'));

    await userEvent.hover(wrapper);

    const hovered = declaredStateValues(field, 'color').map((value) =>
      resolveDeclaration('color', value)
    );
    expect(hovered).toContain(tokenValue('--color-text-primary'));
    // Hover alone must not look like focus.
    expect(getComputedStyle(wrapper).borderTopWidth).toBe('1px');
  }
};

export const Focus: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const field = getField(canvasElement);
    const wrapper = field.parentElement as HTMLElement;

    expect(getComputedStyle(wrapper).borderTopWidth).toBe('1px');

    await userEvent.click(field);
    expect(document.activeElement).toBe(field);

    const focused = getComputedStyle(wrapper);
    expect(focused.borderTopWidth).toBe('2px');
    expect(focused.borderTopColor).toBe(tokenValue('--color-border-focus'));
    expect(getComputedStyle(field).color).toBe(tokenValue('--color-text-primary'));

    await userEvent.type(field, ' integral');
    await expect(field).toHaveValue('Harina sin preparar integral');
  }
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', gap: 16, alignItems: 'center' }}>
      <Input />
      <Input defaultValue="0.00" invalid />
      <Input defaultValue="Sin stock" disabled />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const fields = Array.from(canvasElement.querySelectorAll('input'));
    expect(fields).toHaveLength(3);
    expect(fields.map((field) => field.getAttribute('aria-invalid'))).toEqual([
      null,
      'true',
      null
    ]);
    expect(fields.map((field) => field.disabled)).toEqual([false, false, true]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  render: () => <Input />,
  play: async ({ canvasElement }) => {
    const field = getField(canvasElement);
    await expect(field).toHaveValue('Harina sin preparar');
  }
};
