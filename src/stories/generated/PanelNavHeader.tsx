// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · PanelNavHeader (1220615854:973)
import type { ComponentProps, ReactNode } from "react";
import { Icon as IconifyIcon } from "@iconify/react";

export type PanelNavHeaderProps = ComponentProps<"div"> & {
  title?: string;
  /** Accessible name of the step-back control. */
  previousLabel?: string;
  /** Accessible name of the step-forward control. */
  nextLabel?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  /** Trailing slot; the export places a GhostChip instance here. */
  children?: ReactNode;
};

const STEP_BUTTON_CLASSES =
  "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-(--radius-control) border border-(--color-border-subtle) bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)";

/** Panel heading with period stepping: title, previous/next controls and a slot. */
export function PanelNavHeader({
  title = "Semana 24 – 30 de marzo 2025 · 10 de 17 colaboradores",
  previousLabel = "Semana anterior",
  nextLabel = "Semana siguiente",
  onPrevious,
  onNext,
  children,
  className,
  ...props
}: PanelNavHeaderProps) {
  return (
    <div
      {...props}
      className={["flex w-[764px] items-center gap-2", className].filter(Boolean).join(" ")}
    >
      <h2 className="min-w-0 flex-1 truncate font-[Inter] text-[16px] font-semibold text-(--color-text-primary)">
        {title}
      </h2>
      <button
        type="button"
        aria-label={previousLabel}
        onClick={onPrevious}
        className={STEP_BUTTON_CLASSES}
      >
        <IconifyIcon
          icon="lucide:chevron-left"
          aria-hidden="true"
          className="h-3.5 w-3.5 text-(--color-icon-muted)"
        />
      </button>
      <button
        type="button"
        aria-label={nextLabel}
        onClick={onNext}
        className={STEP_BUTTON_CLASSES}
      >
        <IconifyIcon
          icon="lucide:chevron-right"
          aria-hidden="true"
          className="h-3.5 w-3.5 text-(--color-icon-muted)"
        />
      </button>
      {children ? (
        <div data-slot="actions" className="flex shrink-0 items-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}
