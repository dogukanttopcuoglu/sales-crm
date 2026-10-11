"use client";
import { useEffect, useState } from "react";
import { Checkbox } from "@base-ui/react/checkbox";
import { DesignHeader } from "./design-header";
import { FilterSelect, SearchInput } from "./header";
import { FrameMetrics, Panel, Icon } from "./primitives";
import { Avatar, Badge } from "./data-table";
import data from "./contacts-data.json";

function ContactCheck({ name, checked, onCheckedChange }: { name: string; checked?: boolean; onCheckedChange?: (checked: boolean) => void }) {
  return (
    <Checkbox.Root
      aria-label={name}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="crm-hit-target crm-contact-checkbox relative -ml-[15px] -mr-[15px] flex h-11 w-11 shrink-0 items-center justify-center rounded-crm-xs border-0 before:inset-[15px] before:rounded-crm-xs before:border before:border-crm-palette-c454545 data-[checked]:before:border-crm-primary data-[checked]:before:bg-crm-primary"
    >
      <Checkbox.Indicator className="text-xs text-black">✓</Checkbox.Indicator>
    </Checkbox.Root>
  );
}
const roles = {
  "Decision maker": {
    width: 94.12,
    color: "var(--crm-color-palette-cc4b6da)",
    background: "var(--crm-color-palette-c2d2934)",
  },
  Champion: {
    width: 66.85,
    color: "var(--crm-color-palette-c80b9a2)",
    background: "var(--crm-color-palette-c24322d)",
  },
  Influencer: {
    width: 66.45,
    color: "var(--crm-color-palette-ca1aec2)",
    background: "var(--crm-color-palette-c282e35)",
  },
};
export function ContactsPage() {
  const [search, setSearch] = useState(""),
    [company, setCompany] = useState("All companies"),
    [owner, setOwner] = useState("All owners"),
    [role, setRole] = useState("All roles"),
    [selected, setSelected] = useState(data[0]),
    [checkedContacts, setCheckedContacts] = useState<string[]>([]),
    [page, setPage] = useState(1);
  const rows = data.filter(
    (r) =>
      (company === "All companies" || company === r.text[3]) &&
      (owner === "All owners" || owner === r.text[5]) &&
      (role === "All roles" || role === r.text[4]) &&
      r.text.join(" ").toLowerCase().includes(search.toLowerCase()),
  );
  const pageSize = 14,
    pageCount = Math.max(1, Math.ceil(rows.length / pageSize)),
    visibleRows = rows.slice((page - 1) * pageSize, page * pageSize);
  useEffect(() => {
    setPage(1);
    setSelected(rows[0] ?? data[0]);
  }, [company, owner, role, search]);
  const initial = selected === data[0];
  const visibleContactNames = visibleRows.map((r) => r.text[1]);
  const allVisibleChecked = visibleContactNames.length > 0 && visibleContactNames.every((name) => checkedContacts.includes(name));
  return (
    <>
      <DesignHeader
        title="Contacts"
        badge="38 people"
        secondary="Import"
        action="+ Add contact"
      >
        <FilterSelect
          label="Company"
          value={company}
          options={["All companies", ...data.map((r) => r.text[3])]}
          onChange={setCompany}
        />
        <FilterSelect
          label="Owner"
          value={owner}
          options={["All owners", ...new Set(data.map((r) => r.text[5]))]}
          onChange={setOwner}
        />
        <FilterSelect
          label="Role"
          value={role}
          options={["All roles", ...Object.keys(roles)]}
          onChange={setRole}
        />
        <span className="ml-4 flex items-center gap-2 text-sm text-secondary">
          <Icon name="filter" className="h-[9px] w-[17px]" />
          Filters
        </span>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search contacts"
        />
      </DesignHeader>
      <main className="crm-page-content p-5">
        <FrameMetrics route="contacts" />
        <div className="crm-split-grid mt-[18px] grid gap-5 xl:grid-cols-[minmax(0,744fr)_minmax(0,348fr)]">
          <Panel
            label="Contact directory"
            className="crm-contacts-table relative min-h-[704px] overflow-hidden"
          >
            <div
              className="overflow-x-auto"
              tabIndex={0}
              role="region"
              aria-label="Scrollable contacts"
            >
              <table className="w-full min-w-[742px] table-fixed border-collapse text-xs leading-[15px]">
                <colgroup>
                  <col style={{ width: 48 }} />
                  {[200, 128, 150, 94, 122].map((w, i) => (
                    <col
                      key={i}
                      style={{
                        width: `calc(${(w / 694) * 100}% - ${(48 * w) / 694}px)`,
                      }}
                    />
                  ))}
                </colgroup>
                <thead>
                  <tr className="h-[43px] border-b border-line bg-control text-left text-muted">
                    <th className="pl-[17px]">
                      <ContactCheck name="Select all contacts" checked={allVisibleChecked} onCheckedChange={(checked) => setCheckedContacts((current) => checked ? [...new Set([...current, ...visibleContactNames])] : current.filter((name) => !visibleContactNames.includes(name)))} />
                    </th>
                    {[
                      "Contact",
                      "Company",
                      "Role",
                      "Owner",
                      "Last contact",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`font-normal ${h === "Last contact" ? "pr-[19px] text-right" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((r) => (
                    <tr
                      key={r.text[1]}
                      className={`h-[61px] border-b border-crm-outline-variant ${selected === r ? "bg-crm-palette-c26251e shadow-[inset_2px_0_var(--crm-color-primary)]" : ""}`}
                    >
                      <td className="pl-[17px]">
                        <ContactCheck name={`Select ${r.text[1]}`} checked={checkedContacts.includes(r.text[1])} onCheckedChange={(checked) => setCheckedContacts((current) => checked ? [...new Set([...current, r.text[1]])] : current.filter((name) => name !== r.text[1]))} />
                      </td>
                      <td>
                        <button
                          onClick={() => setSelected(r)}
                          className="flex items-center gap-[10px] text-left"
                        >
                          <Avatar src={r.avatar} size={32} />
                          <span>
                            <span className="block text-crm-table leading-4 text-crm-text-primary">
                              {r.text[1]}
                            </span>
                            <span className="mt-[5px] block text-crm-label leading-[13px] text-crm-text-caption">
                              {r.text[2]}
                            </span>
                          </span>
                        </button>
                      </td>
                      <td className="text-crm-table text-secondary">
                        {r.text[3]}
                      </td>
                      <td>
                        <Badge
                          height={23}
                          {...roles[r.text[4] as keyof typeof roles]}
                        >
                          {r.text[4]}
                        </Badge>
                      </td>
                      <td className="text-crm-palette-caaaaaa">{r.text[5]}</td>
                      <td className="pr-[19px] text-right text-crm-palette-caaaaaa">
                        {r.text[6]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-10 flex min-h-[49px] items-center justify-between border-t border-line bg-crm-surface px-[17px] text-crm-label leading-[13px] text-crm-text-caption">
              <span>
                {rows.length
                  ? `Showing ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, rows.length)} of ${rows.length} contacts`
                  : "No contacts found"}
              </span>
              <nav
                aria-label="Contact pages"
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="flex h-7 w-7 items-center justify-center rounded-crm-xs border border-line disabled:opacity-40"
                >
                  <Icon name="caret-left" className="h-[11px] w-[6px]" />
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                  (value) => (
                    <button
                      key={value}
                      type="button"
                      aria-current={page === value ? "page" : undefined}
                      onClick={() => setPage(value)}
                      className={`flex h-7 w-7 items-center justify-center rounded-crm-xs border border-line ${page === value ? "bg-control text-crm-text-primary" : "text-crm-text-caption"}`}
                    >
                      {value}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={page === pageCount}
                  onClick={() =>
                    setPage((value) => Math.min(pageCount, value + 1))
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-crm-xs border border-line disabled:opacity-40"
                >
                  <Icon name="caret-right" className="h-[11px] w-[6px]" />
                </button>
              </nav>
            </div>
          </Panel>
          <Panel
            label="Contact details"
            className="min-h-[704px] px-[19px] pt-[17px]"
          >
            <div className="flex h-[15px] items-center justify-between text-xs leading-[15px] text-muted">
              Contact details
              <Icon name="dots" className="h-[3px] w-5" />
            </div>
            <div className="mt-[19px] flex h-12 items-start gap-[14px]">
              <Avatar src={selected.avatar} size={48} />
              <div className="pt-px">
                <h2 className="text-lg font-semibold leading-[22px]">
                  {selected.text[1]}
                </h2>
                <p className="mt-[5px] text-xs leading-[15px] text-muted">
                  {selected.text[2]} · {selected.text[3]}
                </p>
              </div>
            </div>
            <div className="mt-[19px] flex gap-3">
              <button
                disabled
                className="flex h-[33px] flex-1 items-center justify-center gap-[7px] rounded-crm-control bg-crm-primary text-xs font-semibold text-crm-surface-deal"
              >
                <Icon name="email-action" className="h-[13px] w-4" />
                Send email
              </button>
              <button
                disabled
                className="flex h-[33px] flex-1 items-center justify-center gap-[7px] rounded-crm-control border border-crm-outline-control bg-crm-palette-c252525 text-xs"
              >
                <Icon name="phone-action" className="h-[14px] w-[14px]" />
                Log activity
              </button>
            </div>
            <div className="mt-[22px] border-t border-line pt-[19px]">
              {[
                ["Email", initial ? "emma.wilson@stripe.com" : "—"],
                ["Phone", initial ? "+1 (415) 555-0142" : "—"],
                ["Location", initial ? "San Francisco, United States" : "—"],
              ].map(([label, value]) => (
                <div key={label} className="mb-[19px]">
                  <p className="text-crm-label leading-[13px] text-crm-text-caption">
                    {label}
                  </p>
                  <div className="mt-[6px] flex h-[15px] justify-between text-xs leading-[15px] text-secondary">
                    {value}
                    {label === "Email" && initial && (
                      <button
                        aria-label="Copy email"
                        onClick={() => navigator.clipboard.writeText(value)}
                      >
                        <Icon name="copy" className="h-[14px] w-[14px]" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-[minmax(0,176fr)_minmax(0,132fr)]">
                <div>
                  <p className="text-crm-label leading-[13px] text-crm-text-caption">
                    Owner
                  </p>
                  <p className="mt-[6px] text-xs leading-[15px] text-secondary">
                    {initial ? "Sarah Jenkins" : selected.text[5]}
                  </p>
                </div>
                <div>
                  <p className="text-crm-label leading-[13px] text-crm-text-caption">
                    Role
                  </p>
                  <p className="mt-[6px] text-xs leading-[15px] text-crm-palette-cc4b6da">
                    {selected.text[4]}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-line pt-[19px]">
              <h3 className="text-xs leading-[15px] text-muted">Linked deal</h3>
              <div className="mt-[11px] flex h-[61px] items-start justify-between rounded-crm-control border border-crm-palette-c333333 bg-crm-surface-hover px-[11px] pt-[10px]">
                <div>
                  <p className="text-crm-table leading-4">
                    {initial ? "Commerce expansion" : "—"}
                  </p>
                  <p className="mt-[7px] text-crm-label leading-[13px] text-crm-text-caption">
                    {initial
                      ? "Proposal · $320,000"
                      : "No linked deal provided"}
                  </p>
                </div>
                <Icon
                  name="external-arrow"
                  className="mt-[3px] h-[13px] w-[13px]"
                />
              </div>
            </div>
            <h3 className="mt-[23px] text-xs leading-[15px] text-muted">
              Recent activity
            </h3>
            {initial &&
              [
                [
                  "email",
                  "Proposal follow-up sent",
                  "Today, 9:15 AM · Sarah Jenkins",
                ],
                [
                  "phone",
                  "Discovery call completed",
                  "Oct 8 · 30 min · Sarah Jenkins",
                ],
              ].map(([icon, title, detail], i) => (
                <div
                  key={title}
                  className={`flex gap-[11px] ${i ? "mt-[23px]" : "mt-[15px]"}`}
                >
                  <Icon name={icon} className="mt-1 h-[15px] w-[15px]" />
                  <div>
                    <p className="text-xs leading-[15px] text-secondary">
                      {title}
                    </p>
                    <p className="mt-[6px] text-crm-label leading-[13px] text-crm-text-caption">
                      {detail}
                    </p>
                  </div>
                </div>
              ))}
          </Panel>
        </div>
      </main>
    </>
  );
}
