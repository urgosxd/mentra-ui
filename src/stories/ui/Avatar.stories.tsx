import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Avatar } from '../generated/Avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  args: { initials: 'LC' },
  argTypes: { initials: { control: 'text' } }
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

function getAvatar(canvasElement: HTMLElement): HTMLElement {
  const avatars = canvasElement.querySelectorAll('[data-avatar]');
  expect(avatars).toHaveLength(1);
  return avatars[0] as HTMLElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const avatar = getAvatar(canvasElement);

    expect(avatar.textContent).toBe('LC');
    // Decorative by default: it usually sits next to the user's name.
    expect(avatar.getAttribute('aria-hidden')).toBe('true');
    expect(avatar.hasAttribute('role')).toBe(false);
    // Circle: the export's 999 radius survives as a computed radius.
    expect(getComputedStyle(avatar).borderRadius).toBe('999px');
  }
};

export const Labelled: Story = {
  args: { initials: 'AA', label: 'Ada Lovelace' },
  play: async ({ canvasElement }) => {
    const avatar = getAvatar(canvasElement);

    expect(avatar.getAttribute('role')).toBe('img');
    expect(avatar.getAttribute('aria-label')).toBe('Ada Lovelace');
    expect(avatar.hasAttribute('aria-hidden')).toBe(false);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(getAvatar(canvasElement).textContent).toBe('LC');
  }
};
