// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · MiniBarColumn (1220615854:4758)
import type { ComponentProps } from "react";

export type MiniBarColumnProps = ComponentProps<"div"> & {
  /** Value label above the bar. */
  valor?: string;
  /** Weekday label under the bar. */
  dia?: string;
  /** Filled height of the bar in px. The design draws 38 of a 120 track. */
  height?: number;
  /** Height of the plot area the bar grows inside. The design draws 120. */
  trackHeight?: number;
};

/**
 * Compact column of a mini chart: value label, single-tone bar in a clipped
 * track, weekday label. The export has no variable preamble, so its two colour
 * literals map 1:1 to the primitive tokens holding the same value: the label
 * greys are `--color-neutral-500` and the bar is `--color-brand-800`.
 */
export function MiniBarColumn({
  valor = "6.8K",
  dia = "Lun",
  height = 38,
  trackHeight = 120,
  className,
  ...props
}: MiniBarColumnProps) {
  return (
    <div
      {...props}
      data-mini-bar-column=""
      className={[
        "flex h-[150px] w-[35px] flex-col items-center justify-end gap-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        data-valor=""
        className="font-[Inter] text-[8px] font-bold leading-none text-(--color-neutral-500)"
      >
        {valor}
      </span>
      <div
        data-track=""
        style={{ height: `${trackHeight}px` }}
        className="flex w-[35px] shrink-0 flex-col justify-end overflow-hidden"
      >
        <div
          data-bar=""
          style={{ height: `${height}px` }}
          className="w-full rounded-[3px] bg-(--color-brand-800)"
        />
      </div>
      <span data-dia="" className="font-[Inter] text-[8px] leading-none text-(--color-neutral-500)">
        {dia}
      </span>
    </div>
  );
}
