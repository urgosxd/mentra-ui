// Fixture data for the `03 · Horarios` prototype screen. Every string is transcribed
// from frame 1462934304:56 of pdf3.fig, spelling and separators included
// (`24 – 30 de marzo 2025`, `08–16`, `⎙ Imprimir`). Values the design only draws as
// geometry (the seven coverage stacks) are the heights its coordinates encode.
import type { ShiftTone, ShiftTemplateTone } from "../../stories/generated/app-data";
import type { AlertTone } from "../../stories/generated/AlertRow";
import type { DashboardChrome } from "./indicadores";

/** Chrome of the shared layout, forwarded verbatim to `DashboardLayout`. */
export type { DashboardChrome };

/** Tone of a badge cell: success for a filled share, neutral for a zero one. */
export type SummaryPercentTone = "Positivo" | "Neutro";

/**
 * Series slot of the coverage stack. The token ramp of the export runs from
 * `--color-chart-series-1` (blue) to `-7` (neutral).
 */
export type CoverageSeries = 1 | 2 | 3 | 4 | 5 | 6;

/** One day column of the coverage chart. */
export type CoverageDay = {
  /** Weekday label under the stack. */
  dia: string;
  /** Share label above the stack, e.g. `17`. */
  valor: string;
  /** Stacked segments, top first, with the pixel height the canvas draws. */
  segments: CoverageSegment[];
};

export type CoverageSegment = {
  /** Area the segment belongs to, e.g. `Cocina`. */
  area: string;
  series: CoverageSeries;
  /** Segment height in px inside the 193px track. */
  height: number;
};

export type CoverageLegendEntry = {
  label: string;
  series: CoverageSeries;
};

/** One `Etiqueta` / `Valor` pair of the assign-shift form. */
export type AssignField = {
  label: string;
  value: string;
};

/** Page heading block above the KPI row. */
export type HorariosHeader = {
  breadcrumb: string;
  title: string;
  subtitle: string;
  actions: {
    secondary: string;
    primary: string;
  };
};

/** KPI card of the schedule module: title, figure and a detail line. */
export type ScheduleKpi = {
  title: string;
  value: string;
  detail: string;
};

/** One day cell of the schedule matrix. */
export type ScheduleDayCell = {
  turno: ShiftTone;
  /** Hours the shift covers, in the canvas shorthand, e.g. `08–16`. */
  label: string;
};

/** One collaborator row of the schedule matrix. */
export type SchedulePersonRow = {
  iniciales: string;
  nombre: string;
  /** `Cargo · Área`. */
  cargo: string;
  /** One entry per day column, Monday first. */
  days: ScheduleDayCell[];
  total: string;
};

/** Header and footer of the weekly schedule panel. */
export type WeekPanel = {
  title: string;
  /** Accessible names of the two 28px week chevrons. */
  previousLabel: string;
  nextLabel: string;
  todayLabel: string;
  filters: string[];
  printLabel: string;
  matrix: {
    personLabel: string;
    days: string[];
    totalLabel: string;
    rows: SchedulePersonRow[];
  };
  helpText: string;
  pageLabel: string;
};

export type AssignPanel = {
  title: string;
  colaborador: AssignField;
  fecha: AssignField;
  turno: AssignField;
  observaciones: {
    label: string;
    placeholder: string;
  };
  actions: {
    secondary: string;
    primary: string;
  };
};

export type ShiftTemplate = {
  tono: ShiftTemplateTone;
  nombre: string;
  /** `08:00 – 16:00 · 8 h`. */
  horario: string;
};

export type TemplatesPanel = {
  title: string;
  actionLabel: string;
  rows: ShiftTemplate[];
};

/** One row of the area summary table. */
export type SummaryRow = {
  area: string;
  colaboradores: string;
  horas: string;
  extra: string;
  /** Badge copy of the `%` cell; the total row draws a plain figure instead. */
  percent: string;
  percentTone: SummaryPercentTone;
};

export type SummaryPanel = {
  title: string;
  actionLabel: string;
  rows: SummaryRow[];
  total: SummaryRow;
  /** Inline annotation under the table. */
  note: string;
};

export type CoveragePanel = {
  title: string;
  /** Badge of the header action slot, e.g. `100 %`. */
  badge: string;
  days: CoverageDay[];
  legend: CoverageLegendEntry[];
};

export type AlertsPanel = {
  title: string;
  actionLabel: string;
  rows: {
    tone: AlertTone;
    label: string;
    detail: string;
    date: string;
  }[];
};

export type HorariosData = {
  chrome: DashboardChrome;
  header: HorariosHeader;
  kpis: ScheduleKpi[];
  /** Module tab bar above the schedule body. */
  tabs: string[];
  activeTab: string;
  /** Caption in front of the shift-tone legend. */
  legendLabel: string;
  /** One chip per shift tone, in the export's order. */
  legend: { turno: ShiftTone; label: string }[];
  week: WeekPanel;
  assign: AssignPanel;
  templates: TemplatesPanel;
  summary: SummaryPanel;
  coverage: CoveragePanel;
  alerts: AlertsPanel;
};

