"use client";
import Image from "next/image";
import { useState } from "react";
import data from "./deals-data.json";
import { DesignHeader } from "./design-header";
import { FilterSelect } from "./header";
import { Icon } from "./primitives";

export function DealsPage() {
  const [owner, setOwner] = useState("All Owners"), [search, setSearch] = useState("");
  const colors = ["var(--crm-color-stage-qualified)", "var(--crm-color-stage-discovery)", "var(--crm-color-stage-proposal)", "var(--crm-color-stage-negotiation)"];
  return <>
    <DesignHeader title="Deals Board" badge="Active" action="+ New deal">
      <FilterSelect label="Pipeline" value="North America" options={["North America"]} onChange={() => {}} className="w-[219px]" />
      <FilterSelect label="Owner" value={owner} options={["All Owners", ...data.flatMap(column => column.cards.map(card => card.text[4]))]} onChange={setOwner} className="w-[184px]" />
      <FilterSelect label="Close date" value="This quarter" options={["This quarter"]} onChange={() => {}} className="w-[215px]" />
      <span className="ml-5 flex items-center gap-2 text-sm text-secondary"><Icon name="filter" className="h-[8.5px] w-[17px]" />Filters</span>
      <label className="flex h-crm-size-filter-height w-[188px] items-center gap-2 rounded-crm-control border border-line bg-crm-surface-input px-[9px] xl:ml-auto">
        <Icon name="search" className="h-[15px] w-[15px]" /><input aria-label="Search deals" placeholder="Search deals" value={search} onChange={event => setSearch(event.target.value)} className="min-w-0 w-full bg-transparent text-crm-table leading-[17px] outline-none placeholder:text-crm-palette-c737373" />
      </label>
      <div aria-label="Board view" className="flex h-crm-size-filter-height w-[102px] shrink-0 items-center gap-1 rounded-crm-control border border-line bg-control p-[3px]">
        <span className="flex h-[29px] w-[46px] items-center justify-center rounded-crm-control bg-crm-palette-c343434"><Icon name="board" className="h-[14.66px] w-4" /></span>
        <span className="flex h-[29px] w-[44px] items-center justify-center"><Icon name="list" className="h-3 w-4" /></span>
      </div>
    </DesignHeader>
    <main className="crm-page-content px-5 pb-[10px] pt-[18px]">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[["Pipeline value", "$ 4,928,471"], ["Weighted forecast", "$ 2,571,901"], ["Open deals", "17"], ["Win probability", "51%"]].map(([label, value]) => <div key={label} className="h-[43px]">
          <div className="text-crm-link leading-[15px] text-crm-text-caption">{label}</div><div className="mt-1 text-xl font-medium leading-6">{value}</div>
        </div>)}
      </div>
      <div className="mt-[15px] grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.map((column, index) => <section key={column.stage} aria-label={column.stage+" deals"} className="min-h-[740px] rounded-crm-control bg-crm-surface-input px-2">
          <div className="h-[62px] px-1 pt-[10px]">
            <div className="flex h-5 items-center gap-crm-link-icon text-sm font-semibold leading-[17px] text-crm-palette-cd7d7d7"><span className="h-2 w-2 rounded-crm-full" style={{ background: colors[index] }} />{column.stage}<span className="ml-[5px] flex h-5 min-w-[22px] items-center justify-center rounded-crm-full bg-crm-outline-divider px-1 text-xs font-normal text-crm-palette-caaaaaa">{column.count}</span><Icon name="dots" className="ml-auto self-start mt-px h-[2.4px] w-4" /></div>
            <div className="mt-[5px] flex items-center justify-between text-xs leading-[15px] text-crm-palette-c7f7f7f">{column.value}<Icon name="plus" className="h-[13px] w-[13px]" /></div>
          </div>
          <div className="flex flex-col gap-crm-icon-gap">
            {column.cards.filter(card => (owner === "All Owners" || card.text[4] === owner) && card.text.join(" ").toLowerCase().includes(search.toLowerCase())).map(card => <article key={card.text[0]} className="h-[126px] rounded-crm-control border border-crm-palette-c353535 bg-crm-surface-deal px-[11px] pt-[11px]">
              <div className="flex items-start justify-between"><h2 className="text-crm-tag font-semibold leading-[18px] text-crm-palette-ce2e2e2">{card.text[0]}</h2><Icon name="dots" className="h-[2.25px] w-[15px]" /></div>
              <div className="mt-[5px] truncate text-crm-label leading-4 text-crm-palette-c848484">{card.text[1]}</div>
              <div className="mt-2 flex items-center justify-between gap-1"><span className="text-xl font-medium leading-6 text-crm-palette-ce5e5e5">{card.text[2]}</span><span className="flex h-[23px] w-[99px] shrink-0 items-center justify-center rounded-crm-full text-crm-label leading-[13px]" style={{ background: card.badge, color: card.color }}>{card.text[3]}</span></div>
              <div className="mt-[10px] grid grid-cols-[minmax(0,1fr)_12px_44px] items-center gap-[11px] border-t border-line pt-2 text-xs leading-[15px] text-crm-palette-ca5a5a5">
                <span className="flex items-center gap-crm-link-icon"><Image src={"/crm/avatars/"+card.avatar.replace("Assets/", "")} alt="" width={16} height={16} className="rounded-crm-full" />{card.text[4]}</span><Icon name="calendar" className="h-[13px] w-3" /><span className={card.text[5] === "Today" ? "text-crm-palette-ce6c75d" : ""}>{card.text[5]}</span>
              </div>
            </article>)}
          </div>
        </section>)}
      </div>
    </main>
  </>;
}
