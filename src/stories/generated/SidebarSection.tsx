// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Sección sidebar (636192757:4186)
import { useId, useState, type ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { NavItem } from "./NavItem";

export type SidebarSectionProps = Omit<ComponentProps<"div">, "onSelect"> & {
  label: string;
  items: string[];
  /** Controlled open state. Omit to let the section manage it. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  activeItem?: string;
  onSelect?: (item: string) => void;
};

/**
 * Collapsible sidebar group from the `Abierto=Sí / Abierto=No` variants: an
 * uppercase header with the chevron and, when open, the indented item list.
 */
export function SidebarSection({
  label,
  items,
  open,
  defaultOpen = true,
  onOpenChange,
  activeItem,
  onSelect,
  className,
  ...props
}: SidebarSectionProps) {
  const contentId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;

  const toggle = () => {
    if (open === undefined) setUncontrolledOpen(!isOpen);
    onOpenChange?.(!isOpen);
  };

  return (
    <div {...props} data-open={isOpen} className={["flex w-full flex-col gap-0.5", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="group/section flex h-7 w-full cursor-pointer items-center justify-between gap-2 rounded-[6px] border-0 bg-transparent px-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-text-on-brand)"
      >
        <span className="truncate font-[Inter] text-[10px] font-semibold uppercase leading-[18px] tracking-[1.6px] text-(--color-text-on-brand) opacity-[0.62]">
          {label}
        </span>
        <IconifyIcon
          icon={isOpen ? "lucide:chevron-down" : "lucide:chevron-right"}
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-(--color-text-on-brand)"
        />
      </button>

      {isOpen ? (
        <ul id={contentId} className="flex w-full flex-col gap-0.5 pl-2">
          {items.map((item) => (
            <li key={item}>
              <NavItem
                label={item}
                selected={item === activeItem}
                onClick={() => onSelect?.(item)}
                className="w-full"
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
