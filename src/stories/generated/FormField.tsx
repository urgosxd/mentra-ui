// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · FormField (1220615854:4036)
import { useId, type ComponentProps } from "react";

export type FormFieldProps = Omit<ComponentProps<"input">, "id"> & {
  /** Field caption; it is the input's accessible name. */
  label?: string;
  /** Overrides the `useId()`-derived id that pairs the label with the input. */
  id?: string;
};

/**
 * Labelled text field: the export shows a caption above a framed value line. The
 * frame wraps a real `<input>` so the label, focus and value all behave natively.
 */
export function FormField({
  label = "Colaborador",
  id,
  placeholder = "Carlos Quispe",
  className,
  ...props
}: FormFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex w-[320px] flex-col gap-1">
      <label
        htmlFor={inputId}
        className="font-[Inter] text-[10px] text-(--color-text-secondary)"
      >
        {label}
      </label>
      <div
        data-input-frame=""
        className="flex h-8 w-full items-center gap-1.5 rounded-(--radius-control) border border-(--color-border-subtle) bg-(--color-bg-surface) px-2.5"
      >
        <input
          id={inputId}
          placeholder={placeholder}
          {...props}
          className={[
            "min-w-0 flex-1 bg-transparent font-[Inter] text-[11.5px] text-(--color-text-primary) placeholder:text-(--color-text-secondary)",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>
    </div>
  );
}
