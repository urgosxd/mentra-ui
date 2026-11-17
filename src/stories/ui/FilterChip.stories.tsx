import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { FilterChip } from '../generated/FilterChip';

const meta = {
  title: 'UI/FilterChip',
  component: FilterChip,
  args: { label: 'Todas las áreas' },
  argTypes: {
    label: { control: 'text' },
    expanded: { control: 'boolean' }
  }
} satisfies Meta<typeof FilterChip>;

export default meta;

type Story = StoryObj<typeof meta>;

function getChip(canvasElement: HTMLElement): HTMLButtonElement {
  const chips = canvasElement.querySelectorAll('button');
  expect(chips).toHaveLength(1);
  return chips[0] as HTMLButtonElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const chip = getChip(canvasElement);

    expect(chip.getAttribute('type')).toBe('button');
    expect(chip.hasAttribute('aria-expanded')).toBe(false);
    expect(chip.hasAttribute('aria-haspopup')).toBe(false);
    expect(chip.textContent).toBe('Todas las áreas');

    // A real lucide svg proves the offline icon collection is registered.
    expect(chip.querySelectorAll('svg')).toHaveLength(1);
  }
};

// When the chip controls a menu it must announce the state of that menu.
export const Expanded: Story = {
  args: { expanded: true },
  play: async ({ canvasElement }) => {
    const chip = getChip(canvasElement);

    expect(chip.getAttribute('aria-expanded')).toBe('true');
    expect(chip.getAttribute('aria-haspopup')).toBe('listbox');
  }
};

export const Click: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    await userEvent.click(getChip(canvasElement));
    expect(args.onClick).toHaveBeenCalledOnce();
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    const chip = getChip(canvasElement);
    expect(chip.textContent).toBe('Todas las áreas');
    expect(chip.querySelectorAll('svg')).toHaveLength(1);
  }
};
