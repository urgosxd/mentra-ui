import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ShiftChip } from '../generated/ShiftChip';
import { SHIFT_TONES, type ShiftTone } from '../generated/app-data';

const meta = {
  title: 'UI/ShiftChip',
  component: ShiftChip,
  args: { turno: 'Mañana', label: '08:00 – 16:00' },
  argTypes: {
    turno: { control: 'select', options: SHIFT_TONES },
    label: { control: 'text' }
  }
} satisfies Meta<typeof ShiftChip>;

export default meta;

type Story = StoryObj<typeof meta>;

async function expectChip(canvasElement: HTMLElement, tone: ShiftTone) {
  const chip = canvasElement.querySelector('[data-turno]') as HTMLElement;
  expect(chip).not.toBeNull();
  expect(chip.getAttribute('data-turno')).toBe(tone);
  expect(chip.textContent).toBe('08:00 – 16:00');
  // Every tone resolves to a real token pair, never to a transparent fallback.
  expect(getComputedStyle(chip).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  expect(getComputedStyle(chip).color).not.toBe('rgba(0, 0, 0, 0)');
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expectChip(canvasElement, 'Mañana');
  }
};

export const Intermedio: Story = {
  args: { turno: 'Intermedio' },
  play: async ({ canvasElement }) => {
    await expectChip(canvasElement, 'Intermedio');
  }
};

export const Tarde: Story = {
  args: { turno: 'Tarde' },
  play: async ({ canvasElement }) => {
    await expectChip(canvasElement, 'Tarde');
  }
};

export const Noche: Story = {
  args: { turno: 'Noche' },
  play: async ({ canvasElement }) => {
    await expectChip(canvasElement, 'Noche');
  }
};

export const PartidoAm: Story = {
  name: 'Partido AM',
  args: { turno: 'Partido AM' },
  play: async ({ canvasElement }) => {
    await expectChip(canvasElement, 'Partido AM');
  }
};

export const PartidoPm: Story = {
  name: 'Partido PM',
  args: { turno: 'Partido PM' },
  play: async ({ canvasElement }) => {
    await expectChip(canvasElement, 'Partido PM');
  }
};

export const Descanso: Story = {
  args: { turno: 'Descanso' },
  play: async ({ canvasElement }) => {
    await expectChip(canvasElement, 'Descanso');
  }
};

export const Libre: Story = {
  args: { turno: 'Libre' },
  play: async ({ canvasElement }) => {
    await expectChip(canvasElement, 'Libre');
  }
};

export const AllTones: Story = {
  render: () => (
    <div className="flex max-w-[664px] flex-wrap gap-2 bg-(--color-bg-canvas) p-2.5">
      {SHIFT_TONES.map((tone) => (
        <ShiftChip key={tone} turno={tone} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const chips = Array.from(canvasElement.querySelectorAll('[data-turno]'));
    expect(chips.map((chip) => chip.getAttribute('data-turno'))).toEqual([...SHIFT_TONES]);

    // Eight tones, eight distinct backgrounds.
    const backgrounds = new Set(chips.map((chip) => getComputedStyle(chip).backgroundColor));
    expect(backgrounds.size).toBe(SHIFT_TONES.length);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    await expectChip(canvasElement, 'Mañana');
  }
};
