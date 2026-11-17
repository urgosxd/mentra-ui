import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Tab } from '../../components/ui/Tab';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/Tab',
  component: Tab,
  args: { label: 'Ventas', selected: false },
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' }
  },
  // The tab is meaningless outside its tablist: the parent owns the role and the
  // keyboard model, so every story renders inside a real `role="tablist"` row.
  render: (args) => (
    <div
      role="tablist"
      aria-label="Secciones"
      className="flex bg-(--color-bg-surface) px-4 pt-4"
    >
      <Tab {...args} />
    </div>
  )
} satisfies Meta<typeof Tab>;

export default meta;

type Story = StoryObj<typeof meta>;

function getTab(canvasElement: HTMLElement): HTMLButtonElement {
  const tabs = canvasElement.querySelectorAll('[role="tab"]');
  expect(tabs).toHaveLength(1);
  return tabs[0] as HTMLButtonElement;
}

function getIndicator(tab: HTMLButtonElement): HTMLElement {
  const indicator = tab.querySelector('[data-indicator]');
  expect(indicator).not.toBeNull();
  return indicator as HTMLElement;
}

// Geometry the design fixes in every state: 44px tall, bottom-justified column,
// 8px gap, 12px inline padding, and a 2px full-width indicator inside that box.
function expectGeometry(tab: HTMLButtonElement) {
  const rect = tab.getBoundingClientRect();
  expect(Math.round(rect.height)).toBe(44);

  const style = getComputedStyle(tab);
  expect(style.display).toBe('flex');
  expect(style.flexDirection).toBe('column');
  expect(style.alignItems).toBe('center');
  expect(style.rowGap).toBe('8px');
  expect(style.paddingLeft).toBe('12px');
  expect(style.paddingRight).toBe('12px');

  const indicator = getIndicator(tab);
  const indicatorRect = indicator.getBoundingClientRect();
  expect(Math.round(indicatorRect.height)).toBe(2);
  // Bottom-justified: the last child sits flush with the bottom edge, which is
  // what `justify-end` means here (the computed keyword serializes differently
  // across Chromium versions, the position does not).
  expect(Math.round(tab.getBoundingClientRect().bottom - indicatorRect.bottom)).toBe(0);
  // Full width of the padded content box, not of the whole button.
  expect(Math.round(indicatorRect.width)).toBe(
    tab.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
  );
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const tab = getTab(canvasElement);

    expect(tab.getAttribute('type')).toBe('button');
    expect(tab.getAttribute('aria-selected')).toBe('false');
    expect(tab.getAttribute('data-state')).toBe('default');
    expect(tab.textContent).toBe('Ventas');

    expectGeometry(tab);

    // Rest label: text/secondary, regular weight, and the indicator hidden by
    // opacity so the row does not jump between states.
    expect(getComputedStyle(tab).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(tab).fontWeight).toBe('400');
    expect(getComputedStyle(tab).fontSize).toBe('12px');
    expect(getComputedStyle(getIndicator(tab)).opacity).toBe('0');
  }
};

export const Selected: Story = {
  args: { selected: true },
  play: async ({ canvasElement }) => {
    const tab = getTab(canvasElement);

    expect(tab.getAttribute('aria-selected')).toBe('true');
    expect(tab.getAttribute('data-state')).toBe('selected');
    expect(tab.textContent).toBe('Ventas');

    expectGeometry(tab);

    // The document paints the selected label with the bg/brand token on the text
    // axis; the assertion follows the design verbatim.
    expect(getComputedStyle(tab).color).toBe(tokenValue('--color-bg-brand'));
    expect(getComputedStyle(tab).fontWeight).toBe('600');
    expect(getComputedStyle(getIndicator(tab)).opacity).toBe('1');
    expect(getComputedStyle(getIndicator(tab)).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
  }
};

export const AllStates: Story = {
  render: () => (
    <div
      role="tablist"
      aria-label="Secciones"
      className="flex bg-(--color-bg-surface) px-4 pt-4"
    >
      <Tab label="Ventas" />
      <Tab label="Indicadores" selected />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tabs = Array.from(canvasElement.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    expect(tabs.map((tab) => tab.getAttribute('aria-selected'))).toEqual(['false', 'true']);
    expect(tabs.map((tab) => getComputedStyle(tab).color)).toEqual([
      tokenValue('--color-text-secondary'),
      tokenValue('--color-bg-brand')
    ]);
    // Only the selected tab exposes its indicator.
    expect(tabs.map((tab) => getComputedStyle(getIndicator(tab)).opacity)).toEqual(['0', '1']);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const tab = getTab(canvasElement);

    // Both the secondary label and the bg/brand text token must come from the
    // dark block, and the dark values must not be the light ones.
    expect(getComputedStyle(tab).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(getIndicator(tab)).opacity).toBe('0');
  }
};
