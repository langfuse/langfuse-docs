import type { ReactNode } from "react";

function Connector() {
  return (
    <div className="evaluation-evolution__connector" aria-hidden="true">
      <div className="evaluation-evolution__line" />
      <div className="evaluation-evolution__arrow" />
    </div>
  );
}

function ManualReviewGlyph() {
  return (
    <svg viewBox="0 0 240 110" fill="none" aria-hidden="true">
      <g stroke="var(--eval-manual-ink)" strokeWidth="1.25">
        <rect x="24" y="18" width="168" height="14" rx="2" fill="var(--eval-glyph-light-surface)" />
        <rect x="24" y="38" width="168" height="14" rx="2" fill="var(--eval-glyph-light-surface)" />
        <rect x="24" y="58" width="168" height="14" rx="2" fill="var(--eval-glyph-light-surface)" />
        <rect x="24" y="78" width="168" height="14" rx="2" fill="var(--eval-glyph-light-surface)" />
      </g>
      <g fill="var(--eval-manual-ink)" opacity="0.55">
        <rect x="32" y="23" width="54" height="4" rx="1" />
        <rect x="32" y="43" width="86" height="4" rx="1" />
        <rect x="32" y="63" width="40" height="4" rx="1" />
        <rect x="32" y="83" width="72" height="4" rx="1" />
      </g>
      <g transform="translate(150 50)">
        <circle cx="0" cy="0" r="22" fill="var(--eval-glyph-warm-surface)" stroke="var(--eval-glyph-ink)" strokeWidth="2" />
        <circle cx="0" cy="0" r="22" fill="none" stroke="#fbff81" strokeWidth="4" opacity="0.5" />
        <line x1="16" y1="16" x2="30" y2="30" stroke="var(--eval-glyph-ink)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="-4" cy="-4" r="5" fill="#fff" opacity="0.55" />
      </g>
    </svg>
  );
}

function FailureModesGlyph() {
  return (
    <svg viewBox="0 0 240 110" fill="none" aria-hidden="true">
      <g stroke="var(--eval-glyph-ink)" strokeWidth="1.5">
        <rect x="34" y="14" width="14" height="14" rx="2" fill="var(--eval-glyph-light-surface)" />
        <rect x="34" y="38" width="14" height="14" rx="2" fill="var(--eval-glyph-light-surface)" />
        <rect x="34" y="62" width="14" height="14" rx="2" fill="var(--eval-glyph-light-surface)" />
        <rect x="34" y="86" width="14" height="14" rx="2" fill="var(--eval-glyph-light-surface)" />
      </g>
      <g stroke="var(--eval-glyph-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M37.5 21.5 l3 3 l5 -6" />
        <path d="M37.5 45.5 l3 3 l5 -6" />
        <path d="M37.5 69.5 l3 3 l5 -6" />
      </g>
      <g fill="var(--eval-glyph-ink)" opacity="0.65">
        <rect x="58" y="19" width="118" height="4" rx="1" />
        <rect x="58" y="43" width="96" height="4" rx="1" />
        <rect x="58" y="67" width="134" height="4" rx="1" />
        <rect x="58" y="91" width="82" height="4" rx="1" opacity="0.45" />
      </g>
      <g transform="translate(150 92) rotate(-30)">
        <path d="M0 0 L20 -4 L26 0 L20 4 Z" fill="var(--eval-glyph-ink)" />
        <path d="M-2 0 L4 -2 L4 2 Z" fill="#fbff81" />
      </g>
    </svg>
  );
}

