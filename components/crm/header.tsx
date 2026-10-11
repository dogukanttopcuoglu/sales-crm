"use client";
import { Select } from "@base-ui/react/select";
import { Icon } from "./primitives";
import { FrameTabs } from "./frame-tabs";
import { usePathname } from "next/navigation";
import { crmRoutes } from "./routes";
import headers from "./frame-headers.json";
function useHeaderSource() {
 const pathname = usePathname();
 const title = crmRoutes.find(route => route.slug === (pathname === "/" ? "emea-enterprise" : pathname.split("/")[1]))?.title;
 return title ? headers[title as keyof typeof headers] : undefined;
}

export function FilterSelect({ label, value, options, onChange, className = "" }: { label: string; value: string; options: string[]; onChange: (value: string) => void; className?: string }) {
  const source = useHeaderSource();
  const width = source?.filters[label as keyof typeof source.filters];
  return <Select.Root value={value} onValueChange={v => { if (v) onChange(v); }}>
    <Select.Trigger aria-label={label} style={{width}} className={`crm-input-filter crm-hit-target rounded-crm-control flex h-crm-size-filter-height shrink-0 items-center gap-crm-icon-gap whitespace-nowrap border border-crm-outline-control px-3 text-crm-control leading-[17px] text-secondary ${className}`}>
      <span className="shrink-0 text-crm-palette-c737373">{label}</span><Select.Value className="min-w-0 truncate font-normal text-secondary" /><Select.Icon data-slot="filter-caret" className="ml-auto flex h-4 w-2 shrink-0 items-center justify-center"><Icon name="caret-right" className="h-[9px] w-[5px] rotate-90" /></Select.Icon>
    </Select.Trigger>
    <Select.Portal><Select.Positioner side="bottom" align="start" sideOffset={5} alignItemWithTrigger={false} className="z-30"><Select.Popup className="min-w-[180px] rounded-crm-control border border-line bg-control p-1 shadow-lg">
      {[...new Set(options)].map(option => <Select.Item key={option} value={option} className="select-item flex min-h-11 cursor-pointer items-center rounded px-3 py-2 text-crm-table outline-none"><Select.ItemText>{option}</Select.ItemText></Select.Item>)}
    </Select.Popup></Select.Positioner></Select.Portal>
  </Select.Root>;
}

export function PageHeader({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return <header className="border-b border-crm-outline-variant">
    <div className="flex h-[77px] items-start justify-between gap-3 px-5 pt-5">
      <div className="flex items-center gap-[21px] pt-[6px]"><h1 className="text-crm-page font-medium leading-[25px] text-crm-text-heading">{title}</h1><span className="h-2 w-2 rounded-crm-full" style={{background:color}} /></div>
      <button disabled title="Deal creation will be implemented in a later task" className="flex h-9 w-[116px] shrink-0 items-center justify-center gap-crm-link-icon rounded-crm-control bg-crm-primary text-crm-control font-semibold text-crm-on-primary"><Icon name="plus-action" className="h-[15px] w-[15px]"/>New deal</button>
    </div>
    <FrameTabs title={title}/>
    {children}
  </header>;
}

export function SearchInput({ value, onChange, placeholder="Search opportunities" }: { value: string; onChange: (value: string) => void; placeholder?:string }) {
  const source = useHeaderSource();
  return <label style={{"--crm-search-width":`${source?.filters[placeholder as keyof typeof source.filters] ?? 225}px`} as React.CSSProperties} className="crm-hit-target flex h-crm-size-filter-height w-[37px] items-center justify-center gap-2 rounded-crm-control border border-line bg-crm-surface-input px-0 sm:ml-auto sm:w-[var(--crm-search-width)] sm:justify-start sm:px-3">
    <Icon name="search" className="h-4 w-4 shrink-0" /><input aria-label={placeholder} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="hidden min-w-0 w-full bg-transparent text-crm-section text-secondary outline-none placeholder:text-crm-palette-c737373 lg:text-crm-control sm:block" />
  </label>;
}
