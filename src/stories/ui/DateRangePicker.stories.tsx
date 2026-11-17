import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import {
  TRANSPARENT,
  declaredStateValues,
  resolveDeclaration,
  tokenValue
} from './styleProbe';

const meta = {
  title: 'UI/DateRangePicker',
  component: DateRangePicker,
  args: { placeholder: 'Seleccionar fechas', numberOfMonths: 1, disabled: false },
  argTypes: {
    placeholder: { control: 'text' },
    numberOfMonths: { control: 'number' },
    disabled: { control: 'boolean' }
  }
} satisfies Meta<typeof DateRangePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

// Radix Popover portals its content to document.body, so the calendar is queried
// on the document and not through `canvas` (which is bound to the story canvas).
function getTrigger(canvasElement: HTMLElement): HTMLButtonElement {
  const triggers = canvasElement.querySelectorAll('button[aria-haspopup="dialog"]');
  expect(triggers).toHaveLength(1);
  return triggers[0] as HTMLButtonElement;
}

// The trigger renders one textual <span> (the formatted range) between the lucide
// icons. Iconify inserts empty placeholder spans, so filter on text.
function getLabel(trigger: HTMLButtonElement): string {
  const labels = Array.from(trigger.querySelectorAll('span')).filter(
    (span) => (span.textContent ?? '').trim() !== ''
  );
  expect(labels).toHaveLength(1);
  return labels[0].textContent ?? '';
}

async function openCalendar(canvasElement: HTMLElement, userEvent: { click: (el: Element) => Promise<void> }) {
  const trigger = getTrigger(canvasElement);
  await userEvent.click(trigger);
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  return within(document.body).findByRole('dialog');
}

// Radix focuses the content (first tabbable inside) right after mount; poll
// briefly instead of assuming the focus call lands before the first assertion.
async function waitForFocusInside(container: HTMLElement) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (container.contains(document.activeElement)) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error('focus never moved into the calendar dialog');
}

function dayCells(dialog: HTMLElement, options: { outside?: boolean } = {}) {
  return Array.from(dialog.querySelectorAll('[data-day]')).filter((cell) =>
    options.outside ? cell.hasAttribute('data-outside') : !cell.hasAttribute('data-outside')
  );
}

function dayCell(dialog: HTMLElement, date: Date): HTMLButtonElement {
  const cell = dialog.querySelector(`[data-day="${format(date, 'yyyy-MM-dd')}"]`);
  if (!cell) throw new Error(`no day cell rendered for ${date.toDateString()}`);
  const button = cell.querySelector('button');
  if (!button) throw new Error(`day cell for ${date.toDateString()} is not clickable`);
  return button;
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement);

    expect(trigger.getAttribute('type')).toBe('button');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.disabled).toBe(false);
    expect(getLabel(trigger)).toBe('Seleccionar fechas');
    expect(trigger.textContent).toBe('Seleccionar fechas');

    // Closed by default: nothing is portaled yet.
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();

    // Three real <svg> nodes (calendar + both chevrons) prove the lucide
    // collection is registered by src/icons.ts; a cold icon cache renders empty
    // placeholder spans instead.
    expect(trigger.querySelectorAll('svg')).toHaveLength(3);
  }
};

// The trigger's two interaction states: a `:hover` wash over the surface (read
// from the rule, since synthetic pointer events do not move the real pointer) and
// a real `:focus-visible` ring reached with the keyboard.
export const Hover: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const trigger = getTrigger(canvasElement);
    const rest = getComputedStyle(trigger).backgroundColor;
    expect(rest).not.toBe(TRANSPARENT);

    await userEvent.hover(trigger);

    const wash = declaredStateValues(trigger, 'background-color')
      .filter((value) => value.includes('--color-bg-sunken'))
      .at(-1);
    if (wash === undefined) throw new Error('the trigger declares no bg/sunken :hover background');

    const resolved = resolveDeclaration('background-color', wash);
    expect(resolved).not.toBe(TRANSPARENT);
    expect(resolved).not.toBe(rest);
  }
};

export const Focus: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const trigger = getTrigger(canvasElement);
    expect(getComputedStyle(trigger).borderTopWidth).toBe('1px');

    await userEvent.tab();
    expect(document.activeElement).toBe(trigger);

    const focused = getComputedStyle(trigger);
    expect(focused.borderTopWidth).toBe('2px');
    expect(focused.borderTopColor).toBe(tokenValue('--color-border-focus'));
  }
};

