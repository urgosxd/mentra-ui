import { useState } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker, type DateRange } from "react-day-picker";
import { Popover } from "radix-ui";

export type DateRangePickerProps = {
  /** Selected range. Passing it makes the picker controlled; otherwise it keeps its own state. */
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  /** Label shown while the range is empty. */
  placeholder?: string;
  numberOfMonths?: number;
  disabled?: boolean;
  className?: string;
};

// The export paints the range copy as `10 – 20 Mar 2025`, with an en dash.
const RANGE_SEPARATOR = "–";

/**
 * Formats the trigger label.
 *
 * Complete range: `10 – 20 mar 2025` (day – day month year, `es` locale, en dash
 * like the export). A half-filled range says so instead of borrowing the
 * complete format, and an empty range falls back to the placeholder.
 *
 * A same-day range is the state right after the first click (react-day-picker
 * completes `{from, to}` with the same date), so it reads as one date instead of
 * a degenerate `10 – 10 mar 2025`.
 */
function formatRangeLabel(range: DateRange | undefined, placeholder: string): string {
  const from = range?.from;
  const to = range?.to;

  if (from && to && isSameDay(from, to)) {
    return format(from, "d MMM yyyy", { locale: es });
  }
  if (from && to) {
    return `${format(from, "d", { locale: es })} ${RANGE_SEPARATOR} ${format(to, "d MMM yyyy", { locale: es })}`;
  }
  if (from) {
    return `${format(from, "d MMM yyyy", { locale: es })} ${RANGE_SEPARATOR} …`;
  }
  if (to) {
    return `… ${RANGE_SEPARATOR} ${format(to, "d MMM yyyy", { locale: es })}`;
  }
  return placeholder;
}

/**
 * DayPicker class names, expressed with this project's design tokens.
 *
 * `range_middle` is marked important on purpose: a day inside the range carries
 * both the `selected` and the `range_middle` modifier, so both background-color
 * and color utilities land on the same cell. The marker states the precedence
 * instead of relying on the order Tailwind happens to emit them in.
 */
const calendarClassNames = {
  months: "flex gap-(--spacing-stack-lg)",
  month: "grid grid-cols-[auto_1fr_auto] items-center gap-(--spacing-stack-sm)",
  month_caption: "col-start-2 row-start-1 flex justify-center",
  caption_label:
    "text-(--type-label-size) font-semibold leading-[18px] text-(--color-text-primary) font-[Inter] capitalize",
  button_previous:
    "col-start-1 row-start-1 flex h-6 w-6 items-center justify-center rounded-(--radius-control) text-(--color-text-secondary) cursor-pointer hover:bg-(--color-bg-sunken) aria-disabled:cursor-not-allowed",
  button_next:
    "col-start-3 row-start-1 flex h-6 w-6 items-center justify-center rounded-(--radius-control) text-(--color-text-secondary) cursor-pointer hover:bg-(--color-bg-sunken) aria-disabled:cursor-not-allowed",
  chevron: "h-4 w-4",
  month_grid: "col-span-3 row-start-2 w-fit border-collapse",
  weekday:
    "w-9 h-6 text-center text-(--type-label-size) font-medium leading-[18px] text-(--color-text-muted) font-[Inter]",
  day: "w-9 h-9 p-0 align-middle box-border text-center text-(--type-label-size) font-normal leading-[18px] font-[Inter] text-(--color-text-primary)",
  day_button: "w-full h-full cursor-pointer",
  selected: "bg-(--color-action-primary) text-(--color-text-on-brand) font-semibold",
  range_start: "bg-(--color-action-primary) text-(--color-text-on-brand) font-semibold",
  range_end: "bg-(--color-action-primary) text-(--color-text-on-brand) font-semibold",
  range_middle: "bg-(--color-action-primary-subtle)! text-(--color-action-primary)!",
  today: "outline-1 outline-(--color-action-primary) -outline-offset-1",
  outside: "text-(--color-text-muted)",
};

