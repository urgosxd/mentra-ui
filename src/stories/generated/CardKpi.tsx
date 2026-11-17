import type { ComponentProps } from "react";

export type CardKpiProps = 
  ComponentProps<"div"> &
  { 
    tone?: "Positivo" | "Negativo" | "Neutro";
    "título"?: string;
    valor?: string;
    detalle?: string
   };

export function CardKpi(
  {
    tone = "Positivo",
    título = "Ventas del día",
    valor = "S/ 14 820",
    detalle = "+8,4 % vs. mes anterior",
    ...props
  }: CardKpiProps
) {
  return <div {...props} className={[
    "group/card-kpi flex p-(--component-card-padding) flex-col items-start gap-(--spacing-stack-md) w-60 bg-(--color-component-card-bg) [border:var(--border-width-default)_solid_var(--color-component-card-border)] box-border rounded-[var(--component-card-radius)]",
    props.className
  ].filter(Boolean).join(" ")} data-tone={tone}>
    <span className="text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-secondary) font-[Inter] whitespace-pre-wrap">{título}</span>
    <span className="text-8 font-semibold leading-[38px] text-(--color-text-primary) font-[Inter_Tight] tracking-[-0.800000011920929px] whitespace-pre-wrap">{valor}</span>
    <span className="text-(length:--type-label-size) font-semibold leading-[18px] text-(--color-text-success) font-[Inter] whitespace-pre-wrap group-data-[tone=Negativo]/card-kpi:text-(--color-text-danger) group-data-[tone=Neutro]/card-kpi:text-(--color-text-secondary)">{detalle}</span>
  </div>;
}
