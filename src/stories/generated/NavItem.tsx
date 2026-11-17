// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Nav Item (636192757:9)
import type { ComponentProps } from "react";

export type NavItemProps = ComponentProps<"button"> & {
  label?: string;
  /** Marks the current route: renders the brand-muted pill and `aria-current="page"`. */
  selected?: boolean;
};

/**
 * Sidebar navigation row. It sits on the brand background, so its label uses
 * `text/on-brand` at the opacities the design defines (0.72 default, 0.9 hover,
 * 1 selected).
 */
export function NavItem({
  label = "Indicadores",
  selected = false,
  className,
  ...props
}: NavItemProps) {
  return (
    <button
      type="button"
      {...props}
      data-state={selected ? "selected" : "default"}
      aria-current={selected ? "page" : undefined}
      className={[
        "group/nav-item flex h-8 w-full shrink-0 cursor-pointer items-center gap-2.5 rounded-(--radius-control) border-0 bg-transparent px-3 text-left font-[Inter] text-xs font-normal leading-4 text-(--color-text-on-brand) opacity-[0.72] outline-none transition-colors",
        "data-[state=default]:hover:bg-(--color-bg-brand-muted)/55 data-[state=default]:hover:opacity-90",
        "data-[state=selected]:bg-(--color-bg-brand-muted) data-[state=selected]:font-semibold data-[state=selected]:opacity-100",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-text-on-brand)",
        "disabled:cursor-not-allowed disabled:opacity-40",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </button>
  );
}
