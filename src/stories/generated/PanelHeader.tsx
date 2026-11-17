// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · PanelHeader (1220615854:961)
import type { ComponentProps, ReactNode } from "react";

export type PanelHeaderProps = ComponentProps<"div"> & {
  title?: string;
  subtitle?: string;
  /** `Show subtitle` property of the export. */
  showSubtitle?: boolean;
  /** Trailing slot; the export places a RangeChip instance here. */
  children?: ReactNode;
};

/** Panel heading: title over a secondary subtitle, with a trailing action slot. */
export function PanelHeader({
  title = "Asistencia del 1 al 31 de marzo 2025",
  subtitle = "17 colaboradores · 22 incidencias registradas",
  showSubtitle = true,
  children,
  className,
  ...props
}: PanelHeaderProps) {
  return (
    <div
      {...props}
      className={["flex w-[764px] items-center gap-2", className].filter(Boolean).join(" ")}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <h2 className="truncate font-[Inter] text-[13px] font-semibold text-(--color-text-primary)">
          {title}
        </h2>
        {showSubtitle ? (
          <p className="truncate font-[Inter] text-[10px] text-(--color-text-secondary)">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children ? (
        <div data-slot="actions" className="flex shrink-0 items-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}