/**
 * Functional date-range picker: Radix Popover + react-day-picker, styled with the
 * design-system tokens.
 *
 * The OpenPencil `DateRangePicker` export is a static mockup (March 2025
 * hardcoded, 31 absolutely positioned cells, a pre-painted range and no date
 * state), so this component reimplements the shadcn range-picker pattern on the
 * project's tokens instead of wrapping the mockup.
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = "Seleccionar fechas",
  numberOfMonths = 1,
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [uncontrolledRange, setUncontrolledRange] = useState<DateRange | undefined>(value);
  const [open, setOpen] = useState(false);

  // Controlled when the parent supplies `value`, self-managed otherwise so the
  // picker also works on its own.
  const range = value ?? uncontrolledRange;

  const handleSelect = (next: DateRange | undefined) => {
    if (value === undefined) {
      setUncontrolledRange(next);
    }
    onChange?.(next);
    // Only a range with two distinct days closes the popover: right after the
    // first click react-day-picker returns `{from: day, to: day}`, and closing
    // there would end the interaction before the user picks the end date.
    if (next?.from && next.to && !isSameDay(next.from, next.to)) {
      setOpen(false);
    }
  };

  return (
    <Popover.Root
      open={open}
      onOpenChange={(next) => {
        if (!disabled) setOpen(next);
      }}
    >
      {/* The trigger classes mirror the exported trigger: pill radius, input
          height, surface background and the focus/open borders, all from tokens.
          The export keys its open state on `data-[state=Open]`, which never
          matches Radix's `data-state="open"`; here the variants sit on the
          element that actually carries the state. */}
      <div
        data-disabled={disabled || undefined}
        className={[
          "group/date-range-picker inline-flex w-fit items-start box-border",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Popover.Trigger
          disabled={disabled}
          data-disabled={disabled || undefined}
          className="group/trigger flex m-0 p-0 justify-between items-center gap-(--spacing-stack-md) w-46 h-(--component-input-height) [text-align:inherit] text-inherit bg-(--color-bg-surface) [border:var(--border-width-default)_solid_var(--color-border-subtle)] bg-none [font:inherit] cursor-pointer px-[var(--component-input-padding-x)] box-border rounded-[var(--radius-pill)] not-data-disabled:hover:bg-(--color-bg-sunken) focus-visible:outline-none focus-visible:[border:var(--border-width-focus-2)_solid_var(--color-border-focus)] data-[state=open]:bg-(--color-bg-raised) data-[state=open]:[border:var(--border-width-focus-2)_solid_var(--color-border-focus)] data-disabled:bg-(--color-bg-sunken) data-disabled:cursor-not-allowed"
        >
          <IconifyIcon
            icon="lucide:calendar"
            className="relative overflow-visible w-4 h-4 shrink-0 text-(--color-text-primary) box-border group-data-disabled/date-range-picker:text-(--color-text-secondary)"
          />
          <span className="w-30 text-(--type-body-size) text-left font-semibold leading-5 text-(--color-text-primary) box-border grow font-[Inter] whitespace-pre-wrap group-data-disabled/date-range-picker:text-(--color-text-secondary)">
            {formatRangeLabel(range, placeholder)}
          </span>
          <IconifyIcon
            icon="lucide:chevron-up"
            className="hidden relative overflow-visible w-4 h-4 shrink-0 text-(--color-text-primary) box-border group-data-[state=open]/trigger:[display:revert] group-data-disabled/date-range-picker:text-(--color-text-secondary)"
          />
          <IconifyIcon
            icon="lucide:chevron-down"
            className="relative overflow-visible w-4 h-4 shrink-0 text-(--color-text-primary) box-border group-data-[state=open]/trigger:hidden group-data-disabled/date-range-picker:text-(--color-text-secondary)"
          />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            aria-label="Seleccionar rango de fechas"
            className="z-50 p-(--spacing-inset-md) flex flex-col items-start gap-(--spacing-stack-sm) w-fit bg-(--color-bg-raised) [border:var(--border-width-default)_solid_var(--color-border-subtle)] box-border rounded-[var(--radius-surface)]"
          >
            <DayPicker
              mode="range"
              locale={es}
              numberOfMonths={numberOfMonths}
              navLayout="around"
              selected={range}
              onSelect={handleSelect}
              // Open on the month of the current range so a preset value is visible.
              defaultMonth={range?.from}
              showOutsideDays
              classNames={calendarClassNames}
              // The export's weekday row is the narrow es form: L M X J V S D.
              formatters={{ formatWeekdayName: (weekday) => format(weekday, "EEEEE", { locale: es }) }}
            />
          </Popover.Content>
        </Popover.Portal>
      </div>
    </Popover.Root>
  );
}
