// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · PersonCard (1220615854:519)
import type { ComponentProps } from "react";
import { AttendanceStatus } from "./AttendanceStatus";
import type { AttendanceState } from "./app-data";

export type PersonCardProps = ComponentProps<"div"> & {
  /** Initials inside the brand circle. */
  iniciales?: string;
  /** Name line. */
  nombre?: string;
  /** Role line under the name. */
  cargo?: string;
  /** The export's `Estado` variant axis, rendered with the shared attendance pill. */
  estado?: AttendanceState;
};

/** Person row of the attendance panel: initials circle, name and role, estado pill. */
export function PersonCard({
  iniciales = "CQ",
  nombre = "Carlos Quispe",
  cargo = "Jefe de Cocina · Cocina",
  estado = "Asistió",
  className,
  ...props
}: PersonCardProps) {
  return (
    <div
      {...props}
      className={["flex w-[312px] items-center gap-[10px]", className].filter(Boolean).join(" ")}
    >
      <div
        data-avatar=""
        className="flex h-[44px] w-[44px] shrink-0 flex-col items-center justify-center rounded-(--radius-pill) bg-(--color-bg-brand)"
      >
        <span className="font-[Inter] text-[11px] font-semibold text-(--color-text-on-brand)">
          {iniciales}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span
          data-nombre=""
          className="truncate font-[Inter] text-[11px] font-semibold text-(--color-text-primary)"
        >
          {nombre}
        </span>
        <span
          data-cargo=""
          className="truncate font-[Inter] text-[11px] text-(--color-text-secondary)"
        >
          {cargo}
        </span>
        <div className="flex">
          <AttendanceStatus estado={estado} />
        </div>
      </div>
    </div>
  );
}
