// Fixture data for the `04 · Asistencia` prototype screen. Every string is transcribed
// from frame 1462934304:4592 of pdf3.fig, spelling and separators included
// (`Asistencia · Control del personal`, `87,6 %`, `2 568`, `Marcaciones · lun 24`).
// Values the design only draws as geometry (the 31 daily columns) are the counts its
// coordinates encode: 18 tardanzas and 4 faltas, one per day, as the KPIs state.
import type { AttendanceState } from "../../stories/generated/app-data";
import type { BadgeProps } from "../../stories/generated/Badge";
import type { DonutBreakdownSegment } from "../../stories/generated/DonutBreakdown";
import type { DashboardChrome } from "./indicadores";

/** Chrome of the shared layout, forwarded verbatim to `DashboardLayout`. */
export type { DashboardChrome };

/** Tone of the two badge columns of the attendance table. */
export type BadgeTone = NonNullable<BadgeProps["tone"]>;

/** Page heading block above the KPI row. */
export type AsistenciaHeader = {
  breadcrumb: string;
  title: string;
  subtitle: string;
  actions: {
    secondary: string;
    primary: string;
  };
};

/** KPI card of the attendance module: title, figure and a success-tone detail line. */
export type AttendanceKpi = {
  title: string;
  value: string;
  detail: string;
};

/**
 * One row of the attendance table. Both badge tones are data, not styling: the
 * export paints a neutral tardanzas badge when the count is zero and a warning
 * punctuality badge below 96 %.
 */
export type AttendanceRow = {
  iniciales: string;
  nombre: string;
  /** `Cargo · Área`. */
  cargo: string;
  turno: string;
  /** Days worked in the month. */
  dias: string;
  tardanzas: string;
  tardanzasTone: BadgeTone;
  faltas: string;
  horas: string;
  puntualidad: string;
  puntualidadTone: BadgeTone;
};

/** Header, filters, table and footer of the register panel. */
export type AttendanceRegisterPanel = {
  title: string;
  subtitle: string;
  /** Label of the range trigger in the panel header, e.g. `Marzo 2025`. */
  rangeLabel: string;
  filters: string[];
  searchPlaceholder: string;
  searchLabel: string;
  rows: AttendanceRow[];
  footer: {
    /** `Mostrando 1 – 10 de 17 colaboradores`. */
    range: string;
    page: string;
    totalPages: number;
  };
};

/**
 * Dot tone of a marking row: brand green for a normal mark, warning for the late
 * one and neutral for the closing mark, exactly as the export binds them.
 */
export type MarkingTone = "green" | "amber" | "neutral";

/** One marking of the day: type, its detail line and the clock time. */
export type Marking = {
  tipo: string;
  detalle: string;
  hora: string;
  tone: MarkingTone;
};

/** Identity card, month calendar and markings of the detail column. */
export type DayDetailPanel = {
  /** Label of the identity card, which the export heads with no text of its own. */
  personLabel: string;
  person: {
    iniciales: string;
    nombre: string;
    cargo: string;
    estado: AttendanceState;
  };
  calendar: {
    month: number;
    year: number;
  };
  markings: {
    title: string;
    /** Late badge of the header, e.g. `+3 min`. */
    badge: string;
    badgeTone: BadgeTone;
    rows: Marking[];
  };
};

/** Incident a single day of the month carries; the remaining days are plain. */
export type DailyIncident = "Tardanza" | "Falta";

/** One legend entry of the daily chart. */
export type DailyLegendEntry = {
  label: string;
  tone: "presente" | "tardanza" | "falta";
};

/** Daily attendance panel: legend, one column per day of March and its axis. */
export type DailyAttendancePanel = {
  title: string;
  legend: DailyLegendEntry[];
  /** One entry per day of the month, in order; `null` for a day with no incident. */
  days: (DailyIncident | null)[];
  axis: string[];
};

/** One meter of the punctuality panel; `percent` is the filled share of the track. */
export type PunctualityMeter = {
  label: string;
  /** Preformatted label, e.g. `96,2 %`. */
  valueLabel: string;
  percent: number;
};

export type PunctualityPanel = {
  title: string;
  meters: PunctualityMeter[];
  note: string;
};

/** Incident breakdown panel: the donut shares are the segment values. */
export type IncidentsPanel = {
  title: string;
  actionLabel: string;
  segments: DonutBreakdownSegment[];
};

