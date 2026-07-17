"use client";

import { useEffect, useRef, type ReactNode } from "react";

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
 *
 * The table itself stays plain markdown so it survives in the generated .md
 * sources; the detail blocks are also plain markdown inside CompatDetail.
 */
export function MatrixTable({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const table = root.querySelector("table");
    if (!table) return;

    const cleanups: (() => void)[] = [];

    // Inject a first header row with "Langfuse Cloud" above the highlighted
    // OSS v4 column (GFM tables only support a single header row).
    const thead = table.querySelector("thead");
    if (thead && !thead.querySelector("[data-cloud-row]")) {
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
      tr.append(mk(3), mk(1, "Langfuse Cloud"), mk(1));
      thead.prepend(tr);
      cleanups.push(() => tr.remove());
    }

    const details = Array.from(
      root.querySelectorAll<HTMLElement>("[data-compat-detail]"),
    );

    for (const detail of details) {
      const name = detail.getAttribute("data-compat-detail");
      const row = Array.from(
        table.querySelectorAll<HTMLTableRowElement>("tbody tr"),
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
    <div
      ref={ref}
      className="[&_th]:px-2.5 [&_td]:px-2.5 [&_td:first-child_code]:text-xs [&_tbody_tr:has(td:first-child>strong):has(td:nth-child(2):empty)]:bg-surface-1 [&_tbody_tr:has(td:first-child>strong):has(td:nth-child(2):empty)_td]:pt-4 [&_tr[role=button]]:cursor-pointer [&_tr[role=button]:hover]:bg-surface-1 [&_tr[aria-expanded=true]]:bg-surface-1 [&_tr[data-compat-expansion]>td]:p-4 [&_tr[data-compat-expansion]>td]:bg-surface-1 [&_thead_th:nth-child(4)]:!bg-[hsl(var(--muted-blue)/0.12)] [&_tbody_tr:not([data-compat-expansion])>td:nth-child(4)]:bg-[hsl(var(--muted-blue)/0.12)] [&_[data-compat-detail]_table:has(thead_th:nth-child(3))_thead_th:last-child]:!bg-[hsl(var(--muted-blue)/0.12)] [&_[data-compat-detail]_table:has(thead_th:nth-child(3))_tbody_td:last-child]:bg-[hsl(var(--muted-blue)/0.12)]"
    >
      {children}
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
