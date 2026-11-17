// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Panel (367078803:199)
import type { ComponentProps, ReactNode } from "react";

export type PanelProps = ComponentProps<"section"> & {
  title?: string;
  actionLabel?: string;
  /** Body content; the export's placeholder is used when nothing is passed. */
  children?: ReactNode;
};

/** Section container: header with title + text action, then a recessed body. */
export function Panel({
  title = "Evolución de ventas",
  actionLabel = "Ver detalle →",
  children,
  className,
  ...props
}: PanelProps) {
  return (
    <section
      {...props}
      className={[
        "flex w-[420px] flex-col gap-3.5 rounded-(--radius-surface) border border-(--color-border-subtle) bg-(--color-bg-surface) p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="flex w-full items-center gap-2">
        <h2 className="min-w-0 flex-1 truncate font-[Inter] text-(length:--type-body-size) font-semibold leading-5 text-(--color-text-primary)">
          {title}
        </h2>
        {actionLabel ? (
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 font-[Inter] text-xs font-semibold leading-4 text-(--color-action-primary) hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)"
          >
            {actionLabel}
          </button>
        ) : null}
      </header>
      <div className="flex min-h-[72px] w-full items-center justify-center rounded-(--radius-control) bg-(--color-bg-canvas)">
        {children ?? (
          <span className="font-[Inter] text-[11px] leading-4 text-(--color-text-secondary)">
            Contenido de la sección
          </span>
        )}
      </div>
    </section>
  );
}
