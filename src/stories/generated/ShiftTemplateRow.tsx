// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Shift Template Row (1462934304:2133)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import type { ShiftTemplateTone } from "./app-data";

const SWATCH_CLASSES: Record<ShiftTemplateTone, string> = {
  "Mañana": "bg-(--color-shift-morning-bg)",
  Tarde: "bg-(--color-shift-afternoon-bg)",
  Noche: "bg-(--color-shift-night-bg)",
};

export type ShiftTemplateRowProps = Omit<ComponentProps<"div">, "children"> & {
  tono?: ShiftTemplateTone;
  nombre?: string;
  horario?: string;
  onEdit?: () => void;
};

/** Editable shift template: colour swatch, name + schedule and the pencil action. */
export function ShiftTemplateRow({
  tono = "Mañana",
  nombre,
  horario = "08:00 – 16:00 · 8 h",
  onEdit,
  className,
  ...props
}: ShiftTemplateRowProps) {
  const title = nombre ?? tono;

  return (
    <div
      {...props}
      data-tono={tono}
      className={[
        "flex h-10 w-[300px] items-center gap-2 rounded-(--radius-control) border border-(--color-border-subtle) bg-(--color-bg-surface) px-2.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        data-swatch=""
        aria-hidden="true"
        className={["h-[22px] w-[22px] shrink-0 rounded-(--radius-chip)", SWATCH_CLASSES[tono]]
          .filter(Boolean)
          .join(" ")}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-[Inter] text-[11.5px] font-semibold leading-[18px] text-(--color-text-primary)">
          {title}
        </span>
        <span className="truncate font-[Inter] text-[10px] leading-[18px] text-(--color-text-secondary)">
          {horario}
        </span>
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Editar turno ${title}`}
        className="cursor-pointer rounded-(--radius-100) border-0 bg-transparent p-1 text-(--color-text-secondary) hover:bg-(--color-bg-sunken) hover:text-(--color-text-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)"
      >
        <IconifyIcon icon="lucide:pencil" aria-hidden="true" className="h-3 w-3" />
      </button>
    </div>
  );
}
