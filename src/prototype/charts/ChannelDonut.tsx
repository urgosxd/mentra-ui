// Hand-composed chart for the prototype screens. The export's `Ventas por canal`
// donut is four raw ELLIPSE arcs plus a legend of label/percentage pairs; the
// component library only offers a single-value ring (`DonutIndicator`) and a
// value-based breakdown (`DonutBreakdown`), so this is the smallest faithful
// substitute: tokens for every paint, no dependency.
import type { ComponentProps } from "react";

/** Brand-ramp tints the export paints the four channel arcs with. */
export type ChannelTone = "brand" | "accent" | "brandSoft" | "neutral";

export type ChannelSlice = {
  label: string;
  /** Share of the ring, 0-100, drawn with one decimal and a dot: `52.4 %`. */
  percent: number;
  tone: ChannelTone;
};

export type ChannelDonutProps = Omit<ComponentProps<"div">, "children"> & {
  slices: ChannelSlice[];
  /** Figure in the hole, preformatted: `S/ 82 450`. */
  total: string;
  /** Second line of the hole. */
  totalCaption: string;
};

const SLICE_STROKE: Record<ChannelTone, string> = {
  brand: "stroke-(--color-bg-brand)",
  accent: "stroke-(--color-action-secondary)",
  brandSoft: "stroke-(--color-brand-300)",
  neutral: "stroke-(--color-neutral-200)",
};

const SLICE_DOT: Record<ChannelTone, string> = {
  brand: "bg-(--color-bg-brand)",
  accent: "bg-(--color-action-secondary)",
  brandSoft: "bg-(--color-brand-300)",
  neutral: "bg-(--color-neutral-200)",
};

/** The export's `Anillo`: a 96px ring whose hole is 68 % of the radius. */
const SIZE = 96;
const CENTER = SIZE / 2;
const STROKE = SIZE * 0.16;
const RADIUS = (SIZE - STROKE) / 2;

/** `pathLength` scale of the ring: dash values read as percentages. */
const RING_SCALE = 100;

function round(value: number): number {
  return Math.round(value * 10_000) / 10_000;
}

/** The design writes its shares with a dot and one decimal, not a comma. */
function formatPercent(percent: number): string {
  return `${percent.toFixed(1)} %`;
}

type PaintedArc = { label: string; tone: ChannelTone; share: number; offset: number };

/** Channel split: a four-tone ring with the period total in the hole, plus its legend. */
export function ChannelDonut({ slices, total, totalCaption, className, ...props }: ChannelDonutProps) {
  const arcs: PaintedArc[] = [];
  let cursor = 0;
  for (const slice of slices) {
    const share = round(Math.min(RING_SCALE, Math.max(0, slice.percent)));
    arcs.push({ label: slice.label, tone: slice.tone, share, offset: cursor });
    cursor += share;
  }

  return (
    <div
      {...props}
      data-channel-donut=""
      className={["flex w-full flex-col items-center gap-2", className].filter(Boolean).join(" ")}
    >
      <div className="relative h-24 w-24 shrink-0">
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 h-full w-full"
        >
          {arcs.map((arc) => (
            <circle
              key={arc.label}
              data-arc=""
              data-tone={arc.tone}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              pathLength={RING_SCALE}
              strokeDasharray={`${arc.share} ${round(RING_SCALE - arc.share)}`}
              strokeDashoffset={round(-arc.offset)}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
              className={SLICE_STROKE[arc.tone]}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-[Inter] text-[13px] font-semibold leading-4 text-(--color-text-primary)">
            {total}
          </span>
          <span className="font-[Inter] text-[9px] leading-[11px] text-(--color-text-secondary)">
            {totalCaption}
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-[3px]">
        {arcs.map((arc) => (
          <div key={arc.label} data-legend="" className="flex w-full items-center gap-1.5 overflow-hidden">
            <span
              data-legend-dot=""
              aria-hidden="true"
              className={["h-[7px] w-[7px] shrink-0 rounded-full", SLICE_DOT[arc.tone]]
                .filter(Boolean)
                .join(" ")}
            />
            <span className="min-w-0 flex-1 truncate font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
              {arc.label}
            </span>
            <span className="shrink-0 font-[Inter] text-[10px] font-semibold leading-3 text-(--color-text-primary)">
              {formatPercent(arc.share)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
