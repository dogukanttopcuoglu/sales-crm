"use client";
import { useEffect, useMemo, useState } from "react";
import { ForecastChart, ForecastChartColumn, ForecastOwners } from "./forecast-panels";
import { DesignHeader } from "./design-header";
import { FilterSelect } from "./header";
import { Icon, FrameMetrics, Panel } from "./primitives";
import rows from "./forecast-data.json";

const periods = ["Q4 2026", "Q3 2026", "Q1 2027"] as const;
const pipelines = ["North America", "EMEA Enterprise", "APAC Expansion"] as const;
type Period = (typeof periods)[number];
type Pipeline = (typeof pipelines)[number];

const periodFactors: Record<Period, number> = { "Q4 2026": 1, "Q3 2026": 0.86, "Q1 2027": 1.16 };
const pipelineProfiles: Record<Pipeline, { scale: number; target: number; closedWon: number; owners: string[] }> = {
  "North America": { scale: 1, target: 4_000_000, closedWon: 880_000, owners: ["Alex Santos", "Sarah Nguyen", "Mark Darnalds", "Noah Lee", "Nia Jameson", "Grace Brooks"] },
  "EMEA Enterprise": { scale: 0.82, target: 3_600_000, closedWon: 720_000, owners: ["Sarah Nguyen", "Mark Darnalds", "Grace Brooks"] },
  "APAC Expansion": { scale: 0.68, target: 3_100_000, closedWon: 640_000, owners: ["Alex Santos", "Noah Lee", "Nia Jameson"] },
};
const baseStageValues = [
  { x: 60, open: 1_090_000, weighted: 256_000, name: "Qualified" },
  { x: 205, open: 1_290_000, weighted: 527_000, name: "Discovery" },
  { x: 350, open: 1_250_000, weighted: 749_000, name: "Proposal" },
  { x: 495, open: 1_290_000, weighted: 1_040_000, name: "Negotiation" },
];

function compactMoney(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}M`;
  return `$${Math.round(value / 1_000)}K`;
}
function fullMoney(value: number) { return `$ ${Math.round(value).toLocaleString("en-US")}`; }

export function ForecastPage() {
  const [period, setPeriod] = useState<Period>("Q4 2026");
  const [pipeline, setPipeline] = useState<Pipeline>("North America");
  const [owner, setOwner] = useState("All Owners");
  const profile = pipelineProfiles[pipeline];
  const scale = profile.scale * periodFactors[period];
  const ownerOptions = ["All Owners", ...profile.owners];

  useEffect(() => {
    if (owner !== "All Owners" && !profile.owners.includes(owner)) setOwner("All Owners");
  }, [owner, profile.owners]);

  const forecast = useMemo(() => {
    const openPipeline = 4_930_000 * scale;
    const weightedPipeline = 2_571_901 * scale;
    const closedWon = profile.closedWon * periodFactors[period];
    const projectedRevenue = closedWon + weightedPipeline;
    const target = profile.target * periodFactors[period];
    const attainment = Math.round((projectedRevenue / target) * 1000) / 10;
    const chartColumns: ForecastChartColumn[] = baseStageValues.map((stage) => ({
      x: stage.x,
      low: (stage.open * scale / 1_500_000) * 159,
      high: (stage.weighted * scale / 1_500_000) * 159,
      openLabel: compactMoney(stage.open * scale),
      label: compactMoney(stage.weighted * scale),
      name: stage.name,
    }));
    return { openPipeline, weightedPipeline, closedWon, projectedRevenue, target, attainment, gap: Math.max(target - projectedRevenue, 0), chartColumns };
  }, [period, profile.closedWon, profile.target, scale]);

  const visibleRows = rows.filter((row) => profile.owners.includes(row.text[0]) && (owner === "All Owners" || row.text[0] === owner));
  const ownerTable = <ForecastOwners key={`${pipeline}-${owner}`} footer rows={visibleRows} />;

  return (
    <>
      <DesignHeader title="Forecast" badge="Live" secondary="↥ Export" updated="Updated Oct 10, 2026" action="✓ Submit forecast">
        <FilterSelect label="Period" value={period} options={[...periods]} onChange={(value) => setPeriod(value as Period)} className="w-[171px]" />
        <FilterSelect label="Pipeline" value={pipeline} options={[...pipelines]} onChange={(value) => setPipeline(value as Pipeline)} className="w-[219px]" />
        <FilterSelect label="Owner" value={owner} options={ownerOptions} onChange={setOwner} className="w-[184px]" />
        <span className="ml-3 flex gap-2 text-sm text-secondary"><Icon name="filter" className="h-[9px] w-[17px]" />Filters</span>
        <div className="ml-auto flex h-crm-size-filter-height w-[225px] items-center justify-around rounded-crm-control border border-line bg-control text-crm-table text-crm-text-caption"><span className="rounded bg-crm-palette-c353535 px-7 py-1 text-crm-text-primary">Overview</span><span>By owner</span></div>
      </DesignHeader>
      <main className="crm-page-content p-5">
        <FrameMetrics route="forecast" valueOverrides={{ "Projected revenue": compactMoney(forecast.projectedRevenue), "Closed won": compactMoney(forecast.closedWon), "Weighted pipeline": compactMoney(forecast.weightedPipeline), "Open pipeline": compactMoney(forecast.openPipeline) }} />
        {owner !== "All Owners" && <div className="mt-[18px]">{ownerTable}</div>}
        <div className="crm-split-grid mt-[18px] grid gap-5 xl:grid-cols-[minmax(0,724fr)_minmax(0,368fr)]">
          <ForecastChart columns={forecast.chartColumns} />
          <Panel label="Quarter target" className="h-[308px] px-[19px] pt-[17px]">
            <div className="flex justify-between"><h2 className="text-base font-semibold">Quarter target</h2><Icon name="target" /></div>
            <div className="mt-3 text-crm-target font-medium leading-[34px]">{fullMoney(forecast.target)}</div>
            <p className="mt-[5px] text-xs text-crm-text-caption">{period} · {pipeline} revenue target</p>
            <div className="mt-[25px] flex h-[10px] overflow-hidden rounded-crm-full bg-crm-palette-c373737"><span className="w-[22%] bg-crm-status-commit" /><span className="bg-crm-primary" style={{ width: `${Math.min(forecast.attainment, 78)}%` }} /></div>
            <div className="mt-3 flex justify-between gap-2 text-crm-label"><span className="text-crm-primary">{forecast.attainment}% expected attainment</span><span className="text-muted">{Math.max(100 - forecast.attainment, 0).toFixed(1)}% remaining</span></div>
            <dl className="mt-4 flex flex-col gap-[15px] border-t border-line pt-3 text-crm-table">{[["Closed won", fullMoney(forecast.closedWon), "var(--crm-color-status-commit)"], ["Weighted pipeline", fullMoney(forecast.weightedPipeline), "var(--crm-color-primary)"], ["Gap to target", fullMoney(forecast.gap), "var(--crm-color-palette-c6b6b6b)"]].map(([label, value, color]) => <div key={label} className="flex justify-between"><dt className="text-muted"><span style={{ color }}>●</span> {label}</dt><dd>{value}</dd></div>)}</dl>
          </Panel>
        </div>
        {owner === "All Owners" && <div className="mt-5">{ownerTable}</div>}
      </main>
    </>
  );
}
