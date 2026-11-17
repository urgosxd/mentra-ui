import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Avatar } from '../generated/Avatar';
import { tokenValue } from './styleProbe';

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

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-2 bg-(--color-bg-canvas) p-4">
      <Avatar initials="LC" />
      <Avatar initials="AA" label="Ada Lovelace" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const avatars = Array.from(canvasElement.querySelectorAll('[data-avatar]'));
    expect(avatars).toHaveLength(2);
    expect(avatars.map((avatar) => avatar.textContent)).toEqual(['LC', 'AA']);

    // The labelled avatar is the only one exposed to assistive tech; the
    // decorative one stays hidden so the adjacent user name is not duplicated.
    expect(avatars.map((avatar) => avatar.getAttribute('aria-hidden'))).toEqual([
      'true',
      null
    ]);
    expect(avatars.map((avatar) => avatar.getAttribute('role'))).toEqual([null, 'img']);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const avatar = getAvatar(canvasElement);
    expect(avatar.textContent).toBe('LC');

    // `bg/brand` moves from brand-800 to slate-800 in the dark block while the
    // circle radius does not: both are asserted so a lost theme hook fails here.
    expect(getComputedStyle(avatar).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(tokenValue('--color-bg-brand', 'background-color')).toBe(
      tokenValue('--color-slate-800', 'background-color')
    );
    const initials = avatar.querySelector('span') as HTMLElement;
    expect(getComputedStyle(initials).color).toBe(tokenValue('--color-text-on-brand'));
    expect(getComputedStyle(avatar).borderRadius).toBe('999px');
  }
};
