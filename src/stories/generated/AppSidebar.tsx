// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · App Sidebar (367078803:219)
import type { ComponentProps } from "react";
import { MENTRA_SECTIONS, type SidebarSectionData } from "./app-data";
import { NavItem } from "./NavItem";
import { SidebarSection } from "./SidebarSection";

export type AppSidebarProps = Omit<ComponentProps<"aside">, "onSelect"> & {
  /** Navigation groups, in order. Defaults to the groups drawn in the export. */
  sections?: SidebarSectionData[];
  activeItem?: string;
  onSelect?: (item: string) => void;
  brand?: string;
  footerNote?: string;
};

/** Brand rail: isotipo + wordmark, grouped navigation and the footer signature. */
export function AppSidebar({
  sections = MENTRA_SECTIONS,
  activeItem = "Personal",
  onSelect,
  brand = "MENTRA",
  footerNote = "Con tecnología de",
  className,
  ...props
}: AppSidebarProps) {
  return (
    <aside
      {...props}
      className={[
        "flex h-full w-[248px] shrink-0 flex-col gap-6 bg-(--color-bg-brand) px-5 py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-(--radius-100) bg-(--color-action-secondary) font-[Inter_Tight] text-(length:--type-body-size) font-extrabold text-(--color-bg-brand-deep)">
          M
        </span>
        <span className="font-[Inter] text-xs font-semibold leading-4 tracking-[4px] text-(--color-text-on-brand)">
          {brand}
        </span>
      </div>

      <nav aria-label="Navegación principal" className="flex w-full flex-col gap-0.5">
        <NavItem label="Dashboard" selected={activeItem === "Dashboard"} onClick={() => onSelect?.("Dashboard")} className="w-full" />
        {sections.map((section) => (
          <SidebarSection
            key={section.label}
            label={section.label}
            items={section.items}
            activeItem={activeItem}
            onSelect={onSelect}
          />
        ))}
      </nav>

      <div aria-hidden="true" className="min-h-0 w-full flex-1" />

      <footer className="flex w-full flex-col gap-1 px-3">
        <span className="font-[Inter] text-[10px] leading-[18px] text-(--color-text-on-brand) opacity-50">
          {footerNote}
        </span>
        <span className="font-[Inter] text-[11px] font-semibold leading-[18px] tracking-[2px] text-(--color-text-on-brand)">
          {brand}
        </span>
      </footer>
    </aside>
  );
}
