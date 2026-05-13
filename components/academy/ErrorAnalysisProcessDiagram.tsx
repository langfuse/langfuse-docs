"use client";

import { useLayoutEffect, useRef } from "react";

const INNER_W = 1100;
const INNER_H = 270;

const STEPS = [
  {
    num: "01",
    label: "Collect",
    title: "Gather traces",
    desc: (
      <>
        Production traffic, datasets, or experiment outputs. The{" "}
        <strong>raw material</strong> of analysis.
      </>
    ),
  },
  {
    num: "02",
    label: "Note",
    title: "Open coding",
    desc: (
      <>
        A free-text note per trace — the{" "}
        <strong>first thing that went wrong</strong>. No taxonomy yet.
      </>
    ),
  },
  {
    num: "03",
    label: "Group",
    title: "Cluster into categories",
    desc: (
      <>
        An <strong>LLM drafts</strong> the taxonomy from your notes. You refine
        it — names matter.
      </>
    ),
  },
  {
    num: "04",
    label: "Quantify",
    title: "Label & measure",
    desc: (
      <>
        Tag every trace · compute failure rates per category. Now you have a{" "}
        <strong>chart</strong>.
      </>
    ),
  },
  {
    num: "05",
    label: "Act",
    title: "Decide & act",
    desc: (
      <>
        Fix the bug · build an evaluator · or set up monitoring. The output of
        analysis is a <span className="error-analysis-process__hl">decision</span>.
      </>
    ),
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
                className={`error-analysis-process__step${
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
                <div className="error-analysis-process__desc">{step.desc}</div>
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
          flex: 1 1 0;
          min-width: 0;
          padding: 22px 20px 22px;
          background: var(--surface-bg);
          border: 1.5px solid var(--line-cta);
          border-radius: 2px;
          display: flex;
          flex-direction: column;
        }

        .error-analysis-process__step--accent {
          background: color-mix(in oklab, var(--surface-cta-primary) 28%, var(--surface-bg));
          border-color: var(--line-cta);
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
          margin-bottom: 18px;
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
          font-size: 26px;
          line-height: 1.08;
          letter-spacing: -0.005em;
          color: var(--text-primary);
          margin: 0 0 14px;
        }

        .error-analysis-process__desc {
          font-family: var(--font-sans);
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-tertiary);
          flex: 1;
        }

        .error-analysis-process__desc strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        .error-analysis-process__hl {
          background-image: linear-gradient(
            transparent 55%,
            color-mix(in oklab, var(--surface-cta-primary) 85%, transparent) 55% 95%,
            transparent 95%
          );
          padding: 0 3px;
          color: var(--text-primary);
          font-weight: 600;
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
