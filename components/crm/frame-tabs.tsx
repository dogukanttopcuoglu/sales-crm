import Link from "next/link";

// Label positions come from the corresponding Brilliant header frames.
const tabs: Record<string, [string, number][]> = {
  Companies: [["Companies", 0], ["Deals", 101], ["Forecast", 163]],
  "Deals Board": [["Companies", 0], ["Deals", 101], ["Forecast", 163]],
  Forecast: [["Companies", 0], ["Deals", 101], ["Forecast", 163]],
  Activities: [["All activities", 0], ["My activities", 112], ["Completed", 228]],
  Contacts: [["All contacts", 0], ["My contacts", 109], ["Recently added", 224]],
  "Email Sequences": [["All sequences", 0], ["Active", 123], ["Paused", 196], ["Drafts", 273]],
  "Strategic AEs": [["Overview", 0], ["Accounts", 93], ["Deals", 186], ["Activities", 252]],
  "Mid Market": [["Overview", 0], ["Accounts", 93], ["Deals", 186], ["Activities", 252]],
  "SDR Team": [["Overview", 0], ["Leads", 93], ["Meetings", 165], ["Activities", 260]],
  "Q1 Forecast": [["Overview", 0], ["By owner", 93], ["By month", 188]],
  "Slipping Deals": [["All slipping", 0], ["High risk", 106], ["No activity", 194], ["Recovered", 297]],
};
const links: Record<string, string> = { Companies: "/companies", Deals: "/deals", Forecast: "/forecast" };

export function FrameTabs({ title }: { title: string }) {
  const items = tabs[title] || [["Overview", 0], ["Deals", 101], ["Forecast", 163]];
  const active = title === "Deals Board" ? "Deals" : title === "Forecast" ? "Forecast" : items[0][0];
  const sharedLinks = ["Companies", "Deals Board", "Forecast"].includes(title);
  return <nav aria-label={`${title} views`} className={`flex h-[52px] shrink-0 overflow-x-auto border-b border-crm-surface-selected px-5 text-crm-control leading-[17px] ${title === "Companies" ? "h-[57px]" : ""}`}>
    {items.map(([label, position], index) => <div key={label} className="flex h-full shrink-0 items-start pt-4" style={{ width: items[index + 1] ? items[index + 1][1] - position : undefined }}>
      {sharedLinks ? <Link href={links[label]} aria-current={label === active ? "page" : undefined} className={`flex h-full items-start border-b-2 ${label === active ? "border-crm-text-primary font-semibold text-crm-text-primary" : "border-transparent text-crm-palette-c737373"}`}>{label}</Link>
        : <span aria-current={label === active ? "page" : undefined} className={`flex h-full items-start border-b-2 ${label === active ? "border-crm-text-primary font-semibold text-crm-text-primary" : "border-transparent text-crm-palette-c737373"}`}>{label}</span>}
    </div>)}
  </nav>;
}
