import type { ComponentProps } from "react";

export type BadgeProps = 
  ComponentProps<"div"> &
  { 
    tone?: 
      "Positivo" |
      "Advertencia" |
      "Negativo" |
      "Informativo" |
      "Neutro";
    label?: string
   };

export function Badge(
  { tone = "Positivo", label = "Activo", ...props }: BadgeProps
) {
  return <div {...props} className={[
    "group/badge flex justify-center items-center w-fit h-(--component-badge-height) bg-(--color-feedback-success-bg) px-[var(--component-badge-padding-x)] box-border rounded-[var(--component-badge-radius)] data-[tone=Advertencia]:bg-(--color-feedback-warning-bg) data-[tone=Negativo]:bg-(--color-feedback-danger-bg) data-[tone=Informativo]:bg-(--color-feedback-info-bg) data-[tone=Neutro]:bg-(--color-bg-sunken)",
    props.className
  ].filter(Boolean).join(" ")} data-tone={tone}>
    <span className="text-xs font-semibold leading-[18px] text-(--color-text-success) font-[Inter] whitespace-pre-wrap group-data-[tone=Advertencia]/badge:text-(--color-text-warning) group-data-[tone=Negativo]/badge:text-(--color-text-danger) group-data-[tone=Informativo]/badge:text-(--color-text-info) group-data-[tone=Neutro]/badge:text-(--color-text-secondary)">{label}</span>
  </div>;
}
