import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { ShiftTemplateRow } from '../generated/ShiftTemplateRow';
import { SHIFT_TEMPLATE_TONES, type ShiftTemplateTone } from '../generated/app-data';

const meta = {
  title: 'UI/ShiftTemplateRow',
  component: ShiftTemplateRow,
  args: { tono: 'Mañana', horario: '08:00 – 16:00 · 8 h' },
  argTypes: {
    tono: { control: 'select', options: SHIFT_TEMPLATE_TONES },
    nombre: { control: 'text' },
    horario: { control: 'text' }
  }
} satisfies Meta<typeof ShiftTemplateRow>;

export default meta;

type Story = StoryObj<typeof meta>;

async function expectTemplate(canvasElement: HTMLElement, tone: ShiftTemplateTone) {
  const row = canvasElement.querySelector('[data-tono]') as HTMLElement;
  expect(row).not.toBeNull();
  expect(row.getAttribute('data-tono')).toBe(tone);
  // The name defaults to the tone, so the accessible edit action follows it.
  expect(row.textContent).toContain(tone);
  expect(row.textContent).toContain('08:00 – 16:00 · 8 h');

  const swatch = row.querySelector('[data-swatch]') as HTMLElement;
  expect(swatch).not.toBeNull();
  expect(getComputedStyle(swatch).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');

  const edit = row.querySelector('button');
  expect(edit?.getAttribute('aria-label')).toBe(`Editar turno ${tone}`);
  expect(edit?.querySelectorAll('svg')).toHaveLength(1);
}

export const Manana: Story = {
  name: 'Mañana',
  play: async ({ canvasElement }) => {
    await expectTemplate(canvasElement, 'Mañana');
  }
};

export const Tarde: Story = {
  args: { tono: 'Tarde' },
  play: async ({ canvasElement }) => {
    await expectTemplate(canvasElement, 'Tarde');
  }
};

export const Noche: Story = {
  args: { tono: 'Noche' },
  play: async ({ canvasElement }) => {
    await expectTemplate(canvasElement, 'Noche');
  }
};

export const CustomCopy: Story = {
  args: { tono: 'Tarde', nombre: 'Turno tarde', horario: '14:00 – 22:00 · 8 h' },
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-tono]') as HTMLElement;
    expect(row.textContent).toContain('Turno tarde');
    expect(row.textContent).toContain('14:00 – 22:00 · 8 h');
  }
};

export const Edit: Story = {
  args: { onEdit: fn() },
  play: async ({ canvasElement, args, userEvent }) => {
    const edit = canvasElement.querySelector('button') as HTMLButtonElement;
    await userEvent.click(edit);
    expect(args.onEdit).toHaveBeenCalledOnce();
  }
};

export const AllTones: Story = {
  render: () => (
    <div className="flex flex-col gap-2 bg-(--color-bg-canvas) p-2.5">
      {SHIFT_TEMPLATE_TONES.map((tone) => (
        <ShiftTemplateRow key={tone} tono={tone} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = Array.from(canvasElement.querySelectorAll('[data-tono]'));
    expect(rows.map((row) => row.getAttribute('data-tono'))).toEqual([...SHIFT_TEMPLATE_TONES]);

    // The swatch is the tone axis: three tones, three colours.
    const swatches = rows.map((row) => getComputedStyle(row.querySelector('[data-swatch]') as Element).backgroundColor);
    expect(new Set(swatches).size).toBe(SHIFT_TEMPLATE_TONES.length);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    await expectTemplate(canvasElement, 'Mañana');
  }
};
