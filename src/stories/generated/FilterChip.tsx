// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Filter Chip (367078803:167)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

export type FilterChipProps = ComponentProps<"button"> & {
  label?: string;
  /** Mirrors the open state of the menu the chip is expected to control. */
  expanded?: boolean;
};

/** Compact filter trigger: label plus the lucide chevron from the export. */
export function FilterChip({
  label = "Todas las áreas",
  expanded,
  className,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      {...props}
      aria-expanded={expanded}
      aria-haspopup={expanded === undefined ? undefined : "listbox"}
      className={[
        "flex h-[34px] w-fit cursor-pointer items-center gap-2 rounded-(--radius-control) border border-(--color-border-subtle) bg-(--color-bg-surface) px-3 font-[Inter] text-xs font-normal leading-4 text-(--color-text-primary) transition-colors",
        "hover:bg-(--color-bg-sunken)",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="whitespace-pre-wrap">{label}</span>
      <IconifyIcon
        icon="lucide:chevron-down"
        aria-hidden="true"
        className="h-[13px] w-[13px] shrink-0 text-(--color-text-secondary)"
      />
    </button>
  );
}
