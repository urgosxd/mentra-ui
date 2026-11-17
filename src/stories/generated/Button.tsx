import type { ComponentProps } from "react";

export type ButtonProps = 
  ComponentProps<"button"> &
  { 
    style?: "Primary" | "Secondary" | "Tertiary" | "Destructive";
    label?: string
   };

export function Button(
  { style = "Primary", label = "Guardar cambios", ...props }: ButtonProps
) {
  return <button type="button" {...props} className={[
    "group/button flex relative m-0 p-0 justify-center items-center gap-(--component-button-gap) w-fit h-(--component-button-height-md) [text-align:inherit] text-inherit bg-(--color-component-button-bg) [border:none] bg-none [font:inherit] cursor-pointer px-[var(--component-button-padding-x)] box-border rounded-[var(--component-button-radius)] not-data-disabled:hover:bg-(--color-component-button-bg-hover) not-data-disabled:active:bg-(--color-action-primary-pressed) focus-visible:[border:var(--border-width-focus-2)_solid_var(--color-text-inverse)] data-disabled:bg-(--color-bg-sunken) data-[style=Secondary]:bg-[unset] data-[style=Secondary]:[border:var(--border-width-default)_solid_var(--color-action-primary)] data-[style=Secondary]:not-data-disabled:hover:bg-(--color-action-primary-subtle) data-[style=Secondary]:not-data-disabled:active:bg-(--color-bg-sunken) data-[style=Secondary]:focus-visible:bg-(--color-bg-surface) data-[style=Secondary]:focus-visible:[border:var(--border-width-focus-2)_solid_var(--color-border-focus)] data-[style=Secondary]:data-disabled:bg-[unset] data-[style=Secondary]:data-disabled:[border:var(--border-width-default)_solid_var(--color-action-disabled)] data-[style=Tertiary]:bg-[unset] data-[style=Tertiary]:not-data-disabled:hover:bg-(--color-action-primary-subtle) data-[style=Tertiary]:not-data-disabled:active:bg-(--color-bg-sunken) data-[style=Tertiary]:focus-visible:[border:var(--border-width-focus-2)_solid_var(--color-border-focus)] data-[style=Tertiary]:data-disabled:bg-[unset] data-[style=Destructive]:bg-(--color-feedback-danger-bg) data-[style=Destructive]:not-data-disabled:hover:bg-(--color-feedback-danger-bg) data-[style=Destructive]:not-data-disabled:hover:[border:var(--border-width-default)_solid_var(--color-border-danger)] data-[style=Destructive]:not-data-disabled:active:bg-(--color-feedback-danger-bg) data-[style=Destructive]:not-data-disabled:active:[border:var(--border-width-default)_solid_var(--color-border-danger)] data-[style=Destructive]:focus-visible:[border:var(--border-width-focus-2)_solid_var(--color-border-focus)] data-[style=Destructive]:data-disabled:bg-(--color-bg-sunken)",
    props.className
  ].filter(Boolean).join(" ")} data-disabled={props.disabled || undefined} data-style={style}>
    <span className="text-(length:--type-body-size) font-semibold leading-5 text-(--color-component-button-text) font-[Inter] whitespace-pre-wrap group-data-disabled/button:text-(--color-text-secondary) group-data-[style=Secondary]/button:text-(--color-action-primary) group-data-[style=Secondary]/button:group-data-disabled/button:text-(--color-text-secondary) group-data-[style=Tertiary]/button:text-(--color-action-primary) group-data-[style=Tertiary]/button:group-data-disabled/button:text-(--color-text-secondary) group-data-[style=Destructive]/button:text-(--color-text-danger) group-data-[style=Destructive]/button:group-not-data-disabled/button:group-hover/button:text-(--color-action-danger-hover) group-data-[style=Destructive]/button:group-not-data-disabled/button:group-active/button:text-(--color-action-danger-hover) group-data-[style=Destructive]/button:group-data-disabled/button:text-(--color-action-danger-hover)">{label}</span>
  </button>;
}
