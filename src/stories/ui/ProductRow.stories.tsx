import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { ProductRow } from '../generated/ProductRow';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/ProductRow',
  component: ProductRow,
  args: {
    ranking: '1',
    producto: 'Alitas BBQ',
    ventas: '11 720',
    participacion: 14.2
  },
  argTypes: {
    ranking: { control: 'text' },
    producto: { control: 'text' },
    ventas: { control: 'text' },
    participacion: { control: { type: 'number', min: 0, max: 100, step: 0.1 } },
    participacionLabel: { control: 'text' }
  },
  render: (args) => (
    <div role="table" aria-label="Productos más vendidos" className="w-[608px]">
      <div role="rowgroup">
        <ProductRow {...args} />
      </div>
    </div>
  )
} satisfies Meta<typeof ProductRow>;

export default meta;

type Story = StoryObj<typeof meta>;

function getRow(canvasElement: HTMLElement) {
  const row = canvasElement.querySelector('[role="row"]') as HTMLElement;
  expect(row).not.toBeNull();
  const cells = Array.from(row.querySelectorAll('[role="cell"]'));
  expect(cells).toHaveLength(5);
  return { row, cells };
}

function getBar(cells: HTMLElement[]) {
  const bar = cells[3].querySelector('[role="progressbar"]') as HTMLElement | null;
  expect(bar).not.toBeNull();
  const track = bar as HTMLElement;
  const fill = track.firstElementChild as HTMLElement;
  expect(fill).not.toBeNull();
  return { track, fill };
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const { row, cells } = getRow(canvasElement);

    expect(cells.map((cell) => cell.textContent)).toEqual([
      '1',
      'Alitas BBQ',
      '11 720',
      '',
      '14,2 %'
    ]);

    expect(getComputedStyle(row).paddingTop).toBe('4px');
    expect(getComputedStyle(row).paddingBottom).toBe('4px');
    expect(getComputedStyle(row).borderBottomWidth).toBe('1px');
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-border-divider'));

    // Ranking is the muted column, the name and the amount are primary and the
    // share label is secondary.
    expect(getComputedStyle(cells[0]).color).toBe(tokenValue('--color-text-muted'));
    expect(getComputedStyle(cells[0]).color).toBe(tokenValue('--color-neutral-400'));
    expect(getComputedStyle(cells[1]).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(cells[1]).color).toBe(tokenValue('--color-neutral-900'));
    expect(getComputedStyle(cells[4]).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(cells[4]).color).toBe(tokenValue('--color-neutral-500'));

    expect(getComputedStyle(cells[0]).fontSize).toBe('10px');
    expect(getComputedStyle(cells[1]).fontSize).toBe('10.5px');

    // Only the amount is right-aligned inside the money column, and it is the
    // semibold one.
    expect(getComputedStyle(cells[2]).textAlign).toBe('right');
    expect(getComputedStyle(cells[2]).fontWeight).toBe('600');
    expect(getComputedStyle(cells[4]).textAlign).toBe('right');
  }
};

// The bar width encodes the share: the export's mock is drawn full width, so the
// percentage prop -- not the markup -- has to decide how much of the track paints.
export const Participacion: Story = {
  play: async ({ canvasElement }) => {
    const { cells } = getRow(canvasElement);
    const { track, fill } = getBar(cells as HTMLElement[]);

    expect(track.getAttribute('role')).toBe('progressbar');
    expect(track.getAttribute('aria-valuenow')).toBe('14.2');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(track.getAttribute('aria-valuemax')).toBe('100');

    expect(getComputedStyle(track).backgroundColor).toBe(
      tokenValue('--color-chart-track', 'background-color')
    );
    expect(getComputedStyle(track).backgroundColor).toBe(
      tokenValue('--color-neutral-100', 'background-color')
    );
    expect(getComputedStyle(fill).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(getComputedStyle(fill).backgroundColor).toBe(
      tokenValue('--color-brand-800', 'background-color')
    );

    expect(fill.style.width).toBe('14.2%');
    const trackWidth = track.getBoundingClientRect().width;
    const fillWidth = fill.getBoundingClientRect().width;
    expect(trackWidth).toBeCloseTo(64, 0);
    expect(fillWidth).toBeGreaterThan(0);
    expect(fillWidth).toBeLessThan(trackWidth);
    expect(fillWidth / trackWidth).toBeCloseTo(0.142, 2);
  }
};

// A wider share paints proportionally wider; this is the observable that a
// hardcoded width in the markup cannot satisfy.
export const Participaciones: Story = {
  render: () => (
    <div role="table" aria-label="Productos más vendidos" className="w-[608px]">
      <div role="rowgroup">
        <ProductRow ranking="1" producto="Alitas BBQ" ventas="11 720" participacion={14.2} />
        <ProductRow ranking="2" producto="Burger Clásica" ventas="7 940" participacion={9.6} />
        <ProductRow ranking="3" producto="Papas Rústicas" ventas="5 310" participacion={6.4} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const rows = Array.from(canvasElement.querySelectorAll('[role="row"]'));
    expect(rows).toHaveLength(3);

    const shares = rows.map((row) => {
      const cells = Array.from(row.querySelectorAll('[role="cell"]')) as HTMLElement[];
      const { track, fill } = getBar(cells);
      return {
        label: cells[4].textContent,
        declared: fill.style.width,
        ratio: fill.getBoundingClientRect().width / track.getBoundingClientRect().width
      };
    });

    expect(shares.map((share) => share.label)).toEqual(['14,2 %', '9,6 %', '6,4 %']);
    expect(shares.map((share) => share.declared)).toEqual(['14.2%', '9.6%', '6.4%']);
    expect(shares[0].ratio).toBeGreaterThan(shares[1].ratio);
    expect(shares[1].ratio).toBeGreaterThan(shares[2].ratio);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const { row, cells } = getRow(canvasElement);
    expect(cells.map((cell) => cell.textContent)).toEqual([
      '1',
      'Alitas BBQ',
      '11 720',
      '',
      '14,2 %'
    ]);

    // Every colour of the row comes from the dark block; the track would vanish
    // into the surface if it kept its light neutral-100.
    expect(getComputedStyle(cells[0]).color).toBe(tokenValue('--color-text-muted'));
    expect(getComputedStyle(cells[0]).color).toBe(tokenValue('--color-slate-500'));
    expect(getComputedStyle(cells[1]).color).toBe(tokenValue('--color-text-primary'));
    expect(getComputedStyle(cells[1]).color).toBe(tokenValue('--color-neutral-50'));
    expect(getComputedStyle(cells[4]).color).toBe(tokenValue('--color-text-secondary'));
    expect(getComputedStyle(cells[4]).color).toBe(tokenValue('--color-slate-400'));

    const { track, fill } = getBar(cells as HTMLElement[]);
    expect(getComputedStyle(track).backgroundColor).toBe(
      tokenValue('--color-chart-track', 'background-color')
    );
    expect(getComputedStyle(track).backgroundColor).toBe(
      tokenValue('--color-slate-700', 'background-color')
    );
    expect(getComputedStyle(fill).backgroundColor).toBe(
      tokenValue('--color-bg-brand', 'background-color')
    );
    expect(getComputedStyle(fill).backgroundColor).toBe(
      tokenValue('--color-slate-800', 'background-color')
    );
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-border-divider'));
    expect(getComputedStyle(row).borderBottomColor).toBe(tokenValue('--color-slate-800'));
  }
};
