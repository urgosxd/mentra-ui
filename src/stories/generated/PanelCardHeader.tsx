// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · PanelCardHeader (1220615854:4032)
import type { ComponentProps, ReactNode } from "react";

export type PanelCardHeaderProps = ComponentProps<"div"> & {
  title?: string;
  /** Text of the default action. */
  actionLabel?: string;
  /** `Show action` property of the export; ignored when `children` is passed. */
  showAction?: boolean;
  /** `Acciones` slot; replaces the default text action when provided. */
  children?: ReactNode;
};

/** Card heading: table-style title plus a small action at the trailing edge. */
export function PanelCardHeader({
  title = "Resumen por área",
  actionLabel = "Ver todas",
  showAction = true,
  children,
  className,
  ...props
}: PanelCardHeaderProps) {
  const actions =
    children ??
    (showAction ? (
      <button
        type="button"
        className="cursor-pointer border-0 bg-transparent p-0 font-[Inter] text-[11px] font-bold text-(--color-action-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)"
      >
        {actionLabel}
      </button>
    ) : null);

  return (
    <div
      {...props}
      className={["flex w-[344px] items-center gap-2", className].filter(Boolean).join(" ")}
    >
      <h3 className="min-w-0 flex-1 truncate font-[Inter] text-[13px] font-bold text-(--color-text-primary)">
        {title}
      </h3>
      {actions ? (
        <div data-slot="actions" className="flex shrink-0 items-center gap-1.5">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
