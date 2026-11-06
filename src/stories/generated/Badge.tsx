import type { ComponentProps } from "react";

export type BadgeProps = 
  ComponentProps<"div"> &
  { 
    tone?: 
      "Positivo" |
      "Advertencia" |
      "Negativo" |
      "Informativo" |
      "Neutro"
   };

export function Badge({ tone = "Positivo", ...props }: BadgeProps) {
  return <div {...props} className={[
    "group/badge flex justify-center items-center w-fit h-(--component-badge-height) bg-(--color-feedback-success-bg) px-[var(--component-badge-padding-x)] box-border rounded-[var(--component-badge-radius)] data-[tone=Advertencia]:bg-(--color-feedback-warning-bg) data-[tone=Negativo]:bg-(--color-feedback-danger-bg) data-[tone=Informativo]:bg-(--color-feedback-info-bg) data-[tone=Neutro]:bg-(--color-bg-canvas)",
    props.className
  ].filter(Boolean).join(" ")} data-tone={tone}>
    <span className="hidden text-xs font-semibold text-(--color-text-secondary) font-[Inter] whitespace-pre-wrap group-data-[tone=Neutro]/badge:[display:revert]">Pendiente</span>
    <span className="hidden text-xs font-semibold text-(--color-text-info) font-[Inter] whitespace-pre-wrap group-data-[tone=Informativo]/badge:[display:revert]">Programado</span>
    <span className="hidden text-xs font-semibold text-(--color-text-danger) font-[Inter] whitespace-pre-wrap group-data-[tone=Negativo]/badge:[display:revert]">Sobre objetivo</span>
    <span className="hidden text-xs font-semibold text-(--color-text-warning) font-[Inter] whitespace-pre-wrap group-data-[tone=Advertencia]/badge:[display:revert]">Stock bajo</span>
    <span className="text-xs font-semibold text-(--color-text-success) font-[Inter] whitespace-pre-wrap group-data-[tone=Advertencia]/badge:hidden group-data-[tone=Negativo]/badge:hidden group-data-[tone=Informativo]/badge:hidden group-data-[tone=Neutro]/badge:hidden">Activo</span>
  </div>;
}
