const GRID_LINES = [22.73, 45.45, 68.18, 90.91];

const ROWS = [
  {
    type: "trace",
    label: "Trace",
    name: "rag-chat-pipeline",
    duration: "4.23s",
    depth: 0,
    barLeft: 0,
    barWidth: 96.14,
  },
  {
    type: "span",
    label: "Span",
    name: "retrieve-documents",
    duration: "1.07s",
    depth: 1,
    barLeft: 0,
    barWidth: 24.32,
  },
  {
    type: "gen",
    label: "Gen",
    name: "embed-query",
    duration: "150ms",
    depth: 2,
    barLeft: 0,
    barWidth: 3.41,
  },
  {
    type: "span",
    label: "Span",
    name: "vector-db-search",
    duration: "510ms",
    depth: 2,
    barLeft: 3.86,
    barWidth: 11.59,
  },
  {
    type: "event",
    label: "Event",
    name: "cache-miss",
    duration: "@ 225ms",
    depth: 3,
    eventLeft: 5.11,
  },
  {
    type: "gen",
    label: "Gen",
    name: "rerank-results",
    duration: "180ms",
    depth: 2,
    barLeft: 17.5,
    barWidth: 4.09,
  },
  {
    type: "span",
    label: "Span",
    name: "generate-answer",
    duration: "3.16s",
    depth: 1,
    barLeft: 24.32,
    barWidth: 71.82,
  },
  {
    type: "gen",
    label: "Gen",
    name: "generate-answer",
    duration: "1.07s",
    depth: 2,
    barLeft: 24.77,
    barWidth: 24.32,
  },
  {
    type: "event",
    label: "Event",
    name: "stream-complete",
    duration: "@ 1.93s",
    depth: 2,
    eventLeft: 43.86,
  },
] as const;

function GridLines() {
  return (
    <div className="rag-trace-view__gridlines" aria-hidden="true">
      {GRID_LINES.map((left) => (
        <div
          key={left}
          className="rag-trace-view__gridline"
          style={{ left: `${left}%` }}
        />
      ))}
    </div>
  );
}

function Indents({ depth }: { depth: number }) {
  return (
    <>
      {Array.from({ length: depth }, (_, index) => (
        <span key={index} className="rag-trace-view__indent" aria-hidden="true" />
      ))}
    </>
  );
}

