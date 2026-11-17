// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · BarColumn (1220615854:719)
import type { ComponentProps } from "react";

export type BarColumnSeries = 1 | 2 | 3;

export type BarColumnSegment = {
  series: BarColumnSeries;
  value: number;
};

export type BarColumnProps = ComponentProps<"div"> & {
  /** Value label above the stack. */
  valor?: string;
  /** Weekday label under the stack. */
  dia?: string;
  /** Stacked segments, bottom-anchored; their values set the shares of the track. */
  segments?: BarColumnSegment[];
  /** Height of the bar area the segments fill. The design draws 193. */
  trackHeight?: number;
};

/** One chart-ramp token paints each segment; only the two outer ends are rounded. */
const SERIES_CLASSES: Record<BarColumnSeries, string> = {
  1: "bg-(--color-chart-series-1) rounded-t-[2px]",
  2: "bg-(--color-chart-series-2)",
  3: "bg-(--color-chart-series-3) rounded-b-[2px]",
};

/** The export's 64 / 64 / 65 segment heights inside the 193 track. */
const DESIGN_SEGMENTS: BarColumnSegment[] = [
  { series: 1, value: 64 },
  { series: 2, value: 64 },
  { series: 3, value: 65 },
];

/** Single day of a column chart: value label, stacked bar, weekday label. */
export function BarColumn({
  valor = "17",
  dia = "Lun",
  segments = DESIGN_SEGMENTS,
  trackHeight = 193,
  className,
  ...props
}: BarColumnProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  return (
    <div
      {...props}
      data-bar-column=""
      className={["flex w-[49px] flex-col items-center gap-0.5", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span data-valor="" className="font-[Inter] text-[10px] text-(--color-text-secondary)">
        {valor}
      </span>
      <div
        data-track=""
        style={{ height: `${trackHeight}px` }}
        className="flex w-full flex-col items-end justify-end"
      >
        {segments.map((segment) => (
          <div
            key={segment.series}
            data-segment=""
            data-series={segment.series}
            style={{ height: `${total > 0 ? (segment.value / total) * 100 : 0}%` }}
            className={["w-full", SERIES_CLASSES[segment.series]].filter(Boolean).join(" ")}
          />
        ))}
      </div>
      <span data-dia="" className="font-[Inter] text-[10px] text-(--color-text-secondary)">
        {dia}
      </span>
    </div>
  );
}
