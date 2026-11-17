// Fixture data for the `01 · Indicadores · Ventas` prototype screen. Every string is
// transcribed from frame 367078803:4393 of pdf3.fig, spelling and separators included
// (`S/ 82 450`, `▲ 8,2 % vs. mes anterior`, `52.4 %`). Figures the design only draws
// as geometry are the round values its coordinates encode.
import type { BcgDatum } from "../charts/BcgMatrix";
import type { ChannelSlice } from "../charts/ChannelDonut";
import type { EvolutionDatum } from "../charts/EvolutionChart";

/** Shared application chrome, so screens 02-04 differ from this one only in data. */
export type DashboardChrome = {
  title: string;
  rangeLabel: string;
  userName: string;
  initials: string;
  activeNavItem: string;
};

/** Props of a `CardKpi`, in the export's order. */
export type KpiCard = {
  title: string;
  value: string;
  detail: string;
  tone: "Positivo" | "Negativo" | "Neutro";
};

/** Every panel opens with the same title + text action pair. */
export type PanelHeading = {
  title: string;
  /** Omitted when the export leaves the action slot empty. */
  actionLabel?: string;
};

export type EvolutionPanel = PanelHeading & {
  points: EvolutionDatum[];
};

export type ChannelsPanel = PanelHeading & {
  /** Figure in the donut hole. */
  total: string;
  totalCaption: string;
  slices: ChannelSlice[];
};

/** Props of a `MiniBarColumn`, in the export's order. */
export type MiniBarColumnDatum = {
  valor: string;
  dia: string;
  height: number;
};

export type BarPanel = PanelHeading & {
  columns: MiniBarColumnDatum[];
};

/** Props of a `ProductRow`, in the export's order. */
export type ProductTableRow = {
  ranking: string;
  producto: string;
  ventas: string;
  participacion: number;
  participacionLabel: string;
};

export type ProductsPanel = PanelHeading & {
  columnLabels: {
    rank: string;
    product: string;
    sales: string;
    share: string;
  };
  rows: ProductTableRow[];
  footer: {
    summary: string;
    total: string;
  };
};

export type BcgPanel = PanelHeading & {
  points: BcgDatum[];
  axisTitle: string;
};

export type BcgCategory = {
  label: string;
  detail: string;
  count: string;
  tone: "success" | "accent" | "warning" | "danger";
};

export type CategoriesPanel = PanelHeading & {
  rows: BcgCategory[];
};

export type IndicadoresVentasData = {
  chrome: DashboardChrome;
  modules: string[];
  activeModule: string;
  kpis: KpiCard[];
  evolution: EvolutionPanel;
  channels: ChannelsPanel;
  salesByDay: BarPanel;
  salesByHour: BarPanel;
  products: ProductsPanel;
  bcg: BcgPanel;
  categories: CategoriesPanel;
};

/** Module tabs drawn above the KPI row; `Ventas` is the selected state. */
const MODULES = [
  "Caja",
  "Costos",
  "Mermas",
  "Personal",
  "Punto de Equilibrio",
  "Rentabilidad",
  "Ventas",
];

