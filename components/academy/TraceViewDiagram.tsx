export interface TraceViewRow {
  /** Determines the pill label and color. */
  kind: "trace" | "gen" | "tool" | "retriever" | "event";
  name: string;
  /** Quoted user/content preview, shown muted after the name. */
  preview?: string;
  /** Attribute chips, e.g. model, tokens, session/user IDs. */
  chips?: string[];
  duration?: string;
  /** Indent one level under the preceding trace row. */
  indent?: boolean;
  /** Concrete input content, shown as a labeled line under the row. */
  input?: string;
  /** Concrete output content, shown as a labeled line under the row. */
  output?: string;
}

const PILL_LABEL: Record<TraceViewRow["kind"], string> = {
  trace: "Trace",
  gen: "Gen",
  tool: "Tool",
  retriever: "Retriever",
  event: "Event",
};

export function TraceViewDiagram({
  label,
  rows,
  ariaLabel = "Trace view",
}: {
  /** Optional ribbon label above the rows, e.g. "Session listen_7f3e". */
  label?: string;
  rows: TraceViewRow[];
  ariaLabel?: string;
}) {
  return (
    <figure className="trace-view not-prose" aria-label={ariaLabel}>
      <div className="trace-view__card corner-box-corners">
        {label ? <div className="trace-view__ribbon">{label}</div> : null}
        {rows.map((row, index) => (
          <div className="trace-view__row" key={`${row.name}-${index}`}>
            <div className="trace-view__line">
              <div className="trace-view__main">
                {row.indent ? (
                  <span className="trace-view__indent" aria-hidden />
                ) : null}
                <span
                  className={`trace-view__pill trace-view__pill--${row.kind}`}
                >
                  {PILL_LABEL[row.kind]}
                </span>
                <span className="trace-view__name">{row.name}</span>
                {row.preview ? (
                  <span className="trace-view__preview">{row.preview}</span>
                ) : null}
                {(row.chips && row.chips.length > 0) || row.duration ? (
                  <span className="trace-view__chips">
                    {(row.chips ?? []).map((chip) => (
                      <span className="trace-view__chip" key={chip}>
                        {chip}
                      </span>
                    ))}
                    {row.duration ? (
                      <span className="trace-view__chip">{row.duration}</span>
                    ) : null}
                  </span>
                ) : null}
              </div>
            </div>
            {row.input || row.output ? (
              <div
                className={`trace-view__io${row.indent ? " trace-view__io--indented" : ""}`}
              >
                {row.input ? (
                  <div className="trace-view__io-row">
                    <span className="trace-view__io-field">input</span>
                    <span className="trace-view__io-value">{row.input}</span>
                  </div>
                ) : null}
                {row.output ? (
                  <div className="trace-view__io-row">
                    <span className="trace-view__io-field">output</span>
                    <span className="trace-view__io-value">{row.output}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <style>{`
        .trace-view {
          margin: 16px 0;
          width: 100%;
        }

        .trace-view__card {
          position: relative;
          border: 1px solid var(--line-structure);
          background: var(--surface-bg);
          border-radius: 2px;
        }

        .trace-view__ribbon {
          background: var(--surface-beige-accent);
          border-bottom: 1px solid var(--line-structure);
          padding: 7px 14px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .trace-view__row {
          padding: 6px 14px;
        }

        .trace-view__row + .trace-view__row {
          border-top: 1px dashed var(--line-divider-dash);
        }

        .trace-view__line {
          display: flex;
          min-height: 22px;
          align-items: center;
          justify-content: space-between;
          gap: 9px;
        }

        .trace-view__io {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 4px;
          padding-left: 53px;
        }

        .trace-view__io--indented {
          padding-left: 80px;
        }

        .trace-view__io-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .trace-view__io-field {
          flex: 0 0 38px;
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.04em;
          color: var(--callout-info);
        }

        .trace-view__io-value {
          font-size: 12px;
          line-height: 1.45;
          color: var(--text-secondary);
        }

        .trace-view__main {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 9px;
        }

        .trace-view__indent {
          position: relative;
          width: 18px;
          height: 100%;
          flex: 0 0 auto;
          align-self: stretch;
        }

        .trace-view__indent::before {
          content: "";
          position: absolute;
          top: -10px;
          bottom: -10px;
          left: 50%;
          width: 1px;
          background: var(--line-structure);
        }

        .trace-view__pill {
          display: inline-flex;
          height: 17px;
          min-width: 44px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border: 1px solid currentColor;
          border-radius: 2px;
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.06em;
          line-height: 1;
          padding: 0 5px;
          text-transform: uppercase;
        }

        .trace-view__pill--trace {
          color: var(--text-secondary);
          background: var(--surface-1);
        }

        .trace-view__pill--gen {
          color: var(--text-code-pink);
          background: color-mix(in oklab, var(--text-code-pink) 12%, var(--surface-bg));
        }

        .trace-view__pill--tool,
        .trace-view__pill--event {
          color: var(--text-code-orange);
          background: color-mix(in oklab, var(--text-code-orange) 12%, var(--surface-bg));
        }

        .trace-view__pill--retriever {
          color: var(--text-code-blue);
          background: color-mix(in oklab, var(--text-code-blue) 12%, var(--surface-bg));
        }

        .trace-view__name {
          flex: 0 0 auto;
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 12.5px;
          line-height: 1.15;
          white-space: nowrap;
        }

        .trace-view__preview {
          min-width: 0;
          overflow: hidden;
          color: var(--text-tertiary);
          font-size: 12px;
          line-height: 1.15;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .trace-view__chips {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 5px;
          overflow: hidden;
        }

        .trace-view__chip {
          flex: 0 0 auto;
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          background: var(--surface-1);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 9.5px;
          line-height: 1;
          padding: 2px 5px;
          white-space: nowrap;
        }

      `}</style>
    </figure>
  );
}
