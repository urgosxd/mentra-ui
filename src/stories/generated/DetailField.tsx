// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · DetailField (1220615854:146)
import type { ComponentProps } from "react";

export type DetailFieldProps = ComponentProps<"dl"> & {
  label?: string;
  value?: string;
};

/** One label/value pair of a detail panel, as a description list entry. */
export function DetailField({
  label = "Nombres",
  value = "Carlos",
  className,
  ...props
}: DetailFieldProps) {
  return (
    <dl
      {...props}
      data-detail-field=""
      className={["flex flex-col gap-px", className].filter(Boolean).join(" ")}
    >
      <dt className="font-[Inter] text-[10px] text-(--color-text-secondary)">{label}</dt>
      <dd className="font-[Inter] text-[11px] font-semibold text-(--color-text-primary)">{value}</dd>
    </dl>
  );
}
