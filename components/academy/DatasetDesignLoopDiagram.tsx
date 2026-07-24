"use client";

import { useLayoutEffect, useRef } from "react";

const INNER_W = 820;
const INNER_H = 360;
const CARD_W = 160;
const CARD_H = 92;

type DatasetDesignLoopStep = {
  num: string;
  title: string;
  meta: string;
  x: number;
  y: number;
  variant?: "terminal";
};

const STEPS: DatasetDesignLoopStep[] = [
  {
    num: "01",
    title: "Define goal",
    meta: "scope / boundary",
    x: 36,
    y: 32,
  },
  {
    num: "02",
    title: "Gather sources",
    meta: "traces / experts",
    x: 232,
    y: 32,
  },
  {
    num: "03",
    title: "Define input distribution",
    meta: "coverage / roles",
    x: 36,
    y: 184,
  },
  {
    num: "04",
    title: "Choose eval style",
    meta: "reference / free",
    x: 232,
    y: 184,
  },
  {
    num: "05",
    title: "Design schema",
    meta: "input / output",
    x: 428,
    y: 184,
  },
  {
    num: "06",
    title: "Run experiment",
    meta: "failures / fit",
    x: 624,
    y: 184,
    variant: "terminal",
  },
];

function estimateInitialScale(): number {
  if (typeof window === "undefined") return 0.69;
  return Math.min(
    1,
    Math.max(0.28, (document.documentElement.clientWidth - 32) / INNER_W),
  );
}

function StepCard({ step }: { step: DatasetDesignLoopStep }) {
  return (
    <div
      className={`dataset-design-loop__card ${
        step.variant === "terminal" ? "dataset-design-loop__card--terminal" : ""
      }`}
      style={{ left: step.x, top: step.y }}
    >
      <span className="dataset-design-loop__num">{step.num}</span>
      <span
        className={`dataset-design-loop__title ${
          step.num === "03" ? "dataset-design-loop__title--compact" : ""
        }`}
      >
        {step.title}
      </span>
      <span className="dataset-design-loop__meta">{step.meta}</span>
    </div>
  );
}

