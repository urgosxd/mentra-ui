// Fixture data for the `02 · Personal` prototype screen. Every string is transcribed
// from frame 367078803:5257 of pdf3.fig, spelling and separators included
// (`72 345 678`, `14:00 – 22:00`, `▲ 6,3 %`). Figures the design only draws as
// geometry (the two share rings and the document bars) are the values its
// coordinates encode.
import type { DashboardChrome } from "./indicadores";

/** Chrome of the shared layout, forwarded verbatim to `DashboardLayout`. */
export type { DashboardChrome };

/**
 * Estado axis of `TableRowPersonal`. `Vacaciones` paints the warning badge.
 */
export type StaffState = "Activo" | "Vacaciones";

/** Documentación axis of `TableRowPersonal`. */
export type StaffDocumentation = "Completa" | "Pendiente";

/** Props of one `TableRowPersonal`, in the export's column order. */
export type StaffRow = {
  /** Avatar initials, e.g. `CQ`. */
  iniciales: string;
  nombre: string;
  /** Second line of the person cell: `Área · Tipo`. */
  area: string;
  cargo: string;
  /** Preformatted amount, no currency sign in the design. */
  sueldo: string;
  estado: StaffState;
  documentacion: StaffDocumentation;
  /** Copy next to the document bar, e.g. `5/6`. */
  docsLabel: string;
  /**
   * Filled share of the 34px document bar. Transcribed from the bar width the
   * canvas draws, which does not always follow the `x/y` label next to it.
   */
  docsPercent: number;
};

/** Page heading block above the KPI row. */
export type PersonalHeader = {
  breadcrumb: string;
  title: string;
  actions: {
    secondary: string;
    primary: string;
  };
};

/** KPI card that closes with a toned delta and its caption. */
export type KpiDeltaCard = {
  kind: "delta";
  title: string;
  value: string;
  delta: string;
  deltaTone: "Positivo" | "Negativo";
  deltaCaption: string;
};

/** KPI card that closes with a share ring instead of a delta. */
export type KpiShareCard = {
  kind: "share";
  title: string;
  value: string;
  /** Muted line under the value, e.g. `70,6 % del total`. */
  caption: string;
  /** Filled share of the ring, 0-100. */
  percent: number;
  /** Accessible name of the ring. */
  shareLabel: string;
  /** Ring fill: brand for the staffed pie, accent for the outsourced one. */
  tone: "brand" | "accent";
};

export type KpiCard = KpiDeltaCard | KpiShareCard;

export type StaffListPanel = {
  title: string;
  /** Trailing muted count in the panel header. */
  countLabel: string;
  filters: string[];
  searchPlaceholder: string;
  /** Accessible name of the search field. */
  searchLabel: string;
  rows: StaffRow[];
  footer: {
    actionLabel: string;
    range: string;
    page: number;
    totalPages: number;
  };
};

/** One `Etiqueta` / `Valor` pair of the detail grid. */
export type DetailField = {
  label: string;
  value: string;
};

/** A titled block of the detail panel with its inline text action. */
export type DetailBlock = {
  title: string;
  actionLabel: string;
  fields: DetailField[];
};

/** One row of the documentation checklist. */
export type DetailDocument = {
  label: string;
  status: string;
};

export type StaffDetailPanel = {
  eyebrow: string;
  iniciales: string;
  name: string;
  state: StaffState;
  /** `Cargo · Área · Tipo de contrato`. */
  roleLine: string;
  /** Phone plus email, joined by the canvas separator. */
  contactLine: string;
  tabs: string[];
  activeTab: string;
  personal: DetailBlock;
  work: DetailBlock;
  documents: {
    title: string;
    progressLabel: string;
    items: DetailDocument[];
  };
  actions: {
    secondary: string;
    primary: string;
  };
};

export type PersonalData = {
  chrome: DashboardChrome;
  header: PersonalHeader;
  kpis: KpiCard[];
  list: StaffListPanel;
  detail: StaffDetailPanel;
};

