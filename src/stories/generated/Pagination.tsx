// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Pagination (1220615854:78)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

/** The two states the export draws for a page cell: filled current, outlined idle. */
const CELL_CLASSES: Record<"current" | "default", string> = {
  current: "bg-(--color-action-primary) font-semibold text-(--color-text-on-brand)",
  default: "border border-(--color-border-subtle) text-(--color-text-primary)",
};

const CELL_BASE =
  "flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-(--radius-control) font-[Inter] text-[11px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)";

const ARROW_CLASS =
  "flex h-[26px] w-[26px] shrink-0 cursor-pointer items-center justify-center rounded-(--radius-control) border border-(--color-border-subtle) text-(--color-icon-muted) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)";

export type PaginationProps = ComponentProps<"nav"> & {
  /** Design `Rango` placeholder: the "page X of Y" label on the left. */
  range?: string;
  /** Current page, 1-based. */
  page?: number;
  /** Number of page cells to draw, one per page. */
  totalPages?: number;
  /** Fired with the page the user asked for; the owner decides what to honour. */
  onPageChange?: (page: number) => void;
};

/** Compact pager: range label, the two arrows and one cell per page. */
export function Pagination({
  range = "Página 1 de 2",
  page = 1,
  totalPages = 2,
  onPageChange,
  className,
  "aria-label": ariaLabel = "Paginación",
  ...props
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={["flex w-[280px] flex-row items-center gap-[6px]", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="flex-1 font-[Inter] text-[10px] text-(--color-text-secondary)">
        {range}
      </span>
      <button
        type="button"
        aria-label="Página anterior"
        onClick={() => onPageChange?.(page - 1)}
        className={ARROW_CLASS}
      >
        <IconifyIcon
          icon="lucide:chevron-left"
          aria-hidden="true"
          className="h-[13px] w-[13px] shrink-0"
        />
      </button>
      {pages.map((cell) => (
        <button
          key={cell}
          type="button"
          aria-current={cell === page ? "page" : undefined}
          onClick={() => onPageChange?.(cell)}
          className={[
            CELL_BASE,
            CELL_CLASSES[cell === page ? "current" : "default"],
          ].join(" ")}
        >
          {cell}
        </button>
      ))}
      <button
        type="button"
        aria-label="Página siguiente"
        onClick={() => onPageChange?.(page + 1)}
        className={ARROW_CLASS}
      >
        <IconifyIcon
          icon="lucide:chevron-right"
          aria-hidden="true"
          className="h-[13px] w-[13px] shrink-0"
        />
      </button>
    </nav>
  );
}
