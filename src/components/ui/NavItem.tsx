import type { ComponentProps } from "react";

export type NavItemProps = ComponentProps<"button"> & {
  label: string;
  /** Marks the current route: brand-muted fill, semibold label, `aria-current="page"`. */
  selected?: boolean;
};

/**
 * Sidebar navigation row from the "Nav Item" COMPONENT_SET: 208×32, 12px inline
 * padding, 10px gap, 8px radius, in every state.
 *
 * It is designed to sit on the dark brand sidebar, so the label is
 * `color/text/on-brand` (near-white, not the surface `text/primary`) and reads
 * through opacity: 0.72 at rest, 0.9 on hover, 1 when selected. The hover wash is
 * a CSS `:hover` rule on the row — a state of the element, never a prop — and its
 * 55% opacity lives in the background color so the label keeps its own opacity.
 */
export function NavItem({ label, selected = false, className, ...props }: NavItemProps) {
  return (
    <button
      type="button"
      {...props}
      data-state={selected ? "selected" : "default"}
      aria-current={selected ? "page" : undefined}
      className={[
        "group/nav-item flex h-8 w-52 shrink-0 items-center gap-2.5 rounded-(--radius-control) border-0 px-3 text-left font-[Inter] text-(length:--type-label-size) leading-(--type-label-line) outline-none",
        // Hover paints the brand-muted wash at 55% over the sidebar; the alpha
        // lives in the color so the label keeps its own opacity.
        selected
          ? "bg-(--color-bg-brand-muted)"
          : "bg-transparent hover:bg-(--color-bg-brand-muted)/55",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-text-on-brand)",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "whitespace-pre-wrap text-(--color-text-on-brand)",
          selected
            ? "font-semibold opacity-100"
            : "font-normal opacity-[0.72] group-hover/nav-item:font-medium group-hover/nav-item:opacity-90",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}
