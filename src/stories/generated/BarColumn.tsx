// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · BarColumn (1220615854:719)
import type { ComponentProps } from "react";

export type BarColumnSeries = 1 | 2 | 3;

export type BarColumnSegment = {
  series: BarColumnSeries;
  value: number;
};

export type BarColumnProps = ComponentProps<"div"> & {
  valor?: string;
  dia?: string;
  segments?: BarColumnSegment[];
  trackHeight?: number;
};

export function BarColumn({ valor: _valor, dia: _dia, segments: _segments, trackHeight: _trackHeight, ...props }: BarColumnProps) {
  return <div {...props} />;
}
