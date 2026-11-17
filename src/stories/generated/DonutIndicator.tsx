// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · DonutIndicator (1220615854:765)
import type { ComponentProps } from "react";

export type DonutIndicatorProps = ComponentProps<"div"> & {
  /** Share of the ring that is filled, 0-100. The design draws 70,6 %. */
  percent?: number;
  /** Preformatted figure in the centre; derived from `percent` when omitted. */
  cifra?: string;
  /** Second line of the centre block. */
  label?: string;
};

const SIZE = 68;
const STROKE = 7;
const CENTER = SIZE / 2;
const RADIUS = (SIZE - STROKE) / 2;

/** `pathLength` scale of the ring: dash values read as percentages. */
const RING_SCALE = 100;

/** Spanish decimal comma, one decimal, space before the sign: `70,6 %`. */
function formatPercent(percent: number): string {
  return `${percent.toFixed(1).replace(".", ",")} %`;
}

function round(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

/** Single-value donut: a track ring with a proportional arc and a centre block. */
export function DonutIndicator({
  percent = 70.6,
  cifra,
  label = "del total",
  className,
  ...props
}: DonutIndicatorProps) {
  const filled = round(Math.min(RING_SCALE, Math.max(0, percent)));
  const rest = round(RING_SCALE - filled);

  return (
    <div
      {...props}
      data-donut-indicator=""
      className={["relative h-[68px] w-[68px]", className].filter(Boolean).join(" ")}
    >
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 h-full w-full"
      >
        <circle
          data-track=""
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-(--color-chart-track)"
        />
        {filled > 0 && (
          <circle
            data-arc=""
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            strokeWidth={STROKE}
            pathLength={RING_SCALE}
            strokeDasharray={`${filled} ${rest}`}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
            className="stroke-(--color-chart-series-5)"
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          data-cifra=""
          className="font-[Inter] text-[12px] font-semibold text-(--color-text-primary)"
        >
          {cifra ?? formatPercent(percent)}
        </span>
        <span data-label="" className="font-[Inter] text-[10px] text-(--color-text-secondary)">
          {label}
        </span>
      </div>
    </div>
  );
}
