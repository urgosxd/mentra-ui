import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PersonCard } from '../generated/PersonCard';
import { ATTENDANCE_STATES } from '../generated/app-data';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/PersonCard',
  component: PersonCard,
  args: {
    iniciales: 'CQ',
    nombre: 'Carlos Quispe',
    cargo: 'Jefe de Cocina · Cocina',
    estado: 'Asistió'
  },
  argTypes: {
    iniciales: { control: 'text' },
    nombre: { control: 'text' },
    cargo: { control: 'text' },
    estado: { control: 'select', options: ATTENDANCE_STATES }
  }
} satisfies Meta<typeof PersonCard>;

export default meta;

type Story = StoryObj<typeof meta>;

function parts(canvasElement: HTMLElement) {
  const avatar = canvasElement.querySelector('[data-avatar]') as HTMLElement | null;
  const nombre = canvasElement.querySelector('[data-nombre]') as HTMLElement | null;
  const cargo = canvasElement.querySelector('[data-cargo]') as HTMLElement | null;
  const estado = canvasElement.querySelector('[data-estado]') as HTMLElement | null;
  expect(avatar).not.toBeNull();
  expect(nombre).not.toBeNull();
  expect(cargo).not.toBeNull();
  expect(estado).not.toBeNull();
  return {
    avatar: avatar as HTMLElement,
    nombre: nombre as HTMLElement,
    cargo: cargo as HTMLElement,
    estado: estado as HTMLElement
  };
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const { avatar, nombre, cargo, estado } = parts(canvasElement);

    // Iniciales in the 44px brand circle.
    expect(avatar.textContent).toBe('CQ');
    expect(getComputedStyle(avatar).width).toBe('44px');
    expect(getComputedStyle(avatar).height).toBe('44px');
    expect(getComputedStyle(avatar).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(getComputedStyle(avatar).borderTopLeftRadius).toBe('999px');
    expect(getComputedStyle(avatar.firstElementChild as HTMLElement).color).toBe(
      tokenValue('--color-text-on-brand')
    );

    // Nombre / cargo roles.
    expect(nombre.textContent).toBe('Carlos Quispe');
    expect(getComputedStyle(nombre).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(nombre).fontWeight).toBe('600');
    expect(cargo.textContent).toBe('Jefe de Cocina · Cocina');
    expect(getComputedStyle(cargo).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(cargo).fontSize).toBe('11px');

    // The estado slot is the shared AttendanceStatus pill, not a local copy.
    expect(estado.getAttribute('data-estado')).toBe('Asistió');
    expect(estado.textContent).toBe('Asistió');
    expect(getComputedStyle(estado).backgroundColor).toBe(
      tokenValue('--color-feedback-success-bg', 'background-color')
    );
    expect(getComputedStyle(estado).color).toBe(tokenValue('--color-text-success'));
  }
};

// Copy is data: the three placeholders of the export are props.
export const OtraPersona: Story = {
  args: {
    iniciales: 'MR',
    nombre: 'María Ramos',
    cargo: 'Cajera · Salón',
    estado: 'Tardanza'
  },
  play: async ({ canvasElement }) => {
    const { avatar, nombre, cargo, estado } = parts(canvasElement);

    expect(avatar.textContent).toBe('MR');
    expect(nombre.textContent).toBe('María Ramos');
    expect(cargo.textContent).toBe('Cajera · Salón');
    expect(estado.getAttribute('data-estado')).toBe('Tardanza');
    expect(getComputedStyle(estado).backgroundColor).toBe(
      tokenValue('--color-feedback-warning-bg', 'background-color')
    );
    expect(getComputedStyle(estado).color).toBe(tokenValue('--color-text-warning'));
  }
};

// The instance's `Estado` property is a variant axis: a third tone proves the pill
// follows the prop instead of staying on the success pair.
export const Falta: Story = {
  args: { estado: 'Falta' },
  play: async ({ canvasElement }) => {
    const { estado } = parts(canvasElement);
    expect(estado.textContent).toBe('Falta');
    expect(getComputedStyle(estado).backgroundColor).toBe(
      tokenValue('--color-feedback-danger-bg', 'background-color')
    );
    expect(getComputedStyle(estado).color).toBe(tokenValue('--color-text-danger'));
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const { avatar, nombre, cargo, estado } = parts(canvasElement);

    // Avatar, nombre and cargo all come from the dark block; none may keep a
    // frozen light value.
    expect(getComputedStyle(avatar).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(tokenValue('--color-bg-brand', 'background-color')).toBe(
      tokenValue('--color-slate-800', 'background-color')
    );
    expect(getComputedStyle(avatar.firstElementChild as HTMLElement).color).toBe(
      tokenValue('--color-text-on-brand')
    );
    expect(getComputedStyle(avatar.firstElementChild as HTMLElement).color).toBe(
      tokenValue('--color-neutral-50')
    );
    expect(getComputedStyle(nombre).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(cargo).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(cargo).color).toBe(tokenValue('--color-slate-400'));

    // The success pair flips to green-950 / green-300 in dark.
    expect(getComputedStyle(estado).backgroundColor).toBe(
      tokenValue('--color-feedback-success-bg', 'background-color')
    );
    expect(tokenValue('--color-feedback-success-bg', 'background-color')).toBe(
      tokenValue('--color-green-950', 'background-color')
    );
    expect(getComputedStyle(estado).color).toBe(tokenValue('--color-text-success'));
    expect(getComputedStyle(estado).color).toBe(tokenValue('--color-green-300'));
  }
};
