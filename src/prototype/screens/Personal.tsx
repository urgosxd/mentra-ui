// `02 · Personal` as a plain React component: no Storybook import, no router, no
// data fetching. It composes the shared chrome with the generated components of
// the library; the detail panel pieces the library does not ship (identity block,
// sub-tabs, KPI cards, share ring) are private to this file.
import type { ReactNode } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { Avatar } from "../../stories/generated/Avatar";
import { Badge } from "../../stories/generated/Badge";
import { Button } from "../../stories/generated/Button";
import { DetailPanelHeader } from "../../stories/generated/DetailPanelHeader";
import { FilterChip } from "../../stories/generated/FilterChip";
import { PageHeader } from "../../stories/generated/PageHeader";
import { Pagination } from "../../stories/generated/Pagination";
import { PanelCardHeader } from "../../stories/generated/PanelCardHeader";
import { SearchField } from "../../stories/generated/SearchField";
import { TableHeaderPersonal } from "../../stories/generated/TableHeaderPersonal";
import { TableRowPersonal } from "../../stories/generated/TableRowPersonal";
import { DashboardLayout } from "../DashboardLayout";
import {
  personal,
  type DetailBlock,
  type KpiCard as KpiCardDatum,
  type KpiShareCard,
  type PersonalData,
  type StaffDetailPanel,
  type StaffListPanel,
} from "../fixtures/personal";

export type PersonalProps = {
  /** Screen data; defaults to the design fixtures. */
  data?: PersonalData;
  /** Sidebar handler forwarded from an outer shell; absent when the screen is rendered alone. */
  onNavSelect?: (item: string) => void;
};

/** Ring geometry of the export: 68px box, inner radius 0.76 → 8.16px stroke. */
const RING_SIZE = 68;
const RING_STROKE = 8.16;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CENTER = RING_SIZE / 2;

const RING_TONE: Record<KpiShareCard["tone"], string> = {
  brand: "stroke-(--color-bg-brand)",
  accent: "stroke-(--color-action-secondary)",
};

/**
 * Panel surface of this screen. `PanelSurface` is not reused because both panels
 * of the export head with something else: a muted count on the list, an eyebrow
 * plus close glyph on the detail side.
 */
