"use client";

import { Fan, ListTree, MoveHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type Adopter = {
  id: string;
  name: string;
  website: string;
  companyDescription: string;
  useCase?: string;
  tableSummary: string;
  referenceLabel: string;
  referenceHref?: string;
};

type View = "wall" | "table";
type TraceType = "TRACE" | "SPAN" | "GENERATION";

const TRACE_TYPE_ICON = {
  TRACE: ListTree,
  SPAN: MoveHorizontal,
  GENERATION: Fan,
} as const;

const TRACE_TYPE_COLOR = {
  TRACE: "text-muted-green",
  SPAN: "text-muted-blue",
  GENERATION: "text-muted-magenta",
} as const;

function TraceTypeIcon({ type }: { type: TraceType }) {
  const Icon = TRACE_TYPE_ICON[type];
  const label = type.charAt(0) + type.slice(1).toLowerCase() + " observation";

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border-2 border-line-structure bg-surface-bg"
    >
      <Icon className={cn("h-3 w-3", TRACE_TYPE_COLOR[type])} />
    </span>
  );
}

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function referenceCtaLabel(adopter: Adopter) {
  const label = adopter.referenceLabel.toLowerCase();
  const href = adopter.referenceHref?.toLowerCase() ?? "";

  if (href.startsWith("/users/")) return "User story";
  if (label.includes("job")) return "Job posting";
  if (label.includes("blog")) return "Tech blogpost";
  if (
    label.includes("data processing") ||
    label.includes("subprocessor") ||
    href.includes("privacy")
  ) {
    return "Data policy";
  }
  return adopter.referenceLabel || "Public reference";
}

function AdopterReference({ adopter }: { adopter: Adopter }) {
  if (!adopter.referenceHref) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-tertiary">
        {adopter.referenceLabel || "Public reference"}
      </span>
    );
  }

  const external = isExternalLink(adopter.referenceHref);
  return (
    <a
      href={adopter.referenceHref}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-secondary no-underline transition-colors hover:text-text-primary"
    >
      {referenceCtaLabel(adopter)} <span aria-hidden>→</span>
    </a>
  );
}

