// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Table Row · Personal (367078803:7733)
import type { ComponentProps } from "react";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";

export type PersonalEstado = "Activo" | "Vacaciones";
export type PersonalDocumentacion = "Completa" | "Pendiente";

export type TableRowPersonalProps = Omit<ComponentProps<"div">, "children"> & {
  estado?: PersonalEstado;
  documentacion?: PersonalDocumentacion;
  nombre?: string;
  area?: string;
  cargo?: string;
  sueldo?: string;
  iniciales?: string;
  /** Copy next to the progress bar, e.g. `3/5`. Derived from `documentacion` by default. */
  docsLabel?: string;
  /** Progress percentage. Derived from `documentacion` by default. */
  docsPercent?: number;
};

/**
 * One row of the Personal table. The two variant axes of the export (estado and
 * documentación) drive the badge tone and the document progress bar; both are
 * exposed as data attributes for styling and tests.
 */
export function TableRowPersonal({
  estado = "Activo",
  documentacion = "Completa",
  nombre = "Nombre Apellido",
  area = "Área · Tipo",
  cargo = "Cargo",
  sueldo = "0 000",
  iniciales = "AA",
  docsLabel,
  docsPercent,
  className,
  ...props
}: TableRowPersonalProps) {
  const complete = documentacion === "Completa";
  const percent = docsPercent ?? (complete ? 100 : 60);
  const label = docsLabel ?? (complete ? "3/3" : "3/5");

  return (
    <div
      role="row"
      {...props}
      data-estado={estado}
      data-documentacion={documentacion}
      className={[
        "grid h-[52px] w-full grid-cols-[252px_122px_68px_96px_56px] items-center gap-2 border-b border-(--color-border-subtle) bg-(--color-bg-surface) px-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div role="cell" className="flex min-w-0 items-center gap-2">
        <Avatar initials={iniciales} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-[Inter] text-xs font-semibold leading-[18px] text-(--color-text-primary)">
            {nombre}
          </span>
          <span className="truncate font-[Inter] text-[10px] leading-[18px] text-(--color-text-secondary)">
            {area}
          </span>
        </div>
      </div>

      <span role="cell" className="truncate font-[Inter] text-[11px] leading-4 text-(--color-text-secondary)">
        {cargo}
      </span>

      <span role="cell" className="truncate text-right font-[Inter] text-[11px] font-semibold leading-4 text-(--color-text-primary)">
        {sueldo}
      </span>

      <div role="cell" className="flex items-center">
        <Badge tone={estado === "Activo" ? "Positivo" : "Advertencia"} label={estado} />
      </div>

      <div role="cell" className="flex w-14 items-center gap-[5px]">
        <div
          role="progressbar"
          aria-label="Documentación"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-[5px] w-[34px] overflow-hidden rounded-[3px] bg-(--color-bg-sunken)"
        >
          <div
            data-progress=""
            className="h-full rounded-[3px] bg-(--color-action-primary)"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="font-[Inter] text-[10px] leading-[18px] text-(--color-text-secondary)">
          {label}
        </span>
      </div>
    </div>
  );
}