function AutomateGlyph() {
  return (
    <svg viewBox="0 0 240 110" fill="none" aria-hidden="true">
      <g>
        <rect x="22" y="22" width="86" height="66" rx="2" fill="var(--eval-glyph-panel)" stroke="var(--eval-glyph-panel)" />
        <circle cx="30" cy="30" r="2" fill="#cc3314" />
        <circle cx="38" cy="30" r="2" fill="#e09d00" />
        <circle cx="46" cy="30" r="2" fill="#538a2e" />
        <rect x="30" y="42" width="38" height="3" rx="1" fill="#fbff81" />
        <rect x="30" y="50" width="58" height="3" rx="1" fill="#f6f6f3" opacity="0.55" />
        <rect x="38" y="58" width="42" height="3" rx="1" fill="#f6f6f3" opacity="0.55" />
        <rect x="38" y="66" width="30" height="3" rx="1" fill="#fbff81" />
        <rect x="30" y="74" width="22" height="3" rx="1" fill="#f6f6f3" opacity="0.55" />
      </g>
      <g stroke="var(--eval-glyph-ink)" strokeWidth="1.25" fill="none" strokeLinecap="round">
        <path d="M115 38 H132" />
        <path d="M115 56 H132" />
        <path d="M115 74 H132" />
      </g>
      <g fill="var(--eval-glyph-ink)">
        <path d="M134 38 l-4 -3 l0 6 z" />
        <path d="M134 56 l-4 -3 l0 6 z" />
        <path d="M134 74 l-4 -3 l0 6 z" />
      </g>
      <g>
        <rect x="138" y="30" width="60" height="16" rx="2" fill="var(--eval-glyph-light-surface)" stroke="var(--eval-glyph-ink)" strokeWidth="1.25" />
        <circle cx="148" cy="38" r="3" fill="#538a2e" />
        <rect x="156" y="36" width="34" height="4" rx="1" fill="var(--eval-glyph-ink)" opacity="0.55" />
        <rect x="138" y="48" width="60" height="16" rx="2" fill="var(--eval-glyph-highlight-bg)" stroke="var(--eval-glyph-ink)" strokeWidth="1.25" />
        <circle cx="148" cy="56" r="3" fill="var(--eval-glyph-ink)" />
        <rect x="156" y="54" width="28" height="4" rx="1" fill="var(--eval-glyph-ink)" opacity="0.7" />
        <rect x="138" y="66" width="60" height="16" rx="2" fill="var(--eval-glyph-light-surface)" stroke="var(--eval-glyph-ink)" strokeWidth="1.25" />
        <circle cx="148" cy="74" r="3" fill="#cc3314" />
        <rect x="156" y="72" width="40" height="4" rx="1" fill="var(--eval-glyph-ink)" opacity="0.55" />
      </g>
    </svg>
  );
}

function Stage({
  className,
  step,
  title,
  children,
}: {
  className: string;
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={`evaluation-evolution__stage ${className}`}>
      <span className="evaluation-evolution__caption">{step}</span>
      <div className="evaluation-evolution__title">{title}</div>
      <div className="evaluation-evolution__glyph">{children}</div>
    </section>
  );
}

