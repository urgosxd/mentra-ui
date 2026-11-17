// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · ProgressMeter (1220615854:1088)
import type { ComponentProps } from "react";

export type ProgressMeterProps = ComponentProps<"div"> & {
  /** Header label: the series or area the meter measures. */
  label?: string;
  /** Preformatted value shown at the right of the header, e.g. `96,3 %`. */
  valueLabel?: string;
  /** Filled portion of the track, 0-100. The design paints 331 of 344 for 96,3 %. */
  value?: number;
};

/** Label + value header over a single-tone track with a proportional fill. */
export function ProgressMeter({
  label = "Cocina",
  valueLabel = "96,3 %",
  value = 96.3,
  className,
  ...props
}: ProgressMeterProps) {
  return (
    <div
      {...props}
      data-meter=""
      className={[
        "flex w-[344px] flex-col gap-1.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex w-full items-center gap-2">
        <span className="grow font-[Inter] text-[10.5px] text-(--color-text-primary)">
          {label}
        </span>
        <span className="shrink-0 font-[Inter] text-[10.5px] font-semibold text-(--color-text-primary)">
          {valueLabel}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={valueLabel}
        className="h-[7px] w-full overflow-hidden rounded-[4px] bg-(--color-chart-track)"
      >
        <div
          data-meter-fill=""
          className="h-full rounded-[4px] bg-(--color-chart-series-5)"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
