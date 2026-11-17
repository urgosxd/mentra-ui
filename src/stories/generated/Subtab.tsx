// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Subtab (1220615854:1341)
import type { ComponentProps } from "react";

export type SubtabProps = ComponentProps<"button"> & {
  label?: string;
  /** Marks the `Selected` cell of the design's `State` axis. */
  selected?: boolean;
};

/**
 * Secondary tab of a detail panel (design COMPONENT_SET, axis `State`:
 * Default / Selected). 82px wide column, 6px between label and the 2px indicator.
 *
 * The parent owns `role="tablist"` and the keyboard model; this element is the
 * `role="tab"` inside it and reports its state twice — `aria-selected` for
 * assistive tech, `data-state` for styling.
 *
 * Two details are reproduced verbatim from the document instead of being
 * "corrected": only `State=Default` declares a weight (medium), so `Selected`
 * renders regular; and the `Default` indicator is a zero-opacity box painted with
 * the brand fill, exactly as `Tab` does, so the label does not shift between
 * states.
 */
export function Subtab({
  label = "Documentos",
  selected = false,
  className,
  ...props
}: SubtabProps) {
  return (
    <button
      type="button"
      role="tab"
      {...props}
      aria-selected={selected}
      data-state={selected ? "selected" : "default"}
      className={[
        "flex w-[82px] cursor-pointer flex-col gap-[6px] border-0 bg-transparent p-0 font-[Inter] text-[11px] leading-4",
        selected
          ? "font-normal text-(--color-text-primary)"
          : "font-medium text-(--color-text-secondary)",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="w-full text-left whitespace-pre-wrap">{label}</span>
      <span
        data-indicator=""
        aria-hidden="true"
        className={[
          "h-0.5 w-full bg-(--color-bg-brand)",
          selected ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </button>
  );
}