export function RagTraceViewDiagram() {
  return (
    <figure className="rag-trace-view not-prose" aria-label="RAG chat pipeline trace timeline">
      <div className="rag-trace-view__card">
        <div className="rag-trace-view__columns">
          <div className="rag-trace-view__column-header rag-trace-view__column-header--left">
            <span>Name</span>
            <span>Duration</span>
          </div>
          <div className="rag-trace-view__column-header">
            <div className="rag-trace-view__ruler">
              <span style={{ left: "0%" }}>0</span>
              <span style={{ left: "22.73%" }}>1s</span>
              <span style={{ left: "45.45%" }}>2s</span>
              <span style={{ left: "68.18%" }}>3s</span>
              <span style={{ left: "90.91%" }}>4s</span>
            </div>
          </div>
        </div>

        <div className="rag-trace-view__body">
          {ROWS.map((row) => (
            <div className="rag-trace-view__row" key={`${row.type}-${row.name}-${row.duration}`}>
              <div className="rag-trace-view__left">
                <Indents depth={row.depth} />
                <span className={`rag-trace-view__pill rag-trace-view__pill--${row.type}`}>
                  {row.label}
                </span>
                <span className="rag-trace-view__name">{row.name}</span>
                <span className="rag-trace-view__duration">{row.duration}</span>
              </div>
              <div className="rag-trace-view__right">
                <GridLines />
                {row.type === "event" ? (
                  <span
                    className="rag-trace-view__event-marker"
                    style={{ left: `${row.eventLeft}%` }}
                    aria-hidden="true"
                  />
                ) : (
                  <span
                    className={`rag-trace-view__bar rag-trace-view__bar--${row.type}`}
                    style={{ left: `${row.barLeft}%`, width: `${row.barWidth}%` }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rag-trace-view__footer">
          <div className="rag-trace-view__legend">
            <span className="rag-trace-view__legend-item rag-trace-view__legend-item--trace"><span />trace</span>
            <span className="rag-trace-view__legend-item rag-trace-view__legend-item--span"><span />span</span>
            <span className="rag-trace-view__legend-item rag-trace-view__legend-item--gen"><span />generation</span>
            <span className="rag-trace-view__legend-item rag-trace-view__legend-item--event"><span />event</span>
          </div>
          <span>1 trace, 8 observations - p95 1.82s</span>
        </div>
      </div>

      <style>{`
        .rag-trace-view {
          container-type: inline-size;
          margin: 32px 0;
          width: 100%;
          color: var(--text-primary);
        }

        .rag-trace-view__card {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          background: var(--surface-bg);
        }

        .rag-trace-view__card::before {
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
          -webkit-mask-position: 0% 0%, 0% 100%, 100% 100%, 100% 0%;
          mask-position: 0% 0%, 0% 100%, 100% 100%, 100% 0%;
          -webkit-mask-size: 8px 8px;
          mask-size: 8px 8px;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
        }

        .rag-trace-view__columns,
        .rag-trace-view__row {
          display: grid;
          grid-template-columns: 50% 50%;
        }

        .rag-trace-view__column-header {
          display: flex;
          height: clamp(14px, 5.3cqw, 36px);
          align-items: center;
          border-bottom: 1px solid var(--line-structure);
          background: var(--surface-1);
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: clamp(4px, 1.45cqw, 10px);
          letter-spacing: 0.06em;
          line-height: 1;
          text-transform: uppercase;
        }

        .rag-trace-view__column-header--left {
          justify-content: space-between;
          padding: 0 clamp(5px, 2.1cqw, 14px);
        }

        .rag-trace-view__ruler {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .rag-trace-view__ruler span {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: clamp(4px, 1.45cqw, 10px);
          white-space: nowrap;
        }

        .rag-trace-view__ruler span:first-child {
          transform: translate(0, -50%);
        }

        .rag-trace-view__row {
          min-height: clamp(16px, 5.6cqw, 38px);
          border-bottom: 1px dashed var(--line-divider-dash);
        }

        .rag-trace-view__row:last-child {
          border-bottom: 0;
        }

        .rag-trace-view__left {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: clamp(3px, 1.45cqw, 10px);
          padding: clamp(3px, 1.2cqw, 8px) clamp(5px, 2.1cqw, 14px);
        }

        .rag-trace-view__right {
          position: relative;
          border-left: 1px solid var(--line-structure);
        }

        .rag-trace-view__gridlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .rag-trace-view__gridline {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 1px;
          background: var(--line-divider-dash);
          opacity: 0.5;
        }

        .rag-trace-view__indent {
          position: relative;
          width: clamp(4px, 2cqw, 14px);
          height: 100%;
          flex: 0 0 auto;
        }

        .rag-trace-view__indent::before {
          content: "";
          position: absolute;
          top: -50%;
          bottom: -50%;
          left: 50%;
          width: 1px;
          background: var(--line-structure);
        }

        .rag-trace-view__pill {
          display: inline-flex;
          height: clamp(8px, 2.7cqw, 18px);
          min-width: clamp(22px, 7.6cqw, 52px);
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border: 1px solid currentColor;
          border-radius: 2px;
          font-family: var(--font-mono);
          font-size: clamp(3.8px, 1.35cqw, 9.5px);
          font-weight: 500;
          letter-spacing: 0.06em;
          line-height: 1;
          text-transform: uppercase;
        }

        .rag-trace-view__pill--trace {
          color: var(--text-secondary);
          background: var(--surface-1);
        }

        .rag-trace-view__pill--span {
          color: var(--text-code-blue);
          background: color-mix(in oklab, var(--text-code-blue) 12%, var(--surface-bg));
        }

        .rag-trace-view__pill--gen {
          color: var(--text-code-pink);
          background: color-mix(in oklab, var(--text-code-pink) 12%, var(--surface-bg));
        }

        .rag-trace-view__pill--event {
          color: var(--text-code-orange);
          background: color-mix(in oklab, var(--text-code-orange) 14%, var(--surface-bg));
        }

        .rag-trace-view__name,
        .rag-trace-view__duration {
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: clamp(4.5px, 1.9cqw, 13px);
          letter-spacing: 0;
          line-height: 1.15;
          white-space: nowrap;
        }

        .rag-trace-view__name {
          min-width: 0;
          flex: 1 1 auto;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rag-trace-view__duration {
          flex: 0 0 auto;
          color: var(--text-secondary);
          font-size: clamp(4px, 1.75cqw, 12px);
        }

        .rag-trace-view__bar {
          position: absolute;
          top: 50%;
          height: clamp(6px, 2.35cqw, 16px);
          transform: translateY(-50%);
          border: 1px solid currentColor;
          border-radius: 2px;
        }

        .rag-trace-view__bar--trace {
          color: var(--text-tertiary);
          background: color-mix(in oklab, var(--text-tertiary) 22%, var(--surface-bg));
        }

        .rag-trace-view__bar--span {
          color: var(--text-code-blue);
          background: color-mix(in oklab, var(--text-code-blue) 32%, var(--surface-bg));
        }

        .rag-trace-view__bar--gen {
          color: var(--text-code-pink);
          background: color-mix(in oklab, var(--text-code-pink) 28%, var(--surface-bg));
        }

        .rag-trace-view__event-marker {
          position: absolute;
          top: 50%;
          width: 2px;
          height: clamp(7px, 2.65cqw, 18px);
          transform: translateY(-50%);
          border-radius: 1px;
          background: var(--text-code-orange);
        }

        .rag-trace-view__footer {
          display: flex;
          height: clamp(14px, 4.7cqw, 32px);
          align-items: center;
          justify-content: space-between;
          gap: clamp(4px, 2cqw, 14px);
          border-top: 1px solid var(--line-structure);
          background: var(--surface-1);
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: clamp(4px, 1.45cqw, 10px);
          letter-spacing: 0.06em;
          line-height: 1;
          padding: 0 clamp(5px, 2.1cqw, 14px);
          text-transform: uppercase;
          white-space: nowrap;
        }

        .rag-trace-view__legend {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: clamp(4px, 2cqw, 14px);
          overflow: hidden;
        }

        .rag-trace-view__legend-item {
          display: inline-flex;
          align-items: center;
          gap: clamp(2px, 0.9cqw, 6px);
        }

        .rag-trace-view__legend-item span {
          width: clamp(4px, 1.45cqw, 10px);
          height: clamp(4px, 1.45cqw, 10px);
          border: 1px solid currentColor;
          border-radius: 2px;
        }

        .rag-trace-view__legend-item--trace {
          color: var(--text-tertiary);
        }

        .rag-trace-view__legend-item--span {
          color: var(--text-code-blue);
        }

        .rag-trace-view__legend-item--gen {
          color: var(--text-code-pink);
        }

        .rag-trace-view__legend-item--event {
          color: var(--text-code-orange);
        }

        .rag-trace-view__legend-item--event span {
          width: 2px;
          border-color: var(--text-code-orange);
          background: var(--text-code-orange);
        }
      `}</style>
    </figure>
  );
}
