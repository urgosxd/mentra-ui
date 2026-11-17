import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { AttendanceStatus } from '../generated/AttendanceStatus';
import { ATTENDANCE_STATES, type AttendanceState } from '../generated/app-data';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/AttendanceStatus',
  component: AttendanceStatus,
  args: { estado: 'Asistió' },
  argTypes: { estado: { control: 'select', options: ATTENDANCE_STATES } }
} satisfies Meta<typeof AttendanceStatus>;

export default meta;

type Story = StoryObj<typeof meta>;

async function expectStatus(canvasElement: HTMLElement, state: AttendanceState) {
  const status = canvasElement.querySelector('[data-estado]') as HTMLElement;
  expect(status).not.toBeNull();
  expect(status.getAttribute('data-estado')).toBe(state);
  expect(status.textContent).toBe(state);
  expect(getComputedStyle(status).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
}

export const Asistio: Story = {
  name: 'Asistió',
  play: async ({ canvasElement }) => {
    await expectStatus(canvasElement, 'Asistió');
  }
};

export const Tardanza: Story = {
  args: { estado: 'Tardanza' },
  play: async ({ canvasElement }) => {
    await expectStatus(canvasElement, 'Tardanza');
  }
};

export const Falta: Story = {
  args: { estado: 'Falta' },
  play: async ({ canvasElement }) => {
    await expectStatus(canvasElement, 'Falta');
  }
};

export const Permiso: Story = {
  args: { estado: 'Permiso' },
  play: async ({ canvasElement }) => {
    await expectStatus(canvasElement, 'Permiso');
  }
};

export const Vacaciones: Story = {
  args: { estado: 'Vacaciones' },
  play: async ({ canvasElement }) => {
    await expectStatus(canvasElement, 'Vacaciones');
  }
};

export const SinRegistro: Story = {
  name: 'Sin registro',
  args: { estado: 'Sin registro' },
  play: async ({ canvasElement }) => {
    await expectStatus(canvasElement, 'Sin registro');
  }
};

export const AllStates: Story = {
  render: () => (
    <div className="flex max-w-[684px] flex-wrap gap-2 bg-(--color-bg-canvas) p-2.5">
      {ATTENDANCE_STATES.map((state) => (
        <AttendanceStatus key={state} estado={state} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const statuses = Array.from(canvasElement.querySelectorAll('[data-estado]'));
    expect(statuses.map((status) => status.getAttribute('data-estado'))).toEqual([
      ...ATTENDANCE_STATES
    ]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');
    await expectStatus(canvasElement, 'Asistió');

    // The pill pairs a feedback surface with its text token; the dark block moves
    // both (green-50/green-950 and green-300), so the resolved values must follow.
    const status = canvasElement.querySelector('[data-estado]') as HTMLElement;
    expect(getComputedStyle(status).backgroundColor).toBe(
      tokenValue('--color-feedback-success-bg', 'background-color')
    );
    expect(tokenValue('--color-feedback-success-bg', 'background-color')).toBe(
      tokenValue('--color-green-950', 'background-color')
    );
    expect(getComputedStyle(status).color).toBe(tokenValue('--color-text-success'));
    expect(getComputedStyle(status).color).toBe(tokenValue('--color-green-300'));
  }
};
