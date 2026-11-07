import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DateRangePicker } from '../generated/DateRangePicker';

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  args: { disabled: false, label: '1 – 31 Mar 2025' },
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' }
  }
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

// Assertions stay on DOM facts, not on CSS: the label copy, the real button
// semantics (this component renders a <button type="button">, unlike the
// generated Button/Badge which are <div>s) and the disabled contract, which the
// component mirrors as both the native attribute and data-disabled.
async function expectPicker(
  canvasElement: HTMLElement,
  expected: { label: string; disabled?: boolean }
) {
  const button = canvasElement.querySelector('button');
  expect(button).not.toBeNull();
  expect(button?.getAttribute('type')).toBe('button');

  // Iconify renders an empty <span> placeholder per icon until its icon data
  // arrives, so only spans carrying text can be the label.
  const labels = Array.from(button?.querySelectorAll('span') ?? []).filter(
    (span) => span.offsetParent !== null && (span.textContent ?? '').trim() !== ''
  );
  expect(labels).toHaveLength(1);
  expect(labels[0].textContent).toBe(expected.label);
  // Nothing else may contribute text to the control.
  expect(button?.textContent).toBe(expected.label);

  if (expected.disabled) {
    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute('data-disabled')).toBe('true');
  } else {
    expect(button?.disabled).toBe(false);
    expect(button?.hasAttribute('data-disabled')).toBe(false);
  }
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expectPicker(canvasElement, { label: '1 – 31 Mar 2025' });
    // The three lucide icons must already be real <svg> nodes: if the collection
    // were being fetched from api.iconify.design they would still be empty
    // placeholder spans at this point, which is the flakiness src/icons.ts removes.
    expect(canvasElement.querySelectorAll('svg').length).toBe(3);
  }
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expectPicker(canvasElement, { label: '1 – 31 Mar 2025', disabled: true });
  }
};

export const CustomRange: Story = {
  args: { label: '1 Ene – 15 Feb 2026' },
  play: async ({ canvasElement }) => {
    await expectPicker(canvasElement, { label: '1 Ene – 15 Feb 2026' });
  }
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', gap: 16, alignItems: 'center' }}>
      <DateRangePicker label="1 – 31 Mar 2025" />
      <DateRangePicker label="1 Ene – 15 Feb 2026" />
      <DateRangePicker label="15 Dic 2025 – 15 Ene 2026" />
      <DateRangePicker disabled label="1 – 31 Mar 2025" />
    </div>
  )
};

// Known gap, upstream in the OpenPencil export: the calendar and chevron icons
// use literal hex colors (text-[#17233A] / text-[#66706A]) instead of the
// --color-text-primary / --color-text-secondary tokens, so they do not follow
// the dark semantic block and lose contrast on a dark surface. Shown here on
// purpose; the fix belongs in openpencil/pdf.fig, not in this story.
export const DarkTheme: Story = {
  render: () => (
    <div
      data-semantic="dark"
      style={{ background: 'var(--color-bg-canvas)', padding: 24 }}
    >
      <DateRangePicker label="1 – 31 Mar 2025" />
    </div>
  )
};