export const personal: PersonalData = {
  // The canvas of frame 367078803:5257 carries the topbar title of the Horarios
  // screen (node 0:504), left over from a copy/paste; the screen is Personal.
  chrome: {
    title: "Personal",
    rangeLabel: "1 – 31 Mar 2025",
    userName: "Gerencia",
    initials: "LC",
    activeNavItem: "Personal",
  },
  header: {
    breadcrumb: "RRHH / Personal",
    title: "Personal",
    actions: {
      secondary: "Enviar onboarding",
      primary: "＋ Nuevo colaborador",
    },
  },
  kpis: [
    {
      kind: "delta",
      title: "Total de colaboradores",
      value: "17",
      delta: "▲ 6,3 %",
      deltaTone: "Positivo",
      deltaCaption: "vs. mes anterior",
    },
    {
      kind: "share",
      title: "En planilla",
      value: "12",
      caption: "70,6 % del total",
      percent: 70.6,
      shareLabel: "12 en planilla: 70,6 % del total",
      tone: "brand",
    },
    {
      kind: "share",
      title: "Fuera de planilla",
      value: "5",
      caption: "29,4 % del total",
      percent: 29.4,
      shareLabel: "5 fuera de planilla: 29,4 % del total",
      tone: "accent",
    },
    {
      kind: "delta",
      title: "Documentación completa",
      value: "82,4 %",
      delta: "▲ 12,4 pp",
      deltaTone: "Positivo",
      deltaCaption: "vs. mes anterior",
    },
  ],
  list: {
    title: "Lista de colaboradores",
    countLabel: "Mostrando 1 – 10 de 17",
    filters: ["Área", "Cargo", "Tipo", "Estado"],
    searchPlaceholder: "Buscar colaborador…",
    searchLabel: "Buscar colaborador",
    rows: [
      {
        iniciales: "CQ",
        nombre: "Carlos Quispe",
        area: "Cocina · Jefe",
        cargo: "Jefe de Cocina",
        sueldo: "3 200",
        estado: "Activo",
        documentacion: "Completa",
        docsLabel: "6/6",
        docsPercent: 100,
      },
      {
        iniciales: "MF",
        nombre: "María Fernández",
        area: "Salón · Jefe",
        cargo: "Jefa de Salón",
        sueldo: "3 100",
        estado: "Activo",
        documentacion: "Completa",
        docsLabel: "5/6",
        docsPercent: 62,
      },
      {
        iniciales: "LM",
        nombre: "Luis Mamani",
        area: "Barra · Planilla",
        cargo: "Barman",
        sueldo: "2 100",
        estado: "Vacaciones",
        documentacion: "Completa",
        docsLabel: "4/4",
        docsPercent: 100,
      },
      {
        iniciales: "AT",
        nombre: "Ana Torres",
        area: "Salón · Planilla",
        cargo: "Moza",
        sueldo: "1 400",
        estado: "Vacaciones",
        documentacion: "Pendiente",
        docsLabel: "4/5",
        docsPercent: 50,
      },
      {
        iniciales: "DR",
        nombre: "Diego Rojas",
        area: "Cocina · Planilla",
        cargo: "Ayudante de Cocina",
        sueldo: "1 400",
        estado: "Activo",
        documentacion: "Pendiente",
        docsLabel: "3/5",
        docsPercent: 100,
      },
      {
        iniciales: "SC",
        nombre: "Sofía Cárdenas",
        area: "Salón · Planilla",
        cargo: "Moza",
        sueldo: "1 300",
        estado: "Activo",
        documentacion: "Completa",
        docsLabel: "4/4",
        docsPercent: 100,
      },
      {
        iniciales: "JP",
        nombre: "Juan Pérez",
        area: "Salón · Planilla",
        cargo: "Mozo",
        sueldo: "1 300",
        estado: "Vacaciones",
        documentacion: "Pendiente",
        docsLabel: "1/4",
        docsPercent: 50,
      },
      {
        iniciales: "VS",
        nombre: "Valeria Soto",
        area: "Barra · Part-time",
        cargo: "Ayudante de Barra",
        sueldo: "1 100",
        estado: "Activo",
        documentacion: "Pendiente",
        docsLabel: "2/5",
        docsPercent: 62,
      },
      {
        iniciales: "MH",
        nombre: "Miguel Huamán",
        area: "Caja · Planilla",
        cargo: "Cajero",
        sueldo: "1 900",
        estado: "Activo",
        documentacion: "Completa",
        docsLabel: "4/4",
        docsPercent: 100,
      },
      {
        iniciales: "LB",
        nombre: "Lucía Bravo",
        area: "Salón · Part-time",
        cargo: "Moza",
        sueldo: "1 300",
        estado: "Vacaciones",
        documentacion: "Completa",
        docsLabel: "3/4",
        docsPercent: 100,
      },
    ],
    footer: {
      actionLabel: "Ver organigrama",
      range: "Página 1 de 2",
      page: 1,
      totalPages: 2,
    },
  },
  detail: {
    eyebrow: "Detalle del colaborador",
    iniciales: "CQ",
    name: "Carlos Quispe",
    state: "Activo",
    roleLine: "Jefe de Cocina · Cocina · Planilla",
    contactLine: "+51 987 654 321 · carlos.quispe@alitasperu.com",
    tabs: ["Información", "Documentos", "Contrato", "Capacitación", "Desempeño"],
    activeTab: "Información",
    personal: {
      title: "Datos personales",
      actionLabel: "Editar",
      fields: [
        { label: "Nombres", value: "Carlos" },
        { label: "Apellidos", value: "Quispe" },
        { label: "DNI", value: "72 345 678" },
        { label: "Nacimiento", value: "15/08/1992" },
        { label: "Teléfono", value: "987 654 321" },
        { label: "Estado civil", value: "Soltero" },
        { label: "Dirección", value: "Av. Los Incas 123" },
        { label: "Sede", value: "Cusco" },
        { label: "Emergencia", value: "987 123 456" },
      ],
    },
    work: {
      title: "Información laboral",
      actionLabel: "Editar",
      fields: [
        { label: "Tipo de contrato", value: "Planilla" },
        { label: "Fecha de ingreso", value: "10/01/2024" },
        { label: "Sueldo base (S/)", value: "2 800" },
        { label: "Horario", value: "14:00 – 22:00" },
        { label: "Jefe inmediato", value: "Administrador" },
        { label: "Modalidad", value: "Tiempo completo" },
      ],
    },
    documents: {
      title: "Documentación",
      progressLabel: "5 de 5 completados",
      items: [
        { label: "Datos personales", status: "Completo" },
        { label: "DNI", status: "Completo" },
        { label: "Contrato", status: "Completo" },
        { label: "RIT (Reglamento Interno)", status: "Completo" },
        { label: "Manual de funciones", status: "Completo" },
      ],
    },
    actions: {
      secondary: "Editar ficha",
      primary: "Enviar mensaje",
    },
  },
};
