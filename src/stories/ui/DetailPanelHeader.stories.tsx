import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { DetailPanelHeader } from '../generated/DetailPanelHeader';
import { tokenValue } from './styleProbe';

const meta = {
  title: 'UI/DetailPanelHeader',
  component: DetailPanelHeader,
  args: { eyebrow: 'Detalle del colaborador' },
  argTypes: {
    eyebrow: { control: 'text' }
  },
  render: (args) => (
    <div className="w-[418px] bg-(--color-bg-surface) p-4">
      <DetailPanelHeader {...args} />
    </div>
  )
} satisfies Meta<typeof DetailPanelHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

function getHeader(canvasElement: HTMLElement): HTMLElement {
  const header = canvasElement.querySelector('[data-detail-panel-header]') as HTMLElement | null;
  expect(header).not.toBeNull();
  return header as HTMLElement;
}

function getEyebrow(header: HTMLElement): HTMLElement {
  const eyebrow = header.querySelector('[data-eyebrow]') as HTMLElement | null;
  expect(eyebrow).not.toBeNull();
  return eyebrow as HTMLElement;
}

function getIcon(header: HTMLElement): SVGSVGElement {
  const icons = header.querySelectorAll('svg');
  expect(icons).toHaveLength(1);
  return icons[0] as SVGSVGElement;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const header = getHeader(canvasElement);
    const eyebrow = getEyebrow(header);
    expect(eyebrow.textContent).toBe('Detalle del colaborador');

    // Eight-point row: the eyebrow takes the free space, the close glyph keeps its
    // 14px box at the end.
    expect(getComputedStyle(header).display).toBe('flex');
    expect(getComputedStyle(header).columnGap).toBe('8px');
    expect(getComputedStyle(header).alignItems).toBe('center');

    // The label renders the 10px / semibold / 1.2px tracked uppercase eyebrow the
    // design draws; the uppercase comes from textCase, so that is what is asserted.
    const style = getComputedStyle(eyebrow);
    expect(style.fontSize).toBe('10px');
    expect(style.fontWeight).toBe('600');
    expect(style.letterSpacing).toBe('1.2px');
    expect(style.textTransform).toBe('uppercase');
    expect(style.color).toBe(tokenValue('--color-text-secondary'));

    const icon = getIcon(header);
    expect(Math.round(icon.getBoundingClientRect().width)).toBe(14);
    expect(Math.round(icon.getBoundingClientRect().height)).toBe(14);
    expect(getComputedStyle(icon).color).toBe(tokenValue('--color-icon-muted'));
  }
};

export const CustomLabel: Story = {
  args: { eyebrow: 'Historial de asistencia' },
  play: async ({ canvasElement }) => {
    const header = getHeader(canvasElement);
    expect(getEyebrow(header).textContent).toBe('Historial de asistencia');
    // Changing the copy must not disturb the glyph.
    expect(getIcon(header)).not.toBeNull();
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  play: async ({ canvasElement }) => {
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const header = getHeader(canvasElement);
    const eyebrow = getEyebrow(header);

    // Label and glyph both come from the dark block (text/secondary -> slate/400,
    // icon/muted -> slate/400), so neither can keep a light-only value.
    expect(getComputedStyle(eyebrow).color).toBe(tokenValue('--color-text-secondary'));
    expect(tokenValue('--color-text-secondary')).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(getIcon(header)).color).toBe(tokenValue('--color-icon-muted'));
    expect(tokenValue('--color-icon-muted')).toBe(tokenValue('--color-slate-400'));
    expect(getComputedStyle(eyebrow).textTransform).toBe('uppercase');
  }
};
