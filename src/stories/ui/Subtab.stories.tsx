import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Subtab } from '../generated/Subtab';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/Subtab',
  component: Subtab,
  args: { label: 'Documentos', selected: false },
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' }
  },
  // A subtab is meaningless outside its tablist: the parent owns the role and the
  // keyboard model, so every story renders inside a real `role="tablist"` row.
  render: (args) => (
    <div role="tablist" aria-label="Detalle" className="flex gap-2 bg-(--color-bg-surface) p-4">
      <Subtab {...args} />
    </div>
  )
} satisfies Meta<typeof Subtab>;

export default meta;

type Story = StoryObj<typeof meta>;

function getSubtab(canvasElement: HTMLElement): HTMLButtonElement {
  const subtabs = canvasElement.querySelectorAll('[role="tab"]');
  expect(subtabs).toHaveLength(1);
  return subtabs[0] as HTMLButtonElement;
}

function getIndicator(subtab: HTMLButtonElement): HTMLElement {
  const indicator = subtab.querySelector('[data-indicator]');
  expect(indicator).not.toBeNull();
  return indicator as HTMLElement;
}

// Geometry the design fixes in both states: an 82px column, a 6px gap between the
// label and the 2px indicator, and an indicator spanning the full width.
function expectGeometry(subtab: HTMLButtonElement) {
  const style = getComputedStyle(subtab);
  expect(Math.round(subtab.getBoundingClientRect().width)).toBe(82);
  expect(style.display).toBe('flex');
  expect(style.flexDirection).toBe('column');
  expect(style.rowGap).toBe('6px');
  expect(style.fontSize).toBe('11px');

  const indicator = getIndicator(subtab);
  expect(Math.round(indicator.getBoundingClientRect().height)).toBe(2);
  expect(Math.round(indicator.getBoundingClientRect().width)).toBe(82);
  // The design paints the indicator with bg/brand in both states; the Default
  // cell hides it with opacity 0 so the label does not shift.
  expect(getComputedStyle(indicator).backgroundColor).toBe(
    tokenValue('--color-bg-brand', 'background-color')
  );
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const subtab = getSubtab(canvasElement);

    expect(subtab.getAttribute('type')).toBe('button');
    expect(subtab.getAttribute('aria-selected')).toBe('false');
    expect(subtab.getAttribute('data-state')).toBe('default');
    expect(subtab.textContent).toBe('Documentos');

    expectGeometry(subtab);

    // Rest label: text/secondary at the medium weight the Default cell declares.
    expect(getComputedStyle(subtab).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(subtab).fontWeight).toBe('500');
    expect(getComputedStyle(getIndicator(subtab)).opacity).toBe('0');
  }
};

export const Selected: Story = {
  args: { selected: true },
  play: async ({ canvasElement }) => {
    const subtab = getSubtab(canvasElement);

    expect(subtab.getAttribute('aria-selected')).toBe('true');
    expect(subtab.getAttribute('data-state')).toBe('selected');
    expect(subtab.textContent).toBe('Documentos');

    expectGeometry(subtab);

    // text/primary and the visible indicator. The design's State=Selected cell
    // declares no weight, so it renders regular while State=Default is medium;
    // that asymmetry is reproduced verbatim instead of being "corrected".
    expect(getComputedStyle(subtab).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(subtab).fontWeight).toBe('400');
    expect(getComputedStyle(getIndicator(subtab)).opacity).toBe('1');
  }
};

// The label is a property placeholder in the mount, so the copy is prop-driven.
export const CustomLabel: Story = {
  args: { label: 'Horarios', selected: true },
  play: async ({ canvasElement }) => {
    const subtab = getSubtab(canvasElement);
    expect(subtab.textContent).toBe('Horarios');
    expect(subtab.getAttribute('aria-selected')).toBe('true');
  }
};

export const AllStates: Story = {
  render: () => (
    <div role="tablist" aria-label="Detalle" className="flex gap-2 bg-(--color-bg-surface) p-4">
      <Subtab label="Documentos" />
      <Subtab label="Horarios" selected />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const subtabs = Array.from(canvasElement.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(subtabs.map((subtab) => subtab.textContent)).toEqual(['Documentos', 'Horarios']);
    expect(subtabs.map((subtab) => subtab.getAttribute('aria-selected'))).toEqual([
      'false',
      'true'
    ]);
    expect(subtabs.map((subtab) => getComputedStyle(subtab).color)).toEqual([
      tokenValue('--color-text-secondary'),
      tokenValue('--color-text-primary')
    ]);
    expect(subtabs.map((subtab) => getComputedStyle(getIndicator(subtab)).opacity)).toEqual([
      '0',
      '1'
    ]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const subtab = getSubtab(canvasElement);

    // The rest label and the brand indicator both move in the dark block
    // (text/secondary -> slate/400, bg/brand -> slate/800).
    expect(getComputedStyle(subtab).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(getIndicator(subtab)).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(tokenValue('--color-bg-brand', 'background-color')).toBe(
      tokenValue('--color-slate-800', 'background-color')
    );
    expect(getComputedStyle(getIndicator(subtab)).opacity).toBe('0');
  }
};
