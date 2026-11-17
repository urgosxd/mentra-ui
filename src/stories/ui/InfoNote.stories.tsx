import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { InfoNote } from '../generated/InfoNote';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/InfoNote',
  component: InfoNote,
  args: { texto: 'Barra concentra el 22 % de las horas extra de la semana.' },
  argTypes: { texto: { control: 'text' } }
} satisfies Meta<typeof InfoNote>;

export default meta;

type Story = StoryObj<typeof meta>;

function getNote(canvasElement: HTMLElement) {
  const notes = canvasElement.querySelectorAll('[data-info-note]');
  expect(notes).toHaveLength(1);
  const note = notes[0] as HTMLElement;

  const icon = note.querySelector('svg') as SVGElement | null;
  if (icon === null) throw new Error('the note has no icon');
  const text = note.querySelector('[data-info-note-text]') as HTMLElement | null;
  if (text === null) throw new Error('the note has no text');

  return { note, icon, text };
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const { note, icon, text } = getNote(canvasElement);

    expect(text.textContent).toBe('Barra concentra el 22 % de las horas extra de la semana.');

    // Row of icon + text, 6px apart and 344 wide in the export.
    expect(getComputedStyle(note).display).toBe('flex');
    expect(getComputedStyle(note).gap).toBe('6px');
    expect(note.getBoundingClientRect().width).toBe(344);

    // A real lucide svg proves the offline collection is registered; it is
    // decoration next to the text, so assistive tech must skip it.
    expect(note.querySelectorAll('svg')).toHaveLength(1);
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(getComputedStyle(icon).width).toBe('12px');
    expect(getComputedStyle(icon).height).toBe('12px');

    // #1F4F8A in the export is `color/icon/info` (blue-700 light).
    expect(getComputedStyle(icon).color).toBe(tokenValue('--color-icon-info'));
    expect(tokenValue('--color-icon-info')).toBe(tokenValue('--color-blue-700'));
    expect(getComputedStyle(text).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-neutral-500'));
    expect(getComputedStyle(text).fontSize).toBe('10px');
  }
};

// The note is used for arbitrary annotations: the slot content is the prop.
export const CustomText: Story = {
  args: { texto: 'Los turnos partidos se calculan sobre 8 horas.' },
  play: async ({ canvasElement }) => {
    const { note, text } = getNote(canvasElement);

    expect(text.textContent).toBe('Los turnos partidos se calculan sobre 8 horas.');
    expect(note.querySelectorAll('svg')).toHaveLength(1);
    expect(getComputedStyle(text).color).toBe(tokenValue('--color-text-secondary'));
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const { icon, text } = getNote(canvasElement);
    expect(text.textContent).toBe('Barra concentra el 22 % de las horas extra de la semana.');

    // The dark block repaints the icon (blue-700 -> blue-400) and the text
    // (neutral-500 -> slate-400).
    expect(getComputedStyle(icon).color).toBe(tokenValue('--color-icon-info'));
    expect(getComputedStyle(icon).color).toBe(tokenValue('--color-blue-400'));
    expect(getComputedStyle(text).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(text).color).toBe(tokenValue('--color-slate-400'));
  }
};
