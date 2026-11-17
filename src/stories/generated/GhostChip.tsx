// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · GhostChip (1220615854:99)
import type { ComponentProps } from "react";

export type GhostChipProps = ComponentProps<"button"> & {
  /** Design `Label` placeholder. */
  label?: string;
};

/** Border-only chip: hairline outline, no fill, a single text label. */
export function GhostChip({ label = "Hoy", className, ...props }: GhostChipProps) {
  return (
    <button
      type="button"
      {...props}
      className={[
        "flex h-[28px] w-fit cursor-pointer flex-row items-center gap-[6px] rounded-(--radius-control) border border-(--color-border-subtle) px-[10px] font-[Inter] text-[11px] text-(--color-text-primary)",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
