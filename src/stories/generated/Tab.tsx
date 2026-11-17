// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Tab (367078803:157)
import type { ComponentProps } from "react";

export type TabProps = ComponentProps<"button"> & {
  label?: string;
  selected?: boolean;
};

/**
 * Text tab with the 2px brand indicator the design draws at the bottom edge.
 * The selected state is mirrored as `aria-selected` + `data-state`, which is what
 * the styling branches on.
 */
export function Tab({
  label = "Ventas",
  selected = false,
  className,
  ...props
}: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      {...props}
      aria-selected={selected}
      data-state={selected ? "selected" : "default"}
      className={[
        "group/tab flex h-11 cursor-pointer flex-col items-center justify-end gap-2 border-0 bg-transparent px-3 font-[Inter] text-xs leading-4 text-(--color-text-secondary)",
        "hover:text-(--color-text-primary)",
        "data-[state=selected]:font-semibold data-[state=selected]:text-(--color-action-primary)",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="whitespace-pre-wrap">{label}</span>
      <span
        data-indicator=""
        aria-hidden="true"
        className="h-0.5 w-full rounded-full bg-(--color-action-primary) opacity-0 group-data-[state=selected]/tab:opacity-100"
      />
    </button>
  );
}
