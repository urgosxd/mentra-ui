// `03 · Horarios` as a plain React component: no Storybook import, no router, no
// data fetching. It composes the shared chrome with the generated components of
// the library; the pieces the library does not ship (KPI card of this module, week
// header with its chevrons, half-width form fields and the stacked coverage
// columns) are private to this file.
import type { ReactNode } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { AlertRow } from "../../stories/generated/AlertRow";
import { Badge } from "../../stories/generated/Badge";
import { Button } from "../../stories/generated/Button";
import { FilterChip } from "../../stories/generated/FilterChip";
import { FormField } from "../../stories/generated/FormField";
import { GhostChip } from "../../stories/generated/GhostChip";
import { InfoNote } from "../../stories/generated/InfoNote";
import { LegendItem } from "../../stories/generated/LegendItem";
import { PageHeader } from "../../stories/generated/PageHeader";
import { PanelCardHeader } from "../../stories/generated/PanelCardHeader";
import { ScheduleMatrixHeader } from "../../stories/generated/ScheduleMatrixHeader";
import { ScheduleRow } from "../../stories/generated/ScheduleRow";
import { ShiftChip } from "../../stories/generated/ShiftChip";
import { ShiftTemplateRow } from "../../stories/generated/ShiftTemplateRow";
import { SummaryTableHeader } from "../../stories/generated/SummaryTableHeader";
import { SummaryTableRow } from "../../stories/generated/SummaryTableRow";
import { Tab } from "../../stories/generated/Tab";
import { DashboardLayout } from "../DashboardLayout";
import { PanelSurface } from "../PanelSurface";
import {
  horarios,
  type CoverageDay,
  type CoverageSeries,
  type HorariosData,
  type ScheduleKpi,
  type SummaryRow,
} from "../fixtures/horarios";

export type HorariosProps = {
  /** Screen data; defaults to the design fixtures. */
  data?: HorariosData;
  /** Sidebar handler forwarded from an outer shell; absent when the screen is rendered alone. */
  onNavSelect?: (item: string) => void;
};

/** One chart-ramp token paints each coverage segment, as in the export. */
const SERIES_FILL: Record<CoverageSeries, string> = {
  1: "bg-(--color-chart-series-1)",
  2: "bg-(--color-chart-series-2)",
  3: "bg-(--color-chart-series-3)",
  4: "bg-(--color-chart-series-4)",
  5: "bg-(--color-chart-series-5)",
  6: "bg-(--color-chart-series-6)",
};

/** `LegendItem` hard-codes the series-1 dot, so each area repaints it here. */
const SERIES_DOT: Record<CoverageSeries, string> = {
  1: "[&_[data-legend-dot]]:bg-(--color-chart-series-1)",
  2: "[&_[data-legend-dot]]:bg-(--color-chart-series-2)",
  3: "[&_[data-legend-dot]]:bg-(--color-chart-series-3)",
  4: "[&_[data-legend-dot]]:bg-(--color-chart-series-4)",
  5: "[&_[data-legend-dot]]:bg-(--color-chart-series-5)",
  6: "[&_[data-legend-dot]]:bg-(--color-chart-series-6)",
};

/** Height of the coverage track the export stacks its segments inside. */
const COVERAGE_TRACK = 193;

const CHIP_TEXT = "[&_[data-turno]_span]:text-[9px]! [&_[data-turno]_span]:leading-[11px]!";

/**
 * Panel surface of the two panels whose head is not the plain card header: the
 * week panel titles with a 16px line and its own chevrons, and the coverage panel
 * puts a badge in the action slot. `PanelSurface` only accepts a text action.
 */
