// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · SearchField (1220615854:73)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

export type SearchFieldProps = ComponentProps<"input"> & {
  /** Design `Placeholder` placeholder: the only text the field shows at rest. */
  placeholder?: string;
};

/**
 * Compact search input: a 34px surface pill wrapping the real `<input>` so the
 * search glyph and the placeholder share the exported geometry.
 */
export function SearchField({
  placeholder = "Buscar colaborador…",
  className,
  ...props
}: SearchFieldProps) {
  return (
    <div
      className={[
        "flex h-[34px] w-[196px] flex-row items-center gap-[6px] rounded-(--radius-control) border border-(--color-border-subtle) bg-(--color-bg-surface) px-[10px]",
        // The native input has no ring of its own; the pill takes it on focus.
        "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-(--color-border-focus)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <IconifyIcon
        icon="lucide:search"
        aria-hidden="true"
        className="h-[13px] w-[13px] shrink-0 text-(--color-icon-muted)"
      />
      <input
        type="search"
        {...props}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent font-[Inter] text-[11px] text-(--color-text-primary) outline-none placeholder:text-(--color-text-secondary)"
      />
    </div>
  );
}
