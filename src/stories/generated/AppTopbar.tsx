// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · App Topbar (367078803:179)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { Avatar } from "./Avatar";

export type AppTopbarProps = ComponentProps<"header"> & {
  title?: string;
  rangeLabel?: string;
  userName?: string;
  initials?: string;
  onRangeClick?: () => void;
  onUserClick?: () => void;
};

/**
 * Application chrome for a module screen: module title, the date-range trigger and
 * the user menu, all hanging off Semantic tokens so it follows the active theme.
 */
export function AppTopbar({
  title = "Indicadores · Ventas",
  rangeLabel = "1 – 31 Mar 2025",
  userName = "Gerencia",
  initials = "LC",
  onRangeClick,
  onUserClick,
  className,
  ...props
}: AppTopbarProps) {
  return (
    <header
      {...props}
      className={[
        "flex h-16 w-full items-center gap-3 border-b border-(--color-border-subtle) bg-(--color-bg-surface) px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="truncate font-[Inter] text-(length:--type-body-size) font-semibold leading-5 text-(--color-text-primary)">
        {title}
      </span>

      <span aria-hidden="true" className="h-px min-w-0 flex-1" />

      <button
        type="button"
        onClick={onRangeClick}
        aria-label={`Rango de fechas: ${rangeLabel}`}
        className="flex h-[34px] w-fit cursor-pointer items-center gap-2 rounded-(--radius-control) border border-(--color-border-subtle) bg-(--color-bg-surface) px-3 font-[Inter] text-xs leading-4 text-(--color-text-primary) hover:bg-(--color-bg-sunken) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)"
      >
        <IconifyIcon icon="lucide:calendar" aria-hidden="true" className="h-3.5 w-3.5 text-(--color-text-secondary)" />
        <span className="whitespace-nowrap">{rangeLabel}</span>
        <IconifyIcon icon="lucide:chevron-down" aria-hidden="true" className="h-3.5 w-3.5 text-(--color-text-secondary)" />
      </button>

      <button
        type="button"
        onClick={onUserClick}
        aria-label={`Menú de usuario: ${userName}`}
        className="flex w-fit cursor-pointer items-center gap-2 rounded-(--radius-control) border-0 bg-transparent p-0 font-[Inter] text-xs font-semibold leading-4 text-(--color-text-primary) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)"
      >
        <Avatar initials={initials} />
        <span className="whitespace-nowrap">{userName}</span>
        <IconifyIcon icon="lucide:chevron-down" aria-hidden="true" className="h-3.5 w-3.5 text-(--color-text-secondary)" />
      </button>
    </header>
  );
}
