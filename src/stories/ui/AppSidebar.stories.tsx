import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { AppSidebar } from '../generated/AppSidebar';

const meta = {
  title: 'UI/AppSidebar',
  component: AppSidebar,
  parameters: { layout: 'fullscreen' },
  args: { activeItem: 'Personal' },
  argTypes: { activeItem: { control: 'text' } },
  render: (args) => (
    <div className="flex h-[767px] bg-(--color-bg-canvas)">
      <AppSidebar {...args} />
    </div>
  )
} satisfies Meta<typeof AppSidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

function getNav(canvasElement: HTMLElement): HTMLElement {
  const nav = canvasElement.querySelector('nav');
  expect(nav).not.toBeNull();
  return nav as HTMLElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const aside = canvasElement.querySelector('aside');
    expect(aside).not.toBeNull();
    expect(aside?.textContent).toContain('MENTRA');

    const nav = getNav(canvasElement);
    expect(nav.getAttribute('aria-label')).toBe('Navegación principal');

    // Dashboard + 12 items across the five groups.
    expect(nav.querySelectorAll('[data-state]')).toHaveLength(13);
    expect(nav.querySelectorAll('button[aria-expanded]')).toHaveLength(5);

    // Exactly one active route, and it is the Personal item drawn in the export.
    const current = nav.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0].textContent).toBe('Personal');

    expect(aside?.textContent).toContain('Con tecnología de');
  }
};

// The section header is the only collapsible control: collapsing FINANZAS must
// remove its three items while keeping the other groups intact.
export const CollapseSection: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const nav = getNav(canvasElement);
    const header = Array.from(nav.querySelectorAll('button[aria-expanded]')).find(
      (button) => button.textContent === 'Finanzas'
    ) as HTMLButtonElement;
    expect(header).toBeDefined();

    await userEvent.click(header);
    expect(header.getAttribute('aria-expanded')).toBe('false');
    expect(nav.textContent).not.toContain('Flujo de Caja');
    expect(nav.textContent).toContain('Food Cost');
  }
};

export const SelectItem: Story = {
  args: { onSelect: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    const horarios = Array.from(canvasElement.querySelectorAll('button')).find(
      (button) => button.textContent === 'Horarios'
    ) as HTMLButtonElement;

    await userEvent.click(horarios);
    expect(args.onSelect).toHaveBeenCalledWith('Horarios');
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(getNav(canvasElement).querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  }
};
