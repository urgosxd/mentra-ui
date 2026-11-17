// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Table Row · Asistencia (1220615854:280)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { Badge } from "./Badge";

export type TableRowAsistenciaProps = Omit<ComponentProps<"div">, "children"> & {
  iniciales?: string;
  nombre?: string;
  cargo?: string;
  turno?: string;
  dias?: string;
  /** Label of the `Advertencia` badge the design draws in the Tardanzas column. */
  tardanzas?: string;
  faltas?: string;
  horas?: string;
  /** Label of the `Positivo` badge the design draws in the Puntualidad column. */
  puntualidad?: string;
};

/**
 * One row of the Asistencia table: identity block, turno, días trabajados, the
 * tardanzas badge, faltas, horas and the puntualidad badge, followed by the
 * disclosure chevron column. Tardanzas and puntualidad are the only two values the
 * design paints as badges; faltas and horas stay plain text.
 *
 * The export draws its avatar as an inline 26px frame instead of the 32px
 * `Avatar` component, so it is composed here at the sizes the dump gives.
 */
export function TableRowAsistencia({
  iniciales = "CQ",
  nombre = "Carlos Quispe",
  cargo = "Jefe de Cocina · Cocina",
  turno = "Mañana",
  dias = "26",
  tardanzas = "1",
  faltas = "0",
  horas = "208",
  puntualidad = "96,3 %",
  className,
  ...props
}: TableRowAsistenciaProps) {
  return (
    <div
      role="row"
      {...props}
      className={[
        "grid h-8 w-full grid-cols-[200px_76px_52px_56px_52px_56px_78px_14px] items-center gap-2 border-b border-(--color-border-divider) px-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div role="cell" data-identity="" className="flex min-w-0 items-center gap-[6px]">
        <div
          data-avatar=""
          className="flex h-[26px] w-[26px] shrink-0 flex-col items-center justify-center rounded-(--radius-pill) bg-(--color-bg-brand)"
        >
          <span className="font-[Inter] text-[10px] font-semibold text-(--color-text-on-brand)">
            {iniciales}
          </span>
        </div>
        <div className="flex min-w-0 flex-col">
          <span
            data-name=""
            className="truncate font-[Inter] text-[10.5px] font-semibold text-(--color-text-primary)"
          >
            {nombre}
          </span>
          <span
            data-cargo=""
            className="truncate font-[Inter] text-[10px] text-(--color-text-secondary)"
          >
            {cargo}
          </span>
        </div>
      </div>

      <span
        role="cell"
        className="truncate font-[Inter] text-[10.5px] text-(--color-text-secondary)"
      >
        {turno}
      </span>

      <span
        role="cell"
        className="truncate font-[Inter] text-[10.5px] text-(--color-text-primary)"
      >
        {dias}
      </span>

      <div role="cell" className="flex items-center">
        <Badge tone="Advertencia" label={tardanzas} />
      </div>

      <span
        role="cell"
        className="truncate font-[Inter] text-[10.5px] text-(--color-text-primary)"
      >
        {faltas}
      </span>

      <span
        role="cell"
        className="truncate font-[Inter] text-[10.5px] text-(--color-text-primary)"
      >
        {horas}
      </span>

      <div role="cell" className="flex items-center">
        <Badge tone="Positivo" label={puntualidad} />
      </div>

      <div role="cell" className="flex h-3 items-center justify-center">
        <IconifyIcon
          icon="lucide:chevron-right"
          aria-hidden="true"
          className="h-3 w-3 shrink-0 text-(--color-icon-muted)"
        />
      </div>
    </div>
  );
}
