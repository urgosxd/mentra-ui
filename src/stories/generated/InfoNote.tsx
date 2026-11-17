// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · InfoNote (1220615854:1065)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

export type InfoNoteProps = ComponentProps<"div"> & {
  texto?: string;
};

/** Inline annotation: the lucide info glyph in the info-icon tone plus body copy. */
export function InfoNote({
  texto = "Barra concentra el 22 % de las horas extra de la semana.",
  className,
  ...props
}: InfoNoteProps) {
  return (
    <div
      {...props}
      data-info-note=""
      className={["flex w-[344px] gap-1.5", className].filter(Boolean).join(" ")}
    >
      <IconifyIcon
        icon="lucide:info"
        aria-hidden="true"
        className="h-3 w-3 shrink-0 text-(--color-icon-info)"
      />
      <span
        data-info-note-text=""
        className="grow font-[Inter] text-[10px] text-(--color-text-secondary)"
      >
        {texto}
      </span>
    </div>
  );
}
