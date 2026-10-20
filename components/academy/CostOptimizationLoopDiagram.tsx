"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

// The cost optimization process as an application of the AI engineering loop:
// five steps left to right, and a return path once cost is down and quality
// still holds. Used on /academy/experiments/cost-optimization. Drawn on a
// fixed 1200x400 canvas that scales to the container width.

const INNER_W = 1200;
const INNER_H = 400;

type Segment = string | { text: string; href: string };

const STEPS: Array<{ left: number; segments: Segment[] }> = [
  {
    left: 40,
    segments: [
      { text: "trace", href: "/academy/tracing" },
      " cost and tokens on your LLM calls",
    ],
  },
  {
    left: 274,
    segments: [
      { text: "monitor", href: "/academy/monitoring" },
      " cost and tokens per feature, over time",
    ],
  },
  {
    left: 508,
    segments: [
      "have ",
      { text: "datasets", href: "/academy/datasets" },
      " that are representative of the real world",
    ],
  },
  { left: 742, segments: ["try cost improvements and run against datasets"] },
  {
    left: 976,
    segments: [
      { text: "evaluate", href: "/academy/evaluate" },
      " cost and output quality",
    ],
  },
];

const ARROWS: Array<[number, number]> = [
  [230, 268],
  [464, 502],
  [698, 736],
  [932, 970],
];

function estimateInitialScale(): number {
  if (typeof window === "undefined") return 0.65;
  const vw = document.documentElement.clientWidth;
  return Math.min(1, Math.max(0.3, (vw - 32) / INNER_W));
}

export function CostOptimizationLoopDiagram() {
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
      className="cost-loop not-prose"
      aria-label="The cost optimization loop: trace cost and tokens on your LLM calls, monitor cost and tokens per feature over time, have datasets that are representative of the real world, try cost improvements and run them against the datasets, evaluate cost and output quality. If cost is down and quality is still good, deploy the cost improvement and start again."
    >
      <div ref={wrapRef} className="cost-loop__wrap">
        <div
          ref={sizerRef}
          suppressHydrationWarning
          className="cost-loop__sizer"
          style={{ width: INNER_W * estScale, height: INNER_H * estScale }}
        >
          <div
            ref={innerRef}
            suppressHydrationWarning
            className="cost-loop__canvas"
            style={{ transform: `scale(${estScale})` }}
          >
            <svg
              width={INNER_W}
              height={INNER_H}
              viewBox={`0 0 ${INNER_W} ${INNER_H}`}
              className="cost-loop__lines"
              aria-hidden="true"
            >
              <defs>
                <marker
                  id="cost-loop-arrow"
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
              <g
                stroke="var(--text-secondary)"
                strokeWidth="1.25"
                markerEnd="url(#cost-loop-arrow)"
              >
                {ARROWS.map(([x1, x2]) => (
                  <line key={x1} x1={x1} y1="132" x2={x2} y2="132" />
                ))}
              </g>
              <path
                d="M1068,230 L1068,330 L132,330 L132,232"
                fill="none"
                stroke="var(--text-secondary)"
                strokeWidth="1.25"
                markerEnd="url(#cost-loop-arrow)"
              />
              <text
                textAnchor="end"
                className="cost-loop__note"
                fill="var(--text-secondary)"
              >
                <tspan x="1052" y="268">
                  cost down &amp;
                </tspan>
                <tspan x="1052" y="292">
                  quality still good?
                </tspan>
              </text>
            </svg>

            {STEPS.map((step) => (
              <div
                key={step.left}
                className="cost-loop__step"
                style={{ left: step.left }}
              >
                <p>
                  {step.segments.map((segment, i) =>
                    typeof segment === "string" ? (
                      <span key={i}>{segment}</span>
                    ) : (
                      <Link key={i} href={segment.href}>
                        {segment.text}
                      </Link>
                    ),
                  )}
                </p>
              </div>
            ))}

            <div className="cost-loop__deploy">
              <span>deploy cost improvement</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cost-loop {
          margin: 32px 0;
          width: 100%;
        }

        .cost-loop__wrap {
          width: 100%;
          overflow: hidden;
        }

        .cost-loop__sizer {
          position: relative;
          overflow: hidden;
        }

        .cost-loop__canvas {
          position: relative;
          width: ${INNER_W}px;
          height: ${INNER_H}px;
          transform-origin: top left;
        }

        .cost-loop__lines {
          position: absolute;
          inset: 0;
          display: block;
        }

        .cost-loop__note {
          font-family: var(--font-sans);
          font-weight: 450;
          font-size: 17px;
          letter-spacing: -0.005em;
        }

        .cost-loop__step {
          position: absolute;
          top: 40px;
          width: 184px;
          height: 184px;
          box-sizing: border-box;
          border: 1.5px solid var(--text-secondary);
          padding: 20px;
          display: flex;
          align-items: center;
        }

        .cost-loop__step a {
          color: var(--text-links, var(--text-primary));
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }

        .cost-loop__step a:hover {
          color: var(--text-primary);
        }

        .cost-loop__step p {
          margin: 0;
          font-family: var(--font-sans);
          font-weight: 450;
          font-size: 17px;
          line-height: 1.4;
          letter-spacing: -0.005em;
          color: var(--text-primary);
          text-wrap: pretty;
        }

        .cost-loop__deploy {
          position: absolute;
          left: 470px;
          top: 310px;
          width: 260px;
          height: 40px;
          box-sizing: border-box;
          background: var(--surface-cta-primary);
          border: 1.5px solid var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cost-loop__deploy span {
          font-family: var(--font-sans);
          font-weight: 450;
          font-size: 18px;
          letter-spacing: -0.005em;
          color: var(--text-primary);
          white-space: nowrap;
        }
      `}</style>
    </figure>
  );
}
