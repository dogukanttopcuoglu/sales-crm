import {Panel,Icon} from "./primitives";
import {Badge} from "./data-table";

export function TargetPanel({values,status,height=324,showSubtitle=true}: {values:string[];status:string;height?:number;showSubtitle?:boolean}){
 const risk=status==="At risk";
 return <Panel label={values[0]} className="px-[19px] pt-[17px]"><div style={{minHeight:height-20}}>
  <div className="flex items-start justify-between"><div><h2 className="text-base font-semibold leading-[19.05px]">{values[0]}</h2>{showSubtitle&&<p className="mt-[7px] text-xs leading-[15px] text-crm-text-caption">{values[1]}</p>}</div><Badge width={risk?53.39:63.62} height={23} fontSize={10} color={risk?"var(--crm-color-palette-cd0ad7c)":"var(--crm-color-palette-c80b9a2)"} background={risk?"var(--crm-color-palette-c332d23)":"var(--crm-color-palette-c24322d)"}>• {status}</Badge></div>
  <p className="mt-[19px] text-crm-target-hero font-medium leading-[41px]">{values[2]}</p>
  <div className="mt-[17px] h-[7px] rounded-crm-full bg-crm-palette-c333333"><div className="h-full rounded-crm-full bg-crm-primary" style={{width:Math.min(parseFloat(values[2]),100)+"%"}}/></div>
  <div className="mt-3 flex justify-between text-crm-label leading-[13px]"><span className="text-secondary">{values[3]}</span><span className="text-crm-text-caption">{values[4]}</span></div>
  <div className="mt-[21px] grid grid-cols-2 border-t border-line pt-[18px]"><div><p className="text-crm-display font-medium leading-[27px]">{values[5]}</p><p className="mt-[5px] text-crm-label leading-[13px] text-crm-text-caption">{values[6]}</p></div><div className="text-right"><p className="text-crm-display font-medium leading-[27px]">{values[7]}</p><p className="mt-[5px] text-crm-label leading-[13px] text-crm-text-caption">{values[8]}</p></div></div>
 </div></Panel>;
}
export function PriorityPanel({title,caption,rows,height=324}: {title:string;caption:string;rows:string[][];height?:number}){
 return <Panel label={title} className="overflow-hidden"><div style={{minHeight:height-2}}>
  <div className="flex h-[76px] items-start justify-between px-[19px] pt-[17px]"><div><h2 className="text-base font-semibold leading-[19.05px]">{title}</h2><p className="mt-[6px] text-xs leading-[15px] text-crm-text-caption">{caption}</p></div><Icon name="external-arrow" className="mt-1 h-[14px] w-[14px]"/></div>
  {rows.map((r,i)=><div key={i} className="grid min-h-[63px] grid-cols-[minmax(0,245fr)_minmax(0,160fr)_minmax(0,279fr)] items-start border-b border-crm-palette-c2b2b2b px-[19px] pt-[10px]">
   <div><p className="text-sm leading-[17px]">{r[0]}</p><p className="mt-[6px] text-crm-label leading-[13px] text-crm-text-caption">{r[1]}</p></div>
   <div className="max-w-[119px] text-right"><p className={r[2].startsWith("$")?"text-sm leading-[17px]":"text-crm-label leading-[17px] text-crm-success"}>{r[2]}</p><p className="mt-[6px] text-crm-caption leading-[13px] text-crm-text-caption">{r[3]}</p></div>
   <div className="flex justify-between gap-2"><div><p className="text-xs leading-[15px] text-secondary">{r[4]}</p><p className={`mt-2 text-crm-caption leading-3 ${r[5]==="Today"?"text-crm-primary":"text-crm-text-caption"}`}>{r[5]}</p></div><Icon name="caret-right" className="mr-[7px] mt-[14px] h-[10px] w-[6px]"/></div>
  </div>)}
 </div></Panel>;
}
