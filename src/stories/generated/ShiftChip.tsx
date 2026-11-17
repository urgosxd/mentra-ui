// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Shift Chip (1462934304:2103)
import type { ComponentProps } from "react";
import type { ShiftTone } from "./app-data";

const TONE_CLASSES: Record<ShiftTone, string> = {
  "Mañana": "bg-(--color-shift-morning-bg) text-(--color-shift-morning-text)",
  Intermedio: "bg-(--color-shift-intermediate-bg) text-(--color-shift-intermediate-text)",
  Tarde: "bg-(--color-shift-afternoon-bg) text-(--color-shift-afternoon-text)",
  Noche: "bg-(--color-shift-night-bg) text-(--color-shift-night-text)",
  "Partido AM": "bg-(--color-shift-split-am-bg) text-(--color-shift-split-am-text)",
  "Partido PM": "bg-(--color-shift-split-pm-bg) text-(--color-shift-split-pm-text)",
  Descanso: "bg-(--color-shift-rest-bg) text-(--color-shift-rest-text)",
  Libre: "bg-(--color-shift-free-bg) text-(--color-shift-free-text)",
};

export type ShiftChipProps = ComponentProps<"div"> & {
  turno?: ShiftTone;
  label?: string;
};

/** Small schedule pill, one token pair per shift tone. */
export function ShiftChip({
  turno = "Mañana",
  label = "08:00 – 16:00",
  className,
  ...props
}: ShiftChipProps) {
  return (
    <div
      {...props}
      data-turno={turno}
      className={[
        "flex h-6 w-[78px] items-center justify-center rounded-(--radius-chip)",
        TONE_CLASSES[turno],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="whitespace-nowrap font-[Inter] text-[10px] font-medium leading-[18px]">
        {label}
      </span>
    </div>
  );
}
