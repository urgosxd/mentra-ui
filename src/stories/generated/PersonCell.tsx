// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · PersonCell (1220615854:164)
import type { ComponentProps } from "react";

export type PersonCellProps = ComponentProps<"div"> & {
  iniciales?: string;
  nombre?: string;
  cargo?: string;
};

/**
 * Person cell of a table row: the initials circle plus name and role. The export
 * draws its avatar as an inline frame (not an instance of the `Avatar` component
 * in `Avatar.tsx`), so it is composed here at the 32px / 10px sizes the dump gives.
 */
export function PersonCell({
  iniciales = "CQ",
  nombre = "Carlos Quispe",
  cargo = "Jefe de Cocina · Cocina",
  className,
  ...props
}: PersonCellProps) {
  return (
    <div
      {...props}
      data-person-cell=""
      className={["flex w-[252px] items-center gap-2", className].filter(Boolean).join(" ")}
    >
      <div
        data-person-avatar=""
        className="flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-(--radius-pill) bg-(--color-bg-brand)"
      >
        <span className="font-[Inter] text-[10px] font-semibold text-(--color-text-on-brand)">
          {iniciales}
        </span>
      </div>
      <div className="flex min-w-0 flex-col">
        <span
          data-person-name=""
          className="truncate font-[Inter] text-xs font-semibold text-(--color-text-primary)"
        >
          {nombre}
        </span>
        <span
          data-person-role=""
          className="truncate font-[Inter] text-[10px] text-(--color-text-secondary)"
        >
          {cargo}
        </span>
      </div>
    </div>
  );
}
