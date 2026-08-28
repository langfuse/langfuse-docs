"use client";

import { useLayoutEffect, useRef } from "react";

// Faithful port of the source diagram: a fixed 920px-wide canvas whose height
// follows its content, scaled down to fit the 680px blog column.
const INNER_W = 920;
const COLUMN_W = 680;

// Line widths of the page mock: the first group is what the harness retrieved,
// the second is what it cut off.
const FETCHED = [88, 72, 94, 64, 82, 58];
const TRUNCATED = [90, 76, 86, 62, 92, 70, 80];

function initialScale(): number {
  if (typeof window === "undefined") return COLUMN_W / INNER_W;
  const vw = document.documentElement.clientWidth;
  return Math.min(1, Math.max(0.1, Math.min(vw - 32, COLUMN_W) / INNER_W));
}

export function TruncatedFetch() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const estScale = initialScale();

  // `zoom` (rather than `transform: scale`) shrinks the canvas's layout box, so
  // the wrapper's height follows the content automatically.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const fit = () => {
      inner.style.zoom = String(Math.min(1, wrap.clientWidth / INNER_W));
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
      className="tf not-prose"
      aria-label="An agent fetches a Langfuse docs page, but only the top of the page comes back. The first six lines of the page are solid and outlined as retrieved; the seven lines below them are faded out, showing the part the harness cut off."
    >
      <div ref={wrapRef} className="tf__wrap">
        <div
          ref={innerRef}
          suppressHydrationWarning
          className="tf__canvas"
          style={{ zoom: estScale }}
        >
          <div className="tf__row">
            <div className="tf__agent">
              <svg
                width="58"
                height="58"
                viewBox="0 0 34 34"
                fill="none"
                stroke="var(--text-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M17 3 L17 8" />
                <circle cx="17" cy="2.5" r="1.6" />
                <rect x="5" y="8" width="24" height="18" rx="2" />
                <circle cx="12" cy="15.5" r="2.2" />
                <circle cx="22" cy="15.5" r="2.2" />
                <path d="M12 21.5 L22 21.5" />
                <path d="M1.5 14 L1.5 20" />
                <path d="M32.5 14 L32.5 20" />
                <path d="M11 26 L11 30" />
                <path d="M23 26 L23 30" />
              </svg>
            </div>

            <div className="tf__arrow">
              <svg width="200" height="14" viewBox="0 0 200 14" fill="none">
                <line
                  x1="0"
                  y1="7"
                  x2="182"
                  y2="7"
                  stroke="var(--text-secondary)"
                  strokeWidth="1.6"
                />
                <path
                  d="M179 2.5 L186 7 L179 11.5"
                  fill="var(--text-secondary)"
                />
              </svg>
            </div>

            <div className="tf__page">
              <div className="tf__panel">
                <div className="tf__panel-head">langfuse.com/docs/&hellip;</div>
                <div className="tf__panel-body">
                  {FETCHED.map((w, i) => (
                    <div
                      key={`f${i}`}
                      className="tf__line"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                  {TRUNCATED.map((w, i) => (
                    <div
                      key={`t${i}`}
                      className="tf__line tf__line--cut"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="tf__retrieved" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .tf { margin: 32px 0; width: 100%; }

        .tf__wrap { position: relative; width: 100%; }

        .tf__canvas {
          width: ${INNER_W}px;
          background: var(--surface-bg);
          font-family: var(--font-sans);
          padding: 56px 40px;
          box-sizing: border-box;
        }

        .tf__row {
          display: flex;
          align-items: flex-start;
          gap: 0;
        }

        .tf__agent {
          width: 180px;
          padding-top: 96px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          flex: none;
        }

        .tf__arrow {
          width: 200px;
          padding-top: 118px;
          flex: none;
        }

        .tf__page {
          position: relative;
          width: 460px;
          flex: none;
        }

        .tf__panel {
          border: 1px solid var(--line-structure);
          background: var(--surface-1);
        }

        .tf__panel-head {
          display: flex;
          align-items: center;
          height: 44px;
          padding: 0 24px;
          border-bottom: 1px solid var(--line-structure);
          background: var(--surface-2);
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--text-primary);
        }

        .tf__panel-body {
          padding: 26px 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .tf__line {
          height: 8px;
          background: var(--text-secondary);
        }

        .tf__line--cut {
          background: var(--text-disabled);
          opacity: 0.55;
        }

        /* Outlines the portion of the page that actually came back. */
        .tf__retrieved {
          position: absolute;
          left: -14px;
          top: 58px;
          right: -14px;
          height: 152px;
          /* 2px so the border still reads once the canvas is scaled down. */
          border: 2px solid var(--highlight-yellow, #fbff7a);
          pointer-events: none;
        }
      `}</style>
    </figure>
  );
}
