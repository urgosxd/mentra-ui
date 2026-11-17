// `01 · Indicadores · Ventas` as a plain React component: no Storybook import, no
// router, no data fetching. It composes the shared chrome with the generated
// components of the library and the two hand-composed charts of `src/prototype/charts`.
import { CardKpi } from "../../stories/generated/CardKpi";
import { MiniBarColumn } from "../../stories/generated/MiniBarColumn";
import { ProductRow } from "../../stories/generated/ProductRow";
import { Tab } from "../../stories/generated/Tab";
import { BcgMatrix } from "../charts/BcgMatrix";
import { ChannelDonut } from "../charts/ChannelDonut";
import { EvolutionChart } from "../charts/EvolutionChart";
import { DashboardLayout } from "../DashboardLayout";
import { indicadoresVentas, type BarPanel, type CategoriesPanel, type IndicadoresVentasData, type ProductsPanel } from "../fixtures/indicadores";
import { PanelSurface } from "../PanelSurface";

export type IndicadoresVentasProps = {
  /** Screen data; defaults to the design fixtures. */
  data?: IndicadoresVentasData;
};

const CATEGORY_DOT: Record<CategoriesPanel["rows"][number]["tone"], string> = {
  success: "bg-(--color-text-success)",
  accent: "bg-(--color-action-secondary)",
  warning: "bg-(--color-amber-700)",
  danger: "bg-(--color-text-danger)",
};

const BAR_PANEL = "h-[214px]";
const TENDENCY_PANEL = "h-[224px]";

/** Column template shared by the products header and every `ProductRow`. */
const PRODUCT_COLUMNS = "grid grid-cols-[14px_minmax(0,1fr)_52px_64px_48px] items-center gap-3";

function BarPanelBody({ panel }: { panel: BarPanel }) {
  return (
    <div data-bar-chart="" className="flex h-[150px] items-end gap-1.5">
      {panel.columns.map((column) => (
        <MiniBarColumn key={column.dia} {...column} />
      ))}
    </div>
  );
}

function ProductsPanelBody({ panel }: { panel: ProductsPanel }) {
  return (
    <div className="flex w-full flex-col">
      <div
        role="table"
        aria-label={panel.title}
        className="flex w-full flex-col"
      >
        <div role="row" className={[PRODUCT_COLUMNS, "border-b border-(--color-border-subtle) pb-2"].join(" ")}>
          <span role="columnheader" className="font-[Inter] text-[9px] font-semibold text-(--color-text-secondary)">
            {panel.columnLabels.rank}
          </span>
          <span role="columnheader" className="font-[Inter] text-[9px] font-semibold text-(--color-text-secondary)">
            {panel.columnLabels.product}
          </span>
          <span
            role="columnheader"
            className="text-right font-[Inter] text-[9px] font-semibold text-(--color-text-secondary)"
          >
            {panel.columnLabels.sales}
          </span>
          <span role="columnheader" />
          <span
            role="columnheader"
            className="text-right font-[Inter] text-[9px] font-semibold text-(--color-text-secondary)"
          >
            {panel.columnLabels.share}
          </span>
        </div>

        {panel.rows.map((row) => (
          <ProductRow key={row.ranking} {...row} />
        ))}
      </div>

      <div className="flex w-full items-center pt-2">
        <span className="min-w-0 flex-1 truncate font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
          {panel.footer.summary}
        </span>
        <span className="shrink-0 font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
          {panel.footer.total}
        </span>
      </div>
    </div>
  );
}

function CategoriesPanelBody({ panel }: { panel: CategoriesPanel }) {
  return (
    <div className="flex w-full flex-col gap-[5px]">
      {panel.rows.map((row) => (
        <div key={row.label} data-bcg-category={row.label} className="flex w-full items-center gap-2">
          <span aria-hidden="true" className={["h-2 w-2 shrink-0 rounded-full", CATEGORY_DOT[row.tone]].join(" ")} />
          <span className="w-[84px] shrink-0 font-[Inter] text-[11px] font-semibold leading-[13px] text-(--color-text-primary)">
            {row.label}
          </span>
          <span className="min-w-0 flex-1 truncate font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
            {row.detail}
          </span>
          <span className="w-6 shrink-0 text-right font-[Inter] text-[10px] font-semibold leading-3 text-(--color-text-primary)">
            {row.count}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Ventas screen of the indicators module: tabs, KPI row and the six indicator panels. */
export function IndicadoresVentas({ data = indicadoresVentas }: IndicadoresVentasProps) {
  return (
    <DashboardLayout
      title={data.chrome.title}
      rangeLabel={data.chrome.rangeLabel}
      userName={data.chrome.userName}
      initials={data.chrome.initials}
      activeNavItem={data.chrome.activeNavItem}
    >
      <div
        role="tablist"
        aria-label="Módulos del indicador"
        className="flex h-11 w-full items-stretch rounded-(--radius-card) border-b border-(--color-border-subtle) bg-(--color-bg-surface) px-4"
      >
        {data.modules.map((module) => (
          <Tab key={module} label={module} selected={module === data.activeModule} />
        ))}
      </div>

      <div data-kpi-row="" className="grid w-full grid-cols-4 gap-3">
        {data.kpis.map((kpi) => (
          <CardKpi
            key={kpi.title}
            tone={kpi.tone}
            título={kpi.title}
            valor={kpi.value}
            detalle={kpi.detail}
            className="w-full!"
          />
        ))}
      </div>

      <div data-indicator-body="" className="grid min-h-0 w-full grid-cols-[640px_500px] gap-3">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="grid w-full grid-cols-[356px_272px] gap-3">
            <PanelSurface
              title={data.evolution.title}
              actionLabel={data.evolution.actionLabel}
              className={TENDENCY_PANEL}
            >
              <EvolutionChart points={data.evolution.points} />
            </PanelSurface>

            <PanelSurface
              title={data.channels.title}
              actionLabel={data.channels.actionLabel}
              className={TENDENCY_PANEL}
            >
              <ChannelDonut
                slices={data.channels.slices}
                total={data.channels.total}
                totalCaption={data.channels.totalCaption}
              />
            </PanelSurface>
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            <PanelSurface title={data.salesByDay.title} actionLabel={data.salesByDay.actionLabel} className={BAR_PANEL}>
              <BarPanelBody panel={data.salesByDay} />
            </PanelSurface>

            <PanelSurface title={data.salesByHour.title} actionLabel={data.salesByHour.actionLabel} className={BAR_PANEL}>
              <BarPanelBody panel={data.salesByHour} />
            </PanelSurface>
          </div>

          <PanelSurface title={data.products.title} actionLabel={data.products.actionLabel} className="h-[408px]">
            <ProductsPanelBody panel={data.products} />
          </PanelSurface>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <PanelSurface title={data.bcg.title} actionLabel={data.bcg.actionLabel} className="h-[736px]">
            <BcgMatrix points={data.bcg.points} axisTitle={data.bcg.axisTitle} />
          </PanelSurface>

          <PanelSurface title={data.categories.title} actionLabel={data.categories.actionLabel} className="h-[122px]">
            <CategoriesPanelBody panel={data.categories} />
          </PanelSurface>
        </div>
      </div>
    </DashboardLayout>
  );
}
