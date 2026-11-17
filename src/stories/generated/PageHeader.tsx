// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · PageHeader (1220615854:63)
import type { ComponentProps, ReactNode } from "react";

export type PageHeaderProps = ComponentProps<"header"> & {
  /** Design `Ruta` placeholder: the breadcrumb line above the title. */
  breadcrumb?: string;
  /** Design `Título` placeholder. */
  title?: string;
  /** Design `Subtítulo` placeholder. */
  subtitle?: string;
  /** Design `Show subtitle` visibility flag. */
  showSubtitle?: boolean;
  /** Design `Slot · Acciones`: the action controls rendered on the right. */
  actions?: ReactNode;
};

/**
 * Screen header: breadcrumb, page title, subtitle and the 44px actions slot.
 * The title is the document heading, so it renders as `<h1>`.
 */
export function PageHeader({
  breadcrumb = "RRHH / Asistencia",
  title = "Asistencia",
  subtitle = "Registra y controla la asistencia: ingresos, salidas, tardanzas, ausencias y horas trabajadas.",
  showSubtitle = true,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      {...props}
      className={[
        "flex w-[1240px] flex-row items-center gap-[12px] font-[Inter]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
        <span className="text-[11px] text-(--color-text-secondary)">{breadcrumb}</span>
        <h1 className="font-[Inter_Tight] text-[24px] font-extrabold leading-[29px] tracking-[-0.6px] text-(--color-text-primary)">
          {title}
        </h1>
        {showSubtitle ? (
          <p className="w-full text-[12px] leading-[15px] text-(--color-text-secondary)">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="flex h-[44px] flex-row items-center gap-[8px]">{actions}</div>
    </header>
  );
}
