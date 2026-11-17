// Shared chrome of the prototype screens: brand rail, topbar and floating AI action
// are drawn once here so screens 02-04 only differ in data, never by copying the
// three chrome instances again.
import type { ReactNode } from "react";
import { AiFab } from "../stories/generated/AiFab";
import { AppSidebar } from "../stories/generated/AppSidebar";
import { AppTopbar } from "../stories/generated/AppTopbar";
import { MENTRA_SECTIONS, type SidebarSectionData } from "../stories/generated/app-data";

export type DashboardLayoutProps = {
  /** Module title in the topbar, e.g. `Indicadores · Ventas`. */
  title?: string;
  /** Date-range trigger text, e.g. `1 – 31 Mar 2025`. */
  rangeLabel?: string;
  userName?: string;
  initials?: string;
  /** Item highlighted in the sidebar navigation. */
  activeNavItem?: string;
  sections?: SidebarSectionData[];
  onNavSelect?: (item: string) => void;
  onRangeClick?: () => void;
  onUserClick?: () => void;
  /** Accessible name of the floating AI action. */
  aiLabel?: string;
  /** Screen body; the layout only owns padding and the vertical rhythm. */
  children?: ReactNode;
};

/** Application frame of every prototype screen: rail + topbar + FAB + content slot. */
export function DashboardLayout({
  title = "Indicadores · Ventas",
  rangeLabel = "1 – 31 Mar 2025",
  userName = "Gerencia",
  initials = "LC",
  activeNavItem = "Indicadores",
  sections = MENTRA_SECTIONS,
  onNavSelect,
  onRangeClick,
  onUserClick,
  aiLabel,
  children,
}: DashboardLayoutProps) {
  return (
    <div
      data-dashboard-layout=""
      className="relative flex h-full w-full overflow-hidden rounded-(--radius-surface) bg-(--color-bg-canvas) outline-1 -outline-offset-1 outline-(--color-border-subtle)"
    >
      <AppSidebar sections={sections} activeItem={activeNavItem} onSelect={onNavSelect} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          title={title}
          rangeLabel={rangeLabel}
          userName={userName}
          initials={initials}
          onRangeClick={onRangeClick}
          onUserClick={onUserClick}
        />
        <main aria-label="Contenido del módulo" className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden p-5">
          {children}
        </main>
      </div>

      <div className="absolute bottom-5 right-5">
        <AiFab label={aiLabel} />
      </div>
    </div>
  );
}
