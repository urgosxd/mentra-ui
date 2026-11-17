// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · ScheduleRow (1220615854:928)
import type { ComponentProps } from "react";
import { ShiftChip } from "./ShiftChip";
import type { ShiftTone } from "./app-data";

/** One day column of the matrix: the shift tone and the hours it covers. */
export type ScheduleDayCell = { turno: ShiftTone; label: string };

export type ScheduleRowProps = Omit<ComponentProps<"div">, "children"> & {
  iniciales?: string;
  nombre?: string;
  cargo?: string;
  /** One entry per day column, Monday first. */
  days?: ScheduleDayCell[];
  total?: string;
};

// Same template as ScheduleMatrixHeader so the cells sit under their headers.
const GRID_COLUMNS = "grid-cols-[162px_repeat(7,minmax(0,1fr))_46px]";

const DEFAULT_DAYS: ScheduleDayCell[] = [
  { turno: "Mañana", label: "08–16" },
  { turno: "Mañana", label: "08–16" },
  { turno: "Tarde", label: "14–22" },
  { turno: "Tarde", label: "14–22" },
  { turno: "Tarde", label: "14–22" },
  { turno: "Mañana", label: "08–16" },
  { turno: "Descanso", label: "Desc." },
];

/**
 * One collaborator's week in the schedule matrix: brand initials, name and role,
 * seven shift chips and the hour total.
 */
export function ScheduleRow({
  iniciales = "CQ",
  nombre = "Carlos Quispe",
  cargo = "Jefe de Cocina · Cocina",
  days = DEFAULT_DAYS,
  total = "48 h",
  className,
  ...props
}: ScheduleRowProps) {
  return (
    <div
      role="row"
      {...props}
      className={["grid w-[764px] items-center gap-1 py-2", GRID_COLUMNS, className]
        .filter(Boolean)
        .join(" ")}
    >
      <div role="cell" className="flex min-w-0 items-center gap-1.5">
        {/* The export sizes this circle at 22px with 10px initials, smaller than
            the 32px Avatar component, so it is drawn here instead of reused. */}
        <div
          data-avatar=""
          aria-hidden="true"
          className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-(--radius-pill) bg-(--color-bg-brand)"
        >
          <span className="font-[Inter] text-[10px] font-semibold text-(--color-text-on-brand)">
            {iniciales}
          </span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-[Inter] text-[11px] font-semibold text-(--color-text-primary)">
            {nombre}
          </span>
          <span className="truncate font-[Inter] text-[9px] text-(--color-text-secondary)">
            {cargo}
          </span>
        </div>
      </div>

      {days.map((day, index) => (
        <div
          key={`${day.turno}-${day.label}-${index}`}
          role="cell"
          className="flex min-w-0 items-center justify-center"
        >
          {/* `max-w-full` keeps the fixed-width chip inside a narrower column. */}
          <ShiftChip turno={day.turno} label={day.label} className="max-w-full" />
        </div>
      ))}

      <span
        role="cell"
        className="truncate text-right font-[Inter] text-[11px] font-semibold text-(--color-text-primary)"
      >
        {total}
      </span>
    </div>
  );
}
