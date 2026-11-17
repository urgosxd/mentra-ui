// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · LegendItem (1220615854:126)
import type { ComponentProps } from "react";

export type LegendItemProps = ComponentProps<"div"> & {
  label?: string;
};

/** Chart legend row: one series-1 dot plus its secondary-tone label. */
export function LegendItem({ label = "Cocina", className, ...props }: LegendItemProps) {
  return (
    <div
      {...props}
      data-legend=""
      className={["flex items-center gap-1", className].filter(Boolean).join(" ")}
    >
      <div
        data-legend-dot=""
        aria-hidden="true"
        className="h-[7px] w-[7px] shrink-0 rounded-[999px] bg-(--color-chart-series-1)"
      />
      <span className="font-[Inter] text-[10px] text-(--color-text-secondary)">{label}</span>
    </div>
  );
}
