// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · DonutBreakdown (1220615854:2733)
import type { ComponentProps } from "react";

export type DonutBreakdownSeries = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DonutBreakdownSegment = {
  label: string;
  value: number;
  series: DonutBreakdownSeries;
};

export type DonutBreakdownProps = ComponentProps<"div"> & {
  /** Legend rows, in design order; each value is a share of the ring. */
  segments?: DonutBreakdownSegment[];
};

/** Each series resolves its own slot of the chart ramp for the arc and its dot. */
const SERIES_STROKE: Record<DonutBreakdownSeries, string> = {
  1: "stroke-(--color-chart-series-1)",
  2: "stroke-(--color-chart-series-2)",
  3: "stroke-(--color-chart-series-3)",
  4: "stroke-(--color-chart-series-4)",
  5: "stroke-(--color-chart-series-5)",
  6: "stroke-(--color-chart-series-6)",
  7: "stroke-(--color-chart-series-7)",
};

const SERIES_BG: Record<DonutBreakdownSeries, string> = {
  1: "bg-(--color-chart-series-1)",
  2: "bg-(--color-chart-series-2)",
  3: "bg-(--color-chart-series-3)",
  4: "bg-(--color-chart-series-4)",
  5: "bg-(--color-chart-series-5)",
  6: "bg-(--color-chart-series-6)",
  7: "bg-(--color-chart-series-7)",
};

/** The export's four legend rows: only Tardanzas and Faltas paint an arc. */
const DESIGN_SEGMENTS: DonutBreakdownSegment[] = [
  { label: "Permisos", value: 0, series: 1 },
  { label: "Tardanzas", value: 18, series: 2 },
  { label: "Faltas", value: 4, series: 4 },
  { label: "Vacaciones", value: 0, series: 5 },
];

const SIZE = 104;
const CENTER = SIZE / 2;
/** `innerRadius` 0.65 of the export: a 18.2px ring around the 68px hole. */
const STROKE = 18.2;
const RADIUS = (SIZE - STROKE) / 2;

/** `pathLength` scale of the ring: dash values read as percentages. */
const RING_SCALE = 100;

/** Spanish decimal comma, one decimal, space before the sign: `81,8 %`. */
function formatPercent(share: number): string {
  return `${share.toFixed(1).replace(".", ",")} %`;
}

function round(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

type PaintedArc = {
  label: string;
  series: DonutBreakdownSeries;
  share: number;
  offset: number;
};

/**
 * Donut with a legend breakdown: one ring segment per non-zero series and a
 * legend row per series, the hole carrying the total of the values.
 */
export function DonutBreakdown({
  segments = DESIGN_SEGMENTS,
  className,
  ...props
}: DonutBreakdownProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);

  // Shares accumulate in legend order, so each arc starts where the previous one
  // ended; zero-valued series add nothing and paint no arc.
  const arcs: PaintedArc[] = [];
  let cursor = 0;
  for (const segment of segments) {
    const share = total > 0 ? (segment.value / total) * RING_SCALE : 0;
    if (segment.value > 0) {
      arcs.push({ label: segment.label, series: segment.series, share, offset: cursor });
    }
    cursor += share;
  }

  return (
    <div
      {...props}
      data-donut-breakdown=""
      className={[
        "flex h-[104px] w-[380px] items-center gap-3.5 bg-(--color-bg-surface)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden">
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 h-full w-full"
        >
          {arcs.map((arc) => {
            const painted = round(arc.share);
            return (
              <circle
                key={arc.series}
                data-arc=""
                data-series={arc.series}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                strokeWidth={STROKE}
                pathLength={RING_SCALE}
                strokeDasharray={`${painted} ${round(RING_SCALE - painted)}`}
                strokeDashoffset={round(-arc.offset)}
                transform={`rotate(-90 ${CENTER} ${CENTER})`}
                className={SERIES_STROKE[arc.series]}
              />
            );
          })}
        </svg>
        <div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full bg-(--color-bg-surface)">
          <span
            data-total=""
            className="font-[Inter_Tight] text-[20px] font-bold text-(--color-text-primary)"
          >
            {total}
          </span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 grow flex-col gap-[5px]">
        {segments.map((segment) => (
          <div
            key={segment.label}
            data-legend=""
            className="flex h-[13px] w-full items-center gap-1.5 overflow-hidden"
          >
            <div className="flex h-full min-w-0 flex-1 items-center gap-1">
              <span
                data-legend-dot=""
                aria-hidden="true"
                className={["h-[7px] w-[7px] shrink-0 rounded-full", SERIES_BG[segment.series]]
                  .filter(Boolean)
                  .join(" ")}
              />
              <span
                data-legend-label=""
                className="truncate font-[Inter] text-[10.5px] leading-none text-(--color-text-primary)"
              >
                {segment.label}
              </span>
            </div>
            <span
              data-legend-value=""
              className="shrink-0 font-[Inter] text-[10.5px] font-semibold leading-none text-(--color-text-primary)"
            >
              {segment.value}
            </span>
            <span
              data-legend-percent=""
              className="w-[44px] shrink-0 text-right font-[Inter] text-[9.5px] leading-none text-(--color-text-muted)"
            >
              {formatPercent(total > 0 ? (segment.value / total) * RING_SCALE : 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
