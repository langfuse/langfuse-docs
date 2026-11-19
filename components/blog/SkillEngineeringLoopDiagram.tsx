"use client";

import { useId, useLayoutEffect, useRef } from "react";

type LoopMode = "offline" | "internal" | "closed";

interface StationConfig {
  id: string;
  phase: "Online" | "Offline";
  title: string;
  dimmed?: boolean;
}

const ACTIVE_STATIONS: StationConfig[] = [
  {
    id: "trace",
    phase: "Online",
    title: "Trace",
  },
  {
    id: "monitor",
    phase: "Online",
    title: "Monitor",
  },
  {
    id: "dataset",
    phase: "Offline",
    title: "Build\ndatasets",
  },
  {
    id: "experiment",
    phase: "Offline",
    title: "Experiment",
  },
  {
    id: "eval",
    phase: "Offline",
    title: "Evaluate",
  },
];

const OFFLINE_STATIONS: StationConfig[] = ACTIVE_STATIONS.map((station) =>
  station.phase === "Online" ? { ...station, dimmed: true } : station,
);

// Fixed 1080x380 canvas scaled smoothly to container width (matches LoopDiagram)
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

export function SkillEngineeringLoopDiagram({
  mode = "offline",
}: {
  mode?: LoopMode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const estScale = estimateInitialScale();

  const uid = useId().replace(/:/g, "");
  const arrowId = `seld-arrow-${uid}`;
  const arrowDarkId = `seld-arrow-dark-${uid}`;

  const isClosed = mode !== "offline";
  const stations = isClosed ? ACTIVE_STATIONS : OFFLINE_STATIONS;
  const deployLabel =
    mode === "closed"
      ? "Publish to GitHub & Skill Management"
      : "Publish new skill version";
  const ariaLabel =
    mode === "closed"
      ? "The closed AI engineering loop for the Langfuse skill: Halo runs provide online tracing and monitoring, feeding into offline datasets, Modal experiments, evaluation, and publishing to GitHub and Skill Management"
      : mode === "internal"
        ? "The full AI engineering loop for an internal skill: online tracing and monitoring of internal agent runs feed into offline datasets, experimentation, evaluation, and publishing a new skill version"
        : "The AI engineering loop for an external skill: Trace and Monitor are dimmed because external runs cannot be observed, while Build datasets, Experiment, Evaluate, and Publish new skill version are active";

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
            aria-hidden="true"
          >
            <defs>
              <marker
                id={arrowId}
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
                id={arrowDarkId}
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

            {/* Horizontal arrows between stations */}
            {[0, 1, 2, 3].map((i) => {
              const dimmed = !isClosed && i < 2;
              return (
                <path
                  key={i}
                  d={`M ${LEFT_X[i] + BOX_W} ${ARROW_Y} L ${LEFT_X[i + 1]} ${ARROW_Y}`}
                  stroke="var(--text-secondary)"
                  strokeWidth="1.25"
                  strokeDasharray={dimmed ? "4 4" : undefined}
                  opacity={dimmed ? 0.35 : 1}
                  fill="none"
                  markerEnd={`url(#${arrowId})`}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Online Iterate subloop (Monitor -> Trace) when closed */}
            {isClosed ? (
              <g>
                <path
                  d="M 319 240 L 319 282 L 110 282 L 110 240"
                  fill="none"
                  stroke="var(--surface-cta-primary)"
                  strokeWidth="11"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                />
                <path
                  d="M 319 240 L 319 282 L 110 282 L 110 240"
                  fill="none"
                  stroke="var(--text-primary)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  markerEnd={`url(#${arrowDarkId})`}
                />
              </g>
            ) : null}

            {/* Offline Iterate subloop (Evaluate -> Experiment) */}
            <g>
              <path
                d="M 970 240 L 970 282 L 761 282 L 761 240"
                fill="none"
                stroke="var(--surface-cta-primary)"
                strokeWidth="11"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
              <path
                d="M 970 240 L 970 282 L 761 282 L 761 240"
                fill="none"
                stroke="var(--text-primary)"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd={`url(#${arrowDarkId})`}
              />
            </g>

            {/* Deploy return path */}
            {isClosed ? (
              <g>
                <path
                  d="M 994 240 L 994 322 L 86 322 L 86 240"
                  fill="none"
                  stroke="var(--surface-cta-primary)"
                  strokeWidth="11"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                />
                <path
                  d="M 994 240 L 994 322 L 86 322 L 86 240"
                  fill="none"
                  stroke="var(--text-primary)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  markerEnd={`url(#${arrowDarkId})`}
                />
              </g>
            ) : (
              <g>
                {/* Active half: Evaluate through Publish pill */}
                <path
                  d="M 994 240 L 994 322 L 380 322"
                  fill="none"
                  stroke="var(--surface-cta-primary)"
                  strokeWidth="11"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                />
                <path
                  d="M 994 240 L 994 322 L 380 322"
                  fill="none"
                  stroke="var(--text-primary)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Dimmed dashed tail: published externally, signal goes dark before Trace */}
                <path
                  d="M 380 322 L 86 322 L 86 240"
                  fill="none"
                  stroke="var(--text-secondary)"
                  strokeWidth="1.25"
                  strokeDasharray="4 4"
                  opacity={0.35}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  markerEnd={`url(#${arrowId})`}
                />
              </g>
            )}
          </svg>

          {/* Iterate pill labels */}
          {isClosed ? (
            <div
              style={{
                position: "absolute",
                left: 214.5,
                top: 282,
                transform: "translate(-50%, -50%)",
                background: "var(--surface-bg)",
                padding: "4px 12px",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--text-secondary)",
                letterSpacing: "0.06em",
                border: "1px solid var(--line-structure)",
                borderRadius: 2,
                zIndex: 5,
              }}
            >
              Iterate
            </div>
          ) : null}

          <div
            style={{
              position: "absolute",
              left: 865.5,
              top: 282,
              transform: "translate(-50%, -50%)",
              background: "var(--surface-bg)",
              padding: "4px 12px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-secondary)",
              letterSpacing: "0.06em",
              border: "1px solid var(--line-structure)",
              borderRadius: 2,
              zIndex: 5,
            }}
          >
            Iterate
          </div>

          {/* Deploy / Publish pill */}
          <div
            style={{
              position: "absolute",
              left: isClosed ? INNER_W / 2 : 640,
              top: 322,
              transform: "translate(-50%, -50%)",
              background: "var(--surface-bg)",
              padding: "4px 14px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-primary)",
              letterSpacing: "0.04em",
              border: "1px solid var(--line-structure)",
              borderRadius: 2,
              whiteSpace: "nowrap",
              zIndex: 5,
            }}
          >
            {deployLabel}
          </div>

          {/* Station cards */}
          {stations.map((station, i) => {
            const dimmed = Boolean(station.dimmed);
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
                  border: dimmed
                    ? "1px dashed var(--line-structure)"
                    : "1px solid var(--line-structure)",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  padding: "18px 20px",
                  opacity: dimmed ? 0.38 : 1,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--text-secondary)",
                    letterSpacing: "0.06em",
                    background: dimmed
                      ? "none"
                      : "linear-gradient(transparent 60%, color-mix(in oklab, var(--surface-cta-primary) 75%, transparent) 60% 92%, transparent 92%)",
                    padding: "0 4px",
                    alignSelf: "flex-start",
                    marginLeft: -2,
                  }}
                >
                  {station.phase}
                </div>

                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    marginTop: 4,
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
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
