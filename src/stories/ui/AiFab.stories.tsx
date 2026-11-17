import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { AiFab } from '../generated/AiFab';

const meta = {
  title: 'UI/AiFab',
  component: AiFab,
  args: { label: 'Asistente IA' },
  argTypes: { label: { control: 'text' } }
} satisfies Meta<typeof AiFab>;

export default meta;

type Story = StoryObj<typeof meta>;

function getFab(canvasElement: HTMLElement): HTMLButtonElement {
  const fabs = canvasElement.querySelectorAll('button');
  expect(fabs).toHaveLength(1);
  return fabs[0] as HTMLButtonElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const fab = getFab(canvasElement);

    expect(fab.getAttribute('type')).toBe('button');
    expect(fab.getAttribute('aria-label')).toBe('Asistente IA');
    // Icon-only control: the accessible name cannot depend on visible text.
    expect(fab.textContent).toBe('');
    expect(fab.querySelectorAll('svg')).toHaveLength(1);
  }
};

export const Click: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    await userEvent.click(getFab(canvasElement));
    expect(args.onClick).toHaveBeenCalledOnce();
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    const fab = getFab(canvasElement);
    expect(fab.getAttribute('aria-label')).toBe('Asistente IA');
    expect(fab.querySelectorAll('svg')).toHaveLength(1);
  }
};
