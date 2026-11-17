import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { ShiftTemplateRow } from '../generated/ShiftTemplateRow';
import { SHIFT_TEMPLATE_TONES, type ShiftTemplateTone } from '../generated/app-data';
import {
  TRANSPARENT,
  declaredStateValues,
  resolveDeclaration,
  tokenValue
} from './styleProbe';

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

// The pencil action is the row's only interactive state: a `:hover` wash plus the
// label colour warming to text/primary. See `declaredStateStyle` for why the
// hovered pseudo-class cannot be computed here.
export const HoverEdit: Story = {
  args: { onEdit: fn() },
  play: async ({ canvasElement, userEvent }) => {
    const edit = canvasElement.querySelector('button') as HTMLButtonElement;
    expect(getComputedStyle(edit).backgroundColor).toBe(TRANSPARENT);

    await userEvent.hover(edit);

    const wash = declaredStateValues(edit, 'background-color')
      .filter((value) => value.includes('--color-bg-sunken'))
      .at(-1);
    if (wash === undefined) throw new Error('the edit action declares no bg/sunken :hover background');
    expect(resolveDeclaration('background-color', wash)).not.toBe(TRANSPARENT);

    expect(
      declaredStateValues(edit, 'color').map((value) => resolveDeclaration('color', value))
    ).toContain(tokenValue('--color-text-primary'));
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');
    await expectTemplate(canvasElement, 'Mañana');

    // Row surface (slate-900) and the morning swatch (blue-950) both come from the
    // dark block; a frozen light swatch would read as "no tone" against it.
    const row = canvasElement.querySelector('[data-tono]') as HTMLElement;
    expect(getComputedStyle(row).backgroundColor).toBe(
      tokenValue('--color-bg-surface', 'background-color')
    );
    expect(tokenValue('--color-bg-surface', 'background-color')).toBe(
      tokenValue('--color-slate-900', 'background-color')
    );
    const swatch = row.querySelector('[data-swatch]') as HTMLElement;
    expect(getComputedStyle(swatch).backgroundColor).toBe(
      tokenValue('--color-shift-morning-bg', 'background-color')
    );
    expect(tokenValue('--color-shift-morning-bg', 'background-color')).toBe(
      tokenValue('--color-blue-950', 'background-color')
    );
  }
};
