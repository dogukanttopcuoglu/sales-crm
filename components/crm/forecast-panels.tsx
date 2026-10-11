import Link from "next/link";
import {Panel,Icon} from "./primitives";
import {Avatar,Badge,Progress,DataTable} from "./data-table";

export type ForecastChartColumn = {x:number; low:number; high:number; label:string; name:string; openLabel?:string};

export function ForecastChart({monthly=false,columns:customColumns}: {monthly?:boolean; columns?:ForecastChartColumn[]}) {
 const title=monthly?"Monthly forecast":"Pipeline by stage";
 const columns=customColumns ?? (monthly?[
  {x:114,low:52.8,high:35.2,label:"$0.80M",name:"January"},
  {x:300,low:67.1,high:47.3,label:"$1.04M",name:"February"},
  {x:486,low:80.3,high:60.5,label:"$1.28M",name:"March"},
 ]:[
  {x:60,low:115.51,high:27.11,openLabel:"$1.09M",label:"$256K",name:"Qualified"},
  {x:205,low:136.89,high:55.86,openLabel:"$1.29M",label:"$527K",name:"Discovery"},
  {x:350,low:132.98,high:79.45,openLabel:"$1.25M",label:"$749K",name:"Proposal"},
  {x:495,low:137.04,high:110.21,openLabel:"$1.29M",label:"$1.04M",name:"Negotiation"},
 ]);
 const baseline=monthly?170:166, step=monthly?55:53;
 const x=(value:number)=>value/636*100+"%";
 const width=(value:number)=>value/636*100+"%";
 return <Panel label={title} className="h-[308px] px-[19px] pt-[17px]">
  <div className="flex items-center justify-between gap-2"><h2 className="text-base font-semibold leading-[19px]">{title}</h2><div className="flex gap-4 text-crm-caption leading-3 text-muted">{(monthly?["Commit","Best case"]:["Open pipeline","Weighted forecast"]).map((label,i)=><span key={label} className="flex items-center gap-[6px]"><span className="h-2 w-2 shrink-0 rounded-crm-full" style={{background:monthly?(i?"var(--crm-color-chart-forecast)":"var(--crm-color-status-commit)"):(i?"var(--crm-color-status-commit)":"var(--crm-color-palette-c4a4a4a)")}}/>{label}</span>)}</div></div>
  <p className="mt-[7px] text-xs leading-[15px] text-crm-text-caption">{monthly?"Expected revenue by close month":"Open pipeline and probability-weighted value"}</p>
  <div className="grid grid-cols-[48px_minmax(0,1fr)]" style={{marginTop:monthly?22:19}}>
   <svg width="48" height="210" aria-hidden>{["$1.5M","$1M","$500K","$0"].map((label,i)=><text key={label} x="0" y={i*step} dominantBaseline="text-before-edge" fontSize={monthly?10:11} fill="var(--crm-color-text-caption)">{label}</text>)}</svg>
    <svg width="100%" height="210" role="img" aria-label={`${title}: ${columns.map(column=>`${column.name} open pipeline ${monthly?column.label:column.openLabel ?? column.label}, weighted forecast ${column.label}`).join(", ")}`}>
    {[0,1,2,3].map(i=><line key={i} x1="0" x2="100%" y1={monthly?5+i*step:7+i*step} y2={monthly?5+i*step:7+i*step} stroke="var(--crm-color-outline)"/>)}
    {columns.map((column,i)=><g key={column.name}>
     {monthly?<><rect x={x(column.x-34)} y={baseline-column.low} width={width(68)} height={column.low} rx="2" fill="var(--crm-color-status-commit)"/><rect x={x(column.x-34)} y={baseline-column.low-column.high} width={width(68)} height={column.high} rx="2" fill="var(--crm-color-chart-forecast)"/><text x={x(column.x)} y={baseline-column.low-column.high-(i?23:18)} dominantBaseline="text-before-edge" textAnchor="middle" fontSize="11" fill="var(--crm-color-text-primary)">{column.label}</text></>:<><rect x={x(column.x)} y={baseline-column.low} width={width(32)} height={column.low} rx="3" fill="var(--crm-color-palette-c4a4a4a)"/><rect x={x(column.x+39)} y={baseline-column.high} width={width(32)} height={column.high} rx="3" fill="var(--crm-color-status-commit)"/><text x={x(column.x+16)} y={Math.max(2,baseline-column.low-20)} dominantBaseline="text-before-edge" textAnchor="middle" fontSize="11" fill="var(--crm-color-text-caption)">{column.openLabel}</text><text x={x(column.x+55)} y={baseline-column.high-20} dominantBaseline="text-before-edge" textAnchor="middle" fontSize="11" fill="var(--crm-color-palette-c94c6b3)">{column.label}</text></>}
     <text x={x(column.x+(monthly?0:36))} y={monthly?188:183} dominantBaseline="text-before-edge" textAnchor="middle" fontSize={monthly?12:11} fill="var(--crm-color-palette-c999999)">{column.name}</text>
    </g>)}
   </svg>
  </div>
 </Panel>;
}
export function ForecastOwners({rows,footer=false}: {rows:{text:string[];avatar:string}[];footer?:boolean}) {
 return <DataTable title="Forecast by owner" titleHeight={49} height={336} minWidth={1110} cellInset={23} footerHeight={0}
  headers={["Owner","Open pipeline","Win probability","Weighted forecast","Forecast category",""]}
  widths={[270,186,154,250,186,64].map(width=>width/1110*100)} contentWidths={[undefined,130,undefined,170,undefined,undefined]} alignments={["left","right","left","right","left","left"]}
  rows={rows.map(row=>[<div key="owner" className="flex items-center gap-[11px]"><Avatar src={row.avatar}/><div><p className="text-crm-table leading-4 text-crm-palette-cd3d3d3">{row.text[0]}</p><p className="mt-[3px] text-crm-caption leading-3 text-crm-text-caption">{row.text[1]}</p></div></div>,row.text[2],<Progress key="progress" value={row.text[3]}/>,<span key="value" className="text-sm text-crm-text-primary">{row.text[4]}</span>,<Badge key="category" color={row.text[5]==="Commit"?"var(--crm-color-palette-c9cc9b4)":"var(--crm-color-palette-cb7a6d5)"} background={row.text[5]==="Commit"?"var(--crm-color-palette-c1e352b)":"var(--crm-color-palette-c2c253b)"}>{row.text[5]}</Badge>,<Icon key="dots" name="dots" className="h-[3px] w-4"/>])}
  action={<Link href="/strategic-aes" className="crm-hit-target inline-flex min-h-11 items-center gap-[7px]">View all owners<Icon name="external-arrow" className="h-[10px] w-[10px]"/></Link>}
  footer={undefined}/>
}
