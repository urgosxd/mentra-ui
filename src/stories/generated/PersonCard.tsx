// Generated from OpenPencil · pdf3.fig · "Biblioteca de componentes" · PersonCard (1220615854:519)
import type { ComponentProps } from "react";
import type { AttendanceState } from "./app-data";

export type PersonCardProps = ComponentProps<"div"> & {
  iniciales?: string;
  nombre?: string;
  cargo?: string;
  estado?: AttendanceState;
};

export function PersonCard({ iniciales: _iniciales, nombre: _nombre, cargo: _cargo, estado: _estado, ...props }: PersonCardProps) {
  return <div {...props} />;
}
