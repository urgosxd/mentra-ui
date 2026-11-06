import type { ComponentProps } from "react";

export type ButtonProps = 
  ComponentProps<"div"> &
  { style?: "Primary" | "Secondary" | "Tertiary" | "Destructive" };

export function Button({ style = "Primary", ...props }: ButtonProps) {
  return <div {...props} className={[
    "group/button flex justify-center items-center w-fit h-(--component-button-height-md) bg-(--color-bg-brand) px-[var(--component-button-padding-x)] box-border rounded-[var(--component-button-radius)] data-[style=Secondary]:bg-[unset] data-[style=Secondary]:border data-[style=Secondary]:border-(--color-bg-brand) data-[style=Secondary]:border-solid data-[style=Tertiary]:bg-[unset] data-[style=Destructive]:bg-(--color-feedback-danger-bg)",
    props.className
  ].filter(Boolean).join(" ")} data-style={style}>
    <span className="hidden text-sm font-semibold text-(--color-text-danger) font-[Inter] whitespace-pre-wrap group-data-[style=Destructive]/button:[display:revert]">Eliminar insumo</span>
    <span className="hidden text-sm font-semibold text-(--color-bg-brand) font-[Inter] whitespace-pre-wrap group-data-[style=Tertiary]/button:[display:revert]">Ver detalle →</span>
    <span className="hidden text-sm font-semibold text-(--color-bg-brand) font-[Inter] whitespace-pre-wrap group-data-[style=Secondary]/button:[display:revert]">Cancelar</span>
    <span className="text-sm font-semibold text-(--color-text-on-brand) font-[Inter] whitespace-pre-wrap group-data-[style=Secondary]/button:hidden group-data-[style=Tertiary]/button:hidden group-data-[style=Destructive]/button:hidden">Guardar cambios</span>
  </div>;
}
