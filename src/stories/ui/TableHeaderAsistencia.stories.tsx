import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TableHeaderAsistencia } from '../generated/TableHeaderAsistencia';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/TableHeaderAsistencia',
  component: TableHeaderAsistencia,
  parameters: { layout: 'padded' },
  // The export is a row with column cells; the table/rowgroup wrapper is the
  // caller's job, so the story provides the ARIA context it needs.
  render: (args) => (
    <div role="table" aria-label="Asistencia" className="w-[764px]">
      <div role="rowgroup">
        <TableHeaderAsistencia {...args} />
      </div>
    </div>
  )
} satisfies Meta<typeof TableHeaderAsistencia>;

export default meta;

type Story = StoryObj<typeof meta>;

// The seventh header is followed by the empty chevron slot the row draws, so the
// grid has eight tracks while only seven of them are labelled columns.
const COLUMN_LABELS = ['Colaborador', 'Turno', 'Días', 'Tard.', 'Falt.', 'Horas', 'Punt.'];
const COLUMN_KEYS = [
  'colaborador',
  'turno',
  'dias',
  'tardanzas',
  'faltas',
  'horas',
  'puntualidad'
];

function getHeaders(canvasElement: HTMLElement): HTMLElement[] {
  const headers = Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[role="columnheader"]')
  );
  expect(headers).toHaveLength(COLUMN_LABELS.length);
  return headers;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[role="row"]') as HTMLElement;
    expect(row).not.toBeNull();

    const headers = getHeaders(canvasElement);
    expect(headers.map((header) => header.textContent)).toEqual(COLUMN_LABELS);
    expect(headers.map((header) => header.getAttribute('data-column'))).toEqual(COLUMN_KEYS);

    // The design strip is 30px tall, inset 16px, on the canvas background.
    expect(Math.round(row.getBoundingClientRect().height)).toBe(30);
    const rowStyle = getComputedStyle(row);
    expect(rowStyle.paddingLeft).toBe('16px');
    expect(rowStyle.paddingRight).toBe('16px');
    expect(rowStyle.backgroundColor).toBe(tokenValue('--color-bg-canvas', 'background-color'));

    // Eight grid tracks: the seven labels plus the chevron slot of the row.
    expect(rowStyle.gridTemplateColumns).toBe('200px 76px 52px 56px 52px 56px 78px 14px');
    const arrow = row.querySelector('[data-slot="arrow"]') as HTMLElement | null;
    expect(arrow).not.toBeNull();
    expect((arrow as HTMLElement).getAttribute('aria-hidden')).toBe('true');

    // Every label shares the same type ramp: 10px, semibold, 1.2px tracking, and
    // the design's textCase upper (asserted as the computed transform, not copy).
    for (const header of headers) {
      const style = getComputedStyle(header);
      expect(style.fontSize).toBe('10px');
      expect(style.fontWeight).toBe('600');
      expect(style.letterSpacing).toBe('1.2px');
      expect(style.textTransform).toBe('uppercase');
      expect(style.color).toBe(tokenValue('--color-text-secondary'));
    }
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const row = canvasElement.querySelector('[role="row"]') as HTMLElement;
    const headers = getHeaders(canvasElement);

    // Both the strip and its labels move in the dark block (canvas -> slate/950,
    // text/secondary -> slate/400), so a frozen light strip would break the table.
    expect(getComputedStyle(row).backgroundColor).toBe(
      tokenValue('--color-bg-canvas', 'background-color')
    );
    expect(tokenValue('--color-bg-canvas', 'background-color')).toBe(
      tokenValue('--color-slate-950', 'background-color')
    );
    expect(getComputedStyle(headers[0]).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(headers[0]).textTransform).toBe('uppercase');
  }
};
