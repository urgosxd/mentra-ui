// `04 · Asistencia` as a plain React component: no Storybook import, no router, no
// data fetching. It composes the shared chrome with the generated components of the
// library; the pieces the library does not ship (the tab strip card of this module,
// its KPI card, the daily column chart and the marking rows) are private to this file.
import type { ReactNode } from "react";
import { AttendanceStatus } from "../../stories/generated/AttendanceStatus";
import { Badge } from "../../stories/generated/Badge";
import { Button } from "../../stories/generated/Button";
import { DonutBreakdown } from "../../stories/generated/DonutBreakdown";
import { FilterChip } from "../../stories/generated/FilterChip";
import { MonthCalendar } from "../../stories/generated/MonthCalendar";
import { PageHeader } from "../../stories/generated/PageHeader";
import { Pagination } from "../../stories/generated/Pagination";
import { PanelCardHeader } from "../../stories/generated/PanelCardHeader";
import { PanelHeader } from "../../stories/generated/PanelHeader";
import { PersonCard } from "../../stories/generated/PersonCard";
import { ProgressMeter } from "../../stories/generated/ProgressMeter";
import { RangeChip } from "../../stories/generated/RangeChip";
import { SearchField } from "../../stories/generated/SearchField";
import { Tab } from "../../stories/generated/Tab";
import { TableHeaderAsistencia } from "../../stories/generated/TableHeaderAsistencia";
import { TableRowAsistencia } from "../../stories/generated/TableRowAsistencia";
import { DashboardLayout } from "../DashboardLayout";
import { PanelSurface } from "../PanelSurface";
import {
  asistencia,
  type AsistenciaData,
  type AttendanceKpi,
  type AttendanceRow,
  type DailyIncident,
  type Marking,
  type MarkingTone,
} from "../fixtures/asistencia";

export type AsistenciaProps = {
  /** Screen data; defaults to the design fixtures. */
  data?: AsistenciaData;
};

/** Height of the daily chart track the export stacks its segments inside. */
const DAILY_TRACK = 202;
/** Segment heights the export draws: a full present bar plus one incident bar. */
const PRESENT_BAR = 160;
const TARDANZA_BAR = 38;
const FALTA_BAR = 21;

const INCIDENT_BAR: Record<DailyIncident, number> = {
  Tardanza: TARDANZA_BAR,
  Falta: FALTA_BAR,
};

const INCIDENT_FILL: Record<DailyIncident, string> = {
  Tardanza: "bg-(--color-chart-series-2)",
  Falta: "bg-(--color-chart-series-4)",
};

/** Legend and bar tone of the daily chart, painted as the export binds them. */
const DAILY_FILL: Record<"presente" | "tardanza" | "falta", string> = {
  presente: "bg-(--color-green-600)",
  tardanza: "bg-(--color-chart-series-2)",
  falta: "bg-(--color-chart-series-4)",
};

/** Dot of a marking row: brand green, warning amber or neutral, as exported. */
const MARKING_FILL: Record<MarkingTone, string> = {
  green: "bg-(--color-green-600)",
  amber: "bg-(--color-amber-700)",
  neutral: "bg-(--color-neutral-500)",
};

/**
 * `TableRowAsistencia` hard-codes the two badge tones of the library export (a
 * warning tardanzas badge and a positive punctuality one). The screen's design
 * instead paints a neutral tardanzas badge for a zero count and a warning
 * punctuality badge below 96 %, so the cell that disagrees is repainted here.
 */
const NEUTRAL_TARDANZAS =
  "[&_[role=cell]:nth-child(4)_[data-tone]]:bg-(--color-bg-sunken)! [&_[role=cell]:nth-child(4)_[data-tone]_span]:text-(--color-text-secondary)!";
const WARNING_PUNCTUALITY =
  "[&_[role=cell]:nth-child(7)_[data-tone]]:bg-(--color-feedback-warning-bg)! [&_[role=cell]:nth-child(7)_[data-tone]_span]:text-(--color-text-warning)!";

/**
 * Panel surface of this screen. `PanelSurface` is not reused because only two of
 * the six panels of the export head with a plain title: the register panel carries
 * a subtitle and a range chip, the identity card has no heading at all, and the
 * marking and daily panels put a badge or a legend in the action slot.
 */