function PanelShell({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <section
      data-panel={label}
      className={[
        "flex min-h-0 w-full flex-col gap-2 rounded-(--radius-surface) border border-(--color-border-subtle) bg-(--color-bg-surface) p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}

/** 28px square week chevron of the schedule panel header. */
function WeekChip({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-(--radius-control) border border-(--color-border-subtle) bg-transparent text-(--color-text-muted) hover:bg-(--color-bg-sunken) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)"
    >
      <IconifyIcon icon={icon} aria-hidden="true" className="h-3.5 w-3.5" />
    </button>
  );
}

/**
 * KPI card of the schedule module. The export frames it at 279×138 with 24px
 * padding, a 32px figure and a semibold 12px detail line; the detail is pinned to
 * one line so the card keeps the exported height.
 */
function KpiCard({ card }: { card: ScheduleKpi }) {
  return (
    <div
      data-kpi-card={card.title}
      className="flex h-full w-full flex-col items-start gap-2 overflow-hidden rounded-(--radius-surface) bg-(--color-bg-surface) p-6"
    >
      <span className="w-full truncate font-[Inter] text-[12px] leading-[18px] text-(--color-text-secondary)">
        {card.title}
      </span>
      <span className="font-[Inter_Tight] text-[32px] font-semibold leading-[38px] tracking-[-0.8px] text-(--color-text-primary)">
        {card.value}
      </span>
      <span className="w-full truncate font-[Inter] text-[12px] font-semibold leading-[18px] text-(--color-text-secondary)">
        {card.detail}
      </span>
    </div>
  );
}

/** Half-width field of the assign-shift panel: caption over a 32px value box. */
function HalfField({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex w-[156px] flex-col gap-1">
      <span className="font-[Inter] text-[10px] text-(--color-text-secondary)">{label}</span>
      <div
        data-input-frame=""
        className="flex h-8 w-full items-center gap-1.5 rounded-(--radius-control) border border-(--color-border-subtle) bg-(--color-bg-surface) px-2.5"
      >
        <span className="min-w-0 flex-1 truncate font-[Inter] text-[11.5px] text-(--color-text-primary)">{value}</span>
        <IconifyIcon icon={icon} aria-hidden="true" className="h-3 w-3 shrink-0 text-(--color-text-secondary)" />
      </div>
    </div>
  );
}

/** One day of the coverage chart: share label, stacked bar, weekday label. */
function CoverageColumn({ day }: { day: CoverageDay }) {
  return (
    <div data-coverage-column="" className="flex w-[49px] shrink-0 flex-col items-center gap-0.5">
      <span className="font-[Inter] text-[10px] text-(--color-text-secondary)">{day.valor}</span>
      <div className="flex w-full flex-col justify-end" style={{ height: `${COVERAGE_TRACK}px` }}>
        {day.segments.map((segment, index) => (
          <div
            key={`${segment.area}-${index}`}
            data-segment={segment.area}
            data-series={segment.series}
            title={segment.area}
            style={{ height: `${segment.height}px` }}
            className={[
              "w-full",
              SERIES_FILL[segment.series],
              index === 0 ? "rounded-t-[2px]" : "",
              index === day.segments.length - 1 ? "rounded-b-[2px]" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        ))}
      </div>
      <span className="font-[Inter] text-[10px] text-(--color-text-secondary)">{day.dia}</span>
    </div>
  );
}

/** `%` cell of the summary table: the export paints it as a pill, not as text. */
function PercentBadge({ row }: { row: SummaryRow }) {
  return <Badge tone={row.percentTone} label={row.percent} className="h-7! px-3" />;
}

function WeekPanel({ data }: { data: HorariosData }) {
  const { week } = data;

  return (
    <PanelShell label={week.title} className="h-[474px]">
      <div className="flex h-7 w-full items-center gap-2">
        <h2 className="min-w-0 flex-1 truncate font-[Inter] text-[16px] font-semibold text-(--color-text-primary)">
          {week.title}
        </h2>
        <WeekChip icon="lucide:chevron-left" label={week.previousLabel} />
        <WeekChip icon="lucide:chevron-right" label={week.nextLabel} />
        <GhostChip label={week.todayLabel} className="h-7!" />
      </div>

      <div className="flex h-11 w-full items-center gap-1.5">
        {week.filters.map((filter) => (
          <FilterChip key={filter} label={filter} />
        ))}
        <div className="flex-1" />
        <Button style="Tertiary" label={week.printLabel} />
      </div>

      <div role="table" aria-label={week.title} className="flex w-full flex-col overflow-hidden">
        <div role="rowgroup">
          <ScheduleMatrixHeader
            personLabel={week.matrix.personLabel}
            days={week.matrix.days}
            totalLabel={week.matrix.totalLabel}
          />
        </div>
        <div role="rowgroup" className="flex flex-col gap-[2px]">
          {week.matrix.rows.map((row) => (
            <ScheduleRow
              key={row.nombre}
              iniciales={row.iniciales}
              nombre={row.nombre}
              cargo={row.cargo}
              days={row.days}
              total={row.total}
              className={[
                // The generated row pads 8px vertically and ships a 24px chip; the
                // export fits each collaborator in 28px around a 20px chip.
                "h-7 py-0! [&_[data-turno]]:h-5! [&_[data-turno]]:w-full!",
                CHIP_TEXT,
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex w-full items-center gap-2">
        <span className="min-w-0 flex-1 truncate font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
          {week.helpText}
        </span>
        <span className="shrink-0 font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
          {week.pageLabel}
        </span>
      </div>
    </PanelShell>
  );
}

export function Horarios({ data = horarios, onNavSelect }: HorariosProps) {
  const { assign, templates, summary, coverage, alerts } = data;

  return (
    <DashboardLayout
      title={data.chrome.title}
      rangeLabel={data.chrome.rangeLabel}
      userName={data.chrome.userName}
      initials={data.chrome.initials}
      activeNavItem={data.chrome.activeNavItem}
      onNavSelect={onNavSelect}
    >
      {/* `w-full!` drops the 1240px card width of the generated header; the breadcrumb
          line box is pinned to the export's 13px so the block closes at 61px. */}
      <PageHeader
        breadcrumb={data.header.breadcrumb}
        title={data.header.title}
        subtitle={data.header.subtitle}
        className="w-full! [&_span]:leading-[13px]"
        actions={
          <>
            <Button style="Secondary" label={data.header.actions.secondary} />
            <Button style="Primary" label={data.header.actions.primary} />
          </>
        }
      />

      <div data-kpi-row="" className="grid h-[138px] w-full grid-cols-4 gap-3">
        {data.kpis.map((card) => (
          <KpiCard key={card.title} card={card} />
        ))}
      </div>

      <div data-horarios-body="" className="flex min-h-0 w-full flex-1 flex-col gap-3">
        <div role="tablist" aria-label="Vistas del módulo" className="flex h-11 w-full items-end gap-0.5">
          {data.tabs.map((tab) => (
            <Tab key={tab} label={tab} selected={tab === data.activeTab} />
          ))}
          <div className="flex-1" />
          <div className="flex items-center gap-2 self-center">
            <span className="font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
              {data.legendLabel}
            </span>
            {data.legend.map((entry) => (
              <ShiftChip
                key={entry.turno}
                turno={entry.turno}
                label={entry.label}
                className={["h-5! w-[75px]!", CHIP_TEXT].join(" ")}
              />
            ))}
          </div>
        </div>

        <div data-main-row="" className="grid h-[474px] w-full grid-cols-[796px_344px] gap-3">
          <WeekPanel data={data} />

          <div className="flex h-full min-h-0 w-full flex-col gap-3">
            {/* The export pads these two panels 12px, two less than the card default. */}
            <PanelSurface title={assign.title} className="h-[252px] gap-1.5! p-3!">
              <div className="flex w-full flex-col gap-1.5">
                <FormField label={assign.colaborador.label} defaultValue={assign.colaborador.value} />
                <div className="flex w-full gap-2">
                  <HalfField label={assign.fecha.label} value={assign.fecha.value} icon="lucide:calendar" />
                  <HalfField label={assign.turno.label} value={assign.turno.value} icon="lucide:chevron-down" />
                </div>
                <FormField
                  label={assign.observaciones.label}
                  placeholder={assign.observaciones.placeholder}
                  className="[&_input]:w-full"
                />
                <div className="flex w-full items-center gap-2">
                  <Button style="Tertiary" label={assign.actions.secondary} />
                  <Button style="Primary" label={assign.actions.primary} />
                </div>
              </div>
            </PanelSurface>

            <PanelSurface
              title={templates.title}
              actionLabel={templates.actionLabel}
              className="h-[210px] gap-1! p-3!"
            >
              <div className="flex w-full flex-col gap-1">
                {templates.rows.map((row) => (
                  <ShiftTemplateRow key={row.nombre} tono={row.tono} nombre={row.nombre} horario={row.horario} />
                ))}
              </div>
            </PanelSurface>
          </div>
        </div>

        <div data-lower-row="" className="grid h-[310px] w-full grid-cols-3 gap-3">
          <PanelSurface title={summary.title} actionLabel={summary.actionLabel} className="h-[310px]">
            <div role="table" aria-label={summary.title} className="flex w-full flex-col">
              <div role="rowgroup">
                <SummaryTableHeader />
              </div>
              <div role="rowgroup">
                {summary.rows.map((row) => (
                  <SummaryTableRow
                    key={row.area}
                    area={row.area}
                    colaboradores={row.colaboradores}
                    horas={row.horas}
                    extra={row.extra}
                    porcentaje={<PercentBadge row={row} />}
                  />
                ))}
                <SummaryTableRow
                  area={summary.total.area}
                  colaboradores={summary.total.colaboradores}
                  horas={summary.total.horas}
                  extra={summary.total.extra}
                  porcentaje={
                    <span className="font-[Inter] text-[11px] font-bold text-(--color-text-primary)">
                      {summary.total.percent}
                    </span>
                  }
                />
              </div>
            </div>

            <div className="flex-1" />

            <div className="rounded-(--radius-control) bg-(--color-feedback-info-bg) px-2 py-2">
              <InfoNote texto={summary.note} className="w-full!" />
            </div>
          </PanelSurface>

          <PanelShell label={coverage.title} className="h-[310px]">
            <PanelCardHeader title={coverage.title} className="w-full!">
              <Badge tone="Positivo" label={coverage.badge} className="h-7!" />
            </PanelCardHeader>

            {/* Seven 49px columns fill the 344px body of the panel. */}
            <div className="flex w-full items-end justify-between">
              {coverage.days.map((day) => (
                <CoverageColumn key={day.dia} day={day} />
              ))}
            </div>

            <div className="flex-1" />

            <div className="flex w-full flex-wrap items-center gap-2.5">
              {coverage.legend.map((entry) => (
                <LegendItem key={entry.label} label={entry.label} className={SERIES_DOT[entry.series]} />
              ))}
            </div>
          </PanelShell>

          <PanelSurface title={alerts.title} actionLabel={alerts.actionLabel} className="h-[310px]">
            <div className="flex w-full flex-col gap-1.5">
              {alerts.rows.map((row) => (
                <AlertRow
                  key={row.label}
                  tone={row.tone}
                  label={row.label}
                  detail={row.detail}
                  date={row.date}
                  className="w-full!"
                />
              ))}
            </div>
            <div className="flex-1" />
          </PanelSurface>
        </div>
      </div>
    </DashboardLayout>
  );
}
