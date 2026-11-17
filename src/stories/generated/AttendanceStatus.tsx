// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Attendance Status (1462934304:2120)
import type { ComponentProps } from "react";
import type { AttendanceState } from "./app-data";

const STATE_CLASSES: Record<AttendanceState, string> = {
  "Asistió": "bg-(--color-feedback-success-bg) text-(--color-text-success)",
  Tardanza: "bg-(--color-feedback-warning-bg) text-(--color-text-warning)",
  Falta: "bg-(--color-feedback-danger-bg) text-(--color-text-danger)",
  Permiso: "bg-(--color-feedback-info-bg) text-(--color-text-info)",
  Vacaciones: "bg-(--color-feedback-info-bg) text-(--color-text-info)",
  "Sin registro": "bg-(--color-bg-sunken) text-(--color-text-secondary)",
};

export type AttendanceStatusProps = ComponentProps<"div"> & {
  estado?: AttendanceState;
  label?: string;
};

/** Attendance pill: success / warning / danger / info / neutral feedback tokens. */
export function AttendanceStatus({
  estado = "Asistió",
  label,
  className,
  ...props
}: AttendanceStatusProps) {
  return (
    <div
      {...props}
      data-estado={estado}
      className={[
        "flex h-6 w-[104px] items-center justify-center rounded-(--radius-chip)",
        STATE_CLASSES[estado],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="whitespace-nowrap font-[Inter] text-[10px] font-semibold leading-[18px]">
        {label ?? estado}
      </span>
    </div>
  );
}
