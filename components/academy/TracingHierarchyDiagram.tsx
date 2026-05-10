import type { ReactNode } from "react";

const TRACE_OBSERVATION_COUNTS = [3, 4, 2];

function CornerRing({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return <div className={`tracing-hierarchy__ring ${className}`}>{children}</div>;
}

function Observation() {
  return (
    <CornerRing className="tracing-hierarchy__observation">
      <span className="tracing-hierarchy__dot" />
      <span className="tracing-hierarchy__observation-label">Observation</span>
    </CornerRing>
  );
}

function Trace({ observationCount }: { observationCount: number }) {
  return (
    <CornerRing className="tracing-hierarchy__trace">
      <span className="tracing-hierarchy__caption">Trace</span>
      <div className="tracing-hierarchy__observations">
        {Array.from({ length: observationCount }, (_, index) => (
          <Observation key={index} />
        ))}
      </div>
    </CornerRing>
  );
}

export function TracingHierarchyDiagram() {
  return (
    <figure className="tracing-hierarchy not-prose" aria-label="Sessions contain traces, and traces contain observations">
      <CornerRing className="tracing-hierarchy__session">
        <span className="tracing-hierarchy__caption">Session</span>
        <div className="tracing-hierarchy__traces">
          {TRACE_OBSERVATION_COUNTS.map((observationCount, index) => (
            <Trace key={index} observationCount={observationCount} />
          ))}
        </div>
      </CornerRing>

      <style>{`
        .tracing-hierarchy {
          --trace-session-tint: #eceaf7;
          --trace-session-stroke: #b3abef;
          --trace-session-ink: #4a3fb3;
          --trace-tint: #f1ede1;
          --trace-stroke: #d6cfb6;
          --trace-ink: #6b5e2b;
          --trace-observation-stroke: var(--line-structure);
          container-type: inline-size;
          margin: 32px 0;
          width: 100%;
        }

        .dark .tracing-hierarchy,
        [data-theme="dark"] .tracing-hierarchy {
          --trace-session-tint: transparent;
          --trace-session-stroke: var(--line-structure);
          --trace-session-ink: var(--text-secondary);
          --trace-tint: transparent;
          --trace-stroke: var(--line-structure);
          --trace-ink: var(--text-secondary);
        }

        .tracing-hierarchy__ring {
          position: relative;
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          background: var(--surface-bg);
          transition: border-color 0.18s ease;
        }

        .tracing-hierarchy__ring::before {
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
          transition: background-color 0.18s ease;
        }

        .tracing-hierarchy__observation:hover,
        .tracing-hierarchy__trace:hover:not(:has(.tracing-hierarchy__observation:hover)),
        .tracing-hierarchy__session:hover:not(:has(.tracing-hierarchy__trace:hover)) {
          border-color: var(--line-cta);
        }

        .tracing-hierarchy__observation:hover::before,
        .tracing-hierarchy__trace:hover:not(:has(.tracing-hierarchy__observation:hover))::before,
        .tracing-hierarchy__session:hover:not(:has(.tracing-hierarchy__trace:hover))::before {
          background-color: var(--line-cta);
        }

        .tracing-hierarchy__caption {
          position: absolute;
          top: -1px;
          left: clamp(6px, 3.5cqw, 24px);
          z-index: 3;
          transform: translateY(-50%);
          padding: 0 clamp(3px, 1.5cqw, 10px);
          font-family: var(--font-mono);
          font-size: clamp(4.5px, 1.55cqw, 10.5px);
          letter-spacing: 0.08em;
          line-height: 1.4;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .tracing-hierarchy__session {
          padding: clamp(14px, 6cqw, 40px) clamp(10px, 4.8cqw, 32px) clamp(12px, 5.4cqw, 36px);
          border-color: var(--trace-session-stroke);
          background: var(--trace-session-tint);
        }

        .tracing-hierarchy__session::before {
          background-color: var(--trace-session-ink);
        }

        .tracing-hierarchy__session > .tracing-hierarchy__caption {
          background: var(--surface-bg);
          color: var(--trace-session-ink);
        }

        .tracing-hierarchy__traces {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(4px, 3.2cqw, 22px);
        }

        .tracing-hierarchy__trace {
          padding: clamp(12px, 4.4cqw, 30px) clamp(6px, 3.2cqw, 22px) clamp(8px, 3.5cqw, 24px);
          border-color: var(--trace-stroke);
          background: var(--trace-tint);
        }

        .tracing-hierarchy__trace::before {
          background-color: var(--trace-ink);
        }

        .tracing-hierarchy__trace > .tracing-hierarchy__caption {
          background: var(--trace-session-tint);
          color: var(--trace-ink);
        }

        .dark .tracing-hierarchy__trace > .tracing-hierarchy__caption,
        [data-theme="dark"] .tracing-hierarchy__trace > .tracing-hierarchy__caption {
          background: var(--surface-bg);
        }

        .tracing-hierarchy__observations {
          display: grid;
          gap: clamp(2px, 1.2cqw, 8px);
        }

        .tracing-hierarchy__observation {
          display: flex;
          min-height: clamp(12px, 4.2cqw, 28px);
          align-items: center;
          gap: clamp(3px, 1.5cqw, 10px);
          padding: clamp(3px, 1.5cqw, 10px) clamp(4px, 2.1cqw, 14px);
          border-color: var(--trace-observation-stroke);
          background: var(--surface-bg);
        }

        .dark .tracing-hierarchy__observation,
        [data-theme="dark"] .tracing-hierarchy__observation {
          background: transparent;
        }

        .tracing-hierarchy__observation::before {
          background-color: var(--line-cta);
        }

        .tracing-hierarchy__dot {
          width: clamp(3px, 1cqw, 7px);
          height: clamp(3px, 1cqw, 7px);
          flex: 0 0 auto;
          border-radius: 9999px;
          background: var(--text-secondary);
        }

        .tracing-hierarchy__observation-label {
          min-width: 0;
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: clamp(4px, 1.35cqw, 10.5px);
          letter-spacing: 0.06em;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: clip;
          text-transform: uppercase;
          white-space: nowrap;
        }

      `}</style>
    </figure>
  );
}
