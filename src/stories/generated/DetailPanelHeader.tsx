// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · DetailPanelHeader (1220615854:335)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

export type DetailPanelHeaderProps = ComponentProps<"div"> & {
  /** Uppercase eyebrow that names the panel, e.g. `Detalle del colaborador`. */
  eyebrow?: string;
};

/**
 * Eyebrow row of a detail panel: tracked uppercase label taking the free space
 * and the muted close glyph at the end. The export draws the glyph as a bare
 * icon (no button node), so it stays decorative here; the caller supplies the
 * interactive close control if the panel needs one.
 */
export function DetailPanelHeader({
  eyebrow = "Detalle del colaborador",
  className,
  ...props
}: DetailPanelHeaderProps) {
  return (
    <div
      {...props}
      data-detail-panel-header=""
      className={["flex w-full items-center gap-2", className].filter(Boolean).join(" ")}
    >
      <span
        data-eyebrow=""
        className="min-w-0 flex-1 truncate font-[Inter] text-[10px] font-semibold uppercase leading-[18px] tracking-[1.2px] text-(--color-text-secondary)"
      >
        {eyebrow}
      </span>
      <IconifyIcon
        icon="lucide:x"
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 text-(--color-icon-muted)"
      />
    </div>
  );
}
