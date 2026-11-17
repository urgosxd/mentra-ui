import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { SidebarSection } from '../generated/SidebarSection';

const meta = {
  title: 'UI/SidebarSection',
  component: SidebarSection,
  args: {
    label: 'Analíticas',
    items: ['Indicadores', 'Reportes'],
    defaultOpen: true,
    activeItem: 'Indicadores'
  },
  argTypes: {
    label: { control: 'text' },
    defaultOpen: { control: 'boolean' }
  },
  // Sidebar content is painted for the brand rail.
  render: (args) => (
    <div className="w-60 bg-(--color-bg-brand) p-4">
      <SidebarSection {...args} />
    </div>
  )
} satisfies Meta<typeof SidebarSection>;

export default meta;

type Story = StoryObj<typeof meta>;

function getHeader(canvasElement: HTMLElement): HTMLButtonElement {
  const header = canvasElement.querySelector('button[aria-expanded]');
  expect(header).not.toBeNull();
  return header as HTMLButtonElement;
}

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const header = getHeader(canvasElement);

    expect(header.getAttribute('aria-expanded')).toBe('true');
    expect(header.textContent).toBe('Analíticas');

    const list = canvasElement.querySelector('ul');
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll('li')).toHaveLength(2);
    expect(header.getAttribute('aria-controls')).toBe(list?.id);

    // The active item carries the selected state.
    const selected = canvasElement.querySelector('[data-state="selected"]');
    expect(selected?.textContent).toBe('Indicadores');
  }
};

export const Closed: Story = {
  args: { defaultOpen: false },
  play: async ({ canvasElement }) => {
    expect(getHeader(canvasElement).getAttribute('aria-expanded')).toBe('false');
    expect(canvasElement.querySelector('ul')).toBeNull();
    expect(canvasElement.querySelectorAll('button')).toHaveLength(1);
  }
};

export const Toggle: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const header = getHeader(canvasElement);

    await userEvent.click(header);
    expect(header.getAttribute('aria-expanded')).toBe('false');
    expect(canvasElement.querySelector('ul')).toBeNull();

    await userEvent.click(header);
    expect(header.getAttribute('aria-expanded')).toBe('true');
    expect(canvasElement.querySelectorAll('li')).toHaveLength(2);
  }
};

export const SelectItem: Story = {
  args: { onSelect: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    const items = canvasElement.querySelectorAll('li button');
    await userEvent.click(items[1]);
    expect(args.onSelect).toHaveBeenCalledWith('Reportes');
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(getHeader(canvasElement).getAttribute('aria-expanded')).toBe('true');
  }
};
