import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Panel } from "./primitives";

export function Avatar({src,size=22}: {src:string;size?:number}) {
 return <Image src={`/crm/avatars/${src.replace("Assets/","")}`} width={size} height={size} alt="" className="shrink-0 rounded-crm-full object-cover" style={{width:size,height:size}}/>;
}
export function Badge({children,color="var(--crm-color-success)",background="var(--crm-color-success-container)",width=96,height=24,fontSize=11}: {children:ReactNode;color?:string;background?:string;width?:number;height?:number;fontSize?:number}) {
 const dotStatus=typeof children==="string"?children.startsWith("• "):Array.isArray(children)&&children[0]==="• ";
 const dotLabel=typeof children==="string"?children.slice(2):Array.isArray(children)?children.slice(1):children;
 const content=dotStatus?<span className="inline-flex items-center gap-[4px] leading-none"><span aria-hidden className="text-[10px] leading-none">•</span>{dotLabel}</span>:children;
 return <span className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-crm-full" style={{width,height,fontSize,color,background}}>{content}</span>;
}
export function Progress({value,color="var(--crm-color-status-commit)",width=92,height=6,gap=9}: {value:string;color?:string;width?:number;height?:number;gap?:number}) {
 return <span className="flex items-center text-xs leading-[15px] text-secondary" style={{gap}}><span className="shrink-0 rounded-crm-full bg-crm-palette-c343434" style={{width,height}}><span className="block h-full rounded-crm-full" style={{width:Math.min(parseFloat(value),100)+"%",background:color}}/></span>{value}</span>;
}
type TableProps = {
 title:string;subtitle?:string;headers:string[];rows:ReactNode[][];widths?:number[];height?:number;rowHeight?:number;fillRows?:boolean;
 footer?:ReactNode;action?:ReactNode;headHeight?:number;titleHeight?:number;headFontSize?:number;
 alignments?:("left"|"center"|"right")[];contentWidths?:(number|undefined)[];minWidth?:number;cellInset?:number;footerHeight?:number;
};
export function DataTable({title,subtitle,headers,rows,widths,height,rowHeight=40,fillRows=false,footer,action,headHeight=31,titleHeight,headFontSize=12,alignments,contentWidths,minWidth=680,cellInset=19,footerHeight=40}: TableProps) {
 const content = (cell:ReactNode,index:number) => contentWidths?.[index] ? <div style={{width:contentWidths[index],textAlign:alignments?.[index]}}>{cell}</div> : cell;
 return <Panel label={title} className={`crm-fill-table overflow-hidden ${fillRows ? "crm-schedule-table" : ""}`}><div style={{minHeight:height}}>
  <div className="flex justify-between gap-3 px-[19px]" style={{height:titleHeight??(subtitle?64:51),paddingTop:subtitle?17:16}}>
   <div><h2 className="text-base font-semibold leading-[19.05px]">{title}</h2></div>
   {action&&<div className="pt-1 text-xs leading-[15px] text-secondary">{action}</div>}
  </div>
  <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={`Scrollable ${title} table`}><table style={{minWidth, "--crm-row-count": Math.max(1,rows.length), "--crm-row-height": `${rowHeight}px`, "--crm-table-columns": headers.map((_,i)=>`${widths?.[i]||100/headers.length}fr`).join(" "), "--crm-table-head-height": `${headHeight}px`} as CSSProperties} className={`w-full table-fixed border-collapse ${fillRows ? "crm-fluid-table" : "crm-fixed-table"}`}>
   <colgroup>{headers.map((_,i)=><col key={i} style={{width:`${widths?.[i]||100/headers.length}%`}}/>)}</colgroup>
   <thead><tr style={{height:headHeight,fontSize:headFontSize}} className="bg-control text-left font-normal leading-[15px] text-muted">{headers.map((header,i)=><th style={{paddingInline:cellInset}} className="font-normal" key={i}>{content(header,i)}</th>)}</tr></thead>
   <tbody>{rows.map((row,i)=><tr key={i} style={{height:`calc(${rowHeight}px + var(--crm-row-extra, 0px))`}} className="border-b border-crm-outline-divider text-crm-table leading-4 text-secondary">{row.map((cell,j)=><td key={j} style={{paddingInline:cellInset,textAlign:contentWidths?.[j]?undefined:alignments?.[j]}}>{content(cell,j)}</td>)}</tr>)}</tbody>
  </table></div>
 </div></Panel>;
}