export const Open: Story = {
  play: async ({ canvasElement, userEvent }) => {
    const dialog = await openCalendar(canvasElement, userEvent);

    // Focus must land inside the dialog, not stay on the trigger.
    await waitForFocusInside(dialog);

    // The grid is real: 7 weekday headers, and one cell per day of the month
    // currently rendered (the current month, since there is no value).
    expect(dialog.querySelectorAll('[role="grid"]')).toHaveLength(1);
    expect(dialog.querySelectorAll('thead th')).toHaveLength(7);

    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    expect(dayCells(dialog)).toHaveLength(daysInMonth);

    // The caption follows the calendar state, not a hardcoded "Marzo 2025".
    const caption = dialog.querySelector('[role="status"]');
    expect((caption?.textContent ?? '').toLowerCase()).toBe(
      format(today, 'MMMM yyyy', { locale: es }).toLowerCase()
    );
  }
};

export const RangeSelected: Story = {
  args: { value: { from: new Date(2025, 2, 10), to: new Date(2025, 2, 20) } },
  play: async ({ canvasElement }) => {
    const trigger = getTrigger(canvasElement);

    // Day – day month year, es locale, the export's en dash.
    expect(getLabel(trigger)).toBe('10 – 20 mar 2025');
  }
};

// A half-filled range must read as incomplete instead of borrowing the complete
// range format.
export const PartialRange: Story = {
  args: { value: { from: new Date(2025, 2, 10) } },
  play: async ({ canvasElement }) => {
    expect(getLabel(getTrigger(canvasElement))).toBe('10 mar 2025 – …');
  }
};

// The mirror case: an end with no start can only arrive through props (the UI
// never produces it), and it must not fall back to the empty placeholder.
export const PartialRangeEnd: Story = {
  args: { value: { from: undefined, to: new Date(2025, 2, 20) } },
  play: async ({ canvasElement }) => {
    expect(getLabel(getTrigger(canvasElement))).toBe('… – 20 mar 2025');
  }
};

// Month navigation starts on the month of the given range, so a preset range
// opens where the user expects. February 2025 is deliberate: it proves the grid
// is not the export's hardcoded 31-cell March 2025 mockup.
export const SelectedMonth: Story = {
  args: { value: { from: new Date(2025, 1, 10), to: new Date(2025, 1, 20) } },
  play: async ({ canvasElement, userEvent }) => {
    const dialog = await openCalendar(canvasElement, userEvent);

    const caption = dialog.querySelector('[role="status"]');
    expect((caption?.textContent ?? '').toLowerCase()).toBe('febrero 2025');
    expect(dayCells(dialog)).toHaveLength(28);
  }
};

// The real proof this is a functional picker and not a mockup: a controlled
// wrapper (useState + onChange + value) selects two days through the UI and the
// trigger label changes as a consequence.
function ControlledPicker() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  return <DateRangePicker value={range} onChange={setRange} />;
}

export const SelectRange: Story = {
  render: () => <ControlledPicker />,
  play: async ({ canvasElement, userEvent }) => {
    const trigger = getTrigger(canvasElement);
    const dialog = await openCalendar(canvasElement, userEvent);

    // The rendered month is the current one, so the clicked days and the
    // expected label are derived from today instead of being hardcoded.
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 10);
    const to = new Date(today.getFullYear(), today.getMonth(), 20);
    const expected = `${format(from, 'd', { locale: es })} – ${format(to, 'd MMM yyyy', { locale: es })}`;

    expect(getLabel(trigger)).toBe('Seleccionar fechas');

    // First click sets the start day only (react-day-picker reports `{from, to}`
    // with the same date at that point): one date, and the calendar stays open.
    await userEvent.click(dayCell(dialog, from));
    expect(getLabel(trigger)).toBe(format(from, 'd MMM yyyy', { locale: es }));
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    // Second click completes the range through onChange and closes the popover.
    await userEvent.click(dayCell(dialog, to));
    expect(getLabel(trigger)).toBe(expected);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  }
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement, userEvent }) => {
    const trigger = getTrigger(canvasElement);

    expect(trigger.disabled).toBe(true);
    expect(trigger.getAttribute('data-disabled')).toBe('true');

    await userEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
  }
};

export const TwoMonths: Story = {
  args: { numberOfMonths: 2 },
  play: async ({ canvasElement, userEvent }) => {
    const dialog = await openCalendar(canvasElement, userEvent);

    expect(dialog.querySelectorAll('[role="grid"]')).toHaveLength(2);
  }
};

export const DarkTheme: Story = {
  parameters: { semantic: 'dark' },
  render: () => <DateRangePicker />,
  play: async ({ canvasElement, userEvent }) => {
    expect(getLabel(getTrigger(canvasElement))).toBe('Seleccionar fechas');

    // The dark attribute must land on the document root, not on a wrapper: the
    // calendar is portaled to document.body, so a wrapper would leave it light.
    expect(document.documentElement.getAttribute('data-semantic')).toBe('dark');

    const dialog = await openCalendar(canvasElement, userEvent);
    const darkCanvas = getComputedStyle(dialog)
      .getPropertyValue('--color-bg-canvas')
      .trim();
    expect(darkCanvas).not.toBe('');
  }
};
