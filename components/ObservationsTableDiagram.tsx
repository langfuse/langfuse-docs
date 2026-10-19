const ROWS = [
  [
    "obs-1",
    "span",
    "handle-chat",
    "3.1s",
    "abc123",
    "chat-request",
    "u-42",
    "s-7",
  ],
  [
    "obs-2",
    "span",
    "retrieval",
    "0.4s",
    "abc123",
    "chat-request",
    "u-42",
    "s-7",
  ],
  [
    "obs-3",
    "generation",
    "llm-call",
    "2.6s",
    "abc123",
    "chat-request",
    "u-42",
    "s-7",
  ],
  [
    "obs-4",
    "span",
    "build-report",
    "1.2s",
    "def789",
    "export-report",
    "u-17",
    "s-9",
  ],
  [
    "obs-5",
    "generation",
    "summarize",
    "0.9s",
    "def789",
    "export-report",
    "u-17",
    "s-9",
  ],
];

const COLUMNS = [
  "id",
  "type",
  "name",
  "latency",
  "trace_id",
  "trace_name",
  "user_id",
  "session_id",
];

/**
 * The observations table as a database-style diagram, using the same visual
 * language as TracingHierarchyDiagram (mono uppercase captions, trace tint,
 * corner-ring border). Trace-level columns are tinted like the "Trace" boxes
 * in the hierarchy visualization to show that trace-level data lives on every
 * observation row.
 */
export function ObservationsTableDiagram() {
  return (
    <figure
      className="obs-table not-prose"
      aria-label="The observations table: each row holds observation-level data plus the trace-level attributes"
    >
      <div className="obs-table__ring">
        <span className="obs-table__caption">Observations table</span>
        <div className="obs-table__scroll">
          <table>
            <thead>
              <tr>
                <th colSpan={4} className="obs-table__group">
                  Observation-level data
                </th>
                <th colSpan={4} className="obs-table__group obs-table__trace">
                  Trace-level data · on every row
                </th>
              </tr>
              <tr>
                {COLUMNS.map((col, i) => (
                  <th
                    key={col}
                    className={i >= 4 ? "obs-table__trace" : undefined}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={i >= 4 ? "obs-table__trace" : undefined}
                    >
                      {i === 0 && <span className="obs-table__dot" />}
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .obs-table {
          --obs-trace-tint: #f1ede1;
          --obs-trace-stroke: #d6cfb6;
          --obs-trace-ink: #6b5e2b;
          container-type: inline-size;
          margin: 24px 0 32px;
          width: 100%;
        }

        .dark .obs-table,
        [data-theme="dark"] .obs-table {
          --obs-trace-tint: transparent;
          --obs-trace-stroke: var(--line-structure);
          --obs-trace-ink: var(--text-secondary);
        }

        .obs-table__ring {
          position: relative;
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          background: var(--surface-bg);
          padding: clamp(14px, 4cqw, 26px) clamp(10px, 3cqw, 20px) clamp(10px, 3cqw, 20px);
        }

        .obs-table__ring::before {
          content: "";
          position: absolute;
          inset: -1px;
          z-index: 2;
          pointer-events: none;
          background-color: var(--line-cta);
          --tl: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M8 0V1H3C1.89543 1 1 1.89543 1 3V8H0V0H8Z' fill='black'/%3E%3C/svg%3E");
          --bl: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M8 8V7H3C1.89543 7 1 6.10457 1 5V0H0V8H8Z' fill='black'/%3E%3C/svg%3E");
          --br: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M0 8V7H5C6.10457 7 7 6.10457 7 5V0H8V8H0Z' fill='black'/%3E%3C/svg%3E");
          --tr: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M0 0V1H5C6.10457 1 7 1.89543 7 3V8H8V0H0Z' fill='black'/%3E%3C/svg%3E");
          -webkit-mask-image: var(--tl), var(--bl), var(--br), var(--tr);
          mask-image: var(--tl), var(--bl), var(--br), var(--tr);
          -webkit-mask-position: top left, bottom left, bottom right, top right;
          mask-position: top left, bottom left, bottom right, top right;
          -webkit-mask-size: clamp(4px, 1.2cqw, 8px) clamp(4px, 1.2cqw, 8px);
          mask-size: clamp(4px, 1.2cqw, 8px) clamp(4px, 1.2cqw, 8px);
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
        }

        .obs-table__caption {
          position: absolute;
          top: -1px;
          left: clamp(6px, 3.5cqw, 24px);
          z-index: 3;
          transform: translateY(-50%);
          padding: 0 clamp(3px, 1.5cqw, 10px);
          background: var(--surface-bg);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: clamp(6px, 1.55cqw, 10.5px);
          letter-spacing: 0.08em;
          line-height: 1.4;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .obs-table__scroll {
          overflow-x: auto;
        }

        .obs-table table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--font-mono);
          font-size: clamp(7px, 1.5cqw, 11.5px);
          line-height: 1.4;
        }

        .obs-table th,
        .obs-table td {
          border: 1px solid var(--line-structure);
          padding: clamp(3px, 1.2cqw, 8px) clamp(4px, 1.6cqw, 12px);
          text-align: left;
          white-space: nowrap;
          color: var(--text-secondary);
          font-weight: 400;
        }

        .obs-table__group {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: clamp(6px, 1.35cqw, 10px);
        }

        .obs-table th.obs-table__trace,
        .obs-table td.obs-table__trace {
          background: var(--obs-trace-tint);
          border-color: var(--obs-trace-stroke);
          color: var(--obs-trace-ink);
        }

        .obs-table__dot {
          display: inline-block;
          width: clamp(3px, 1cqw, 6px);
          height: clamp(3px, 1cqw, 6px);
          margin-right: clamp(3px, 1.2cqw, 8px);
          border-radius: 9999px;
          background: var(--text-secondary);
          vertical-align: middle;
        }
      `}</style>
    </figure>
  );
}
