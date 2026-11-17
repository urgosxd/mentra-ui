// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · ScheduleMatrixHeader (1220615854:911)
import type { ComponentProps } from "react";

export type ScheduleMatrixHeaderProps = ComponentProps<"div"> & {
  /** Leading column label: who the row belongs to. */
  personLabel?: string;
  /** One label per day column, Monday first. */
  days?: string[];
  /** Trailing column label. */
  totalLabel?: string;
};

// The column template is shared with ScheduleRow (162px person column, seven
// flexible day columns, 46px total) so header and body stay aligned.
const GRID_COLUMNS = "grid-cols-[162px_repeat(7,minmax(0,1fr))_46px]";

const LABEL_CLASSES =
  "truncate font-[Inter] text-[10px] font-semibold uppercase leading-[18px] tracking-[1.2px] text-(--color-text-secondary)";

/**
 * Header row of the weekly schedule matrix. Rendered as an ARIA row so it can sit
 * inside a `role="table"` + `role="rowgroup"` container above ScheduleRow.
 */
export function ScheduleMatrixHeader({
  personLabel = "Colaborador / cargo",
  days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  totalLabel = "Total",
  className,
  ...props
}: ScheduleMatrixHeaderProps) {
  return (
    <div
      role="row"
      {...props}
      className={[
        "grid h-[23px] w-[764px] items-end gap-1",
        GRID_COLUMNS,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span role="columnheader" data-column="persona" className={LABEL_CLASSES}>
        {personLabel}
      </span>
      {days.map((day, index) => (
        <span
          key={`${day}-${index}`}
          role="columnheader"
          data-column={`dia-${index}`}
          className={["pb-1 text-center", LABEL_CLASSES].join(" ")}
        >
          {day}
        </span>
      ))}
      <span role="columnheader" data-column="total" className={["text-right", LABEL_CLASSES].join(" ")}>
        {totalLabel}
      </span>
    </div>
  );
}
