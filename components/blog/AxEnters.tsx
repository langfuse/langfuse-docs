"use client";

import { useLayoutEffect, useRef } from "react";

// Faithful port of the source scene's 1320x470 stage: UX, DX, and AX side by
// side, with AX highlighted. Scaled down to fit the 680px blog column.
const INNER_W = 1320;
const INNER_H = 470;
const COLUMN_W = 680;

function initialScale(): number {
  if (typeof window === "undefined") return COLUMN_W / INNER_W;
  const vw = document.documentElement.clientWidth;
  return Math.min(1, Math.max(0.1, Math.min(vw - 32, COLUMN_W) / INNER_W));
}

function Person() {
  return (
    <svg
      width="82"
      height="116"
      viewBox="0 0 54 84"
      fill="none"
      stroke="var(--text-primary)"
      strokeWidth="1.9"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="27" cy="13" r="10" />
      <path d="M27 23 L27 51" />
      <path d="M6 33 L27 38 L48 33" />
      <path d="M27 51 L13 79" />
      <path d="M27 51 L41 79" />
    </svg>
  );
}

function Terminal() {
  return (
    <svg
      width="108"
      height="116"
      viewBox="0 0 44 46"
      fill="none"
      stroke="var(--text-primary)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="6" width="38" height="28" />
      <path d="M10 16 L15 20 L10 24" />
      <path d="M19 25 L31 25" />
      <path d="M14 41 L30 41" />
      <path d="M22 34 L22 41" />
    </svg>
  );
}

function Robot() {
  return (
    <svg
      width="116"
      height="116"
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
  );
}

export function AxEnters() {
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
      className="axe not-prose"
      aria-label="Three audiences side by side: UX, drawn as a person; DX, drawn as a terminal; and AX, drawn as an agent, with its name highlighted."
    >
      <div ref={wrapRef} className="axe__wrap">
        <div
          ref={innerRef}
          suppressHydrationWarning
          className="axe__canvas"
          style={{ zoom: estScale }}
        >
          <div className="axe__stage">
            <div className="axe__card" style={{ left: 0 }}>
              <div className="axe__icon">
                <Person />
              </div>
              <div className="axe__abbr">UX</div>
            </div>

            <div className="axe__card" style={{ left: 460 }}>
              <div className="axe__icon">
                <Terminal />
              </div>
              <div className="axe__abbr">DX</div>
            </div>

            <div className="axe__card" style={{ left: 920 }}>
              <div className="axe__icon">
                <Robot />
              </div>
              <div className="axe__abbr">
                <span className="axe__hl-wrap">
                  <span className="axe__hl" />
                  <span className="axe__hl-text">AX</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .axe { margin: 32px 0; width: 100%; }

        .axe__wrap { position: relative; width: 100%; }

        .axe__canvas {
          width: ${INNER_W}px;
          background: var(--surface-bg);
        }

        .axe__stage {
          position: relative;
          width: ${INNER_W}px;
          height: ${INNER_H}px;
        }

        .axe__card {
          position: absolute;
          top: 0;
          width: 400px;
          height: ${INNER_H}px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 44px;
        }

        .axe__icon {
          height: 116px;
          display: flex;
          align-items: center;
        }

        .axe__abbr {
          font-family: var(--font-analog), serif;
          font-weight: 500;
          font-size: 96px;
          line-height: 1;
          color: var(--text-primary);
        }

        .axe__hl-wrap {
          position: relative;
          display: inline-block;
        }

        .axe__hl {
          position: absolute;
          left: -12px;
          right: -12px;
          top: 12px;
          bottom: 12px;
          background: var(--highlight-yellow, #fbff7a);
          mix-blend-mode: multiply;
        }

        .axe__hl-text { position: relative; }
      `}</style>
    </figure>
  );
}
