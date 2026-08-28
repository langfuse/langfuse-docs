"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Faithful port of the source animation's 1200x240 scene: the request on the
// left, two candidate endpoints on the right, and a dot that travels the top
// branch. Scaled down to fit the 680px blog column.
const INNER_W = 1200;
const STAGE_H = 240;
// Breathing room above and below the scene. Applied as padding on the canvas,
// which is the containing block, so the whole scene shifts with it.
const PAD_Y = 36;
const INNER_H = STAGE_H + PAD_Y * 2;

// Scene cues from the source timeline (Ask 1.6s, Match 0.6s, Travel 1.2s,
// Land 0.6s), then the finished picture holds before the loop restarts.
const CUE_MATCH = 1.6;
const CUE_TRAVEL = 2.2;
const CUE_LAND = 3.4;
const WIPE_DUR = 0.6;
const TRAVEL_DUR = 1.2;
const FADE_DUR = 0.2;
const HOLD = 20;
const CYCLE = CUE_LAND + WIPE_DUR + HOLD;

/** A time in seconds as a percentage of the loop, for use in @keyframes. */
const at = (seconds: number) => `${((seconds / CYCLE) * 100).toFixed(4)}%`;

const DOT_PATH = "M 416 118 L 620 118 L 620 56 L 710 56";

function estimateInitialScale(): number {
  if (typeof window === "undefined") return 680 / INNER_W;
  const vw = document.documentElement.clientWidth;
  return Math.min(1, Math.max(0.1, Math.min(vw - 32, 680) / INNER_W));
}

