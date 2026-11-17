import type { ComponentProps } from "react";
import { Icon as IconifyIcon } from "@iconify/react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";

export type DateRangePickerProps = 
  ComponentProps<typeof CollapsiblePrimitive.Root> &
  { label?: string };

export function DateRangePicker(
  { label = "10 – 20 Mar 2025", ...props }: DateRangePickerProps
) {
  return <CollapsiblePrimitive.Root {...props} className={[
    "group/date-range-picker flex relative flex-col items-start gap-(--spacing-stack-sm) w-fit box-border",
    props.className
  ].filter(Boolean).join(" ")}>
    <CollapsiblePrimitive.Trigger className="flex m-0 p-0 justify-between items-center gap-(--spacing-stack-md) w-46 h-(--component-input-height) [text-align:inherit] text-inherit bg-(--color-bg-surface) [border:var(--border-width-default)_solid_var(--color-border-subtle)] bg-none [font:inherit] cursor-pointer px-[var(--component-input-padding-x)] box-border rounded-[var(--radius-pill)] group-not-data-disabled/date-range-picker:group-hover/date-range-picker:bg-(--color-bg-sunken) group-focus-visible/date-range-picker:[border:var(--border-width-focus-2)_solid_var(--color-border-focus)] group-data-[state=Open]/date-range-picker:bg-(--color-bg-raised) group-data-[state=Open]/date-range-picker:[border:var(--border-width-focus-2)_solid_var(--color-border-focus)] group-data-disabled/date-range-picker:bg-(--color-bg-sunken)">
      <IconifyIcon icon="lucide:calendar" className="relative overflow-visible w-4 h-4 text-[#17233A] box-border group-data-disabled/date-range-picker:text-[#5A645E]" />
      <span className="w-30 text-(length:--type-body-size) font-semibold leading-5 text-(--color-text-primary) box-border grow font-[Inter] whitespace-pre-wrap group-data-disabled/date-range-picker:text-(--color-text-secondary)">{label}</span>
      <IconifyIcon icon="lucide:chevron-up" className="hidden relative overflow-visible w-4 h-4 text-[#17233A] box-border group-data-[state=Open]/date-range-picker:[display:revert]" />
      <IconifyIcon icon="lucide:chevron-down" className="relative overflow-visible w-4 h-4 text-[#17233A] box-border group-data-[state=Open]/date-range-picker:hidden group-data-disabled/date-range-picker:text-[#5A645E]" />
    </CollapsiblePrimitive.Trigger>
    <CollapsiblePrimitive.Content className="hidden p-(--spacing-inset-md) flex-col items-start gap-(--spacing-stack-sm) w-73 bg-(--color-bg-raised) [border:var(--border-width-default)_solid_var(--color-border-subtle)] box-border rounded-[var(--radius-surface)] group-data-[state=Open]/date-range-picker:flex">
      <div className="hidden p-(--spacing-stack-sm) justify-between items-center self-stretch group-data-[state=Open]/date-range-picker:flex">
        <IconifyIcon icon="lucide:chevron-left" className="hidden relative overflow-visible w-4 h-4 text-[#5A645E] box-border group-data-[state=Open]/date-range-picker:[display:revert]" />
        <span className="hidden text-(length:--type-label-size) font-semibold leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">Marzo 2025</span>
        <IconifyIcon icon="lucide:chevron-right" className="hidden relative overflow-visible w-4 h-4 text-[#5A645E] box-border group-data-[state=Open]/date-range-picker:[display:revert]" />
      </div>
      <div className="hidden relative self-stretch h-6 box-border group-data-[state=Open]/date-range-picker:[display:revert]">
        <div className="hidden absolute top-0 left-0 justify-center items-center w-9 h-6 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-medium leading-[18px] text-(--color-text-muted) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">L</span>
        </div>
        <div className="hidden absolute top-0 left-9 justify-center items-center w-9 h-6 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-medium leading-[18px] text-(--color-text-muted) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">M</span>
        </div>
        <div className="hidden absolute top-0 left-18 justify-center items-center w-9 h-6 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-medium leading-[18px] text-(--color-text-muted) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">X</span>
        </div>
        <div className="hidden absolute top-0 left-27 justify-center items-center w-9 h-6 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-medium leading-[18px] text-(--color-text-muted) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">J</span>
        </div>
        <div className="hidden absolute top-0 left-36 justify-center items-center w-9 h-6 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-medium leading-[18px] text-(--color-text-muted) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">V</span>
        </div>
        <div className="hidden absolute top-0 left-45 justify-center items-center w-9 h-6 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-medium leading-[18px] text-(--color-text-muted) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">S</span>
        </div>
        <div className="hidden absolute top-0 left-54 justify-center items-center w-9 h-6 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-medium leading-[18px] text-(--color-text-muted) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">D</span>
        </div>
      </div>
      <div className="hidden relative self-stretch h-54 box-border group-data-[state=Open]/date-range-picker:[display:revert]">
        <div className="hidden absolute top-0 left-0 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
        <div className="hidden absolute top-0 left-9 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
        <div className="hidden absolute top-0 left-18 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
        <div className="hidden absolute top-0 left-27 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
        <div className="hidden absolute top-0 left-36 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
        <div className="hidden absolute top-0 left-45 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">1</span>
        </div>
        <div className="hidden absolute top-0 left-54 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">2</span>
        </div>
        <div className="hidden absolute top-9 left-0 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">3</span>
        </div>
        <div className="hidden absolute top-9 left-9 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">4</span>
        </div>
        <div className="hidden absolute top-9 left-18 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">5</span>
        </div>
        <div className="hidden absolute top-9 left-27 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">6</span>
        </div>
        <div className="hidden absolute top-9 left-36 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">7</span>
        </div>
        <div className="hidden absolute top-9 left-45 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">8</span>
        </div>
        <div className="hidden absolute top-9 left-54 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">9</span>
        </div>
        <div className="hidden absolute top-18 left-0 justify-center items-center w-9 h-9 bg-(--color-action-primary) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-semibold leading-[18px] text-(--color-text-on-brand) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">10</span>
        </div>
        <div className="hidden absolute top-18 left-9 justify-center items-center w-9 h-9 bg-(--color-action-primary-subtle) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-action-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">11</span>
        </div>
        <div className="hidden absolute top-18 left-18 justify-center items-center w-9 h-9 bg-(--color-action-primary-subtle) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-action-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">12</span>
        </div>
        <div className="hidden absolute top-18 left-27 justify-center items-center w-9 h-9 bg-(--color-action-primary-subtle) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-action-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">13</span>
        </div>
        <div className="hidden absolute top-18 left-36 justify-center items-center w-9 h-9 bg-(--color-action-primary-subtle) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-action-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">14</span>
        </div>
        <div className="hidden absolute top-18 left-45 justify-center items-center w-9 h-9 bg-(--color-action-primary-subtle) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-action-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">15</span>
        </div>
        <div className="hidden absolute top-18 left-54 justify-center items-center w-9 h-9 bg-(--color-action-primary-subtle) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-action-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">16</span>
        </div>
        <div className="hidden absolute top-27 left-0 justify-center items-center w-9 h-9 bg-(--color-action-primary-subtle) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-action-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">17</span>
        </div>
        <div className="hidden absolute top-27 left-9 justify-center items-center w-9 h-9 bg-(--color-action-primary-subtle) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-action-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">18</span>
        </div>
        <div className="hidden absolute top-27 left-18 justify-center items-center w-9 h-9 bg-(--color-action-primary-subtle) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-action-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">19</span>
        </div>
        <div className="hidden absolute top-27 left-27 justify-center items-center w-9 h-9 bg-(--color-action-primary) box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-semibold leading-[18px] text-(--color-text-on-brand) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">20</span>
        </div>
        <div className="hidden absolute top-27 left-36 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">21</span>
        </div>
        <div className="hidden absolute top-27 left-45 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">22</span>
        </div>
        <div className="hidden absolute top-27 left-54 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">23</span>
        </div>
        <div className="hidden absolute top-36 left-0 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">24</span>
        </div>
        <div className="hidden absolute top-36 left-9 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">25</span>
        </div>
        <div className="hidden absolute top-36 left-18 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">26</span>
        </div>
        <div className="hidden absolute top-36 left-27 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">27</span>
        </div>
        <div className="hidden absolute top-36 left-36 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">28</span>
        </div>
        <div className="hidden absolute top-36 left-45 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">29</span>
        </div>
        <div className="hidden absolute top-36 left-54 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">30</span>
        </div>
        <div className="hidden absolute top-45 left-0 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex">
          <span className="hidden text-(length:--type-label-size) font-normal leading-[18px] text-(--color-text-primary) font-[Inter] whitespace-pre-wrap group-data-[state=Open]/date-range-picker:[display:revert]">31</span>
        </div>
        <div className="hidden absolute top-45 left-9 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
        <div className="hidden absolute top-45 left-18 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
        <div className="hidden absolute top-45 left-27 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
        <div className="hidden absolute top-45 left-36 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
        <div className="hidden absolute top-45 left-45 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
        <div className="hidden absolute top-45 left-54 justify-center items-center w-9 h-9 box-border group-data-[state=Open]/date-range-picker:flex" />
      </div>
    </CollapsiblePrimitive.Content>
  </CollapsiblePrimitive.Root>;
}
