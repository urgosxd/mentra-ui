// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · MonthCalendar (1220615854:529)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

export type MonthCalendarProps = ComponentProps<"div"> & {
  /** Month of the rendered grid, 1-12. Drives the default `Mes` label. */
  month?: number;
  /** Year of the rendered grid. */
  year?: number;
  /** `Mes` text property of the export, when a caller needs a fixed label. */
  mes?: string;
  /** Day of the month that carries the highlighted number. */
  selectedDay?: number;
};

/** One slot of the grid: a day of the month, or a blank of the padded week. */
export type CalendarCell = number | null;

/** Spanish month names the export's `Mes` label is written in. */
const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/** Monday-first weekday header letters, exactly as exported. */
const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

/**
 * Monday-first month grid, in whole weeks: the leading blanks of the first week,
 * the days of the month, and the trailing blanks that close the last one. The
 * design draws six weeks for March 2025 and five for April and February.
 */
function monthWeeks(month: number, year: number): CalendarCell[][] {
  const daysInMonth = new Date(year, month, 0).getDate();
  // `getDay()` is Sunday-first; the header is not, so Saturday maps to column 5.
  const leading = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const total = Math.ceil((leading + daysInMonth) / 7) * 7;

  const weeks: CalendarCell[][] = [];
  for (let start = 0; start < total; start += 7) {
    const week: CalendarCell[] = [];
    for (let slot = start; slot < start + 7; slot += 1) {
      const day = slot - leading + 1;
      week.push(day >= 1 && day <= daysInMonth ? day : null);
    }
    weeks.push(week);
  }
  return weeks;
}

/** Month grid of the schedule panel: label, month chevrons, weekday header, days. */
export function MonthCalendar({
  month = 3,
  year = 2025,
  mes,
  selectedDay,
  className,
  ...props
}: MonthCalendarProps) {
  const weeks = monthWeeks(month, year);
  const label = mes ?? `${MONTH_NAMES[month - 1]} ${year}`;

  return (
    <div
      {...props}
      className={["flex w-[312px] flex-col gap-[6px]", className].filter(Boolean).join(" ")}
    >
      <div className="flex w-full items-center gap-[8px]">
        <span
          data-mes=""
          className="min-w-0 flex-1 truncate font-[Inter] text-[11px] font-semibold text-(--color-text-primary)"
        >
          {label}
        </span>
        <IconifyIcon
          icon="lucide:chevron-left"
          aria-hidden="true"
          className="h-[12px] w-[12px] shrink-0 text-(--color-icon-muted)"
        />
        <IconifyIcon
          icon="lucide:chevron-right"
          aria-hidden="true"
          className="h-[12px] w-[12px] shrink-0 text-(--color-icon-muted)"
        />
      </div>

      <div className="flex w-full">
        {WEEKDAYS.map((weekday, index) => (
          <span
            // The header repeats `M` for Tuesday and Wednesday, as exported.
            key={`${weekday}-${index}`}
            data-weekday=""
            className="min-w-0 flex-1 text-center font-[Inter] text-[10px] text-(--color-text-secondary)"
          >
            {weekday}
          </span>
        ))}
      </div>

      {weeks.map((week, weekIndex) => (
        <div key={`week-${weekIndex}`} data-week="" className="flex w-full">
          {week.map((day, slot) => {
            const selected = day !== null && day === selectedDay;
            return (
              <div
                key={`cell-${weekIndex}-${slot}`}
                data-cell=""
                data-day={day ?? undefined}
                data-selected={selected ? "true" : undefined}
                className="flex h-[20px] flex-1 flex-col items-center justify-center"
              >
                {day === null ? (
                  // `Vacío` frame of the export: a 1x1 placeholder keeps the slot's height.
                  <div aria-hidden="true" className="h-px w-px" />
                ) : (
                  <span
                    data-day-number=""
                    className={[
                      "w-[20px] text-center font-[Inter] text-[10px] leading-[20px]",
                      selected
                        ? "rounded-(--radius-100) bg-(--color-bg-brand) text-(--color-text-on-brand)"
                        : "text-(--color-text-primary)",
                    ].join(" ")}
                  >
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
