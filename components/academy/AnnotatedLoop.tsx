"use client";

import { useLayoutEffect, useRef } from "react";

const STATIONS = [
  { id: "trace", label: "Online", title: "Trace" },
  { id: "monitor", label: "Online", title: "Monitor" },
  { id: "dataset", label: "Offline", title: "Build\ndatasets" },
  { id: "change", label: "Offline", title: "Experiment" },
  { id: "eval", label: "Offline", title: "Evaluate" },
] as const;

type StationId = (typeof STATIONS)[number]["id"];

export interface StationAnnotation {
  note?: string;
  dimmed?: boolean;
}

// Design geometry (px) — fixed 1080×380 canvas, scaled to fit (matches LoopDiagram)
const LEFT_X = [0, 221, 442, 663, 884];
const BOX_W = 196;
const BOX_H = 200;
const BOX_TOP = 40;
const ARROW_Y = BOX_TOP + BOX_H / 2;
const INNER_W = 1080;
const INNER_H = 380;

function estimateInitialScale(): number {
  if (typeof window === "undefined") return 0.56;
  const vw = document.documentElement.clientWidth;
  if (vw < 768) {
    return Math.max(0.25, (vw - 32) / INNER_W);
  }
  return 0.56;
}

export function AnnotatedLoop({
  stations = {},
  ariaLabel = "The AI engineering loop annotated for this phase",
}: {
  stations?: Partial<Record<StationId, StationAnnotation>>;
  ariaLabel?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const estScale = estimateInitialScale();

  const traceDimmed = Boolean(stations.trace?.dimmed);

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
    <figure className="not-prose my-8" aria-label={ariaLabel}>
      <div
        ref={wrapRef}
        suppressHydrationWarning
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          height: `${INNER_H * estScale}px`,
        }}
      >
        <div
          ref={innerRef}
          suppressHydrationWarning
          style={{
            position: "relative",
            width: INNER_W,
            height: INNER_H,
            transformOrigin: "top left",
            transform: `scale(${estScale})`,
          }}
        >
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
              pointerEvents: "none",
            }}
            viewBox={`0 0 ${INNER_W} ${INNER_H}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <marker
                id="lfa-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-secondary)" />
              </marker>
              <marker
                id="lfa-arrow-dark"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--text-primary)" />
              </marker>
            </defs>

            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M ${LEFT_X[i] + BOX_W} ${ARROW_Y} L ${LEFT_X[i + 1]} ${ARROW_Y}`}
                stroke="var(--text-secondary)"
                strokeWidth="1.25"
                fill="none"
                markerEnd="url(#lfa-arrow)"
                strokeLinecap="round"
              />
            ))}

            <g opacity={traceDimmed ? 0.3 : 1}>
              <path
                d="M 982 240 L 982 310 L 98 310 L 98 240"
                fill="none"
                stroke="var(--surface-cta-primary)"
                strokeWidth="11"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
              <path
                d="M 982 240 L 982 310 L 98 310 L 98 240"
                fill="none"
                stroke="var(--text-primary)"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd="url(#lfa-arrow-dark)"
              />
            </g>
          </svg>

          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 310,
              transform: "translate(-50%, -50%)",
              background: "var(--surface-bg)",
              padding: "4px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-secondary)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              border: "1px solid var(--line-structure)",
              borderRadius: 2,
              zIndex: 5,
              opacity: traceDimmed ? 0.4 : 1,
            }}
          >
            Deploy
          </div>

          {STATIONS.map((station, i) => {
            const annotation = stations[station.id];
            const dimmed = Boolean(annotation?.dimmed);
            return (
              <div
                key={station.id}
                style={{
                  position: "absolute",
                  left: LEFT_X[i],
                  top: BOX_TOP,
                  width: BOX_W,
                  height: BOX_H,
                  background: "var(--surface-bg)",
                  border: "1px solid var(--line-structure)",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  padding: "18px 20px",
                  opacity: dimmed ? 0.4 : 1,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-analog)",
                    fontWeight: 500,
                    fontSize: station.id === "dataset" ? 22 : 26,
                    lineHeight: 1.05,
                    color: "var(--text-primary)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {station.title}
                </div>

                {annotation?.note ? (
                  <div
                    style={{
                      marginTop: "auto",
                      lineHeight: 1.55,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 13,
                        color: dimmed
                          ? "var(--text-tertiary)"
                          : "var(--text-primary)",
                        letterSpacing: "0.02em",
                        background: dimmed
                          ? "none"
                          : "linear-gradient(transparent 55%, color-mix(in oklab, var(--surface-cta-primary) 80%, transparent) 55% 95%, transparent 95%)",
                        padding: "0 3px",
                        marginLeft: -3,
                        boxDecorationBreak: "clone",
                        WebkitBoxDecorationBreak: "clone",
                      }}
                    >
                      {annotation.note}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
