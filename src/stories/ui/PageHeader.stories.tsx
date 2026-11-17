import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { PageHeader } from '../generated/PageHeader';
import { tokenValue } from './styleProbe';

const SUBTITLE =
  'Registra y controla la asistencia: ingresos, salidas, tardanzas, ausencias y horas trabajadas.';

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  parameters: { layout: 'fullscreen' },
  args: {
    breadcrumb: 'RRHH / Asistencia',
    title: 'Asistencia',
    subtitle: SUBTITLE,
    showSubtitle: true
  },
  argTypes: {
    breadcrumb: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    showSubtitle: { control: 'boolean' }
  },
  render: (args) => (
    <div className="w-[1240px] max-w-full bg-(--color-bg-canvas) p-4">
      <PageHeader {...args} />
    </div>
  )
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

function getHeader(canvasElement: HTMLElement): HTMLElement {
  const headers = canvasElement.querySelectorAll('header');
  expect(headers).toHaveLength(1);
  return headers[0];
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const header = getHeader(canvasElement);

    // The breadcrumb line: the only bare span in the header.
    const breadcrumb = header.querySelector('span') as HTMLElement;
    expect(breadcrumb).not.toBeNull();
    expect(breadcrumb.textContent).toBe('RRHH / Asistencia');
    expect(getComputedStyle(breadcrumb).fontSize).toBe('11px');
    expect(getComputedStyle(breadcrumb).color).toBe(tokenValue('--color-text-secondary'));

    // The page title is the document heading, at the exported type ramp.
    const title = header.querySelector('h1') as HTMLElement;
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Asistencia');
    const titleStyle = getComputedStyle(title);
    expect(titleStyle.fontSize).toBe('24px');
    expect(titleStyle.fontWeight).toBe('800');
    expect(titleStyle.lineHeight).toBe('29px');
    expect(titleStyle.letterSpacing).toBe('-0.6px');
    expect(titleStyle.color).toBe(tokenValue('--color-text-primary'));

    const subtitle = header.querySelector('p') as HTMLElement;
    expect(subtitle).not.toBeNull();
    expect(subtitle.textContent).toBe(SUBTITLE);
    expect(getComputedStyle(subtitle).fontSize).toBe('12px');
    expect(getComputedStyle(subtitle).lineHeight).toBe('15px');
    expect(getComputedStyle(subtitle).color).toBe(tokenValue('--color-text-secondary'));

    // With no `actions`, the right-hand slot stays empty.
    expect(header.querySelectorAll('button')).toHaveLength(0);
  }
};

export const CustomCopy: Story = {
  args: {
    breadcrumb: 'Operaciones / Personal',
    title: 'Personal',
    subtitle: 'Plantilla activa por área y turno.'
  },
  play: async ({ canvasElement }) => {
    const header = getHeader(canvasElement);
    expect((header.querySelector('span') as HTMLElement).textContent).toBe(
      'Operaciones / Personal'
    );
    expect((header.querySelector('h1') as HTMLElement).textContent).toBe('Personal');
    expect((header.querySelector('p') as HTMLElement).textContent).toBe(
      'Plantilla activa por área y turno.'
    );
  }
};

// The design exposes `Show subtitle` as a visibility flag, so hiding the subtitle
// must drop the node instead of rendering an empty paragraph.
export const WithoutSubtitle: Story = {
  args: { showSubtitle: false },
  play: async ({ canvasElement }) => {
    const header = getHeader(canvasElement);

    expect(header.querySelector('p')).toBeNull();
    expect((header.querySelector('h1') as HTMLElement).textContent).toBe('Asistencia');
    expect(header.textContent).not.toContain('Registra y controla');
  }
};

// `Slot · Acciones` is a 44px, 8px-gap row; whatever the screen passes renders there.
export const WithActions: Story = {
  args: {
    actions: (
      <button
        type="button"
        className="h-9 cursor-pointer rounded-(--radius-control) bg-(--color-action-primary) px-3 text-xs text-(--color-text-on-brand)"
      >
        Exportar
      </button>
    )
  },
  play: async ({ canvasElement }) => {
    const header = getHeader(canvasElement);

    const buttons = header.querySelectorAll('button');
    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent).toBe('Exportar');

    const slot = buttons[0].parentElement as HTMLElement;
    const slotStyle = getComputedStyle(slot);
    expect(slotStyle.display).toBe('flex');
    expect(slotStyle.height).toBe('44px');
    expect(slotStyle.columnGap).toBe('8px');
    // The slot sits after the title block, so the title keeps the free width.
    expect(slot.previousElementSibling).not.toBeNull();
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const header = getHeader(canvasElement);
    const title = header.querySelector('h1') as HTMLElement;
    const subtitle = header.querySelector('p') as HTMLElement;

    // Both text roles flip with the theme: neutral-900/500 become neutral-50/slate-400.
    expect(getComputedStyle(title).color).toBe(tokenValue('--color-text-primary'));
    expect(tokenValue('--color-text-primary')).toBe(tokenValue('--color-neutral-50'));
    expect(getComputedStyle(subtitle).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(header.querySelector('span') as HTMLElement).color).toBe(
      tokenValue('--color-text-secondary')
    );
  }
};
