// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Summary Table Row (1220615854:651)
import type { ComponentProps, ReactNode } from "react";

export type SummaryTableRowProps = Omit<ComponentProps<"div">, "children"> & {
  /** Area or product group the row summarises. */
  area?: string;
  colaboradores?: string;
  horas?: string;
  extra?: string;
  /**
   * Content of the `%` cell. The export ships the frame empty, so the caller
   * decides what the summary shows there (a percent label, a chip, nothing).
   */
  porcentaje?: ReactNode;
};

/**
 * One row of the summary table. The column track matches SummaryTableHeader so
 * both can be grouped under the same `role="table"` / `role="rowgroup"`.
 */
export function SummaryTableRow({
  area = "Cocina",
  colaboradores = "5",
  horas = "184",
  extra = "6",
  porcentaje,
  className,
  ...props
}: SummaryTableRowProps) {
  return (
    <div
      role="row"
      {...props}
      className={[
        "grid h-[30px] w-full grid-cols-[118px_40px_48px_44px_minmax(0,1fr)] items-center gap-2 border-b border-(--color-border-divider)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        role="cell"
        className="truncate font-[Inter] text-[10.5px] font-semibold leading-[18px] text-(--color-text-primary)"
      >
        {area}
      </span>

      <span
        role="cell"
        className="truncate font-[Inter] text-[10.5px] leading-[18px] text-(--color-text-primary)"
      >
        {colaboradores}
      </span>

      <span
        role="cell"
        className="truncate font-[Inter] text-[10.5px] leading-[18px] text-(--color-text-primary)"
      >
        {horas}
      </span>

      <span
        role="cell"
        className="truncate font-[Inter] text-[10.5px] leading-[18px] text-(--color-text-primary)"
      >
        {extra}
      </span>

      {/* The header right-aligns this column, so the slot content follows it. */}
      <div
        role="cell"
        className="flex min-w-0 items-center justify-end overflow-hidden font-[Inter] text-[10.5px] leading-[18px] text-(--color-text-primary)"
      >
        {porcentaje}
      </div>
    </div>
  );
}
