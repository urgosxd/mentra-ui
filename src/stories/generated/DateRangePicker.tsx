import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

export type DateRangePickerProps = ComponentProps<"button"> & { label?: string };

export function DateRangePicker(
  { label = "1 – 31 Mar 2025", ...props }: DateRangePickerProps
) {
  return <button type="button" {...props} className={[
    "group/date-range-picker flex m-0 p-0 items-center gap-(--spacing-stack-md) w-fit h-(--component-input-height) [text-align:inherit] text-inherit bg-(--color-bg-surface) [border:var(--border-width-default)_solid_var(--color-border-subtle)] bg-none [font:inherit] cursor-pointer px-[var(--component-input-padding-x)] box-border rounded-[var(--radius-pill)] not-data-disabled:hover:bg-(--color-bg-sunken) focus-visible:[border:var(--border-width-focus-2)_solid_var(--color-border-focus)] not-data-disabled:active:bg-(--color-bg-raised) not-data-disabled:active:[border:var(--border-width-focus-2)_solid_var(--color-border-focus)] data-disabled:bg-(--color-bg-sunken)",
    props.className
  ].filter(Boolean).join(" ")} data-disabled={props.disabled || undefined}>
    <IconifyIcon icon="lucide:calendar" className="relative overflow-visible w-4 h-4 text-[#17233A] box-border group-data-disabled/date-range-picker:text-[#66706A]" />
    <span className="text-(--type-body-size) font-semibold text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-disabled/date-range-picker:text-(--color-text-secondary)">{label}</span>
    <IconifyIcon icon="lucide:chevron-up" className="hidden relative overflow-visible w-4 h-4 text-[#17233A] box-border group-not-data-disabled/date-range-picker:group-active/date-range-picker:[display:revert]" />
    <IconifyIcon icon="lucide:chevron-down" className="relative overflow-visible w-4 h-4 text-[#17233A] box-border group-not-data-disabled/date-range-picker:group-active/date-range-picker:hidden group-data-disabled/date-range-picker:text-[#66706A]" />
  </button>;
}
