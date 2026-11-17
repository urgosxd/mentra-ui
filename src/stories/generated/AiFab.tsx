// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Ai Fab (367078803:173)
import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

export type AiFabProps = ComponentProps<"button"> & {
  /** Accessible name; the button has no visible text. */
  label?: string;
};

/** Floating AI action: gold circle, sparkles glyph and the export's drop shadow. */
export function AiFab({
  label = "Asistente IA",
  className,
  ...props
}: AiFabProps) {
  return (
    <button
      type="button"
      {...props}
      aria-label={label}
      className={[
        "flex h-[54px] w-[54px] cursor-pointer items-center justify-center rounded-(--radius-pill) border-0 bg-(--color-action-secondary) text-(--color-bg-brand-deep) shadow-[0_8px_18px_rgba(11,20,18,0.35)] transition-transform",
        "hover:scale-105 active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <IconifyIcon icon="lucide:sparkles" aria-hidden="true" className="h-[22px] w-[22px]" />
    </button>
  );
}
