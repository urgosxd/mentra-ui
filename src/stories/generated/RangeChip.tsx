// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · RangeChip (1220615854:91)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

export type RangeChipProps = ComponentProps<"button"> & {
  /** Design `Fecha` placeholder: the visible range label. */
  label?: string;
  /** Mirrors the open state of the date picker the chevron announces. */
  expanded?: boolean;
};

/** Date-range trigger: calendar glyph, range label and the chevron of a picker. */
export function RangeChip({
  label = "Marzo 2025",
  expanded,
  className,
  ...props
}: RangeChipProps) {
  return (
    <button
      type="button"
      {...props}
      aria-expanded={expanded}
      // A range picker opens a dialog, not a menu of options.
      aria-haspopup={expanded === undefined ? undefined : "dialog"}
      className={[
        "flex h-[28px] w-fit cursor-pointer flex-row items-center gap-[6px] rounded-(--radius-control) border border-(--color-border-subtle) bg-(--color-bg-surface) px-[10px] font-[Inter] text-[11px] text-(--color-text-primary)",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <IconifyIcon
        icon="lucide:calendar"
        aria-hidden="true"
        className="h-[12px] w-[12px] shrink-0 text-(--color-icon-muted)"
      />
      <span className="whitespace-pre-wrap">{label}</span>
      <IconifyIcon
        icon="lucide:chevron-down"
        aria-hidden="true"
        className="h-[12px] w-[12px] shrink-0 text-(--color-icon-muted)"
      />
    </button>
  );
}
