// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Summary Table Header (1220615854:645)
import type { ComponentProps } from "react";

export type SummaryTableHeaderProps = ComponentProps<"div">;

const COLUMNS = ["Área", "Col.", "Horas", "Extra", "%"];

/**
 * Header row for the summary table. Rendered as an ARIA row so it can be placed
 * inside a `role="table"` + `role="rowgroup"` container alongside SummaryTableRow;
 * both share the same column track so the labels sit over their cells.
 */
export function SummaryTableHeader({ className, ...props }: SummaryTableHeaderProps) {
  return (
    <div
      role="row"
      {...props}
      className={[
        "grid w-full grid-cols-[118px_40px_48px_44px_minmax(0,1fr)] items-center gap-2 border-b border-(--color-border-divider) pb-1.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {COLUMNS.map((column) => (
        <span
          key={column}
          role="columnheader"
          data-column={column}
          className={[
            "truncate font-[Inter] text-[10px] font-semibold uppercase leading-[18px] tracking-[1.2px] text-(--color-text-secondary)",
            column === "%" ? "text-right" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {column}
        </span>
      ))}
    </div>
  );
}
