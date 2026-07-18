"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type MatrixPersona = {
  id: string;
  label: string;
  /** Section-row name prefixes to show. Empty (with empty rows) shows all. */
  sections?: string[];
  /** Additional data-row name prefixes to show. */
  rows?: string[];
};

/**
 * Styles a GFM markdown table with pricing-page-style section rows and makes
 * rows expandable.
 *
 * - A section row is authored in markdown as a row whose first cell contains
 *   only bold text and whose remaining cells are empty, e.g.
 *   `| **Python** | | | | | |`. It gets a shaded full-width look.
 * - A row becomes click-to-expand when a sibling `<CompatDetail name="...">`
 *   exists whose `name` equals the row's first-cell text. Clicking the row
 *   inserts the detail content as a full-width row directly below it.
 * - Optional `personas` render filter pills above the table; the selection is
 *   synced with the `?persona=` URL parameter so other pages can deep-link a
 *   pre-filtered matrix.
 *
 * The table itself stays plain markdown so it survives in the generated .md
 * sources; the detail blocks are also plain markdown inside CompatDetail.
 */
export function MatrixTable({
  children,
  personas,
}: {
  children: ReactNode;
  personas?: MatrixPersona[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("all");

  useEffect(() => {
    if (!personas) return;
    const fromSearch = new URLSearchParams(window.location.search).get(
      "persona",
    );
    const fromHash = /^#persona-(.+)$/.exec(window.location.hash)?.[1];
    const requested = fromSearch ?? fromHash;
    if (requested && personas.some((p) => p.id === requested)) {
      setActive(requested);
      if (fromHash) {
        // The hash targets no element; scroll to the matrix ourselves.
        setTimeout(() => ref.current?.scrollIntoView({ block: "start" }), 100);
      }
    }
  }, [personas]);

  useEffect(() => {
    const table = ref.current?.querySelector("table");
    if (!table) return;
    const persona = personas?.find((p) => p.id === active);
    const showAll =
      !persona ||
      ((persona.sections?.length ?? 0) === 0 &&
        (persona.rows?.length ?? 0) === 0);
    const rows = Array.from<HTMLTableRowElement>(
      table.querySelectorAll<HTMLTableRowElement>("tbody tr"),
    );
    const isSectionRow = (r: HTMLTableRowElement) =>
      !!r.cells[0]?.querySelector("strong") &&
      Array.from<HTMLTableCellElement>(r.cells)
        .slice(1)
        .every((c) => !c.textContent?.trim());

    let sectionRow: HTMLTableRowElement | null = null;
    let sectionName = "";
    let sectionHasVisible = false;
    const finishSection = () => {
      if (sectionRow)
        sectionRow.style.display = sectionHasVisible ? "" : "none";
    };
    for (const r of rows) {
      if (r.dataset.compatExpansion) continue;
      if (isSectionRow(r)) {
        finishSection();
        sectionRow = r;
        sectionName = r.cells[0]?.textContent?.trim() ?? "";
        sectionHasVisible = false;
        continue;
      }
      const name = (r.cells[0]?.textContent ?? "").replace(/^[▸\s]+/, "");
      const visible =
        showAll ||
        (persona?.sections ?? []).some((s) => sectionName.startsWith(s)) ||
        (persona?.rows ?? []).some((s) => name.startsWith(s));
      r.style.display = visible ? "" : "none";
      const next = r.nextElementSibling as HTMLTableRowElement | null;
      if (next?.dataset.compatExpansion)
        next.style.display = visible ? "" : "none";
      if (visible) sectionHasVisible = true;
    }
    finishSection();
  }, [active, personas]);

  const selectPersona = (id: string) => {
    setActive(id);
    const url = new URL(window.location.href);
    url.hash = id === "all" ? "" : `persona-${id}`;
    history.replaceState(null, "", url.toString());
  };

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const table = root.querySelector("table");
    if (!table) return;

    const cleanups: (() => void)[] = [];

    // Inject a first header row with "Langfuse Cloud" above the highlighted
    // OSS v4 column (GFM tables only support a single header row).
    const thead = table.querySelector<HTMLTableSectionElement>("thead");
    const headRow = thead?.querySelector<HTMLTableRowElement>("tr");
    // The highlighted Cloud column is the 4th one (kept in sync with the
    // nth-child(4) highlight rules in the wrapper className below).
    const colCount = headRow
      ? Array.from<HTMLTableCellElement>(headRow.cells).reduce(
          (n, c) => n + c.colSpan,
          0,
        )
      : 0;
    if (thead && colCount > 4 && !thead.querySelector("[data-cloud-row]")) {
      const tr = document.createElement("tr");
      tr.dataset.cloudRow = "true";
      const mk = (colSpan: number, text?: string) => {
        const th = document.createElement("th");
        th.colSpan = colSpan;
        if (text) {
          th.textContent = text;
          th.style.backgroundColor = "hsl(var(--muted-blue)/0.12)";
        }
        return th;
      };
      tr.append(mk(3), mk(1, "Langfuse Cloud"), mk(colCount - 4));
      thead.prepend(tr);
      cleanups.push(() => tr.remove());
    }

    const details = Array.from<HTMLElement>(
      root.querySelectorAll("[data-compat-detail]"),
    );

    for (const detail of details) {
      const name = detail.getAttribute("data-compat-detail");
      const row = Array.from<HTMLTableRowElement>(
        table.querySelectorAll("tbody tr"),
      ).find((r) => r.cells[0]?.textContent?.trim().startsWith(name!));
      if (!row || row.dataset.compatBound) continue;
      row.dataset.compatBound = "true";

      const holder = detail.parentElement;
      row.setAttribute("role", "button");
      row.setAttribute("aria-expanded", "false");
      row.tabIndex = 0;

      const cell = row.cells[0];
      const cellStyle = getComputedStyle(cell);
      const basePadLeft = cellStyle.paddingLeft;
      const basePadTop = cellStyle.paddingTop;
      cell.style.position = "relative";
      cell.style.paddingLeft = `calc(${basePadLeft} + 1.5rem)`;

      const chevron = document.createElement("span");
      chevron.textContent = "▸";
      chevron.setAttribute("aria-hidden", "true");
      chevron.style.cssText = `position:absolute;left:${basePadLeft};top:${basePadTop};transition:transform 0.15s;font-size:24px;line-height:1.4rem;`;
      cell.prepend(chevron);

      const collapse = () => {
        const next = row.nextElementSibling as HTMLTableRowElement | null;
        if (next?.dataset.compatExpansion) {
          detail.classList.add("hidden");
          holder?.appendChild(detail);
          next.remove();
        }
        row.setAttribute("aria-expanded", "false");
        chevron.style.transform = "";
      };

      const toggle = () => {
        if (row.getAttribute("aria-expanded") === "true") {
          collapse();
          return;
        }
        const tr = document.createElement("tr");
        tr.dataset.compatExpansion = "true";
        const td = document.createElement("td");
        td.colSpan = row.cells.length;
        tr.appendChild(td);
        detail.classList.remove("hidden");
        td.appendChild(detail);
        row.after(tr);
        row.setAttribute("aria-expanded", "true");
        chevron.style.transform = "rotate(90deg)";
      };

      const onClick = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest("a")) return;
        toggle();
      };
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      };
      row.addEventListener("click", onClick);
      row.addEventListener("keydown", onKeyDown);

      cleanups.push(() => {
        collapse();
        row.removeEventListener("click", onClick);
        row.removeEventListener("keydown", onKeyDown);
        chevron.remove();
        cell.style.position = "";
        cell.style.paddingLeft = "";
        row.removeAttribute("role");
        row.removeAttribute("aria-expanded");
        row.removeAttribute("tabindex");
        delete row.dataset.compatBound;
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div>
      {personas && (
        <div className="mb-4 flex flex-wrap gap-2">
          {[{ id: "all", label: "All" }, ...personas].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPersona(p.id)}
              aria-pressed={active === p.id}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                active === p.id
                  ? "border-primary bg-surface-1 font-medium"
                  : "border-border text-muted-foreground hover:bg-surface-1"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div
        ref={ref}
        className="[&_th]:px-2.5 [&_td]:px-2.5 [&_td:first-child_code]:text-xs [&_tbody_tr:has(td:first-child>strong):has(td:nth-child(2):empty)]:bg-surface-1 [&_tbody_tr:has(td:first-child>strong):has(td:nth-child(2):empty)_td]:pt-4 [&_tr[role=button]]:cursor-pointer [&_tr[role=button]:hover]:bg-surface-1 [&_tr[aria-expanded=true]]:bg-surface-1 [&_tr[data-compat-expansion]>td]:p-4 [&_tr[data-compat-expansion]>td]:bg-surface-1 [&_thead_th:nth-child(4)]:!bg-[hsl(var(--muted-blue)/0.12)] [&_tbody_tr:not([data-compat-expansion])>td:nth-child(4)]:bg-[hsl(var(--muted-blue)/0.12)] [&_[data-compat-detail]_table:has(thead_th:nth-child(3))_thead_th:last-child]:!bg-[hsl(var(--muted-blue)/0.12)] [&_[data-compat-detail]_table:has(thead_th:nth-child(3))_tbody_td:last-child]:bg-[hsl(var(--muted-blue)/0.12)]"
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Detail content for one row of a MatrixTable. Hidden until the row whose
 * first cell matches `name` is clicked; then shown inline below that row.
 */
export function CompatDetail({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <div data-compat-detail={name} className="hidden">
      {children}
    </div>
  );
}
