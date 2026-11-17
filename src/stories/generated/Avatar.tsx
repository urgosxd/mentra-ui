// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · Avatar (367078803:171)
import type { ComponentProps } from "react";

export type AvatarProps = ComponentProps<"div"> & {
  initials?: string;
  /** Accessible name. When omitted the avatar is decorative (`aria-hidden`). */
  label?: string;
};

/** Brand circle with up to two initials. */
export function Avatar({
  initials = "LC",
  label,
  className,
  ...props
}: AvatarProps) {
  return (
    <div
      {...props}
      data-avatar=""
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={[
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-(--radius-pill) bg-(--color-bg-brand)",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="font-[Inter] text-[11px] font-semibold leading-[18px] text-(--color-text-on-brand)">
        {initials}
      </span>
    </div>
  );
}
