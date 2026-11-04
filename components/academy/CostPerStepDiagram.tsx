"use client";

import { useLayoutEffect, useRef } from "react";

// Cost per LLM call for one agent task, and two ways to bring the total down:
// a cheaper model with the same behavior, or fewer calls. Used on
// /academy/experiments/cost-optimization. Drawn on a fixed 1200x820 canvas
// that scales to the container width, like ErrorAnalysisProcessDiagram.

const INNER_W = 1200;
const INNER_H = 820;

type Row = { label: string; value: string | null };
type Card = { left: number; top: number; rows: Row[]; total: string };

const CARDS: Card[] = [
  {
    left: 140,
    top: 230,
    total: "57",
    rows: [
      { label: "LLM call 1", value: "5" },
      { label: "LLM call 2", value: "7" },
      { label: "LLM call 3", value: "10" },
      { label: "LLM call 4", value: "15" },
      { label: "LLM call 5", value: "20" },
    ],
  },
  {
    left: 840,
    top: 40,
    total: "45.6",
    rows: [
      { label: "LLM call 1", value: "4" },
      { label: "LLM call 2", value: "5.6" },
      { label: "LLM call 3", value: "8" },
      { label: "LLM call 4", value: "12" },
      { label: "LLM call 5", value: "16" },
    ],
  },
  {
    left: 840,
    top: 440,
    total: "40",
    rows: [
      { label: "LLM call 1", value: "5" },
      { label: "LLM call 2", value: null },
      { label: "LLM call 3", value: null },
      { label: "LLM call 4", value: "15" },
      { label: "LLM call 5", value: "20" },
    ],
  },
];

function estimateInitialScale(): number {
  if (typeof window === "undefined") return 0.65;
  const vw = document.documentElement.clientWidth;
  return Math.min(1, Math.max(0.3, (vw - 32) / INNER_W));
}

export function CostPerStepDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const estScale = estimateInitialScale();

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const sizer = sizerRef.current;
    const inner = innerRef.current;
    if (!wrap || !sizer || !inner) return;

    const fit = () => {
      const scale = Math.min(1, wrap.clientWidth / INNER_W);
      inner.style.transform = `scale(${scale})`;
      sizer.style.width = `${INNER_W * scale}px`;
      sizer.style.height = `${INNER_H * scale}px`;
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
      className="cost-per-step not-prose"
      aria-label="Cost per LLM call for one agent task: five calls costing 5, 7, 10, 15, and 20, total 57. A 20% cheaper model with the same behavior brings the total to 45.6. Eliminating steps 2 and 3 brings it to 40."
    >
      <div ref={wrapRef} className="cost-per-step__wrap">
        <div
          ref={sizerRef}
          suppressHydrationWarning
          className="cost-per-step__sizer"
          style={{ width: INNER_W * estScale, height: INNER_H * estScale }}
        >
          <div
            ref={innerRef}
            suppressHydrationWarning
            className="cost-per-step__canvas"
            style={{ transform: `scale(${estScale})` }}
          >
            <svg
              width={INNER_W}
              height={INNER_H}
              viewBox={`0 0 ${INNER_W} ${INNER_H}`}
              className="cost-per-step__lines"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="cost-per-step-arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="12"
                  markerHeight="12"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path
                    d="M1,1 L9,5 L1,9"
                    fill="none"
                    stroke="var(--text-secondary)"
                    strokeWidth="1.25"
                  />
                </marker>
              </defs>
              <line
                x1="392"
                y1="340"
                x2="826"
                y2="186"
                stroke="var(--text-secondary)"
                strokeWidth="1.25"
                strokeDasharray="5 5"
                markerEnd="url(#cost-per-step-arrow)"
              />
              <line
                x1="392"
                y1="404"
                x2="826"
                y2="576"
                stroke="var(--text-secondary)"
                strokeWidth="1.25"
                strokeDasharray="5 5"
                markerEnd="url(#cost-per-step-arrow)"
              />
              <text
                className="cost-per-step__note"
                fill="var(--text-secondary)"
              >
                <tspan x="470" y="224">
                  20% cheaper model
                </tspan>
                <tspan x="470" y="248">
                  with same behavior
                </tspan>
              </text>
              <text
                className="cost-per-step__note"
                fill="var(--text-secondary)"
              >
                <tspan x="630" y="452">
                  eliminate steps
                </tspan>
                <tspan x="630" y="476">
                  2 and 3
                </tspan>
              </text>
            </svg>

            {CARDS.map((card) => (
              <div
                key={`${card.left}-${card.top}`}
                className="cost-per-step__group"
                style={{ left: card.left, top: card.top }}
              >
                <div className="cost-per-step__card corner-box-corners">
                  {card.rows.map((row) => (
                    <div
                      key={row.label}
                      className={`cost-per-step__row${
                        row.value === null ? " cost-per-step__row--removed" : ""
                      }`}
                    >
                      <span className="cost-per-step__label">{row.label}</span>
                      <span className="cost-per-step__value">
                        {row.value ?? ""}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="cost-per-step__total">
                  <span className="cost-per-step__total-label">Total</span>
                  <span className="cost-per-step__total-value">
                    {card.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .cost-per-step {
          margin: 32px 0;
          width: 100%;
        }

        .cost-per-step__wrap {
          width: 100%;
          overflow: hidden;
        }

        .cost-per-step__sizer {
          position: relative;
          overflow: hidden;
        }

        .cost-per-step__canvas {
          position: relative;
          width: ${INNER_W}px;
          height: ${INNER_H}px;
          transform-origin: top left;
        }

        .cost-per-step__lines {
          position: absolute;
          inset: 0;
          display: block;
        }

        .cost-per-step__note {
          font-family: var(--font-sans);
          font-size: 17px;
          letter-spacing: -0.005em;
        }

        .cost-per-step__group {
          position: absolute;
          width: 240px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cost-per-step__card {
          position: relative;
          border: 1px solid var(--line-structure);
          padding: 6px 20px;
          display: flex;
          flex-direction: column;
        }

        .cost-per-step__row {
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 -20px;
          padding: 0 20px;
        }

        .cost-per-step__row + .cost-per-step__row {
          border-top: 1px dashed var(--line-divider-dash);
        }

        .cost-per-step__row--removed {
          background: repeating-linear-gradient(
            315deg,
            color-mix(in oklab, var(--text-secondary) 10%, transparent) 0 1px,
            transparent 1px 4px
          );
        }

        .cost-per-step__row--removed .cost-per-step__label {
          color: var(--text-disabled);
        }

        .cost-per-step__label {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.04em;
          white-space: nowrap;
          color: var(--text-tertiary);
        }

        .cost-per-step__value {
          font-family: var(--font-mono);
          font-size: 22px;
          color: var(--text-primary);
          margin-left: auto;
        }

        .cost-per-step__total {
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding-left: 2px;
        }

        .cost-per-step__total-label {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .cost-per-step__total-value {
          font-family: var(--font-analog), serif;
          font-weight: 500;
          font-size: 36px;
          line-height: 1;
          color: var(--text-primary);
        }
      `}</style>
    </figure>
  );
}
