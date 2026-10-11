"use client";
import { useState } from "react";
import { Checkbox } from "@base-ui/react/checkbox";
import { DesignHeader } from "./design-header";
import { FilterSelect, SearchInput } from "./header";
import { FrameMetrics, Panel, Icon } from "./primitives";
import { Badge, DataTable } from "./data-table";
import data from "./sequences-data.json";
export function SequencesPage() {
  const [owner, setOwner] = useState("All owners"),
    [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [activeSequence, setActiveSequence] = useState("Enterprise outbound");
  const rows = data.rows.filter(
    (r) =>
      (owner === "All owners" || owner === r[7]) &&
      r.join(" ").toLowerCase().includes(search.toLowerCase()),
  );
  const activeRow = rows.find((r) => r[0] === activeSequence) ?? rows[0] ?? data.rows[0];
  const activeSteps = data.steps.map((step, index) => [
    step[0],
    index === 0 ? "Introduction" : index === 1 ? "Value follow-up" : index === 2 ? "Personal follow-up" : index === 3 ? "Final check-in" : index === 4 ? "Long-term check-in" : index === 5 ? "Executive follow-up" : "Breakup email",
    `${step[2]} · ${activeRow[0]}`,
    step[3],
    step[4],
    step[5],
  ]);
  return (
    <>
      <DesignHeader
        title="Email Sequences"
        badge="3 active"
        secondary="Templates"
        action="+ New sequence"
      >
        <FilterSelect
          label="Owner"
          value={owner}
          options={["All owners", ...data.rows.map((r) => r[7])]}
          onChange={setOwner}
        />
        <FilterSelect
          label="Period"
          value="Last 30 days"
          options={["Last 30 days"]}
          onChange={() => {}}
        />
        <span className="ml-4 flex items-center gap-2 text-sm text-secondary">
          <Icon name="filter" className="h-[9px] w-[17px]" />
          Filters
        </span>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search sequences"
        />
      </DesignHeader>
      <main className="crm-page-content crm-sequences-page p-5">
        <FrameMetrics route="email-sequences" />
        <Panel label="Sequence directory" className="mt-[18px] overflow-hidden">
          <div
            className="overflow-x-auto"
            tabIndex={0}
            role="region"
            aria-label="Scrollable sequences"
          >
            <table className="w-full min-w-[1110px] table-fixed border-collapse">
              <colgroup>
                {[48, 312, 118, 103, 115, 120, 111, 143, 40].map((w, i) => (
                  <col key={i} style={{ width: (w / 1110) * 100 + "%" }} />
                ))}
              </colgroup>
              <thead>
                <tr className="h-[43px] bg-control text-left text-xs text-muted">
                  <th className="pl-[17px]">
                    <Checkbox.Root
                      aria-label="Select all sequences"
                      checked={rows.length > 0 && selected.length === rows.length}
                      indeterminate={selected.length > 0 && selected.length < rows.length}
                      onCheckedChange={(checked) => setSelected(checked ? rows.map((r) => r[0]) : [])}
                      className="crm-hit-target crm-table-checkbox relative -ml-[15px] -mr-[15px] flex h-11 w-11 shrink-0 items-center justify-center rounded-crm-xs border-0 before:inset-[15px] before:rounded-crm-xs before:border before:border-crm-palette-c454545 data-[checked]:before:border-crm-primary data-[checked]:before:bg-crm-primary data-[indeterminate]:before:border-crm-primary data-[indeterminate]:before:bg-crm-primary"
                    >
                      <Checkbox.Indicator className="leading-none text-black">
                        ✓
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                  </th>
                  {[
                    "Sequence",
                    "Status",
                    "Enrolled",
                    "Open rate",
                    "Reply rate",
                    "Meetings",
                    "Owner",
                    "",
                  ].map((h, i) => (
                    <th key={i} className="font-normal">
                      {i >= 2 && i <= 5 ? (
                        <span
                          className="block text-center"
                          style={{ width: [64, 76, 76, 68][i - 2] }}
                        >
                          {h}
                        </span>
                      ) : (
                        h
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r[0]}
                    onClick={() => setActiveSequence(r[0])}
                    className={`h-[54px] cursor-pointer border-b border-crm-palette-c282828 text-crm-table text-secondary ${activeSequence === r[0] ? "bg-crm-palette-c26251e shadow-[inset_2px_0_var(--crm-color-primary)]" : ""}`}
                  >
                    <td className="pl-[17px]">
                      <Checkbox.Root
                        aria-label={`Select ${r[0]}`}
                        checked={selected.includes(r[0])}
                        onCheckedChange={(checked) => setSelected((values) => checked ? [...values.filter((value) => value !== r[0]), r[0]] : values.filter((value) => value !== r[0]))}
                        className="crm-hit-target crm-table-checkbox relative -ml-[15px] -mr-[15px] flex h-11 w-11 shrink-0 items-center justify-center rounded-crm-xs border-0 before:inset-[15px] before:rounded-crm-xs before:border before:border-crm-palette-c454545 data-[checked]:before:border-crm-primary data-[checked]:before:bg-crm-primary"
                      >
                        <Checkbox.Indicator className="leading-none text-black">
                          ✓
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                    </td>
                    <td className="">
                      <p className="text-sm leading-[17px] text-crm-text-primary">
                        {r[0]}
                      </p>
                      <p className="mt-[6px] text-crm-label leading-[13px] text-crm-text-caption">
                        {r[1]}
                      </p>
                    </td>
                    <td className="">
                      <Badge
                        width={
                          r[2] === "Active"
                            ? 56.52
                            : r[2] === "Paused"
                              ? 62.67
                              : 49.56
                        }
                        height={23}
                        color={
                          r[2] === "Active"
                            ? "var(--crm-color-palette-c80b9a2)"
                            : r[2] === "Paused"
                              ? "var(--crm-color-warning)"
                              : "var(--crm-color-palette-c999999)"
                        }
                        background={
                          r[2] === "Active"
                            ? "var(--crm-color-palette-c24322d)"
                            : r[2] === "Paused"
                              ? "var(--crm-color-palette-c332d23)"
                              : "var(--crm-color-outline-variant)"
                        }
                      >
                        • {r[2]}
                      </Badge>
                    </td>
                    {r.slice(3, 7).map((v, j) => (
                      <td key={j} className="leading-4">
                        <span
                          className="block text-center"
                          style={{ width: [64, 76, 76, 68][j] }}
                        >
                          {v}
                        </span>
                      </td>
                    ))}
                    <td className="text-xs leading-[15px]">{r[7]}</td>
                    <td>
                      <Icon name="dots" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex h-[39px] items-center justify-between px-[18px] text-crm-label text-crm-text-caption">
            <span>5 sequences · Last synced just now</span>
            <span>Manage columns</span>
          </div>
        </Panel>
        <div className="crm-split-grid mt-5 grid gap-5 xl:grid-cols-[minmax(0,724fr)_minmax(0,368fr)]">
          <DataTable
            fillRows
            title={activeRow[0]}
            subtitle={`${activeRow[3]} enrolled · ${activeSteps.filter((step) => step[3] === "Email").length} emails · ${activeSteps.filter((step) => step[3] === "Task").length} task`}
            height={328}
            titleHeight={75}
            headHeight={29}
            headFontSize={11}
            footerHeight={32}
            rowHeight={48}
            minWidth={722}
            cellInset={19}
            contentWidths={[undefined, undefined, 46, 105, 84]}
            alignments={["left", "left", "center", "left", "center"]}
            action={
              <span className="rounded-crm-xs border border-line px-3 py-[6px] text-crm-label">
                Edit
              </span>
            }
            headers={["Schedule", "Touchpoint", "Type", "Progress", "Replies"]}
            widths={[79, 298, 78, 145, 122].map((width) => (width / 722) * 100)}
            rows={activeSteps.map((r) => [
              r[0],
              <div key="touch">
                <p>{r[1]}</p>
                <p className="mt-[6px] text-crm-label leading-[13px] text-crm-text-caption">
                  {r[2]}
                </p>
              </div>,
              <Badge
                key="type"
                width={46}
                height={21}
                background={
                  r[3] === "Task"
                    ? "var(--crm-color-status-bestcase-container)"
                    : "var(--crm-color-outline-variant)"
                }
                color={
                  r[3] === "Task"
                    ? "var(--crm-color-palette-cc4b6da)"
                    : "var(--crm-color-text-secondary)"
                }
              >
                {r[3]}
              </Badge>,
              <span key="progress" className="text-xs">
                {r[4]}
              </span>,
              <span key="reply" className="text-crm-success">
                {r[5]}
              </span>,
            ])}
            footer={
              <>
                <span>Stops on reply</span>
                <span>Weekdays · 9 AM–5 PM</span>
              </>
            }
          />
          <Panel label="Engagement" className="h-[330px] px-[19px] pt-[17px]">
            <h2 className="text-base font-semibold leading-[19px]">
              Engagement
            </h2>
            <p className="mt-[7px] text-xs leading-[15px] text-crm-text-caption">
              {activeRow[0]} · {activeRow[3]} contacts
            </p>
            <div className="mt-[17px] flex items-center justify-between">
              <div>
                <p className="text-crm-target-hero font-medium leading-[41px]">
                  8.9%
                </p>
                <p className="mt-[6px] text-crm-label leading-[13px] text-muted">
                  Booking rate
                </p>
              </div>
              <Badge
                width={87.63}
                height={25}
                color="var(--crm-color-palette-c80b9a2)"
                background="var(--crm-color-palette-c27322c)"
              >
                • 11 meetings
              </Badge>
            </div>
            <div className="mt-[15px] border-t border-line pt-4">
              {[
                [
                  "Delivered",
                  "122 contacts",
                  "98.4%",
                  "var(--crm-color-palette-c999999)",
                ],
                ["Opened", "78 contacts", "62.9%", "var(--crm-color-info)"],
                [
                  "Replied",
                  "23 contacts",
                  "18.5%",
                  "var(--crm-color-palette-c80b9a2)",
                ],
              ].map(([label, contacts, rate, color]) => (
                <div key={label} className="mb-[16px]">
                  <div className="flex items-center justify-between text-xs leading-[15px]">
                    <span className="text-secondary">{label}</span>
                    <span className="ml-auto mr-[46px] text-crm-caption text-crm-text-caption">
                      {contacts}
                    </span>
                    <span>{rate}</span>
                  </div>
                  <div className="mt-[10px] h-[3px] bg-line">
                    <div
                      className="h-full"
                      style={{ width: rate, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-[-1px] flex justify-between text-crm-caption leading-[13px]">
              <span className="text-crm-success">+4 meetings this week</span>
              <span className="text-crm-text-caption">Last 30 days</span>
            </div>
          </Panel>
        </div>
      </main>
    </>
  );
}
