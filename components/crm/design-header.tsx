"use client";
import type { ReactNode } from "react";
import { FrameTabs } from "./frame-tabs";
import { Icon } from "./primitives";
import headers from "./frame-headers.json";
function ActionLabel({ value, primary = false }: { value: ReactNode; primary?: boolean }) {
 if (typeof value !== "string") return value;
 const icon = /^[＋+]/.test(value) ? "plus-action" : value.startsWith("✓") ? "check" : value.includes("Export") || value === "Import" ? "export" : value === "Calendar" ? "calendar" : value === "Templates" ? "templates" : undefined;
 return <span className="flex items-center justify-center gap-crm-link-icon whitespace-nowrap">{icon && <Icon name={icon} className={`${primary ? "h-[15px] w-[15px]" : "h-[15px] w-[13px]"}`} />}{value.replace(/^[＋+✓↥]\s*/, "")}</span>;
}
export function DesignHeader({title,badge,action,children,secondary,updated,badgeColor="var(--crm-color-palette-c26b99f)",badgeBackground="var(--crm-color-palette-c2b2b2b)"}: {title:string;badge?:string;action?:ReactNode;secondary?:ReactNode;updated?:string;badgeColor?:string;badgeBackground?:string;children:ReactNode}) {
 const source = headers[title as keyof typeof headers];
 const badgeStyle = source?.badge;
 return <header className="border-b border-crm-surface-selected"><div className="flex h-[77px] items-start justify-between gap-2 px-5 pt-5"><div className="flex items-center pt-[6px]" style={{gap:badgeStyle?.gap ?? 16}}><h1 className="text-xl font-medium leading-[24px] text-crm-text-heading">{title}</h1>{badge&&<span style={{background:badgeBackground, width:badgeStyle?.width, height:badgeStyle?.height ?? 24, color:badgeStyle?.textColor, fontSize:badgeStyle?.fontSize ?? 14}} className="hidden sm:flex items-center justify-center gap-[5px] rounded-crm-full px-[7px] leading-[17px]">{(badgeStyle?.dot ?? true)&&<span style={{background:badgeColor,width:badgeStyle?.dotSize??6,height:badgeStyle?.dotSize??6}} className=" shrink-0 rounded-crm-full"/>}{badge}</span>}</div><div className="flex items-center" style={{gap:source?.actionGap ?? 12}}>{updated&&<span style={{marginRight:source && "updatedGap" in source ? Math.max(0,(source.updatedGap??40)-(source.actionGap??12)):28}} className="hidden text-xs leading-[15px] text-crm-text-caption xl:block">{updated}</span>}{secondary&&<button style={{width:source && "secondaryWidth" in source ? source.secondaryWidth : undefined}} disabled className="crm-hit-target hidden h-9 rounded-crm-control border border-line bg-control sm:block px-[14px] text-sm text-secondary"><ActionLabel value={secondary}/></button>}{action&&<button style={{width:source?.primaryWidth}} disabled className="crm-hit-target h-9 shrink-0 rounded-crm-control bg-crm-primary px-[10px] text-sm font-semibold text-crm-on-primary"><ActionLabel value={action} primary/></button>}</div></div><FrameTabs title={title}/><div className="crm-toolbar flex min-h-[68px] flex-wrap items-center gap-crm-icon-gap px-5 py-4 xl:py-0">{children}</div></header>;
}