function PanelShell({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <section
      data-panel={label}
      className={[
        "flex min-h-0 w-full flex-col gap-2 overflow-hidden rounded-(--radius-surface) border border-(--color-border-subtle) bg-(--color-bg-surface) p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}

/**
 * KPI card of the attendance module: 279×138 with 24px padding and a green detail
 * line, which is how the export binds all four of them.
 */
function KpiCard({ card }: { card: AttendanceKpi }) {
  return (
    <div
      data-kpi-card={card.title}
      className="flex h-full w-full flex-col items-start gap-2 overflow-hidden rounded-(--radius-surface) border border-(--color-border-subtle) bg-(--color-bg-surface) p-6"
    >
      <span className="w-full truncate font-[Inter] text-[12px] leading-[18px] text-(--color-text-secondary)">
        {card.title}
      </span>
      <span className="font-[Inter_Tight] text-[32px] font-semibold leading-[38px] tracking-[-0.8px] text-(--color-text-primary)">
        {card.value}
      </span>
      <span className="w-full truncate font-[Inter] text-[12px] font-semibold leading-[18px] text-(--color-text-success)">
        {card.detail}
      </span>
    </div>
  );
}

/** Badge tones of the two table columns, repainted over the generated row. */
function rowToneClasses(row: AttendanceRow): string {
  return [
    row.tardanzasTone === "Advertencia" ? "" : NEUTRAL_TARDANZAS,
    row.puntualidadTone === "Positivo" ? "" : WARNING_PUNCTUALITY,
  ]
    .filter(Boolean)
    .join(" ");
}

/** One day of the daily chart: the day's incident over the present share. */
function DailyColumn({ day, incident }: { day: number; incident: DailyIncident | null }) {
  return (
    <div
      data-daily-column={day}
      className="flex h-full w-[9.16px] shrink-0 flex-col items-center justify-end gap-px"
    >
      {incident ? (
        <div
          data-daily-segment={incident === "Tardanza" ? "tardanza" : "falta"}
          title={incident}
          style={{ height: `${INCIDENT_BAR[incident]}px` }}
          className={["w-full rounded-[1px]", INCIDENT_FILL[incident]].join(" ")}
        />
      ) : null}
      <div
        data-daily-segment="presente"
        style={{ height: `${PRESENT_BAR}px` }}
        className="w-full rounded-[1px] bg-(--color-green-600)"
      />
    </div>
  );
}

/** One marking of the day: tone dot, type and detail, clock time on the edge. */
function MarkingRow({ row }: { row: Marking }) {
  return (
    <div
      data-marking={row.tipo}
      className="flex h-[33px] w-full shrink-0 items-center gap-2 border-b border-(--color-border-divider)"
    >
      <span
        data-marking-tone={row.tone}
        aria-hidden="true"
        className={["h-[7px] w-[7px] shrink-0 rounded-full", MARKING_FILL[row.tone]].join(" ")}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-[Inter] text-[11px] leading-[13px] text-(--color-text-primary)">
          {row.tipo}
        </span>
        <span className="truncate font-[Inter] text-[9.5px] leading-[11px] text-(--color-text-secondary)">
          {row.detalle}
        </span>
      </div>
      <span className="shrink-0 font-[Inter] text-[11px] leading-[13px] text-(--color-text-primary)">
        {row.hora}
      </span>
    </div>
  );
}

/** Asistencia screen of the RRHH module: register table, day detail and summaries. */
export function Asistencia({ data = asistencia }: AsistenciaProps) {
  const { register, detail, daily, punctuality, incidents } = data;

  return (
    <DashboardLayout
      title={data.chrome.title}
      rangeLabel={data.chrome.rangeLabel}
      userName={data.chrome.userName}
      initials={data.chrome.initials}
      activeNavItem={data.chrome.activeNavItem}
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

      <div data-asistencia-body="" className="flex min-h-0 w-full flex-1 flex-col gap-3">
        {/* The tab bar of this module is its own surface card, unlike screens 02/03. */}
        <div
          data-tab-strip=""
          className="flex h-11 w-full shrink-0 items-center rounded-(--radius-card) border border-(--color-border-subtle) bg-(--color-bg-surface) px-2"
        >
          <div role="tablist" aria-label="Vistas del módulo" className="flex h-full items-center">
            {data.tabs.map((tab) => (
              <Tab key={tab} label={tab} selected={tab === data.activeTab} className="h-full!" />
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex shrink-0 items-center gap-2">
            {data.states.map((state) => (
              <AttendanceStatus key={state} estado={state} />
            ))}
          </div>
        </div>

        <div data-main-row="" className="grid h-[508px] w-full grid-cols-[796px_344px] gap-3">
          <PanelShell label={register.title} className="h-[508px]">
            <PanelHeader title={register.title} subtitle={register.subtitle} className="w-full!">
              <RangeChip label={register.rangeLabel} />
            </PanelHeader>

            <div className="flex h-[34px] w-full shrink-0 items-center gap-1.5">
              {register.filters.map((filter) => (
                <FilterChip key={filter} label={filter} />
              ))}
              <div className="flex-1" />
              <SearchField placeholder={register.searchPlaceholder} aria-label={register.searchLabel} />
            </div>

            <div role="table" aria-label={register.title} className="flex w-full flex-col overflow-hidden">
              <div role="rowgroup">
                <TableHeaderAsistencia />
              </div>
              <div role="rowgroup">
                {register.rows.map((row) => (
                  <TableRowAsistencia
                    key={row.nombre}
                    iniciales={row.iniciales}
                    nombre={row.nombre}
                    cargo={row.cargo}
                    turno={row.turno}
                    dias={row.dias}
                    tardanzas={row.tardanzas}
                    faltas={row.faltas}
                    horas={row.horas}
                    puntualidad={row.puntualidad}
                    className={rowToneClasses(row)}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1" />

            <div className="flex h-[26px] w-full shrink-0 items-center gap-1.5">
              <span className="min-w-0 flex-1 truncate font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
                {register.footer.range}
              </span>
              <Pagination
                range={register.footer.page}
                page={1}
                totalPages={register.footer.totalPages}
                className="w-[280px]!"
              />
            </div>
          </PanelShell>

          <div data-detail-column="" className="flex h-full min-h-0 w-full flex-col gap-3">
            {/* The export pads these two cards 14px vertically and 16px sideways. */}
            <PanelShell label={detail.personLabel} className="h-[290px] gap-2! px-4! py-3.5!">
              <PersonCard
                iniciales={detail.person.iniciales}
                nombre={detail.person.nombre}
                cargo={detail.person.cargo}
                estado={detail.person.estado}
                className="w-full!"
              />
              <div className="h-px w-full shrink-0 bg-(--color-border-divider)" />
              <MonthCalendar month={detail.calendar.month} year={detail.calendar.year} className="w-full!" />
            </PanelShell>

            <PanelShell
              label={detail.markings.title}
              className="h-[206px] gap-[5px]! px-4! pt-3.5! pb-3!"
            >
              <div className="flex h-7 w-full shrink-0 items-center gap-2">
                <h2 className="min-w-0 flex-1 truncate font-[Inter] text-[13px] font-medium text-(--color-text-primary)">
                  {detail.markings.title}
                </h2>
                <Badge tone={detail.markings.badgeTone} label={detail.markings.badge} className="h-7!" />
              </div>

              {detail.markings.rows.map((row) => (
                <MarkingRow key={row.tipo} row={row} />
              ))}
            </PanelShell>
          </div>
        </div>

        <div data-lower-row="" className="grid h-[277px] w-full grid-cols-3 gap-3">
          <PanelShell label={daily.title} className="h-[277px]">
            <PanelCardHeader title={daily.title} className="w-full!">
              <div className="flex items-center gap-2">
                {daily.legend.map((entry) => (
                  <span key={entry.label} data-legend="" className="flex items-center gap-1">
                    <span
                      aria-hidden="true"
                      className={[
                        "h-[7px] w-[7px] shrink-0 rounded-full",
                        DAILY_FILL[entry.tone],
                      ].join(" ")}
                    />
                    <span className="font-[Inter] text-[10px] text-(--color-text-secondary)">{entry.label}</span>
                  </span>
                ))}
              </div>
            </PanelCardHeader>

            <div
              data-daily-chart=""
              className="flex w-full shrink-0 items-end justify-between"
              style={{ height: `${DAILY_TRACK}px` }}
            >
              {daily.days.map((incident, index) => (
                <DailyColumn key={index} day={index + 1} incident={incident} />
              ))}
            </div>

            <div className="flex h-[11px] w-full shrink-0 items-center gap-2">
              <span className="min-w-0 flex-1 truncate font-[Inter] text-[10px] leading-[11px] text-(--color-text-secondary)">
                {daily.axis[0]}
              </span>
              <span className="shrink-0 font-[Inter] text-[10px] leading-[11px] text-(--color-text-secondary)">
                {daily.axis[1]}
              </span>
              <span className="shrink-0 font-[Inter] text-[10px] leading-[11px] text-(--color-text-secondary)">
                {daily.axis[2]}
              </span>
            </div>
          </PanelShell>

          {/* The export pads this panel 16px and spaces its rows 10px. */}
          <PanelSurface title={punctuality.title} className="h-[277px] gap-2.5!">
            <div className="flex w-full flex-col gap-2.5">
              {punctuality.meters.map((meter) => (
                <ProgressMeter
                  key={meter.label}
                  label={meter.label}
                  valueLabel={meter.valueLabel}
                  value={meter.percent}
                  className="w-full!"
                />
              ))}
            </div>
            <div className="flex-1" />
            <span className="w-full font-[Inter] text-[10px] leading-[12px] text-(--color-text-secondary)">
              {punctuality.note}
            </span>
          </PanelSurface>

          <PanelSurface title={incidents.title} actionLabel={incidents.actionLabel} className="h-[277px]">
            {/* `DonutBreakdown` hard-codes the 380px width of another screen. */}
            <DonutBreakdown segments={incidents.segments} className="w-full!" />
          </PanelSurface>
        </div>
      </div>
    </DashboardLayout>
  );
}
