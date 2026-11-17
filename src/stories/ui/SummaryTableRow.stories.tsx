import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { SummaryTableHeader } from '../generated/SummaryTableHeader';
import { SummaryTableRow } from '../generated/SummaryTableRow';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/SummaryTableRow',
  component: SummaryTableRow,
  args: {
    area: 'Cocina',
    colaboradores: '5',
    horas: '184',
    extra: '6'
  },
  argTypes: {
    area: { control: 'text' },
    colaboradores: { control: 'text' },
    horas: { control: 'text' },
    extra: { control: 'text' },
    porcentaje: { control: 'text' }
  },
  render: (args) => (
    <div role="table" aria-label="Resumen por área" className="w-[344px]">
      <div role="rowgroup">
        <SummaryTableRow {...args} />
      </div>
    </div>
  )
} satisfies Meta<typeof SummaryTableRow>;

export default meta;

type Story = StoryObj<typeof meta>;

function getRow(canvasElement: HTMLElement) {
  const row = canvasElement.querySelector('[role="row"]') as HTMLElement;
  expect(row).not.toBeNull();
  const cells = Array.from(row.querySelectorAll('[role="cell"]'));
  expect(cells).toHaveLength(5);
  return { row, cells };
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const { row, cells } = getRow(canvasElement);

    // The design leaves the `%` cell empty, so only the four data cells carry text.
    expect(cells.map((cell) => cell.textContent)).toEqual(['Cocina', '5', '184', '6', '']);

    // Same column track as the header, otherwise the labels drift off the cells.
    expect(getComputedStyle(row).gridTemplateColumns).toBe('118px 40px 48px 44px 62px');
    expect(getComputedStyle(row).height).toBe('30px');
    expect(getComputedStyle(row).borderBottomWidth).toBe('1px');
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-border-divider'));

    // Value typography: 10.5px, only the area name is semibold.
    expect(getComputedStyle(cells[0]).fontSize).toBe('10.5px');
    expect(getComputedStyle(cells[0]).fontWeight).toBe('600');
    expect(getComputedStyle(cells[1]).fontWeight).toBe('400');

    for (const cell of cells.slice(0, 4)) {
      expect(getComputedStyle(cell).color).toBe(tokenValue('--color-text-primary'));
      expect(getComputedStyle(cell).color).toBe(tokenValue('--color-neutral-900'));
    }

    // The slot frame clips overflowing percentage content, as the export declares.
    expect(getComputedStyle(cells[4]).overflow).toBe('hidden');
  }
};

// The `%` cell is a slot: the caller fills it with whatever the summary shows
// there (the export itself ships it empty).
export const Porcentaje: Story = {
  args: { porcentaje: <span>14,2 %</span> },
  play: async ({ canvasElement }) => {
    const { cells } = getRow(canvasElement);

    expect(cells[4].textContent).toBe('14,2 %');
    expect(cells.map((cell) => cell.textContent)).toEqual(['Cocina', '5', '184', '6', '14,2 %']);

    // The `%` header is right-aligned, so slot content hugs the right edge of its
    // cell instead of drifting left under the label.
    const content = cells[4].firstElementChild as HTMLElement;
    expect(content).not.toBeNull();
    const cellBox = cells[4].getBoundingClientRect();
    const contentBox = content.getBoundingClientRect();
    expect(Math.abs(cellBox.right - contentBox.right)).toBeLessThan(1);
  }
};

export const Table: Story = {
  render: () => (
    <div role="table" aria-label="Resumen por área" className="w-[344px]">
      <div role="rowgroup">
        <SummaryTableHeader />
      </div>
      <div role="rowgroup">
        <SummaryTableRow
          area="Cocina"
          colaboradores="5"
          horas="184"
          extra="6"
          porcentaje="14,2 %"
        />
        <SummaryTableRow
          area="Salón"
          colaboradores="8"
          horas="276"
          extra="12"
          porcentaje="21,4 %"
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = Array.from(canvasElement.querySelectorAll('[role="row"]'));
    expect(rows).toHaveLength(3);
    expect(rows[0].querySelectorAll('[role="columnheader"]')).toHaveLength(5);

    const bodyRows = rows.slice(1);
    const template = getComputedStyle(rows[0]).gridTemplateColumns;
    for (const row of bodyRows) {
      expect(row.querySelectorAll('[role="cell"]')).toHaveLength(5);
      expect(getComputedStyle(row).gridTemplateColumns).toBe(template);
    }

    expect(
      bodyRows.map((row) =>
        Array.from(row.querySelectorAll('[role="cell"]')).map((cell) => cell.textContent)
      )
    ).toEqual([
      ['Cocina', '5', '184', '6', '14,2 %'],
      ['Salón', '8', '276', '12', '21,4 %']
    ]);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  args: { porcentaje: '14,2 %' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const { row, cells } = getRow(canvasElement);
    expect(cells.map((cell) => cell.textContent)).toEqual(['Cocina', '5', '184', '6', '14,2 %']);

    // Values and divider both flip in the dark block (neutral-50 / slate-800).
    expect(getComputedStyle(cells[0]).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(cells[0]).color).toBe(tokenValue('--color-neutral-50'));
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-border-divider'));
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-slate-800'));
  }
};