export function EvaluationEvolutionDiagram() {
  return (
    <figure className="evaluation-evolution not-prose" aria-label="How evaluation typically evolves from manual review to automated evaluators">
      <div className="evaluation-evolution__wrap">
        <div className="evaluation-evolution__flow">
          <Stage className="evaluation-evolution__stage--one" step="Step 01" title="Manual review">
            <ManualReviewGlyph />
          </Stage>
          <Connector />
          <Stage className="evaluation-evolution__stage--two" step="Step 02" title={"Identify\nfailure\u00a0modes"}>
            <FailureModesGlyph />
          </Stage>
          <Connector />
          <Stage className="evaluation-evolution__stage--three" step="Step 03" title="Automate">
            <AutomateGlyph />
          </Stage>
        </div>

        <div className="evaluation-evolution__loop" aria-hidden="true">
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M 852 0 V 47" stroke="var(--eval-loop-line)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            <path d="M 852 47 H 148" stroke="var(--eval-loop-line)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            <path d="M 148 47 V 0" stroke="var(--eval-loop-line)" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            <path d="M 148 0 l -5 7 l 10 0 z" fill="var(--eval-loop-arrow)" />
          </svg>
        </div>
      </div>

      <style>{`
        .evaluation-evolution {
          --eval-stage-one-tint: #f1ede1;
          --eval-stage-one-stroke: #d6cfb6;
          --eval-stage-one-ink: #6b5e2b;
          --eval-stage-two-tint: var(--surface-bg);
          --eval-stage-two-stroke: var(--line-structure);
          --eval-stage-two-ink: #2c2c28;
          --eval-stage-three-tint: #f1ede1;
          --eval-stage-three-stroke: #d6cfb6;
          --eval-stage-three-ink: #6b5e2b;
          --eval-glyph-ink: #2c2c28;
          --eval-glyph-panel: #222220;
          --eval-glyph-light-surface: #f6f6f3;
          --eval-glyph-warm-surface: #f1ede1;
          --eval-manual-ink: #6b5e2b;
          --eval-loop-line: #6c6760;
          --eval-loop-arrow: #404039;
          --eval-glyph-highlight-bg: #fbff81;
          container-type: inline-size;
          margin: 32px 0 80px;
          width: 100%;
        }

        .dark .evaluation-evolution,
        [data-theme="dark"] .evaluation-evolution {
          --eval-stage-one-tint: var(--surface-bg);
          --eval-stage-one-stroke: var(--line-structure);
          --eval-stage-one-ink: var(--text-secondary);
          --eval-stage-two-ink: var(--text-secondary);
          --eval-stage-three-tint: var(--surface-bg);
          --eval-stage-three-stroke: var(--line-structure);
          --eval-stage-three-ink: var(--text-secondary);
          --eval-glyph-ink: var(--text-secondary);
          --eval-glyph-panel: var(--surface-2);
          --eval-glyph-light-surface: var(--surface-2);
          --eval-glyph-warm-surface: var(--surface-2);
          --eval-manual-ink: var(--text-secondary);
          --eval-loop-line: var(--text-tertiary);
          --eval-loop-arrow: var(--text-secondary);
          --eval-glyph-highlight-bg: #5a5a1f;
        }

        .evaluation-evolution__wrap {
          position: relative;
          width: 100%;
        }

        .evaluation-evolution__flow {
          display: grid;
          grid-template-columns: minmax(0, 1fr) clamp(18px, 8cqw, 56px) minmax(0, 1fr) clamp(18px, 8cqw, 56px) minmax(0, 1fr);
          align-items: center;
          gap: 0;
        }

        .evaluation-evolution__stage {
          position: relative;
          display: flex;
          aspect-ratio: 1 / 1;
          min-height: 0;
          width: 100%;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          gap: clamp(4px, 1.8cqw, 18px);
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          background: var(--surface-bg);
          padding: clamp(12px, 7cqw, 44px) clamp(7px, 4cqw, 28px) clamp(8px, 5cqw, 32px);
          transition: border-color 0.18s ease;
        }

        .evaluation-evolution__stage::before {
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
          opacity: 0.72;
          transition: background-color 0.18s ease, opacity 0.18s ease;
        }

        .evaluation-evolution__stage:hover {
          border-color: var(--line-cta);
        }

        .evaluation-evolution__stage:hover::before {
          background-color: var(--line-cta);
          opacity: 1;
        }

        .evaluation-evolution__stage--one {
          border-color: var(--eval-stage-one-stroke);
          background: var(--eval-stage-one-tint);
        }

        .evaluation-evolution__stage--one::before {
          background-color: var(--eval-stage-one-ink);
        }

        .evaluation-evolution__stage--two {
          border-color: var(--eval-stage-two-stroke);
          background: var(--eval-stage-two-tint);
        }

        .evaluation-evolution__stage--two::before {
          background-color: var(--eval-stage-two-ink);
        }

        .evaluation-evolution__stage--three {
          border-color: var(--eval-stage-three-stroke);
          background: var(--eval-stage-three-tint);
        }

        .evaluation-evolution__stage--three::before {
          background-color: var(--eval-stage-three-ink);
        }

        .evaluation-evolution__caption {
          position: absolute;
          top: -1px;
          left: 24px;
          z-index: 3;
          transform: translateY(-50%);
          background: var(--surface-bg);
          padding: 0 10px;
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: clamp(5px, 1.6cqw, 11px);
          letter-spacing: 0.08em;
          line-height: 1.4;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .evaluation-evolution__stage--one > .evaluation-evolution__caption {
          color: var(--eval-stage-one-ink);
        }

        .evaluation-evolution__stage--three > .evaluation-evolution__caption {
          color: var(--eval-stage-three-ink);
        }

        .evaluation-evolution__title {
          color: var(--text-primary);
          font-family: var(--font-analog);
          font-feature-settings: "dlig" on;
          font-size: clamp(8px, 3.1cqw, 24px);
          font-weight: 500;
          letter-spacing: 0;
          line-height: 1.1;
          white-space: pre-line;
        }

        .evaluation-evolution__glyph {
          display: flex;
          flex: 1 1 auto;
          width: 100%;
          min-height: 0;
          max-height: clamp(28px, 16cqw, 120px);
          align-items: center;
          justify-content: center;
        }

        .evaluation-evolution__glyph svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .evaluation-evolution__connector {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .evaluation-evolution__line {
          width: 100%;
          height: 1px;
          background-image: linear-gradient(to right, var(--text-tertiary) 50%, transparent 0%);
          background-repeat: repeat-x;
          background-size: 6px 1px;
        }

        .evaluation-evolution__arrow {
          position: absolute;
          right: 6px;
          width: 0;
          height: 0;
          border-top: clamp(3px, 1cqw, 5px) solid transparent;
          border-bottom: clamp(3px, 1cqw, 5px) solid transparent;
          border-left: clamp(4px, 1.2cqw, 7px) solid var(--text-secondary);
        }

        .evaluation-evolution__loop {
          position: absolute;
          top: 100%;
          right: 0;
          left: 0;
          height: 56px;
          overflow: visible;
          pointer-events: none;
        }

        .evaluation-evolution__loop svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        @container (max-width: 520px) {
          .evaluation-evolution__caption {
            left: clamp(6px, 5cqw, 24px);
            padding: 0 clamp(3px, 1.6cqw, 10px);
            letter-spacing: 0.04em;
          }

          .evaluation-evolution__stage::before {
            -webkit-mask-size: 6px 6px;
            mask-size: 6px 6px;
          }
        }
      `}</style>
    </figure>
  );
}
