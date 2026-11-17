// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · DonutBreakdown (1220615854:2733)
import type { ComponentProps } from "react";

export type DonutBreakdownSeries = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DonutBreakdownSegment = {
  label: string;
  value: number;
  series: DonutBreakdownSeries;
};

export type DonutBreakdownProps = ComponentProps<"div"> & {
  segments?: DonutBreakdownSegment[];
};

export function DonutBreakdown({ segments: _segments, ...props }: DonutBreakdownProps) {
  return <div {...props} />;
}