/** Shift tones of the matrix, in the order the canvas paints them. */
const MORNING: ScheduleDayCell = { turno: "Mañana", label: "08–16" };
const AFTERNOON: ScheduleDayCell = { turno: "Tarde", label: "14–22" };
const NIGHT: ScheduleDayCell = { turno: "Noche", label: "16–00" };
const SPLIT: ScheduleDayCell = { turno: "Intermedio", label: "12–20" };
const EARLY: ScheduleDayCell = { turno: "Mañana", label: "10–18" };
const WEEKDAYS_END: ScheduleDayCell = { turno: "Descanso", label: "Desc." };
const WEEKDAYS_OFF: ScheduleDayCell = { turno: "Libre", label: "Libre" };

/** The six-day block every row of the export repeats before its rest day. */
const week = (day: ScheduleDayCell, rest: ScheduleDayCell): ScheduleDayCell[] => [day, day, day, day, day, day, rest];

export const horarios: HorariosData = {
  chrome: {
    title: "Horarios · Planificación semanal",
    rangeLabel: "1 – 31 Mar 2025",
    userName: "Gerencia",
    initials: "LC",
    activeNavItem: "Horarios",
  },
  header: {
    breadcrumb: "RRHH / Horarios",
    title: "Horarios",
    subtitle: "Planifica y controla los horarios de tu equipo por semana, área y turno.",
    actions: {
      secondary: "Opciones",
      primary: "Crear horario",
    },
  },
  kpis: [
    {
      title: "Total de colaboradores",
      value: "17",
      detail: "Activos 15 · Vacaciones 1 · Suspendidos 1",
    },
    { title: "Horas programadas", value: "624", detail: "▲ 2,5 % vs. semana anterior" },
    { title: "Horas extra", value: "18", detail: "▲ 50,0 % vs. semana anterior" },
    { title: "Cobertura de turnos", value: "100 %", detail: "42 de 42 turnos cubiertos" },
  ],
  tabs: ["Vista de horario", "Turnos y plantillas", "Control de horas", "Reportes"],
  activeTab: "Vista de horario",
  legendLabel: "Turnos:",
  legend: [
    { turno: "Mañana", label: "Mañana" },
    { turno: "Tarde", label: "Tarde" },
    { turno: "Noche", label: "Noche" },
    { turno: "Descanso", label: "Descanso" },
    { turno: "Libre", label: "Libre" },
  ],
  week: {
    title: "Semana 24 – 30 de marzo 2025 · 10 de 17 colaboradores",
    previousLabel: "Semana anterior",
    nextLabel: "Semana siguiente",
    todayLabel: "Hoy",
    filters: ["Todas las áreas", "Todos los turnos", "Semana"],
    printLabel: "⎙ Imprimir",
    matrix: {
      personLabel: "Colaborador / cargo",
      days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      totalLabel: "Total",
      rows: [
        {
          iniciales: "CQ",
          nombre: "Carlos Quispe",
          cargo: "Jefe de Cocina · Cocina",
          days: week(MORNING, WEEKDAYS_END),
          total: "48 h",
        },
        {
          iniciales: "MF",
          nombre: "María Fernández",
          cargo: "Jefa de Salón · Salón",
          days: week(AFTERNOON, WEEKDAYS_END),
          total: "48 h",
        },
        {
          iniciales: "LM",
          nombre: "Luis Mamani",
          cargo: "Barman · Barra",
          days: week(NIGHT, WEEKDAYS_END),
          total: "48 h",
        },
        {
          iniciales: "AT",
          nombre: "Ana Torres",
          cargo: "Moza · Salón",
          days: week(AFTERNOON, WEEKDAYS_END),
          total: "48 h",
        },
        {
          iniciales: "DR",
          nombre: "Diego Rojas",
          cargo: "Ayudante de Cocina · Cocina",
          days: week(MORNING, WEEKDAYS_OFF),
          total: "40 h",
        },
        {
          iniciales: "SC",
          nombre: "Sofía Cárdenas",
          cargo: "Moza · Salón",
          days: week(SPLIT, WEEKDAYS_END),
          total: "48 h",
        },
        {
          iniciales: "JP",
          nombre: "Juan Pérez",
          cargo: "Mozo · Salón",
          days: week(NIGHT, WEEKDAYS_END),
          total: "48 h",
        },
        {
          iniciales: "VS",
          nombre: "Valeria Soto",
          cargo: "Ayudante de Barra · Barra",
          days: week(SPLIT, WEEKDAYS_END),
          total: "48 h",
        },
        {
          iniciales: "MH",
          nombre: "Miguel Huamán",
          cargo: "Cajero · Caja",
          days: week(EARLY, WEEKDAYS_OFF),
          total: "40 h",
        },
        {
          iniciales: "LB",
          nombre: "Lucía Bravo",
          cargo: "Moza · Salón",
          days: week(AFTERNOON, WEEKDAYS_OFF),
          total: "40 h",
        },
      ],
    },
    helpText: "Haz clic en una celda para cambiar el turno asignado",
    pageLabel: "Mostrando 1 – 10 de 17",
  },
  assign: {
    title: "Asignar o editar turno",
    colaborador: { label: "Colaborador", value: "Carlos Quispe" },
    fecha: { label: "Fecha", value: "24/03/2025" },
    turno: { label: "Turno", value: "Mañana" },
    observaciones: { label: "Observaciones", placeholder: "Agregar observaciones…" },
    actions: { secondary: "Cancelar", primary: "Guardar turno" },
  },
  templates: {
    title: "Turnos predefinidos",
    actionLabel: "Gestionar",
    rows: [
      { tono: "Mañana", nombre: "Mañana", horario: "08:00 – 16:00 · 8 h" },
      { tono: "Tarde", nombre: "Tarde", horario: "14:00 – 22:00 · 8 h" },
      { tono: "Noche", nombre: "Noche", horario: "16:00 – 00:00 · 8 h" },
    ],
  },
  summary: {
    title: "Resumen por área",
    actionLabel: "Ver todas",
    rows: [
      { area: "Cocina", colaboradores: "5", horas: "184", extra: "6", percent: "3,3 %", percentTone: "Positivo" },
      { area: "Salón", colaboradores: "6", horas: "240", extra: "8", percent: "3,3 %", percentTone: "Positivo" },
      { area: "Barra", colaboradores: "3", horas: "120", extra: "4", percent: "3,3 %", percentTone: "Positivo" },
      { area: "Caja", colaboradores: "1", horas: "40", extra: "0", percent: "0,0 %", percentTone: "Neutro" },
      {
        area: "Administración",
        colaboradores: "2",
        horas: "80",
        extra: "0",
        percent: "0,0 %",
        percentTone: "Neutro",
      },
    ],
    total: {
      area: "Total",
      colaboradores: "17",
      horas: "624",
      extra: "18",
      percent: "2,9 %",
      percentTone: "Neutro",
    },
    note: "Barra concentra el 22 % de las horas extra de la semana.",
  },
  coverage: {
    title: "Cobertura de turnos",
    badge: "100 %",
    days: [
      {
        dia: "Lun",
        valor: "17",
        segments: [
          { area: "Cocina", series: 1, height: 65 },
          { area: "Salón", series: 2, height: 64 },
          { area: "Barra", series: 3, height: 64 },
        ],
      },
      {
        dia: "Mar",
        valor: "17",
        segments: [
          { area: "Salón", series: 2, height: 49 },
          { area: "Caja", series: 4, height: 48 },
          { area: "Administración", series: 5, height: 48 },
          { area: "Otro", series: 6, height: 48 },
        ],
      },
      {
        dia: "Mié",
        valor: "17",
        segments: [
          { area: "Barra", series: 3, height: 65 },
          { area: "Administración", series: 5, height: 64 },
          { area: "Cocina", series: 1, height: 64 },
        ],
      },
      {
        dia: "Jue",
        valor: "16",
        segments: [
          { area: "Caja", series: 4, height: 91 },
          { area: "Salón", series: 2, height: 91 },
        ],
      },
      {
        dia: "Vie",
        valor: "17",
        segments: [
          { area: "Administración", series: 5, height: 41 },
          { area: "Cocina", series: 1, height: 38 },
          { area: "Salón", series: 2, height: 38 },
          { area: "Barra", series: 3, height: 38 },
          { area: "Caja", series: 4, height: 38 },
        ],
      },
      {
        dia: "Sáb",
        valor: "17",
        segments: [
          { area: "Otro", series: 6, height: 49 },
          { area: "Salón", series: 2, height: 48 },
          { area: "Barra", series: 3, height: 48 },
          { area: "Administración", series: 5, height: 48 },
        ],
      },
      {
        dia: "Dom",
        valor: "15",
        segments: [
          { area: "Otro", series: 6, height: 85 },
          { area: "Cocina", series: 1, height: 85 },
        ],
      },
    ],
    legend: [
      { label: "Cocina", series: 1 },
      { label: "Salón", series: 2 },
      { label: "Barra", series: 3 },
      { label: "Caja", series: 4 },
      { label: "Administración", series: 5 },
    ],
  },
  alerts: {
    title: "Alertas y observaciones",
    actionLabel: "Ver todas",
    rows: [
      {
        tone: "Negativo",
        label: "3 turnos sin cubrir",
        detail: "Revisar personal de salón para el 29/03",
        date: "24/03",
      },
      {
        tone: "Advertencia",
        label: "2 solicitudes de cambio",
        detail: "Pendiente de aprobación",
        date: "23/03",
      },
      {
        tone: "Informativo",
        label: "1 colaborador con horas extra",
        detail: "Luis Mamani (+4 h esta semana)",
        date: "23/03",
      },
      {
        tone: "Positivo",
        label: "Recordatorio",
        detail: "Revisar vacaciones de abril",
        date: "22/03",
      },
    ],
  },
};