export const indicadoresVentas: IndicadoresVentasData = {
  chrome: {
    title: "Indicadores · Ventas",
    rangeLabel: "1 – 31 Mar 2025",
    userName: "Gerencia",
    initials: "LC",
    activeNavItem: "Indicadores",
  },
  modules: MODULES,
  activeModule: "Ventas",
  kpis: [
    { title: "Ventas totales", value: "S/ 82 450", detail: "▲ 8,2 % vs. mes anterior", tone: "Positivo" },
    { title: "Clientes (PAX)", value: "1 940", detail: "▲ 7,1 % vs. mes anterior", tone: "Positivo" },
    { title: "Ticket promedio", value: "S/ 42,50", detail: "▲ 4,2 % vs. mes anterior", tone: "Positivo" },
    { title: "Órdenes", value: "2 060", detail: "▲ 5,6 % vs. mes anterior", tone: "Positivo" },
  ],
  evolution: {
    title: "Evolución de ventas",
    actionLabel: "Este año",
    points: [
      { label: "Ene", thisYear: 48, lastYear: 28 },
      { label: "Feb", thisYear: 65, lastYear: 37 },
      { label: "Mar", thisYear: 82.5, lastYear: 47 },
      { label: "Abr", thisYear: 62, lastYear: 39 },
      { label: "May", thisYear: 68, lastYear: 38 },
      { label: "Jun", thisYear: 82, lastYear: 50 },
      { label: "Jul", thisYear: 65, lastYear: 31 },
      { label: "Ago", thisYear: 68, lastYear: 35 },
      { label: "Sep", thisYear: 70, lastYear: 40 },
      { label: "Oct", thisYear: 82, lastYear: 45 },
      { label: "Nov", thisYear: 88, lastYear: 44 },
      { label: "Dic", thisYear: 97, lastYear: 70 },
    ],
  },
  channels: {
    title: "Ventas por canal",
    total: "S/ 82 450",
    totalCaption: "Ventas totales",
    slices: [
      { label: "Salón", percent: 52.4, tone: "brand" },
      { label: "Delivery", percent: 24.1, tone: "accent" },
      { label: "Recojo", percent: 15.3, tone: "brandSoft" },
      { label: "Online", percent: 8.2, tone: "neutral" },
    ],
  },
  salesByDay: {
    title: "Ventas por día",
    actionLabel: "S/ 82 450",
    columns: [
      { valor: "6.8K", dia: "Lun", height: 38 },
      { valor: "9.0K", dia: "Mar", height: 50 },
      { valor: "10.7K", dia: "Mié", height: 60 },
      { valor: "10.3K", dia: "Jue", height: 58 },
      { valor: "12.7K", dia: "Vie", height: 71 },
      { valor: "17.9K", dia: "Sáb", height: 100 },
      { valor: "15.1K", dia: "Dom", height: 84 },
    ],
  },
  salesByHour: {
    title: "Ventas por hora",
    actionLabel: "Pico 20–22",
    columns: [
      { valor: "4.7K", dia: "8-10", height: 26 },
      { valor: "8.6K", dia: "10-12", height: 48 },
      { valor: "14.9K", dia: "12-14", height: 84 },
      { valor: "6.8K", dia: "14-16", height: 38 },
      { valor: "11.3K", dia: "16-18", height: 63 },
      { valor: "16.4K", dia: "18-20", height: 92 },
      { valor: "19.8K", dia: "20-22", height: 111 },
    ],
  },
  products: {
    title: "Top 10 productos",
    actionLabel: "Ver carta →",
    columnLabels: { rank: "#", product: "PRODUCTO", sales: "VENTAS", share: "% TOTAL" },
    rows: [
      { ranking: "1", producto: "Alitas BBQ", ventas: "11 720", participacion: 14.2, participacionLabel: "14.2 %" },
      { ranking: "2", producto: "Buffalo", ventas: "9 730", participacion: 11.8, participacionLabel: "11.8 %" },
      { ranking: "3", producto: "Hamburguesa Clásica", ventas: "6 930", participacion: 8.4, participacionLabel: "8.4 %" },
      { ranking: "4", producto: "Tragos Clásicos", ventas: "5 690", participacion: 6.9, participacionLabel: "6.9 %" },
      { ranking: "5", producto: "Papas Especiales", ventas: "4 630", participacion: 5.6, participacionLabel: "5.6 %" },
      { ranking: "6", producto: "Hamburguesa Especial", ventas: "3 920", participacion: 4.8, participacionLabel: "4.8 %" },
      { ranking: "7", producto: "Costillas BBQ", ventas: "3 450", participacion: 4.2, participacionLabel: "4.2 %" },
      { ranking: "8", producto: "Ensalada Andina", ventas: "2 150", participacion: 2.6, participacionLabel: "2.6 %" },
      { ranking: "9", producto: "Sopa del Día", ventas: "1 820", participacion: 2.2, participacionLabel: "2.2 %" },
      { ranking: "10", producto: "Jugo Natural", ventas: "1 560", participacion: 1.9, participacionLabel: "1.9 %" },
    ],
    footer: { summary: "Mostrando 10 de 42 productos de la carta", total: "S/ 82 450 · 100 %" },
  },
  bcg: {
    title: "Matriz BCG de la carta",
    actionLabel: "Todos 8",
    axisTitle: "Participación en ventas (%)",
    points: [
      { name: "Alitas BBQ", participation: 18, growth: 6, tone: "success", labelSide: "left" },
      { name: "Buffalo", participation: 16, growth: 18, tone: "success", labelSide: "right" },
      { name: "Hamburguesa Clásica", participation: 14, growth: 24, tone: "success", labelSide: "right" },
      { name: "Papas Especiales", participation: 20, growth: 12, tone: "success", labelSide: "left" },
      { name: "Tragos Clásicos", participation: 3.5, growth: 15, tone: "accent", labelSide: "right" },
      { name: "Papas Trufadas", participation: 4.5, growth: 26, tone: "accent", labelSide: "right" },
      { name: "Ensalada Andina", participation: 1.8, growth: -8, tone: "danger", labelSide: "right" },
      { name: "Jugo Natural", participation: 4.2, growth: -18, tone: "danger", labelSide: "right" },
    ],
  },
  categories: {
    title: "Categorías BCG",
    actionLabel: "8 productos",
    rows: [
      { label: "Estrellas", detail: "Alto crec. · alta part.", count: "3", tone: "success" },
      { label: "Interrogantes", detail: "Alto crec. · baja part.", count: "2", tone: "accent" },
      { label: "Vacas", detail: "Bajo crec. · alta part.", count: "2", tone: "warning" },
      { label: "Perros", detail: "Bajo crec. · baja part.", count: "1", tone: "danger" },
    ],
  },
};
