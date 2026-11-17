import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { TableHeaderPersonal } from '../generated/TableHeaderPersonal';

const meta = {
  title: 'UI/TableHeaderPersonal',
  component: TableHeaderPersonal,
  // The export is a row with column cells; the table/rowgroup wrapper is the
  // caller's job, so the story provides the ARIA context it needs.
  render: (args) => (
    <div role="table" aria-label="Personal" className="w-[658px]">
      <div role="rowgroup">
        <TableHeaderPersonal {...args} />
      </div>
    </div>
  )
} satisfies Meta<typeof TableHeaderPersonal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const headers = canvasElement.querySelectorAll('[role="columnheader"]');
    expect(headers).toHaveLength(5);
    expect(Array.from(headers).map((header) => header.textContent)).toEqual([
      'Colaborador',
      'Cargo',
      'Sueldo',
      'Estado',
      'Docs'
    ]);

    // The design uppercases the header through textCase; assert the computed
    // transform instead of requiring the copy to be typed in caps.
    expect(getComputedStyle(headers[0]).textTransform).toBe('uppercase');

    // Sueldo is the only right-aligned column.
    expect(getComputedStyle(headers[2]).textAlign).toBe('right');
    expect(getComputedStyle(headers[0]).textAlign).not.toBe('right');
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelectorAll('[role="columnheader"]')).toHaveLength(5);
  }
};
