// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · AlertRow (1220615854:427)
import type { ComponentProps } from "react";

export type AlertTone = "Negativo" | "Advertencia" | "Informativo" | "Positivo";

/** The set's `Tono` axis: one semantic text token paints each tone dot. */
const TONE_CLASSES: Record<AlertTone, string> = {
  Negativo: "bg-(--color-text-danger)",
  Advertencia: "bg-(--color-text-warning)",
  Informativo: "bg-(--color-text-info)",
  Positivo: "bg-(--color-text-success)",
};

export type AlertRowProps = ComponentProps<"div"> & {
  tone?: AlertTone;
  /** Title line of the row. */
  label?: string;
  /** Secondary line under the title. */
  detail?: string;
  /** Muted date on the trailing edge. */
  date?: string;
};

/** Feed row of the activity panel: tone dot, title + detail stack, muted date. */
export function AlertRow({
  tone = "Negativo",
  label = "3 turnos sin cubrir",
  detail = "Revisar personal de salón para el 29/03",
  date = "24/03",
  className,
  ...props
}: AlertRowProps) {
  return (
    <div
      {...props}
      data-tone={tone}
      className={[
        "flex w-[344px] items-center gap-2 border-b border-(--color-border-divider) pb-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className={["h-[7px] w-[7px] shrink-0 rounded-full", TONE_CLASSES[tone]]
          .filter(Boolean)
          .join(" ")}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="truncate font-[Inter] text-[11px] font-semibold leading-4 text-(--color-text-primary)">
          {label}
        </span>
        <span className="truncate font-[Inter] text-[10px] leading-4 text-(--color-text-secondary)">
          {detail}
        </span>
      </div>
      <span className="shrink-0 font-[Inter] text-[10px] leading-4 text-(--color-text-muted)">
        {date}
      </span>
    </div>
  );
}
