"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { crmRoutes } from "./routes";
import { Dialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";
import { Icon } from "./primitives";
const groups = [
  { label: "", items: [["Companies", "companies", "241"], ["Deals Board", "deals"], ["Forecast", "forecast", "9"], ["Activities", "activities"], ["Contacts", "contacts", "38"], ["Email Sequences", "email"]] },
  { label: "TEAM", items: [["Strategic AEs", "target"], ["Mid Market", "crosshair"], ["SDR Team", "users"]] },
  { label: "REPORTING", items: [["Q1 Forecast", "forecast"], ["Slipping Deals", "warning"]] },
];
function Sidebar({ onNavigate, collapsed = false, onToggle }: { onNavigate?: () => void; collapsed?: boolean; onToggle?: () => void }) {
  const pathname = usePathname();
  const active = pathname === "/" ? "emea-enterprise" : pathname.split("/")[1];
  const [labelsMounted, setLabelsMounted] = useState(!collapsed);
  useEffect(() => {
    const timer = window.setTimeout(() => setLabelsMounted(!collapsed), 200);
    return () => window.clearTimeout(timer);
  }, [collapsed]);
  return <div className={`crm-sidebar-motion relative flex h-full min-h-0 flex-col overflow-hidden bg-crm-surface-sidebar transition-[width] duration-200 ease-out ${collapsed ? "w-[72px]" : "w-crm-layout-sidebar-width"}`}>
    <div className="flex h-[71px] shrink-0 items-center gap-crm-icon-gap border-b border-crm-palette-c252525 px-crm-navigation-inset">
      <button type="button" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="shrink-0"><Image src="/crm/logo.svg" width={39} height={39} alt="Sales CRM logo" /></button>
      <div className={`shrink-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-out ${collapsed || !labelsMounted ? "max-w-0 opacity-0" : "max-w-[180px] opacity-100"}`}><div className="text-crm-brand font-medium leading-[21px] text-crm-text-heading">Sales CRM</div></div>
    </div>
    <nav aria-label="CRM navigation">
      {groups.map(group => <div key={group.label} className={`border-b border-crm-palette-c252525 px-crm-navigation-inset ${group.label ? "pb-[13px] pt-4" : "pb-3 pt-[14px]"}`}>
        {group.label && <div aria-hidden={collapsed || !labelsMounted} className={`mb-[7px] h-[19px] text-crm-table font-medium leading-[19px] text-crm-text-disabled ${collapsed || !labelsMounted ? "pointer-events-none opacity-0" : ""}`}>{group.label}</div>}
        {group.items.map(([label, icon, count]) => { const route = crmRoutes.find(r => r.title === label)!; return <Link key={label} title={collapsed ? label : undefined} href={`/${route.slug}`} onClick={onNavigate} aria-current={active === route.slug ? "page" : undefined} className={`flex h-crm-size-nav-row w-full items-center gap-crm-icon-gap rounded-crm-panel px-[11px] text-left text-crm-section leading-[19px] ${active === route.slug ? "border border-crm-outline-selected bg-crm-surface-selected font-medium text-crm-text-heading" : "text-crm-palette-c838383 hover:bg-crm-surface-hover"}`}>
          <Icon name={icon} /><span className={`whitespace-nowrap transition-opacity duration-200 ease-out ${collapsed || !labelsMounted ? "opacity-0" : "opacity-100"}`}>{label}</span>{count && <span className={`ml-auto shrink-0 rounded-crm-full bg-crm-outline-divider px-[6px] py-px text-crm-control leading-[17px] text-crm-palette-cb9b9b9 transition-opacity duration-200 ease-out ${collapsed || !labelsMounted ? "opacity-0" : "opacity-100"}`}>{count}</span>}
        </Link>;})}
      </div>)}
      <div className="px-crm-navigation-inset py-4"><div aria-hidden={collapsed || !labelsMounted} className={`mb-2 text-crm-table font-medium leading-4 text-crm-text-disabled ${collapsed || !labelsMounted ? "pointer-events-none opacity-0" : ""}`}>PIPELINES</div>
        {crmRoutes.filter(r => r.color).map(route => <Link title={collapsed ? route.title : undefined} href={`/${route.slug}`} onClick={onNavigate} aria-current={active === route.slug ? "page" : undefined} key={route.slug} className={`flex h-crm-size-nav-row w-full items-center gap-crm-icon-gap rounded-crm-panel pl-3 text-crm-section ${active === route.slug ? "border border-crm-outline-selected bg-crm-surface-selected font-medium text-crm-text-heading" : "text-crm-palette-c838383 hover:bg-crm-surface-hover"}`}><span className="mx-[3.5px] h-[9px] w-[9px] shrink-0 rounded-crm-full" style={{background:route.color}} /><span className={`whitespace-nowrap transition-opacity duration-200 ease-out ${collapsed || !labelsMounted ? "opacity-0" : "opacity-100"}`}>{route.title}</span></Link>)}
      </div>
    </nav>
    <button disabled title={collapsed ? "Invite teammates" : undefined} className="mb-[14px] ml-6 mt-auto flex shrink-0 items-center gap-crm-icon-gap pt-4 text-crm-section leading-[19px] text-crm-text-caption"><Icon name="invite" /><span className={`whitespace-nowrap transition-opacity duration-200 ease-out ${collapsed || !labelsMounted ? "opacity-0" : "opacity-100"}`}>Invite teammates</span></button>
  </div>;
}
export function CrmShell({ children }: { children: ReactNode }) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return <div className={`crm-sidebar-motion min-h-screen transition-[grid-template-columns] duration-200 ease-out lg:grid ${sidebarCollapsed ? "lg:grid-cols-[72px_minmax(0,1fr)]" : "lg:grid-cols-[var(--crm-layout-sidebar-width)_minmax(0,1fr)]"}`}>
    <aside className="sticky top-0 hidden h-dvh max-h-dvh overflow-hidden border-r border-crm-surface-pressed lg:block"><Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(value => !value)} /></aside>
    <div className="crm-workspace min-w-0">
      <div className="flex h-14 items-center border-b border-line px-4 lg:hidden">
        <Dialog.Root open={navigationOpen} onOpenChange={setNavigationOpen}><Dialog.Trigger className="rounded-md border border-line px-3 py-2 text-sm">☰ Navigation</Dialog.Trigger>
          <Dialog.Portal><Dialog.Backdrop className="fixed inset-0 z-40 bg-black/60" /><Dialog.Popup className="fixed inset-y-0 left-0 z-50 w-crm-layout-sidebar-width overflow-y-auto bg-crm-surface-sidebar">
            <Dialog.Title className="sr-only">CRM navigation</Dialog.Title><Dialog.Close aria-label="Close navigation" className="absolute right-2 top-2 z-10 rounded px-2 py-1">×</Dialog.Close><Sidebar onNavigate={() => setNavigationOpen(false)} />
          </Dialog.Popup></Dialog.Portal>
        </Dialog.Root>
      </div>
      {children}
    </div>
  </div>;
}