function TracePreview({ adopter }: { adopter: Adopter }) {
  return (
    <div className="border-t border-line-structure bg-surface-1">
      <div className="grid gap-4 px-4 py-5 sm:grid-cols-[72px_1fr] sm:px-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-tertiary">
          Trace
        </span>
        <div className="min-w-0 font-mono text-[11px] leading-[1.5] text-text-secondary">
          <div className="flex min-w-0 items-center gap-2">
            <TraceTypeIcon type="TRACE" />
            <a
              href={adopter.website}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-text-primary no-underline hover:underline"
            >
              {adopter.name} <span aria-hidden>↗</span>
            </a>
          </div>
          <div className="ml-2 mt-2 border-l border-line-structure pl-4">
            <div className="flex min-w-0 items-start gap-2">
              <span aria-hidden className="shrink-0 text-text-tertiary">
                └─
              </span>
              <TraceTypeIcon type="SPAN" />
              <span className="min-w-0 break-words">
                {adopter.companyDescription}
              </span>
            </div>
            {adopter.useCase && (
              <div className="ml-4 mt-2 flex min-w-0 items-start gap-2 border-l border-line-structure pl-3 text-text-tertiary">
                <span aria-hidden className="shrink-0">
                  └─
                </span>
                <TraceTypeIcon type="GENERATION" />
                <span className="min-w-0 break-words">{adopter.useCase}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end border-t border-line-structure px-4 py-3 sm:px-5">
        <div className="ml-auto">
          <AdopterReference adopter={adopter} />
        </div>
      </div>
    </div>
  );
}

function AdopterCard({
  adopter,
  active,
  onToggle,
}: {
  adopter: Adopter;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={cn("bg-surface-bg", active && "bg-surface-2")}>
      <button
        type="button"
        aria-expanded={active}
        onClick={onToggle}
        className="group relative block w-full cursor-pointer p-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <span
          className={cn(
            "flex min-h-16 items-center justify-center border border-dashed border-line-structure px-12 py-4 text-center font-analog text-[17px] font-medium text-text-secondary transition-colors group-hover:bg-surface-1 group-hover:text-text-primary",
            active && "bg-surface-1 text-text-primary",
          )}
        >
          {adopter.name}
        </span>
        {active && (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 font-mono text-[9px] uppercase tracking-[0.1em] text-text-tertiary">
            Close <span aria-hidden>×</span>
          </span>
        )}
      </button>
      {active && <TracePreview adopter={adopter} />}
    </article>
  );
}

function AdopterList({
  adopters,
  activeId,
  onToggle,
}: {
  adopters: Adopter[];
  activeId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="divide-y divide-line-structure">
      {adopters.map((adopter) => (
        <AdopterCard
          key={adopter.id}
          adopter={adopter}
          active={activeId === adopter.id}
          onToggle={() => onToggle(adopter.id)}
        />
      ))}
    </div>
  );
}

function AdoptersWall({ adopters }: { adopters: Adopter[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const columns = useMemo(
    () => [
      adopters.filter((_, index) => index % 2 === 0),
      adopters.filter((_, index) => index % 2 === 1),
    ],
    [adopters],
  );
  const toggle = (id: string) =>
    setActiveId((current) => (current === id ? null : id));

  return (
    <>
      <div className="border border-line-structure bg-surface-bg md:hidden">
        <AdopterList
          adopters={adopters}
          activeId={activeId}
          onToggle={toggle}
        />
      </div>
      <div className="hidden grid-cols-2 divide-x divide-line-structure border border-line-structure bg-surface-bg md:grid">
        {columns.map((column, index) => (
          <AdopterList
            key={index}
            adopters={column}
            activeId={activeId}
            onToggle={toggle}
          />
        ))}
      </div>
    </>
  );
}

function AdoptersTable({ adopters }: { adopters: Adopter[] }) {
  return (
    <div className="overflow-x-auto border border-line-structure bg-surface-bg">
      <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
        <thead className="bg-surface-2 font-mono text-[10px] uppercase tracking-[0.1em] text-text-tertiary">
          <tr>
            <th className="border-b border-line-structure px-4 py-3 font-normal">
              Company
            </th>
            <th className="border-b border-l border-line-structure px-4 py-3 font-normal">
              Use case
            </th>
            <th className="border-b border-l border-line-structure px-4 py-3 font-normal">
              Reference
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-structure">
          {adopters.map((adopter) => (
            <tr key={adopter.id} className="align-top hover:bg-surface-1">
              <td className="px-4 py-3">
                <a
                  href={adopter.website}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-text-primary no-underline hover:underline"
                >
                  {adopter.name}
                </a>
              </td>
              <td className="border-l border-line-structure px-4 py-3 text-text-secondary">
                {adopter.tableSummary}
              </td>
              <td className="border-l border-line-structure px-4 py-3">
                <AdopterReference adopter={adopter} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (view: View) => void;
}) {
  return (
    <div
      className="inline-flex border border-line-structure bg-surface-bg p-1"
      role="group"
      aria-label="Adopters view"
    >
      {(["wall", "table"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={view === option}
          onClick={() => onChange(option)}
          className={cn(
            "min-w-16 cursor-pointer px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            view === option
              ? "bg-text-primary text-surface-bg"
              : "text-text-tertiary hover:bg-surface-1 hover:text-text-primary",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function AdoptersExplorer({ adopters }: { adopters: Adopter[] }) {
  const [view, setView] = useState<View>("wall");

  return (
    <section className="not-prose bg-surface-bg text-text-primary">
      <header className="border-b border-line-structure px-4 py-10 sm:px-8 sm:py-14 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-text-tertiary">
              — Adopters
            </p>
            <h1 className="mt-5 max-w-[19ch] font-analog text-[38px] font-medium leading-[1.02] tracking-tight text-text-primary sm:text-[50px]">
              Langfuse is adopted by 100,000+ developers worldwide
            </h1>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <p className="m-0 max-w-[28ch] text-[13px] leading-[1.5] text-text-tertiary lg:text-right">
              Select a company to see how it uses Langfuse.
            </p>
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </header>

      <div className="px-4 py-6 sm:px-8 sm:py-8 lg:px-10">
        <div className="mb-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.1em] text-text-tertiary">
          <span>{view === "wall" ? "Adopter wall" : "Simple table"}</span>
          <span>{adopters.length} companies</span>
        </div>
        {view === "wall" ? (
          <AdoptersWall adopters={adopters} />
        ) : (
          <AdoptersTable adopters={adopters} />
        )}
        <p className="mb-0 mt-4 max-w-[78ch] text-[12px] leading-[1.5] text-text-tertiary">
          This list is assembled from public sources and may differ from current
          usage. Please make sure you are not sharing information covered by an
          NDA when suggesting an update.
        </p>
      </div>

      <div className="mx-4 mb-8 flex flex-col gap-6 border border-text-primary bg-text-primary px-5 py-7 text-surface-bg sm:mx-8 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:mx-10">
        <div>
          <h2 className="m-0 font-analog text-[26px] font-medium leading-tight text-surface-bg">
            Add your team to the wall
          </h2>
          <p className="mb-0 mt-2 max-w-[58ch] text-[13px] leading-[1.5] text-surface-bg/70">
            Open a pull request against the adopters list, or reach out to get
            your story on record.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <a
            href="/talk-to-us"
            className="inline-flex min-h-9 items-center justify-center border border-surface-bg bg-surface-bg px-4 text-[12px] font-medium text-text-primary no-underline transition-opacity hover:opacity-90"
          >
            Share your story
          </a>
          <button
            type="button"
            onClick={() => setView("table")}
            className="inline-flex min-h-9 cursor-pointer items-center justify-center border border-surface-bg/40 bg-transparent px-4 text-[12px] font-medium text-surface-bg transition-colors hover:border-surface-bg"
          >
            Open table view
          </button>
        </div>
      </div>
    </section>
  );
}
