// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Table Header · Asistencia (1220615854:271)
import type { ComponentProps } from "react";

export type TableHeaderAsistenciaProps = ComponentProps<"div">;

/** Column labels in design order, each paired with its stable data key. */
const COLUMNS = [
  { key: "colaborador", label: "Colaborador" },
  { key: "turno", label: "Turno" },
  { key: "dias", label: "Días" },
  { key: "tardanzas", label: "Tard." },
  { key: "faltas", label: "Falt." },
  { key: "horas", label: "Horas" },
  { key: "puntualidad", label: "Punt." },
];

/**
 * Header row of the Asistencia table: seven labelled columns on the canvas strip
 * plus the empty `Flecha` slot the design ends the row with, so header and data
 * rows share one column grid. Rendered as an ARIA row so it can sit inside a
 * `role="table"` + `role="rowgroup"` container next to TableRowAsistencia.
 */
export function TableHeaderAsistencia({
  className,
  ...props
}: TableHeaderAsistenciaProps) {
  return (
    <div
      role="row"
      {...props}
      className={[
        "grid h-[30px] w-full grid-cols-[200px_76px_52px_56px_52px_56px_78px_14px] items-center gap-2 bg-(--color-bg-canvas) px-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {COLUMNS.map((column) => (
        <span
          key={column.key}
          role="columnheader"
          data-column={column.key}
          className="truncate font-[Inter] text-[10px] font-semibold uppercase leading-[18px] tracking-[1.2px] text-(--color-text-secondary)"
        >
          {column.label}
        </span>
      ))}
      {/* The design's `Flecha` frame: an empty 14x12 box reserving the chevron
          column that TableRowAsistencia fills with its disclosure glyph. */}
      <span data-slot="arrow" aria-hidden="true" className="h-3 w-3.5" />
    </div>
  );
}
