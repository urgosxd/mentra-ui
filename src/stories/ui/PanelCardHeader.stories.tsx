import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PanelCardHeader } from '../generated/PanelCardHeader';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/PanelCardHeader',
  component: PanelCardHeader,
  argTypes: {
    title: { control: 'text' },
    actionLabel: { control: 'text' },
    showAction: { control: 'boolean' }
  }
} satisfies Meta<typeof PanelCardHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

function getTitle(canvasElement: HTMLElement): HTMLElement {
  const titles = canvasElement.querySelectorAll('h3');
  expect(titles).toHaveLength(1);
  return titles[0] as HTMLElement;
}

function getAction(canvasElement: HTMLElement): HTMLElement {
  const actions = canvasElement.querySelector('[data-slot="actions"]');
  if (actions === null) throw new Error('the card header rendered no actions slot');
  const action = actions.querySelector('button') as HTMLElement | null;
  if (action === null) throw new Error('the actions slot holds no action button');
  return action;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const title = getTitle(canvasElement);
    expect(title.textContent).toBe('Resumen por área');
    expect(getComputedStyle(title).fontSize).toBe('13px');
    expect(getComputedStyle(title).fontWeight).toBe('700');
    expect(getComputedStyle(title).color).toBe(tokenValue('--color-text-primary'));

    const action = getAction(canvasElement);
    expect(action.getAttribute('type')).toBe('button');
    expect(action.textContent).toBe('Ver todas');
    expect(getComputedStyle(action).fontSize).toBe('11px');
    expect(getComputedStyle(action).fontWeight).toBe('700');
    expect(getComputedStyle(action).color).toBe(tokenValue('--color-action-primary'));
  }
};

// `Show action` is a design variant switch.
export const WithoutAction: Story = {
  args: { showAction: false },
  play: async ({ canvasElement }) => {
    expect(getTitle(canvasElement).textContent).toBe('Resumen por área');
    expect(canvasElement.querySelector('[data-slot="actions"]')).toBeNull();
    expect(canvasElement.querySelectorAll('button')).toHaveLength(0);
  }
};

export const CustomActions: Story = {
  args: { title: 'Resumen de sucursal' },
  render: (args) => (
    <PanelCardHeader {...args}>
      <a href="#detalle" className="text-[11px] font-bold">
        Ver reporte
      </a>
    </PanelCardHeader>
  ),
  play: async ({ canvasElement }) => {
    expect(getTitle(canvasElement).textContent).toBe('Resumen de sucursal');

    // A caller can put any control in the slot, and the default action is gone.
    const actions = canvasElement.querySelector('[data-slot="actions"]') as HTMLElement;
    expect(actions.querySelector('a')?.textContent).toBe('Ver reporte');
    expect(actions.querySelectorAll('button')).toHaveLength(0);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const title = getTitle(canvasElement);
    expect(getComputedStyle(title).color).toBe(tokenValue('--color-text-primary'));
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-50'));

    // `action/primary` is brand-300 in the dark block: a frozen brand-800 would be
    // invisible on the dark card.
    const action = getAction(canvasElement);
    expect(getComputedStyle(action).color).toBe(tokenValue('--color-action-primary'));
    expect(tokenValue('--color-action-primary')).toBe(tokenValue('--color-brand-300'));
  }
};
