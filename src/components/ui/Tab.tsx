import type { ComponentProps } from "react";

export type TabProps = ComponentProps<"button"> & {
  label: string;
  /** Marks the selected tab: brand label, semibold, visible 2px indicator. */
  selected?: boolean;
};

/**
 * Text tab from the "Tab" COMPONENT_SET: 44px tall, column layout justified to
 * the bottom, 8px gap, 12px inline padding.
 *
 * The parent owns `role="tablist"` and keyboard navigation; this element is the
 * `role="tab"` inside it and reports its state twice — `aria-selected` for
 * assistive tech, `data-state` for styling.
 *
 * The selected label is painted with `color/bg/brand` as a **text** color because
 * that is what the document does (a background token on the text axis). It is
 * reproduced as-is instead of being "corrected" to `text/link`, so the component
 * matches the design it comes from.
 */
export function Tab({ label, selected = false, className, ...props }: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      {...props}
      aria-selected={selected}
      data-state={selected ? "selected" : "default"}
      className={[
        "group/tab flex h-11 cursor-pointer flex-col items-center justify-end gap-2 border-0 bg-transparent px-3 font-[Inter] text-(length:--type-label-size) leading-(--type-label-line) outline-none",
        selected
          ? "font-semibold text-(--color-bg-brand)"
          : "font-normal text-(--color-text-secondary)",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="whitespace-pre-wrap">{label}</span>
      {/* The design's `Rectangle`: full width of the padded box, 2px tall, brand
          filled, and present in both states — Default hides it with opacity 0 so
          the label does not shift between states. */}
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
