"use client";
import { useState } from "react";
import { FilterSelect, PageHeader, SearchInput } from "./header";
import { Icon, FrameMetrics, Panel } from "./primitives";

const emeaStages = [
  { name: "Qualified", deals: 3, value: "$680K", share: "17.7%", color: "var(--crm-color-stage-qualified)", weight: 119.53 },
  { name: "Discovery", deals: 3, value: "$940K", share: "24.5%", color: "var(--crm-color-info)", weight: 165.23 },
  { name: "Proposal", deals: 4, value: "$1.30M", share: "33.9%", color: "var(--crm-color-stage-proposal)", weight: 228.52 },
  { name: "Negotiation", deals: 2, value: "$920K", share: "24.0%", color: "var(--crm-color-stage-negotiation)", weight: 161.72 },
];
const emeaOpportunities = [
  { company: "LVMH", description: "Global rollout", stage: "Proposal", value: "$420,000", owner: "Sarah Jenkins", close: "Oct 24", probability: 65 },
  { company: "SAP", description: "Enterprise platform", stage: "Negotiation", value: "$510,000", owner: "Mark Daniels", close: "Oct 30", probability: 85 },
  { company: "Siemens", description: "Regional expansion", stage: "Negotiation", value: "$410,000", owner: "Grace Brooks", close: "Nov 08", probability: 75 },
  { company: "Spotify", description: "Land & expand", stage: "Proposal", value: "$170,991", owner: "Hannah Lee", close: "Nov 14", probability: 60 },
  { company: "Adyen", description: "Revenue operations", stage: "Discovery", value: "$320,000", owner: "Alex Santos", close: "Nov 20", probability: 45 },
  { company: "Revolut", description: "Sales transformation", stage: "Proposal", value: "$380,000", owner: "James Taylor", close: "Nov 27", probability: 55 },
  { company: "Miro", description: "Enterprise seats", stage: "Qualified", value: "$240,000", owner: "Noah Reed", close: "Dec 05", probability: 25 },
];
export type PipelineData = {
  title:string; color:string; metrics:string[][]; openCount:string;
  stages:typeof emeaStages; opportunities:typeof emeaOpportunities;
  target:{status:string;value:string;attainment:number;closed:string;remaining:string};
};
const emeaData:PipelineData = {
  title:"EMEA Enterprise",color:"var(--crm-color-region-emea)",openCount:"12 open opportunities",
  stages:emeaStages,opportunities:emeaOpportunities,
  metrics:[["Open pipeline","$3.84M","12 opportunities"],["Weighted forecast","$2.11M","54.9% of pipeline"],["Closed revenue","$1.24M","68.9% of $1.8M target"],["Win rate","34.8%","+2.6 pts this quarter"]],
  target:{status:"At risk",value:"$1,800,000",attainment:68.9,closed:"$1,240,000",remaining:"$560,000"},
};
function PipelineStages({stages,openCount}: Pick<PipelineData,"stages"|"openCount">) {
  return <Panel label="Pipeline by stage" className="h-[260px] px-crm-panel-inset pt-crm-panel-content-top">
    <div className="flex h-5 items-center justify-between gap-3"><h2 className="text-crm-section font-medium leading-5">Pipeline by stage</h2><span className="text-crm-label text-crm-text-caption">{openCount}</span></div>
    <div aria-label="Pipeline stage shares" className="mt-5 flex h-[10px] gap-[3px]">{stages.map(stage => <div key={stage.name} className="rounded-crm-full" style={{background:stage.color, flex:stage.weight}} />)}</div>
    <table className="mt-[13px] w-full table-fixed border-collapse"><colgroup><col style={{width:"40%"}}/><col style={{width:"9%"}}/><col style={{width:"27.5%"}}/><col style={{width:"23.5%"}}/></colgroup>
      <thead><tr className="h-[27px] text-crm-caption font-medium text-crm-text-caption"><th className="text-left font-medium">Stage</th><th className="text-right font-medium">Deals</th><th className="text-right font-medium">Pipeline value</th><th className="text-right font-medium">Share</th></tr></thead>
      <tbody>{stages.map(stage => <tr key={stage.name} className="h-[33px] border-b border-crm-palette-c2b2b2b text-crm-link last:border-0"><td className="font-medium text-secondary"><span className="mr-[10px] inline-block h-[6px] w-[6px] rounded-crm-full" style={{background:stage.color}} />{stage.name}</td><td className="text-right text-crm-palette-c999999">{stage.deals}</td><td className="text-right text-crm-table font-medium">{stage.value}</td><td className="text-right text-crm-palette-c999999">{stage.share}</td></tr>)}</tbody>
    </table>
  </Panel>;
}
function QuarterTarget({target}: Pick<PipelineData,"target">) {
  return <Panel label="Quarter target" className="h-[260px] px-crm-panel-inset pt-crm-panel-content-top">
    <div className="flex h-[22px] items-center justify-between"><h2 className="text-crm-section font-medium">Quarter target</h2><span className={`flex h-[22px] w-16 items-center justify-center rounded-crm-full text-crm-label ${target.status==="At risk"?"bg-crm-primary-container text-crm-warning":"bg-crm-success-container text-crm-success"}`}>{target.status}</span></div>
    <div className="mt-[14px] text-crm-target font-medium leading-[35px]">{target.value}</div><div className="mt-[3px] text-crm-link leading-[15px] text-muted">{target.attainment}% attained</div>
    <div role="progressbar" aria-label="Quarter target attained" aria-valuenow={target.attainment} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-[7px] rounded-crm-full bg-line"><div className="h-full rounded-crm-full bg-crm-chart-forecast" style={{width:target.attainment+"%"}} /></div>
    <dl className="mt-[22px] grid grid-cols-2 gap-y-[14px] text-crm-link leading-4 text-muted">{[["Closed revenue", target.closed], ["Remaining", target.remaining], ["Period", "Q4 2026"]].map(([label,value]) => <div key={label} className="contents"><dt>{label}</dt><dd className="text-right text-crm-table font-medium text-crm-icon-selected">{value}</dd></div>)}</dl>
  </Panel>;
}
export function EmeaOverview({data=emeaData}: {data?:PipelineData}) {
  const {stages,opportunities}=data;
  const [owner, setOwner] = useState("All owners");
  const [date, setDate] = useState("This quarter");
  const [stage, setStage] = useState("All stages");
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const visible = opportunities.filter(deal => (owner === "All owners" || deal.owner === owner) && (stage === "All stages" || deal.stage === stage) && (date !== "This month" || deal.close.startsWith("Oct")) && `${deal.company} ${deal.description} ${deal.owner}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="w-full">
    <PageHeader title={data.title} color={data.color}>
      <div className="crm-toolbar flex min-h-[68px] flex-wrap items-center gap-crm-icon-gap px-5 py-4 lg:py-0">
        <FilterSelect label="Owner" value={owner} onChange={setOwner} options={["All owners", ...opportunities.map(d => d.owner)]} className="w-[184px]" />
        <FilterSelect label="Close date" value={date} onChange={setDate} options={["This quarter", "This month", "All dates"]} className="w-[212px]" />
        <button aria-expanded={showFilters} onClick={() => setShowFilters(v => !v)} className="ml-3 flex h-crm-size-filter-height items-center gap-[9px] text-crm-control text-secondary"><Icon name="filter" className="h-[9px] w-[17px]" />Filters</button>
        <SearchInput value={search} onChange={setSearch} />
      </div>
      {showFilters && <div className="flex flex-wrap gap-3 px-5 pb-4"><FilterSelect label="Stage" value={stage} onChange={setStage} options={["All stages", ...stages.map(s => s.name)]} /><button onClick={() => {setOwner("All owners"); setStage("All stages"); setDate("This quarter"); setSearch("");}} className="text-sm text-secondary">Clear filters</button></div>}
    </PageHeader>
    <main className="crm-page-content p-5">
      <FrameMetrics route={data.title==="North America"?"north-america":data.title==="APAC Expansion"?"apac-expansion":"emea-enterprise"}/>
      <div className="crm-split-grid mt-[18px] grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,724fr)_minmax(0,368fr)]"><PipelineStages stages={stages} openCount={data.openCount}/><QuarterTarget target={data.target}/></div>
      <Panel label="Priority opportunities" className="crm-fill-table mt-5 min-h-[424px] overflow-hidden">
        <div className="flex h-[52px] items-center justify-between gap-3 px-crm-panel-inset"><h2 className="text-crm-section font-medium">Priority opportunities</h2><button title="Reset filters to show all reference opportunities" onClick={() => {setSearch(""); setOwner("All owners"); setStage("All stages"); setDate("This quarter");}} className="text-crm-link text-secondary">View all deals&nbsp; →</button></div>
        <div role="region" aria-label="Scrollable opportunities table" tabIndex={0} className="overflow-x-auto">
          <table className="opportunities"><colgroup>{[29.55,14,14.45,17.4,13.7,10.9].map((width,index) => <col key={index} style={{width:`${width}%`}} />)}</colgroup>
            <thead><tr>{["Company / opportunity", "Stage", "Deal value", "Owner", "Close date", "Probability"].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead>
            <tbody>{visible.map(deal => {const color = deal.stage === "Negotiation" ? "var(--crm-color-success)" : deal.stage === "Qualified" ? "var(--crm-color-palette-ca0a0a0)" : stages.find(s => s.name === deal.stage)!.color; return <tr key={deal.company}>
              <td><div className="text-crm-table font-medium leading-4 text-crm-icon-selected">{deal.company}</div><div className="mt-[3px] text-crm-caption leading-[13px] text-crm-text-caption">{deal.description}</div></td>
              <td><span className="flex h-[23px] w-[102px] items-center justify-center rounded-crm-full bg-crm-palette-c282828 text-crm-label" style={{color}}>{deal.stage}</span></td><td><span className="text-crm-table font-medium text-crm-icon-selected">{deal.value}</span></td><td>{deal.owner}</td><td>{deal.close}</td><td><div className="flex items-center gap-crm-icon-gap"><span className="h-1 w-12 rounded-crm-full bg-line"><span className="block h-full rounded-crm-full" style={{width:`${deal.probability}%`, background:color}} /></span><span className="text-crm-label">{deal.probability}%</span></div></td>
            </tr>;})}</tbody>
          </table>
          {visible.length === 0 && <p className="p-5 text-sm text-muted" role="status">No opportunities match your filters.</p>}
        </div>
      </Panel>
    </main>
  </div>;
}