function PanelShell({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <section
      data-panel={label}
      className={[
        "flex min-h-0 w-full flex-col gap-2.5 rounded-(--radius-surface) border border-(--color-border-subtle) bg-(--color-bg-surface) p-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}

/** Share ring of the two planilla KPI cards: track plus a proportional arc. */
function ShareRing({ percent, tone, shareLabel }: Pick<KpiShareCard, "percent" | "tone" | "shareLabel">) {
  const filled = Math.min(100, Math.max(0, percent));

  return (
    <div
      data-share-ring=""
      role="img"
      aria-label={shareLabel}
      className="relative h-[68px] w-[68px] shrink-0"
    >
      <svg viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} aria-hidden="true" className="absolute inset-0 h-full w-full">
        <circle
          cx={RING_CENTER}
          cy={RING_CENTER}
          r={RING_RADIUS}
          fill="none"
          strokeWidth={RING_STROKE}
          className="stroke-(--color-bg-sunken)"
        />
        {filled > 0 ? (
          <circle
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={RING_RADIUS}
            fill="none"
            strokeWidth={RING_STROKE}
            pathLength={100}
            strokeDasharray={`${filled} ${100 - filled}`}
            transform={`rotate(-90 ${RING_CENTER} ${RING_CENTER})`}
            className={RING_TONE[tone]}
          />
        ) : null}
      </svg>
      {/* The export leaves the `Cifra` slot of the ring empty and draws the caption only. */}
      <span className="absolute inset-x-0 top-[37px] text-center font-[Inter] text-[8px] leading-[10px] text-(--color-text-secondary)">
        del total
      </span>
    </div>
  );
}

// The KPI card draws its hairline with `outline` rather than `border`: the export's
// 110px box budgets 16px padding plus 78px of text and no border, and a real border
// would push the card 2px past the frame.
function KpiCard({ card }: { card: KpiCardDatum }) {
  return (
    <div
      data-kpi-card={card.title}
      className="flex h-full w-full items-center gap-2 rounded-(--radius-surface) bg-(--color-bg-surface) p-4 outline-1 -outline-offset-1 outline-(--color-border-subtle)"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate font-[Inter] text-[11px] leading-[13px] text-(--color-text-secondary)">
          {card.title}
        </span>
        <span className="font-[Inter_Tight] text-[24px] font-semibold leading-[29px] tracking-[-0.5px] text-(--color-text-primary)">
          {card.value}
        </span>
        {card.kind === "delta" ? (
          <div className="flex items-center gap-2">
            <Badge tone={card.deltaTone} label={card.delta} />
            <span className="truncate font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
              {card.deltaCaption}
            </span>
          </div>
        ) : (
          <span className="truncate font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
            {card.caption}
          </span>
        )}
      </div>

      {card.kind === "share" ? (
        <ShareRing percent={card.percent} tone={card.tone} shareLabel={card.shareLabel} />
      ) : null}
    </div>
  );
}

function StaffListBody({ panel }: { panel: StaffListPanel }) {
  return (
    <>
      <PanelCardHeader title={panel.title} className="w-full!">
        <span className="font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">{panel.countLabel}</span>
      </PanelCardHeader>

      <div className="flex w-full flex-wrap items-center gap-1.5">
        {panel.filters.map((filter) => (
          <FilterChip key={filter} label={filter} />
        ))}
        <div className="flex-1" />
        <SearchField placeholder={panel.searchPlaceholder} aria-label={panel.searchLabel} />
      </div>

      <div role="table" aria-label={panel.title} className="flex w-full flex-col overflow-hidden rounded-(--radius-control)">
        <div role="rowgroup">
          <TableHeaderPersonal />
        </div>
        <div role="rowgroup">
          {panel.rows.map((row) => (
            <TableRowPersonal
              key={row.nombre}
              iniciales={row.iniciales}
              nombre={row.nombre}
              area={row.area}
              cargo={row.cargo}
              sueldo={row.sueldo}
              estado={row.estado}
              documentacion={row.documentacion}
              docsLabel={row.docsLabel}
              docsPercent={row.docsPercent}
            />
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex w-full items-center gap-1.5">
        <Button style="Tertiary" label={panel.footer.actionLabel} />
        <div className="flex-1" />
        <Pagination range={panel.footer.range} page={panel.footer.page} totalPages={panel.footer.totalPages} />
      </div>
    </>
  );
}

/** Sub-tab of the detail panel: auto-width label over the 2px brand indicator. */
function DetailTab({ label, selected }: { label: string; selected: boolean }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      data-state={selected ? "selected" : "default"}
      className={[
        "flex h-9 cursor-pointer flex-col justify-end gap-2 border-0 bg-transparent px-2 font-[Inter] text-[11px]",
        selected
          ? "font-semibold text-(--color-bg-brand)"
          : "font-normal text-(--color-text-secondary) hover:text-(--color-text-primary)",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)",
      ].join(" ")}
    >
      <span className="whitespace-nowrap">{label}</span>
      <span
        aria-hidden="true"
        className={["h-0.5 w-full", selected ? "bg-(--color-bg-brand)" : "bg-transparent"].join(" ")}
      />
    </button>
  );
}

/**
 * Titled block of `Etiqueta` / `Valor` pairs. `compact` reproduces the 9px labels
 * the export draws in the labour block; the personal block uses 10px labels.
 */
function DetailGrid({ block, compact }: { block: DetailBlock; compact?: boolean }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <h3 className="min-w-0 flex-1 truncate font-[Inter] text-[12px] font-semibold text-(--color-text-primary)">
          {block.title}
        </h3>
        <button
          type="button"
          className="shrink-0 cursor-pointer border-0 bg-transparent p-0 font-[Inter] text-[11px] font-semibold text-(--color-bg-brand) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-border-focus)"
        >
          {block.actionLabel}
        </button>
      </div>

      <div className="grid w-full grid-cols-[repeat(3,124px)] gap-2">
        {block.fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-px">
            <span
              className={[
                "font-[Inter] leading-3 text-(--color-text-secondary)",
                compact ? "text-[9px]" : "text-[10px]",
              ].join(" ")}
            >
              {field.label}
            </span>
            <span className="truncate font-[Inter] text-[11px] font-semibold leading-4 text-(--color-text-primary)">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffDetailBody({ panel }: { panel: StaffDetailPanel }) {
  return (
    <>
      <DetailPanelHeader eyebrow={panel.eyebrow} />

      <div className="flex w-full items-center gap-2.5">
        <Avatar initials={panel.iniciales} className="h-[46px] w-[46px] [&_span]:text-[15px]" />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="truncate font-[Inter] text-[15px] font-semibold text-(--color-text-primary)">
              {panel.name}
            </span>
            <Badge tone={panel.state === "Activo" ? "Positivo" : "Advertencia"} label={panel.state} />
          </div>
          <span className="truncate font-[Inter] text-[11px] leading-4 text-(--color-text-secondary)">
            {panel.roleLine}
          </span>
          <span className="truncate font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
            {panel.contactLine}
          </span>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Secciones de la ficha"
        className="flex w-full items-end gap-0.5 border-b border-(--color-border-subtle)"
      >
        {panel.tabs.map((tab) => (
          <DetailTab key={tab} label={tab} selected={tab === panel.activeTab} />
        ))}
      </div>

      <DetailGrid block={panel.personal} />
      <div className="h-px w-full shrink-0 bg-(--color-border-subtle)" />
      <DetailGrid block={panel.work} compact />
      <div className="h-px w-full shrink-0 bg-(--color-border-subtle)" />

      <div className="flex w-full flex-col gap-1.5">
        <div className="flex w-full items-center gap-2">
          <h3 className="min-w-0 flex-1 truncate font-[Inter] text-[12px] font-semibold text-(--color-text-primary)">
            {panel.documents.title}
          </h3>
          <span className="shrink-0 font-[Inter] text-[10px] leading-3 text-(--color-text-secondary)">
            {panel.documents.progressLabel}
          </span>
        </div>

        {panel.documents.items.map((item) => (
          <div key={item.label} data-document={item.label} className="flex w-full items-center gap-2">
            <IconifyIcon
              icon="lucide:check-circle-2"
              aria-hidden="true"
              className="h-[13px] w-[13px] shrink-0 text-(--color-text-success)"
            />
            <span className="min-w-0 flex-1 truncate font-[Inter] text-[11px] leading-4 text-(--color-text-primary)">
              {item.label}
            </span>
            <Badge tone="Positivo" label={item.status} />
          </div>
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex w-full gap-2">
        <Button style="Secondary" label={panel.actions.secondary} />
        <Button style="Primary" label={panel.actions.primary} />
      </div>
    </>
  );
}

/** Personal screen of the RRHH module: header actions, KPI row, staff list and detail. */
export function Personal({ data = personal, onNavSelect }: PersonalProps) {
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
          line box is pinned to the export's 13px so the block closes at 44px. */}
      <PageHeader
        breadcrumb={data.header.breadcrumb}
        title={data.header.title}
        showSubtitle={false}
        className="w-full! [&_span]:leading-[13px]"
        actions={
          <>
            <Button style="Secondary" label={data.header.actions.secondary} />
            <Button style="Primary" label={data.header.actions.primary} />
          </>
        }
      />

      <div data-kpi-row="" className="grid h-[110px] w-full grid-cols-4 gap-3">
        {data.kpis.map((card) => (
          <KpiCard key={card.title} card={card} />
        ))}
      </div>

      <div data-personal-body="" className="grid min-h-0 w-full flex-1 grid-cols-[690px_450px] gap-3">
        <PanelShell label={data.list.title} className="h-full">
          <StaffListBody panel={data.list} />
        </PanelShell>

        <PanelShell label={data.detail.eyebrow} className="h-full">
          <StaffDetailBody panel={data.detail} />
        </PanelShell>
      </div>
    </DashboardLayout>
  );
}