export type AsistenciaData = {
  chrome: DashboardChrome;
  header: AsistenciaHeader;
  kpis: AttendanceKpi[];
  /** Module tab bar above the register body. */
  tabs: string[];
  activeTab: string;
  /** Attendance-state legend that closes the tab bar, in the export's order. */
  states: AttendanceState[];
  register: AttendanceRegisterPanel;
  detail: DayDetailPanel;
  daily: DailyAttendancePanel;
  punctuality: PunctualityPanel;
  incidents: IncidentsPanel;
};

/**
 * March 2025 as the daily chart draws it: the 18 tardanzas and 4 faltas of the
 * month, one per day, and 9 days with no incident.
 */
const march = (): (DailyIncident | null)[] =>
  Array.from({ length: 31 }, (_, index) => {
    const day = index + 1;
    if ([4, 11, 18, 26].includes(day)) return "Falta";
    if ([8, 14, 16, 20, 23, 25, 28, 30, 31].includes(day)) return null;
    return "Tardanza";
  });

export const asistencia: AsistenciaData = {
  chrome: {
    title: "Asistencia · Control del personal",
    rangeLabel: "1 – 31 Mar 2025",
    userName: "Gerencia",
    initials: "LC",
    activeNavItem: "Asistencia",
  },
  header: {
    breadcrumb: "RRHH / Asistencia",
    title: "Asistencia",
    subtitle: "Registra y controla la asistencia: ingresos, salidas, tardanzas, ausencias y horas trabajadas.",
    actions: {
      secondary: "Exportar",
      primary: "Registrar asistencia",
    },
  },
  kpis: [
    { title: "Puntualidad del mes", value: "87,6 %", detail: "▲ 4,2 pp vs. mes anterior" },
    { title: "Tardanzas", value: "18", detail: "▼ 28,0 % vs. mes anterior" },
    { title: "Faltas", value: "4", detail: "▼ 42,9 % vs. mes anterior" },
    { title: "Horas trabajadas", value: "2 568", detail: "▲ 6,3 % vs. mes anterior" },
  ],
  tabs: ["Registro", "Resumen mensual", "Incidencias", "Justificaciones"],
  activeTab: "Registro",
  states: ["Asistió", "Tardanza", "Falta", "Permiso"],
  register: {
    title: "Asistencia del 1 al 31 de marzo 2025",
    subtitle: "17 colaboradores · 22 incidencias registradas",
    rangeLabel: "Marzo 2025",
    filters: ["Todas las áreas", "Todos los turnos", "Todos los estados"],
    searchPlaceholder: "Buscar colaborador…",
    searchLabel: "Buscar colaborador",
    rows: [
      {
        iniciales: "CQ",
        nombre: "Carlos Quispe",
        cargo: "Jefe de Cocina · Cocina",
        turno: "Mañana",
        dias: "26",
        tardanzas: "1",
        tardanzasTone: "Advertencia",
        faltas: "0",
        horas: "208",
        puntualidad: "96,3 %",
        puntualidadTone: "Positivo",
      },
      {
        iniciales: "MF",
        nombre: "María Fernández",
        cargo: "Jefa de Salón · Salón",
        turno: "Tarde",
        dias: "24",
        tardanzas: "2",
        tardanzasTone: "Advertencia",
        faltas: "1",
        horas: "192",
        puntualidad: "91,7 %",
        puntualidadTone: "Advertencia",
      },
      {
        iniciales: "LM",
        nombre: "Luis Mamani",
        cargo: "Barman · Barra",
        turno: "Noche",
        dias: "25",
        tardanzas: "3",
        tardanzasTone: "Advertencia",
        faltas: "0",
        horas: "200",
        puntualidad: "88,0 %",
        puntualidadTone: "Advertencia",
      },
      {
        iniciales: "AT",
        nombre: "Ana Torres",
        cargo: "Moza · Salón",
        turno: "Tarde",
        dias: "26",
        tardanzas: "0",
        tardanzasTone: "Neutro",
        faltas: "0",
        horas: "208",
        puntualidad: "100 %",
        puntualidadTone: "Positivo",
      },
      {
        iniciales: "DR",
        nombre: "Diego Rojas",
        cargo: "Ayudante de Cocina · Cocina",
        turno: "Mañana",
        dias: "24",
        tardanzas: "2",
        tardanzasTone: "Advertencia",
        faltas: "1",
        horas: "192",
        puntualidad: "91,7 %",
        puntualidadTone: "Advertencia",
      },
      {
        iniciales: "SC",
        nombre: "Sofía Cárdenas",
        cargo: "Moza · Salón",
        turno: "Tarde",
        dias: "23",
        tardanzas: "4",
        tardanzasTone: "Advertencia",
        faltas: "1",
        horas: "184",
        puntualidad: "82,6 %",
        puntualidadTone: "Advertencia",
      },
      {
        iniciales: "JP",
        nombre: "Juan Pérez",
        cargo: "Mozo · Salón",
        turno: "Noche",
        dias: "26",
        tardanzas: "1",
        tardanzasTone: "Advertencia",
        faltas: "0",
        horas: "208",
        puntualidad: "96,2 %",
        puntualidadTone: "Positivo",
      },
      {
        iniciales: "VS",
        nombre: "Valeria Soto",
        cargo: "Ayudante de Barra · Barra",
        turno: "Intermedio",
        dias: "24",
        tardanzas: "3",
        tardanzasTone: "Advertencia",
        faltas: "0",
        horas: "192",
        puntualidad: "87,5 %",
        puntualidadTone: "Advertencia",
      },
      {
        iniciales: "MH",
        nombre: "Miguel Huamán",
        cargo: "Cajero · Caja",
        turno: "Intermedio",
        dias: "26",
        tardanzas: "0",
        tardanzasTone: "Neutro",
        faltas: "0",
        horas: "208",
        puntualidad: "100 %",
        puntualidadTone: "Positivo",
      },
      {
        iniciales: "LB",
        nombre: "Lucía Bravo",
        cargo: "Moza · Salón",
        turno: "Tarde",
        dias: "22",
        tardanzas: "2",
        tardanzasTone: "Advertencia",
        faltas: "2",
        horas: "176",
        puntualidad: "90,9 %",
        puntualidadTone: "Advertencia",
      },
    ],
    footer: {
      range: "Mostrando 1 – 10 de 17 colaboradores",
      page: "Página 1 de 2",
      totalPages: 2,
    },
  },
  detail: {
    personLabel: "Ficha colaborador",
    person: {
      iniciales: "CQ",
      nombre: "Carlos Quispe",
      cargo: "Jefe de Cocina · Cocina",
      estado: "Asistió",
    },
    calendar: {
      month: 3,
      year: 2025,
    },
    markings: {
      title: "Marcaciones · lun 24",
      badge: "+3 min",
      badgeTone: "Advertencia",
      rows: [
        { tipo: "Ingreso", detalle: "Horario: 08:00", hora: "08:03", tone: "green" },
        { tipo: "Salida a almuerzo", detalle: "45 min", hora: "12:58", tone: "amber" },
        { tipo: "Reingreso", detalle: "Horario: 14:00", hora: "14:02", tone: "green" },
        { tipo: "Salida", detalle: "Total: 13 h 03 min", hora: "22:05", tone: "neutral" },
      ],
    },
  },
  daily: {
    title: "Asistencia diaria",
    legend: [
      { label: "Presentes", tone: "presente" },
      { label: "Tardanzas", tone: "tardanza" },
      { label: "Faltas", tone: "falta" },
    ],
    days: march(),
    axis: ["01 mar", "15 mar", "31 mar"],
  },
  punctuality: {
    title: "Puntualidad por área",
    meters: [
      { label: "Cocina", valueLabel: "96,2 %", percent: 96.2 },
      { label: "Salón", valueLabel: "89,4 %", percent: 89.4 },
      { label: "Barra", valueLabel: "84,6 %", percent: 84.6 },
      { label: "Caja", valueLabel: "100 %", percent: 100 },
      { label: "Administración", valueLabel: "100 %", percent: 100 },
    ],
    note: "Barra está 15,4 pp por debajo del objetivo de 100 %.",
  },
  incidents: {
    title: "Tipos de incidencias",
    actionLabel: "Ver todas",
    segments: [
      { label: "Permisos", value: 0, series: 1 },
      { label: "Tardanzas", value: 18, series: 2 },
      { label: "Faltas", value: 4, series: 4 },
      { label: "Vacaciones", value: 0, series: 5 },
    ],
  },
};
