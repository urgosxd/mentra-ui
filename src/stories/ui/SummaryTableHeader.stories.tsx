import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { SummaryTableHeader } from '../generated/SummaryTableHeader';
import { SummaryTableRow } from '../generated/SummaryTableRow';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/SummaryTableHeader',
  component: SummaryTableHeader,
  // The export is a row of column cells; the table/rowgroup wrapper is the
  // caller's job, so the story provides the ARIA context it needs.
  render: (args) => (
    <div role="table" aria-label="Resumen por área" className="w-[344px]">
      <div role="rowgroup">
        <SummaryTableHeader {...args} />
      </div>
    </div>
  )
} satisfies Meta<typeof SummaryTableHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

const LABELS = ['Área', 'Col.', 'Horas', 'Extra', '%'];

function getHeader(canvasElement: HTMLElement) {
  const row = canvasElement.querySelector('[role="row"]') as HTMLElement;
  expect(row).not.toBeNull();
  const headers = Array.from(row.querySelectorAll('[role="columnheader"]'));
  expect(headers).toHaveLength(5);
  return { row, headers };
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const { row, headers } = getHeader(canvasElement);

    expect(headers.map((header) => header.textContent)).toEqual(LABELS);

    // The design uppercases the labels through textCase; assert the computed
    // transform instead of requiring the copy to be typed in caps.
    for (const header of headers) {
      expect(getComputedStyle(header).textTransform).toBe('uppercase');
    }

    // Column track from the export: 118 / 40 / 48 / 44 and a flexible `%` that
    // ends up 62px wide at the 344px design width.
    expect(getComputedStyle(row).gridTemplateColumns).toBe('118px 40px 48px 44px 62px');
    expect(getComputedStyle(row).paddingBottom).toBe('6px');
    expect(getComputedStyle(row).borderBottomWidth).toBe('1px');
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-border-divider'));

    // Label typography: 10px semibold with the design's 1.2px tracking.
    expect(getComputedStyle(headers[0]).fontSize).toBe('10px');
    expect(getComputedStyle(headers[0]).fontWeight).toBe('600');
    expect(getComputedStyle(headers[0]).letterSpacing).toBe('1.2px');

    // `%` is the only right-aligned column.
    expect(getComputedStyle(headers[4]).textAlign).toBe('right');
    expect(getComputedStyle(headers[0]).textAlign).not.toBe('right');
  }
};

// Header plus two rows in the shape the summary table is composed with.
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
    for (const row of bodyRows) {
      expect(row.querySelectorAll('[role="cell"]')).toHaveLength(5);
    }

    // One shared column track is what makes the labels sit over their cells.
    const template = getComputedStyle(rows[0]).gridTemplateColumns;
    for (const row of bodyRows) {
      expect(getComputedStyle(row).gridTemplateColumns).toBe(template);
    }

    expect(bodyRows[0].textContent).toContain('Cocina');
    expect(bodyRows[1].textContent).toContain('Salón');
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const { row, headers } = getHeader(canvasElement);
    expect(headers.map((header) => header.textContent)).toEqual(LABELS);

    // Labels and the bottom divider both move in the dark block
    // (slate-400 / slate-800); a frozen light pair would erase the header.
    expect(getComputedStyle(headers[0]).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(headers[0]).color).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-border-divider'));
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-slate-800'));
  }
};
