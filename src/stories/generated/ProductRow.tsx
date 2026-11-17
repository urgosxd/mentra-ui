// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Product Row (1220615854:670)
import type { ComponentProps } from "react";

export type ProductRowProps = Omit<ComponentProps<"div">, "children"> & {
  /** Position in the ranking, 1-based. */
  ranking?: string;
  producto?: string;
  ventas?: string;
  /** Share of the total, 0-100. Drives the width of the participation bar. */
  participacion?: number;
  /** Copy next to the bar, e.g. `14,2 %`. Formatted from `participacion` by default. */
  participacionLabel?: string;
};

/**
 * One row of the products ranking. The export draws its `Barra` mock full width,
 * so the percentage is what actually sizes the fill: `participacion` is rendered
 * as a 0-100 percentage of the track (and exposed through `aria-valuenow`).
 */
export function ProductRow({
  ranking = "1",
  producto = "Alitas BBQ",
  ventas = "11 720",
  participacion = 14.2,
  participacionLabel,
  className,
  ...props
}: ProductRowProps) {
  const label = participacionLabel ?? `${String(participacion).replace(".", ",")} %`;

  return (
    <div
      role="row"
      {...props}
      data-participacion={participacion}
      className={[
        // The export's fixed widths (14 / 52 / 64 / 48 plus 12px gaps) sum to less
        // than its 608px row, so the product name is the column that grows.
        "grid w-full grid-cols-[14px_minmax(0,1fr)_52px_64px_48px] items-center gap-3 border-b border-(--color-border-divider) py-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        role="cell"
        className="truncate font-[Inter] text-[10px] leading-[18px] text-(--color-text-muted)"
      >
        {ranking}
      </span>

      <span
        role="cell"
        className="truncate font-[Inter] text-[10.5px] leading-[18px] text-(--color-text-primary)"
      >
        {producto}
      </span>

      <span
        role="cell"
        className="truncate text-right font-[Inter] text-[10.5px] font-semibold leading-[18px] text-(--color-text-primary)"
      >
        {ventas}
      </span>

      <div role="cell" className="flex items-center">
        <div
          role="progressbar"
          aria-label="Participación en ventas"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={participacion}
          className="flex h-[6px] w-[64px] items-center overflow-hidden rounded-[3px] bg-(--color-chart-track)"
        >
          <div
            data-progress=""
            className="h-[5px] rounded-[3px] bg-(--color-bg-brand)"
            style={{ width: `${participacion}%` }}
          />
        </div>
      </div>

      <span
        role="cell"
        className="truncate text-right font-[Inter] text-[10px] leading-[18px] text-(--color-text-secondary)"
      >
        {label}
      </span>
    </div>
  );
}