export function DatasetDesignLoopDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const estScale = estimateInitialScale();

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const fit = () => {
      const scale = Math.min(1, wrap.clientWidth / INNER_W);
      inner.style.transform = `scale(${scale})`;
      wrap.style.height = `${INNER_H * scale}px`;
    };

    fit();
    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(fit);
    });
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <figure
      className="dataset-design-loop not-prose"
      aria-label="Dataset design loop from goal definition through sources, input distribution, evaluation design, schema design, experiment runs, and iteration"
    >
      <div
        ref={wrapRef}
        suppressHydrationWarning
        className="dataset-design-loop__wrap"
        style={{ height: INNER_H * estScale }}
      >
        <div
          ref={innerRef}
          suppressHydrationWarning
          className="dataset-design-loop__canvas"
          style={{ transform: `scale(${estScale})` }}
        >
          <div className="dataset-design-loop__frame" />
          <svg
            className="dataset-design-loop__arrows"
            viewBox={`0 0 ${INNER_W} ${INNER_H}`}
            aria-hidden="true"
          >
            <defs>
              <marker
                id="dataset-design-loop-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 Z" fill="var(--text-secondary)" />
              </marker>
              <marker
                id="dataset-design-loop-arrow-cta"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0 0 L10 5 L0 10 Z" fill="var(--line-cta)" />
              </marker>
            </defs>

            <path
              className="dataset-design-loop__arrow"
              d="M196 78 H232"
              markerEnd="url(#dataset-design-loop-arrow)"
            />
            <path
              className="dataset-design-loop__arrow"
              d="M312 124 V148 H116 V184"
              markerEnd="url(#dataset-design-loop-arrow)"
            />
            <path
              className="dataset-design-loop__arrow"
              d="M196 230 H232"
              markerEnd="url(#dataset-design-loop-arrow)"
            />
            <path
              className="dataset-design-loop__arrow"
              d="M392 230 H428"
              markerEnd="url(#dataset-design-loop-arrow)"
            />
            <path
              className="dataset-design-loop__arrow"
              d="M588 230 H624"
              markerEnd="url(#dataset-design-loop-arrow)"
            />
            <path
              className="dataset-design-loop__return-band"
              d="M704 276 C704 324 560 334 410 334 H158 C130 334 116 314 116 284"
            />
            <path
              className="dataset-design-loop__return-line"
              d="M704 276 C704 324 560 334 410 334 H158 C130 334 116 314 116 284"
              markerEnd="url(#dataset-design-loop-arrow-cta)"
            />
          </svg>

          <div className="dataset-design-loop__loop-label">
            Iterate and expand
          </div>

          {STEPS.map((step) => (
            <StepCard key={step.num} step={step} />
          ))}
        </div>
      </div>

      <style>{`
        .dataset-design-loop {
          margin: 28px 0 32px;
          width: 100%;
        }

        .dataset-design-loop__wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .dataset-design-loop__canvas {
          position: relative;
          width: ${INNER_W}px;
          height: ${INNER_H}px;
          transform-origin: top left;
        }

        .dataset-design-loop__frame {
          position: absolute;
          inset: 0;
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          background:
            linear-gradient(
              90deg,
              color-mix(in oklab, var(--line-structure) 30%, transparent) 1px,
              transparent 1px
            ),
            linear-gradient(
              180deg,
              color-mix(in oklab, var(--line-structure) 30%, transparent) 1px,
              transparent 1px
            ),
            var(--surface-bg);
          background-size: 56px 56px;
        }

        .dataset-design-loop__arrows {
          position: absolute;
          inset: 0;
          z-index: 1;
          width: ${INNER_W}px;
          height: ${INNER_H}px;
          overflow: visible;
          pointer-events: none;
        }

        .dataset-design-loop__arrow,
        .dataset-design-loop__return-line,
        .dataset-design-loop__return-band {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .dataset-design-loop__arrow {
          stroke: var(--text-secondary);
          stroke-width: 1.35;
        }

        .dataset-design-loop__return-band {
          stroke: color-mix(in oklab, var(--surface-cta-primary) 74%, transparent);
          stroke-width: 12;
        }

        .dataset-design-loop__return-line {
          stroke: var(--line-cta);
          stroke-width: 1.5;
        }

        .dataset-design-loop__loop-label {
          position: absolute;
          z-index: 3;
          left: 328px;
          top: 316px;
          padding: 5px 12px;
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          background: var(--surface-bg);
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        .dataset-design-loop__card {
          position: absolute;
          z-index: 2;
          width: ${CARD_W}px;
          height: ${CARD_H}px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          background: var(--surface-bg);
          padding: 12px 18px;
          transition: border-color 0.18s ease;
        }

        .dataset-design-loop__card::before {
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
          -webkit-mask-size: 8px 8px;
          mask-size: 8px 8px;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
        }

        .dataset-design-loop__card:hover {
          border-color: var(--line-cta);
        }

        .dataset-design-loop__card--terminal {
          background: var(--surface-cta-primary);
        }

        .dataset-design-loop__num,
        .dataset-design-loop__meta {
          display: block;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: 10px;
          line-height: 1.3;
          letter-spacing: 0;
        }

        .dataset-design-loop__num {
          margin-bottom: 8px;
          color: var(--text-disabled);
          font-size: 10px;
        }

        .dataset-design-loop__title {
          display: block;
          margin-bottom: 8px;
          color: var(--text-primary);
          font-family: var(--font-analog);
          font-size: 21px;
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: 0;
        }

        .dataset-design-loop__title--compact {
          font-size: 17px;
        }

        .dark .dataset-design-loop__card--terminal,
        [data-theme="dark"] .dataset-design-loop__card--terminal {
          background: transparent;
        }
      `}</style>
    </figure>
  );
}