export function EndpointGuessFlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const estScale = estimateInitialScale();

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const fit = () => {
      const scale = Math.min(1, wrap.clientWidth / INNER_W);
      inner.style.transform = `scale(${scale})`;
      wrap.style.height = `${Math.ceil(INNER_H * scale)}px`;
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

  // Start the loop when the figure comes into view, and pause it while the
  // figure is scrolled out of view so it isn't animating unseen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPlaying(true);
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      className="egf not-prose"
      aria-label='An agent asked to "fetch the latest traces" faces two candidate endpoints: the deprecated /api/public/traces and /api/public/v2/observations. Because the word "traces" appears in the request, it follows the branch to the deprecated endpoint.'
    >
      <div
        ref={wrapRef}
        suppressHydrationWarning
        className={`egf__wrap${playing ? " egf__wrap--play" : ""}${
          visible ? "" : " egf__wrap--paused"
        }`}
        style={{ height: INNER_H * estScale }}
      >
        <div
          ref={innerRef}
          suppressHydrationWarning
          className="egf__canvas"
          style={{ transform: `scale(${estScale})` }}
        >
          <div className="egf__stage">
            <div className="egf__quote">
              &ldquo;fetch the latest{" "}
              <span className="egf__hl">
                <span className="egf__hl-fill egf__hl-fill--match" />
                <span className="egf__hl-text">traces</span>
              </span>
              &rdquo;
            </div>

            <svg
              width="1200"
              height="240"
              viewBox="0 0 1200 240"
              className="egf__fan"
              aria-hidden="true"
            >
              <g fill="none" stroke="var(--text-secondary)" strokeWidth="1.6">
                <path d="M452 118 H620 V56 H698" />
                <path d="M452 118 H620 V180 H698" />
              </g>
              <path d="M692 51 L702 56 L692 61" fill="var(--text-secondary)" />
              <path
                d="M692 175 L702 180 L692 185"
                fill="var(--text-secondary)"
              />
            </svg>

            <div className="egf__row egf__row--top">
              <div className="egf__endpoint">
                /api/public/
                <span className="egf__hl">
                  <span className="egf__hl-fill egf__hl-fill--land" />
                  <span className="egf__hl-text">traces</span>
                </span>
              </div>
              <div className="egf__tag">deprecated</div>
            </div>

            <div className="egf__row egf__row--bottom">
              <div className="egf__endpoint">/api/public/v2/observations</div>
            </div>

            <div className="egf__dot" />
          </div>
        </div>
      </div>

      <style>{`
        .egf { margin: 32px 0; width: 100%; }

        .egf__wrap { position: relative; width: 100%; overflow: hidden; }

        .egf__canvas {
          width: ${INNER_W}px;
          height: ${INNER_H}px;
          padding: ${PAD_Y}px 0;
          box-sizing: border-box;
          transform-origin: top left;
          background: var(--surface-bg);
        }

        /* The scene keeps the source's own coordinate space; the canvas padding
           above pushes it down as an in-flow child. */
        .egf__stage {
          position: relative;
          width: ${INNER_W}px;
          height: ${STAGE_H}px;
        }

        .egf__quote {
          position: absolute;
          left: 0;
          top: 92px;
          font-family: var(--font-analog), serif;
          font-style: italic;
          font-weight: 500;
          font-size: 40px;
          line-height: 130%;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .egf__fan {
          position: absolute;
          left: 0;
          top: 0;
          overflow: visible;
        }

        .egf__row {
          position: absolute;
          left: 724px;
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .egf__row--top { top: 39px; }
        .egf__row--bottom { top: 163px; }

        .egf__endpoint {
          font-family: var(--font-mono);
          font-size: 26px;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .egf__tag {
          border: 1px solid var(--line-structure);
          padding: 5px 12px;
          font-family: var(--font-mono);
          font-size: 14px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-code-orange);
          white-space: nowrap;
        }

        /* Yellow highlighter, wiped in left to right. */
        .egf__hl {
          position: relative;
          display: inline-block;
        }

        .egf__hl-fill {
          position: absolute;
          left: -5px;
          right: -5px;
          top: 0;
          bottom: 1px;
          background: var(--highlight-yellow, #fbff7a);
          mix-blend-mode: multiply;
          transform: scaleX(0);
          transform-origin: 0% 50%;
        }

        .egf__hl-text { position: relative; }

        .egf__dot {
          position: absolute;
          /* offset-path centres the dot on the path via offset-anchor, so the
             box itself must sit at the origin — any left/top would shift it
             off the line. */
          left: 0;
          top: 0;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--highlight-yellow, #fbff7a);
          opacity: 0;
          offset-path: path("${DOT_PATH}");
          offset-distance: 0%;
          offset-rotate: 0deg;
        }

        /* One ${CYCLE}s loop: the beats play, the finished picture holds for
           ${HOLD}s, then it starts over. */
        .egf__wrap--play .egf__hl-fill--match {
          animation: egf-match ${CYCLE}s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        .egf__wrap--play .egf__hl-fill--land {
          animation: egf-land ${CYCLE}s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }

        .egf__wrap--play .egf__dot {
          animation:
            egf-travel ${CYCLE}s cubic-bezier(0.65, 0, 0.35, 1) infinite,
            egf-dot-fade ${CYCLE}s linear infinite;
        }

        .egf__wrap--paused .egf__hl-fill,
        .egf__wrap--paused .egf__dot {
          animation-play-state: paused;
        }

        @keyframes egf-match {
          0%, ${at(CUE_MATCH)} { transform: scaleX(0); }
          ${at(CUE_MATCH + WIPE_DUR)}, 100% { transform: scaleX(1); }
        }

        @keyframes egf-land {
          0%, ${at(CUE_LAND)} { transform: scaleX(0); }
          ${at(CUE_LAND + WIPE_DUR)}, 100% { transform: scaleX(1); }
        }

        @keyframes egf-travel {
          0%, ${at(CUE_TRAVEL)} { offset-distance: 0%; }
          ${at(CUE_TRAVEL + TRAVEL_DUR)}, 100% { offset-distance: 100%; }
        }

        @keyframes egf-dot-fade {
          0%, ${at(CUE_TRAVEL)} { opacity: 0; }
          ${at(CUE_TRAVEL + FADE_DUR)}, ${at(CUE_TRAVEL + TRAVEL_DUR)} { opacity: 1; }
          ${at(CUE_TRAVEL + TRAVEL_DUR + FADE_DUR)}, 100% { opacity: 0; }
        }

        /* Reduced motion: show the finished picture, no movement. */
        @media (prefers-reduced-motion: reduce) {
          .egf__hl-fill { transform: scaleX(1); }
          .egf__wrap--play .egf__hl-fill--match,
          .egf__wrap--play .egf__hl-fill--land,
          .egf__wrap--play .egf__dot { animation: none; }
          .egf__dot { opacity: 0; }
        }
      `}</style>
    </figure>
  );
}
