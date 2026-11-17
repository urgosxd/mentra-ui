import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PanelHeader } from '../generated/PanelHeader';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/PanelHeader',
  component: PanelHeader,
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    showSubtitle: { control: 'boolean' }
  }
} satisfies Meta<typeof PanelHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

function getTitle(canvasElement: HTMLElement): HTMLElement {
  const titles = canvasElement.querySelectorAll('h2');
  expect(titles).toHaveLength(1);
  return titles[0] as HTMLElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const title = getTitle(canvasElement);
    expect(title.textContent).toBe('Asistencia del 1 al 31 de marzo 2025');
    expect(getComputedStyle(title).fontSize).toBe('13px');
    expect(getComputedStyle(title).fontWeight).toBe('600');
    expect(getComputedStyle(title).color).toBe(tokenValue('--color-text-primary'));

    const subtitle = canvasElement.querySelector('p') as HTMLElement;
    expect(subtitle.textContent).toBe('17 colaboradores · 22 incidencias registradas');
    expect(getComputedStyle(subtitle).fontSize).toBe('10px');
    expect(getComputedStyle(subtitle).color).toBe(tokenValue('--color-text-secondary'));

    // The export only holds a RangeChip instance here, so the slot stays empty
    // until a caller passes one.
    expect(canvasElement.querySelector('[data-slot="actions"]')).toBeNull();
  }
};

// `Show subtitle` is a design variant switch.
export const WithoutSubtitle: Story = {
  args: { showSubtitle: false },
  play: async ({ canvasElement }) => {
    expect(getTitle(canvasElement).textContent).toBe(
      'Asistencia del 1 al 31 de marzo 2025'
    );
    expect(canvasElement.querySelector('p')).toBeNull();
  }
};

export const CustomActions: Story = {
  args: { title: 'Horarios de la semana' },
  render: (args) => (
    <PanelHeader {...args}>
      <button type="button" className="text-xs font-semibold">
        Rango: este mes
      </button>
    </PanelHeader>
  ),
  play: async ({ canvasElement }) => {
    expect(getTitle(canvasElement).textContent).toBe('Horarios de la semana');

    const actions = canvasElement.querySelector('[data-slot="actions"]') as HTMLElement;
    expect(actions).not.toBeNull();
    expect(actions.textContent).toBe('Rango: este mes');
    expect(actions.querySelectorAll('button')).toHaveLength(1);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const title = getTitle(canvasElement);
    // Title and subtitle both come from the dark block (neutral-50 / slate-400).
    expect(getComputedStyle(title).color).toBe(tokenValue('--color-text-primary'));
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-50'));

    const subtitle = canvasElement.querySelector('p') as HTMLElement;
    expect(getComputedStyle(subtitle).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-slate-400'));
  }
};
