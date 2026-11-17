// Value lists and default data shared by the app-layer components. Keeping them
// out of the component files preserves the one-component-per-file convention and
// avoids breaking Fast Refresh for mixed component/value exports.

export type SidebarSectionData = { label: string; items: string[] };

export const MENTRA_SECTIONS: SidebarSectionData[] = [
  { label: "Analíticas", items: ["Indicadores", "Reportes"] },
  { label: "Finanzas", items: ["Flujo de Caja", "Estado de Resultados", "Punto de Equilibrio"] },
  { label: "Operaciones", items: ["Food Cost", "Inventarios"] },
  { label: "RRHH", items: ["Personal", "Horarios", "Asistencia"] },
  { label: "Configuración", items: ["Apariencia", "Usuarios"] },
];

export const SHIFT_TONES = [
  "Mañana",
  "Intermedio",
  "Tarde",
  "Noche",
  "Partido AM",
  "Partido PM",
  "Descanso",
  "Libre",
] as const;

export type ShiftTone = (typeof SHIFT_TONES)[number];

export const ATTENDANCE_STATES = [
  "Asistió",
  "Tardanza",
  "Falta",
  "Permiso",
  "Vacaciones",
  "Sin registro",
] as const;

export type AttendanceState = (typeof ATTENDANCE_STATES)[number];

export const SHIFT_TEMPLATE_TONES = ["Mañana", "Tarde", "Noche"] as const;

export type ShiftTemplateTone = (typeof SHIFT_TEMPLATE_TONES)[number];
