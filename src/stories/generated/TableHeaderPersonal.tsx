// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Table Header · Personal (367078803:7585)
import type { ComponentProps } from "react";

export type TableHeaderPersonalProps = ComponentProps<"div">;

const COLUMNS = ["Colaborador", "Cargo", "Sueldo", "Estado", "Docs"];

/**
 * Header row for the Personal table. Rendered as an ARIA row so it can be placed
 * inside a `role="table"` + `role="rowgroup"` container alongside TableRowPersonal.
 */
export function TableHeaderPersonal({ className, ...props }: TableHeaderPersonalProps) {
  return (
    <div
      role="row"
      {...props}
      className={[
        "grid h-[30px] w-full grid-cols-[252px_122px_68px_96px_56px] items-center gap-2 rounded-(--radius-control) bg-(--color-bg-sunken) px-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {COLUMNS.map((column) => (
        <span
          key={column}
          role="columnheader"
          data-column={column.toLowerCase()}
          className={[
            "truncate font-[Inter] text-[9px] font-semibold uppercase leading-[18px] tracking-[1.2px] text-(--color-text-secondary)",
            column === "Sueldo" ? "text-right" : "",
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
