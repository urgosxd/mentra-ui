// Hand-composed chart for the prototype screens. pdf3.fig draws this panel with raw
// VECTOR + ELLIPSE nodes and the component library has no line/area chart, so the
// smallest faithful substitute lives here: no dependency, tokens for every paint.
import type { ComponentProps } from "react";

export type EvolutionDatum = {
  /** Month abbreviation drawn under the axis, e.g. `Ene`. */
  label: string;
  /** Sales of the current year, in thousands of soles. */
  thisYear: number;
  /** Sales of the previous year, in thousands of soles. */
  lastYear: number;
};

export type EvolutionChartProps = Omit<ComponentProps<"svg">, "children" | "points"> & {
  points: EvolutionDatum[];
  /** Top of the value axis, in thousands. The design draws 120K. */
  maxValue?: number;
};

/** Geometry of the export's `Gráfico evolución` frame, in CSS pixels. */
const WIDTH = 316;
const HEIGHT = 160;
const BASELINE = 142;
const TOP = 8;
/** Grid lines stop short of the last point, exactly as the export draws them. */
const GRID_LEFT = 34;
const GRID_RIGHT = 284;
const POINT_LEFT = 30;
const POINT_RIGHT = 312;
const TICKS = [0, 30, 60, 90, 120] as const;

const AXIS_TEXT = "fill-(--color-text-secondary) font-[Inter] text-[9px]";

function formatTick(tick: number): string {
  return tick === 0 ? "0" : `${tick}K`;
}

/** Two-series monthly evolution: brand area + line for this year, grey line for last. */
export function EvolutionChart({ points, maxValue = 120, ...props }: EvolutionChartProps) {
  const lastIndex = Math.max(points.length - 1, 1);
  const x = (index: number) => POINT_LEFT + (index * (POINT_RIGHT - POINT_LEFT)) / lastIndex;
  const y = (value: number) => BASELINE - (value / maxValue) * (BASELINE - TOP);

  const line = (key: "thisYear" | "lastYear") =>
    points
      .map((point, index) => `${index === 0 ? "M" : "L"}${x(index).toFixed(2)} ${y(point[key]).toFixed(2)}`)
      .join("");

  const area = `${line("thisYear")}L${x(lastIndex).toFixed(2)} ${BASELINE}L${x(0).toFixed(2)} ${BASELINE}Z`;

  return (
    <svg
      {...props}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      role="img"
      aria-label="Evolución de ventas de este año frente al año anterior"
      className={["shrink-0", props.className].filter(Boolean).join(" ")}
    >
      {TICKS.map((tick) => (
        <g key={tick} data-grid-line="">
          <line
            x1={GRID_LEFT}
            x2={GRID_RIGHT}
            y1={y(tick)}
            y2={y(tick)}
            strokeWidth={1}
            className="stroke-(--color-border-subtle)"
          />
          <text x={24} y={y(tick) + 5} textAnchor="end" className={AXIS_TEXT}>
            {formatTick(tick)}
          </text>
        </g>
      ))}

      <path d={area} data-area="" className="fill-(--color-bg-brand)" opacity={0.1} />
      <path
        d={line("lastYear")}
        data-series="last-year"
        fill="none"
        strokeWidth={2}
        className="stroke-(--color-slate-400)"
      />
      <path
        d={line("thisYear")}
        data-series="this-year"
        fill="none"
        strokeWidth={2}
        className="stroke-(--color-bg-brand)"
      />

      {points.map((point, index) => (
        <circle
          key={point.label}
          data-point=""
          cx={x(index)}
          cy={y(point.thisYear)}
          r={2.5}
          className="fill-(--color-bg-brand)"
        />
      ))}

      {points.map((point, index) => (
        <text key={point.label} x={x(index)} y={157} textAnchor="middle" className={AXIS_TEXT}>
          {point.label}
        </text>
      ))}
    </svg>
  );
}
