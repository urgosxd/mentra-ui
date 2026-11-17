// Hand-composed chart for the prototype screens. pdf3.fig draws the BCG matrix
// with raw RECTANGLE quadrants, grid lines and ELLIPSE points; the component
// library has no scatter plot, so this is the smallest faithful substitute:
// tokens for every paint, no dependency.
import type { ComponentProps } from "react";

export type BcgPointTone = "success" | "accent" | "danger";

export type BcgDatum = {
  name: string;
  /** Share of total sales, in percent: the X axis. */
  participation: number;
  /** Growth, in percent: the Y axis. */
  growth: number;
  tone: BcgPointTone;
  /** Which side of its point carries the label, as the export places it. */
  labelSide: "left" | "right";
};

export type BcgMatrixProps = Omit<ComponentProps<"svg">, "children" | "points"> & {
  points: BcgDatum[];
  /** Caption centred under the X axis. */
  axisTitle: string;
};

/** Geometry of the export's `Gráfico BCG` frame, in CSS pixels. */
const WIDTH = 468;
const HEIGHT = 536;
const PLOT_LEFT = 44;
const PLOT_RIGHT = 458;
const PLOT_TOP = 8;
const PLOT_BOTTOM = 498;
const MID_X = 251;
const MID_Y = 253;

/** Axis limits of the export: participation 0-25 %, growth -30 to 30 %. */
const X_MAX = 25;
const Y_MAX = 30;

const X_TICKS = [0, 5, 10, 15, 20, 25] as const;
const Y_TICKS = [-30, -15, 0, 15, 30] as const;

const POINT_FILL: Record<BcgPointTone, string> = {
  success: "fill-(--color-text-success)",
  accent: "fill-(--color-action-secondary)",
  danger: "fill-(--color-text-danger)",
};

const AXIS_TEXT = "fill-(--color-text-secondary) font-[Inter] text-[9px]";
const QUADRANT_TEXT = "font-[Inter] text-[9px] font-semibold";

/** BCG scatter: four tinted quadrants, the axis grid and one labelled point per product. */
export function BcgMatrix({ points, axisTitle, ...props }: BcgMatrixProps) {
  const x = (participation: number) =>
    PLOT_LEFT + (Math.min(participation, X_MAX) / X_MAX) * (PLOT_RIGHT - PLOT_LEFT);
  const y = (growth: number) =>
    MID_Y - (Math.max(Math.min(growth, Y_MAX), -Y_MAX) / Y_MAX) * (MID_Y - PLOT_TOP);

  return (
    <svg
      {...props}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      role="img"
      aria-label="Matriz BCG de la carta: crecimiento frente a participación en ventas"
      className={["shrink-0", props.className].filter(Boolean).join(" ")}
    >
      <g data-quadrants="">
        <rect
          x={PLOT_LEFT}
          y={PLOT_TOP}
          width={MID_X - PLOT_LEFT}
          height={MID_Y - PLOT_TOP}
          className="fill-(--color-amber-50)"
        />
        <rect
          x={MID_X}
          y={PLOT_TOP}
          width={PLOT_RIGHT - MID_X}
          height={MID_Y - PLOT_TOP}
          className="fill-(--color-green-50)"
        />
        <rect
          x={PLOT_LEFT}
          y={MID_Y}
          width={MID_X - PLOT_LEFT}
          height={PLOT_BOTTOM - MID_Y}
          className="fill-(--color-red-50)"
        />
        <rect
          x={MID_X}
          y={MID_Y}
          width={PLOT_RIGHT - MID_X}
          height={PLOT_BOTTOM - MID_Y}
          className="fill-(--color-neutral-50)"
        />
      </g>

      {Y_TICKS.map((tick) => (
        <g key={`y-${tick}`} data-grid-line="">
          <line
            x1={PLOT_LEFT}
            x2={PLOT_RIGHT}
            y1={y(tick)}
            y2={y(tick)}
            strokeWidth={1}
            className={tick === 0 ? "stroke-(--color-neutral-400)" : "stroke-(--color-chart-grid)"}
            opacity={tick === 0 ? 0.45 : 1}
          />
          <text x={36} y={y(tick) + 5} textAnchor="end" className={AXIS_TEXT}>
            {tick === 0 ? "0 %" : `${tick} %`}
          </text>
        </g>
      ))}

      {X_TICKS.map((tick) => (
        <g key={`x-${tick}`} data-grid-line="">
          <line
            x1={x(tick)}
            x2={x(tick)}
            y1={PLOT_TOP}
            y2={PLOT_BOTTOM}
            strokeWidth={1}
            className="stroke-(--color-chart-grid)"
          />
          <text x={x(tick)} y={516} textAnchor="middle" className={AXIS_TEXT}>
            {`${tick} %`}
          </text>
        </g>
      ))}

      <g data-quadrant-labels="">
        <text x={52} y={29} className={[QUADRANT_TEXT, "fill-(--color-text-warning)"].join(" ")}>
          INTERROGANTES
        </text>
        <text
          x={450}
          y={29}
          textAnchor="end"
          className={[QUADRANT_TEXT, "fill-(--color-text-success)"].join(" ")}
        >
          ESTRELLAS
        </text>
        <text x={52} y={489} className={[QUADRANT_TEXT, "fill-(--color-text-danger)"].join(" ")}>
          PERROS
        </text>
        <text
          x={450}
          y={489}
          textAnchor="end"
          className={[QUADRANT_TEXT, "fill-(--color-text-warning)"].join(" ")}
        >
          VACAS
        </text>
      </g>

      {points.map((point) => {
        const cx = x(point.participation);
        const cy = y(point.growth);
        const left = point.labelSide === "left";
        return (
          <g key={point.name} data-bcg-point={point.name}>
            <circle cx={cx} cy={cy} r={5} strokeWidth={1} className={[POINT_FILL[point.tone], "stroke-(--color-neutral-0)"].join(" ")} />
            <text
              x={left ? cx - 12 : cx + 12}
              y={cy + 3.5}
              textAnchor={left ? "end" : "start"}
              className="fill-(--color-text-primary) font-[Inter] text-[9px]"
            >
              {point.name}
            </text>
          </g>
        );
      })}

      <text x={(PLOT_LEFT + PLOT_RIGHT) / 2} y={535} textAnchor="middle" className={AXIS_TEXT}>
        {axisTitle}
      </text>
    </svg>
  );
}
