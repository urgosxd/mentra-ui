import type { ComponentProps } from "react";

export type InputProps = ComponentProps<"input"> & { invalid?: boolean };

export function Input({ invalid, ...props }: InputProps) {
  return <div className={[
    "group/input flex items-center gap-(--spacing-stack-md) w-[190px] h-(--component-input-height) bg-(--color-bg-surface) [border:var(--border-width-default)_solid_var(--color-border-subtle)] px-[var(--component-input-padding-x)] box-border rounded-[var(--component-input-radius)] not-data-invalid:focus-within:[border:var(--border-width-focus-2)_solid_var(--color-border-focus)] not-data-disabled:data-invalid:[border:var(--border-width-focus-2)_solid_var(--color-border-danger)] data-disabled:bg-(--color-bg-sunken)",
    props.className
  ].filter(Boolean).join(" ")} data-disabled={props.disabled || undefined} data-invalid={invalid || undefined}>
    <input defaultValue="Harina sin preparar" {...props} aria-invalid={invalid || props["aria-invalid"]} className="m-0 p-0 w-[158px] text-(length:--type-body-size) font-normal leading-5 text-(--color-text-secondary) bg-transparent [border:none] [outline:none] resize-none box-border grow font-[Inter] group-not-data-disabled/input:group-not-data-invalid/input:group-hover/input:text-(--color-text-primary) group-not-data-invalid/input:group-focus-within/input:text-(--color-text-primary) group-not-data-disabled/input:group-data-invalid/input:text-(--color-text-primary)" />
  </div>;
}
