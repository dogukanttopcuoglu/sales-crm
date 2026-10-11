import Image from "next/image";
import type { ReactNode } from "react";
import frameMetrics from "./frame-metrics.json";
export function Icon({ name, className = "h-[18px] w-[18px]" }: { name: string; className?: string }) {
  return <Image src={`/crm/${name}.svg`} width={18} height={18} alt="" aria-hidden className={`shrink-0 object-contain ${className}`} />;
}
export function Panel({ children, className = "", label }: { children: ReactNode; className?: string; label: string }) {
  return <section aria-label={label} className={`crm-card-panel min-w-0 border border-line ${className}`}>{children}</section>;
}
export function Metric({ label, value, caption, captionX, captionColor }: { label: string; value: string; caption: string; captionX?: number; captionColor?:string }) {
  const source = Object.values(frameMetrics).flat().find(metric => metric.label === label && metric.value === value);
  const captionPosition = captionX ?? source?.captionX ?? (value.length < 4 ? 42 : 110);
  return <div className="crm-card-metric h-crm-size-metric-height min-w-0 px-3 pt-2">
    <div className="text-crm-label leading-[13px] text-crm-palette-c858585">{label}</div>
    <div className="mt-[6px] grid" style={{gridTemplateColumns:`${captionPosition - 12}px minmax(0,1fr)`}}><span className="whitespace-nowrap text-crm-metric font-medium leading-[28.07px]">{value}</span><span style={{color:captionColor??source?.captionColor}} className="mt-3 whitespace-nowrap text-crm-caption leading-3 text-crm-palette-c858585">{caption}</span></div>
  </div>;
}
export function FrameMetrics({route, valueOverrides}: {route:keyof typeof frameMetrics; valueOverrides?:Record<string,string>}) {
 return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{frameMetrics[route].map(metric => <Metric key={metric.label} {...metric} value={valueOverrides?.[metric.label] ?? metric.value}/>)}</div>;
}
