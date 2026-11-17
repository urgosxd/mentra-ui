// Shared panel shell of the prototype screens. The export's indicator panels are a
// bordered surface (padded 16, gap 8, radius 16) whose heading is the generated
// `PanelCardHeader`; `Panel` itself is not reused because it hard-codes a 420px
// width and wraps its body in a recessed canvas box this screen never draws.
import type { ComponentProps, ReactNode } from "react";
import { PanelCardHeader } from "../stories/generated/PanelCardHeader";

export type PanelSurfaceProps = Omit<ComponentProps<"section">, "title"> & {
  title: string;
  /** Rendered only when the export's action slot holds text. */
  actionLabel?: string;
  children?: ReactNode;
};

export function PanelSurface({ title, actionLabel, children, className, ...props }: PanelSurfaceProps) {
  return (
    <section
      {...props}
      data-panel={title}
      className={[
        "flex min-h-0 w-full flex-col gap-2 rounded-(--radius-surface) border border-(--color-border-subtle) bg-(--color-bg-surface) p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* `PanelCardHeader` hard-codes the 344px card width of another screen. */}
      <PanelCardHeader title={title} actionLabel={actionLabel} showAction={Boolean(actionLabel)} className="w-full!" />
      <div className="flex min-h-0 w-full flex-1 flex-col">{children}</div>
    </section>
  );
}
