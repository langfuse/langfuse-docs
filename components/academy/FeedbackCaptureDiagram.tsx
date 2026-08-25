"use client";

import { useId, useLayoutEffect, useRef } from "react";

const INNER_W = 900;
const INNER_H = 250;

const BOX_W_APP = 250;
const BOX_W_LF = 250;
const BOX_H = 60;
const APP_X = 0;
const LF_X = INNER_W - BOX_W_LF;
const ROW1_Y = 30;
const ROW2_Y = 160;

function estimateInitialScale(): number {
  if (typeof window === "undefined") return 0.7;
  const vw = document.documentElement.clientWidth;
  return Math.min(1, Math.max(0.3, (vw - 32) / INNER_W));
}

export function FeedbackCaptureDiagram() {
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

  const row1Mid = ROW1_Y + BOX_H / 2;
  const row2Mid = ROW2_Y + BOX_H / 2;
  const attachX = LF_X + 26;
  const gapMid = (ROW1_Y + BOX_H + ROW2_Y) / 2;
  const arrowId = `fc-arrow-${useId().replace(/:/g, "")}`;

  return (
    <figure
      className="feedback-capture not-prose"
      aria-label="In your app, an agent execution is captured as a trace in Langfuse, and a user signal is captured as a score that is attached to that trace"
    >
      <div
        ref={wrapRef}
        suppressHydrationWarning
        className="feedback-capture__wrap"
        style={{ height: INNER_H * estScale }}
      >
        <div
          ref={innerRef}
          suppressHydrationWarning
          className="feedback-capture__canvas"
          style={{ transform: `scale(${estScale})` }}
        >
          <span
            className="feedback-capture__col-label"
            style={{ left: APP_X, top: 6, width: BOX_W_APP }}
          >
            In your app
          </span>
          <span
            className="feedback-capture__col-label"
            style={{ left: LF_X, top: 6, width: BOX_W_LF }}
          >
            In Langfuse
          </span>

          <article
            className="feedback-capture__box corner-box-corners"
            style={{
              left: APP_X,
              top: ROW1_Y,
              width: BOX_W_APP,
              height: BOX_H,
            }}
          >
            <h3 className="feedback-capture__title">Agent execution</h3>
          </article>

          <article
            className="feedback-capture__box corner-box-corners"
            style={{
              left: APP_X,
              top: ROW2_Y,
              width: BOX_W_APP,
              height: BOX_H,
            }}
          >
            <h3 className="feedback-capture__title">User signal</h3>
          </article>

          <article
            className="feedback-capture__box corner-box-corners"
            style={{ left: LF_X, top: ROW1_Y, width: BOX_W_LF, height: BOX_H }}
          >
            <h3 className="feedback-capture__title">Trace</h3>
          </article>

          <article
            className="feedback-capture__box feedback-capture__box--score corner-box-corners"
            style={{ left: LF_X, top: ROW2_Y, width: BOX_W_LF, height: BOX_H }}
          >
            <h3 className="feedback-capture__title">Score</h3>
          </article>

          <svg
            className="feedback-capture__lines"
            viewBox={`0 0 ${INNER_W} ${INNER_H}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <marker
                id={arrowId}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path
                  d="M 0 1 L 8 5 L 0 9"
                  fill="none"
                  stroke="var(--line-cta)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>

            <line
              x1={BOX_W_APP + 6}
              y1={row1Mid}
              x2={LF_X - 8}
              y2={row1Mid}
              stroke="var(--line-cta)"
              strokeWidth="1.5"
              markerEnd={`url(#${arrowId})`}
            />
            <line
              x1={BOX_W_APP + 6}
              y1={row2Mid}
              x2={LF_X - 8}
              y2={row2Mid}
              stroke="var(--line-cta)"
              strokeWidth="1.5"
              markerEnd={`url(#${arrowId})`}
            />
            <line
              x1={attachX}
              y1={ROW2_Y - 6}
              x2={attachX}
              y2={ROW1_Y + BOX_H + 8}
              stroke="var(--line-cta)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              markerEnd={`url(#${arrowId})`}
            />
          </svg>

          <span
            className="feedback-capture__attach-label"
            style={{ left: attachX + 14, top: gapMid - 8 }}
          >
            attached to the trace
          </span>
        </div>
      </div>

      <style>{`
        .feedback-capture {
          margin: 32px 0;
          width: 100%;
        }

        .feedback-capture__wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .feedback-capture__canvas {
          position: relative;
          width: ${INNER_W}px;
          height: ${INNER_H}px;
          transform-origin: top left;
        }

        .feedback-capture__col-label {
          position: absolute;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-disabled);
        }

        .feedback-capture__box {
          position: absolute;
          padding: 12px 16px;
          background: var(--surface-bg);
          border: 1px solid var(--line-structure);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .feedback-capture__box--score {
          background: color-mix(in oklab, var(--surface-cta-primary) 24%, var(--surface-bg));
          border-style: dashed;
        }

        .feedback-capture__title {
          font-family: var(--font-analog), serif;
          font-weight: 500;
          font-size: 20px;
          line-height: 1.1;
          letter-spacing: -0.005em;
          color: var(--text-primary);
          margin: 0;
        }

        .feedback-capture__lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
        }

        .feedback-capture__attach-label {
          position: absolute;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.04em;
          color: var(--text-secondary);
          white-space: nowrap;
        }
      `}</style>
    </figure>
  );
}
