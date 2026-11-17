// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · FileStatusRow (1220615854:387)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { Badge, type BadgeProps } from "./Badge";

export type FileStatus = "Completo" | "Pendiente";

/** The set's `Estado` axis: each state paints its leading icon with its own token. */
const STATE_CLASSES: Record<FileStatus, string> = {
  Completo: "text-(--color-text-success)",
  Pendiente: "text-(--color-text-warning)",
};

/** Leading lucide icon and trailing badge each state carries in the export. */
const STATE_META: Record<
  FileStatus,
  { icon: string; tone: NonNullable<BadgeProps["tone"]> }
> = {
  Completo: { icon: "lucide:check-circle-2", tone: "Positivo" },
  Pendiente: { icon: "lucide:alert-circle", tone: "Advertencia" },
};

export type FileStatusRowProps = ComponentProps<"div"> & {
  estado?: FileStatus;
  /** Name of the file the row reports on. */
  document?: string;
};

/** One document of the employee file: state icon, name, and its status badge. */
export function FileStatusRow({
  estado = "Completo",
  document = "Datos personales",
  className,
  ...props
}: FileStatusRowProps) {
  const { icon, tone } = STATE_META[estado];

  return (
    <div
      {...props}
      data-estado={estado}
      className={["flex w-[418px] items-center gap-2", className].filter(Boolean).join(" ")}
    >
      <IconifyIcon
        icon={icon}
        aria-hidden="true"
        className={["h-[13px] w-[13px] shrink-0", STATE_CLASSES[estado]]
          .filter(Boolean)
          .join(" ")}
      />
      <span className="min-w-0 flex-1 truncate font-[Inter] text-[11px] leading-4 text-(--color-text-primary)">
        {document}
      </span>
      <Badge tone={tone} label={estado} />
    </div>
  );
}
