"use client";

import { useLayoutEffect, useRef } from "react";

const INNER_W = 1100;
const INNER_H = 150;

const STEPS = [
  {
    num: "01",
    label: "Collect",
    title: "Gather traces",
  },
  {
    num: "02",
    label: "Note",
    title: "Open coding",
  },
  {
    num: "03",
    label: "Group",
    title: "Cluster into categories",
  },
  {
    num: "04",
    label: "Quantify",
    title: "Label & measure",
  },
  {
    num: "05",
    label: "Act",
    title: "Decide & act",
    accent: true,
  },
];

function estimateInitialScale(): number {
  if (typeof window === "undefined") return 0.65;
  const vw = document.documentElement.clientWidth;
  return Math.min(1, Math.max(0.3, (vw - 32) / INNER_W));
}

export function ErrorAnalysisProcessDiagram() {
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
      className="error-analysis-process not-prose"
      aria-label="The five steps of the error analysis process"
    >
      <div
        ref={wrapRef}
        suppressHydrationWarning
        className="error-analysis-process__wrap"
        style={{ height: INNER_H * estScale }}
      >
        <div
          ref={innerRef}
          suppressHydrationWarning
          className="error-analysis-process__canvas"
          style={{ transform: `scale(${estScale})` }}
        >
          {STEPS.map((step, i) => (
            <div key={step.num} className="error-analysis-process__row-cell">
              <article
                className={`error-analysis-process__step corner-box-corners${
                  step.accent ? " error-analysis-process__step--accent" : ""
                }`}
              >
                <div className="error-analysis-process__num">
                  <strong>{step.num}</strong>
                  <span className="error-analysis-process__label">
                    {step.label}
                  </span>
                </div>
                <h3 className="error-analysis-process__title">{step.title}</h3>
              </article>
              {i < STEPS.length - 1 && (
                <div
                  className="error-analysis-process__connector"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 32 14" preserveAspectRatio="none">
                    <line
                      x1="0"
                      y1="7"
                      x2="26"
                      y2="7"
                      stroke="var(--line-cta)"
                      strokeWidth="1.5"
                    />
                    <polyline
                      points="20,2 26,7 20,12"
                      fill="none"
                      stroke="var(--line-cta)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .error-analysis-process {
          margin: 32px 0;
          width: 100%;
        }

        .error-analysis-process__wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .error-analysis-process__canvas {
          width: ${INNER_W}px;
          height: ${INNER_H}px;
          transform-origin: top left;
          display: flex;
          align-items: stretch;
          gap: 0;
        }

        .error-analysis-process__row-cell {
          display: flex;
          align-items: stretch;
          flex: 1 1 0;
          min-width: 0;
        }

        .error-analysis-process__step {
          position: relative;
          flex: 1 1 0;
          min-width: 0;
          padding: 18px 18px 20px;
          background: var(--surface-bg);
          border: 1px solid var(--line-structure);
          border-radius: 0;
          display: flex;
          flex-direction: column;
        }

        .error-analysis-process__step--accent {
          background: color-mix(in oklab, var(--surface-cta-primary) 28%, var(--surface-bg));
        }

        .error-analysis-process__num {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.1em;
          color: var(--text-disabled);
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        .error-analysis-process__num strong {
          font-weight: 600;
          color: var(--text-primary);
        }

        .error-analysis-process__label {
          background-image: linear-gradient(
            transparent 55%,
            color-mix(in oklab, var(--surface-cta-primary) 85%, transparent) 55% 95%,
            transparent 95%
          );
          padding: 0 4px;
          color: var(--text-secondary);
        }

        .error-analysis-process__title {
          font-family: var(--font-analog), serif;
          font-weight: 500;
          font-size: 24px;
          line-height: 1.08;
          letter-spacing: -0.005em;
          color: var(--text-primary);
          margin: 0;
        }

        .error-analysis-process__connector {
          flex: 0 0 24px;
          align-self: center;
          height: 14px;
          margin: 0 -1px;
          z-index: 1;
        }

        .error-analysis-process__connector svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
      `}</style>
    </figure>
  );
}
