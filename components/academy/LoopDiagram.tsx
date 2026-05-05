"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const STATIONS = [
  {
    id: "trace",
    label: "Online",
    title: "Trace",
    meta: ["traces", "sessions", "agents", "prompts"],
    href: "/academy/tracing",
  },
  {
    id: "monitor",
    label: "Online",
    title: "Monitor",
    meta: ["dashboards", "LLM-as-judge", "feedback"],
    href: "/academy/monitoring",
  },
  {
    id: "dataset",
    label: "Offline",
    title: "Build\ndatasets",
    meta: ["datasets", "features-as-tests"],
    href: "/academy/datasets",
  },
  {
    id: "change",
    label: "Offline",
    title: "Experiment",
    meta: ["prompts", "models", "code variants"],
    href: "/academy/experiments",
  },
  {
    id: "eval",
    label: "Offline",
    title: "Evaluate",
    meta: ["judges", "custom evals", "annotation"],
    href: "/academy/evaluate",
  },
];

// Design geometry (px) — fixed 1080×380 canvas, scaled to fit
const LEFT_X = [0, 221, 442, 663, 884];
const BOX_W = 196;
const BOX_H = 200;
const BOX_TOP = 40;
const ARROW_Y = BOX_TOP + BOX_H / 2; // 140
const INNER_W = 1080;
const INNER_H = 380;

// Synchronous estimate of the initial scale so the canvas is never shown at
// native 1080px width before useLayoutEffect fires.
// 0.56 is intentionally conservative (actual desktop scale is ~0.57–0.59),
// so the useLayoutEffect correction is always a small upward nudge rather
// than a shrink — growth is less visually jarring than shrink.
// On mobile the column fills the viewport minus padding (~16px each side).
function estimateInitialScale(): number {
  if (typeof window === "undefined") return 0.56;
  const vw = document.documentElement.clientWidth;
  if (vw < 768) {
    return Math.max(0.25, (vw - 32) / INNER_W);
  }
  return 0.56;
}

export function LoopDiagram({ highlight }: { highlight?: string } = {}) {
  const pinnedIndex = highlight
    ? STATIONS.findIndex((s) => s.id === highlight)
    : -1;
  const [active, setActive] = useState(pinnedIndex >= 0 ? pinnedIndex : 0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Computed once per mount; only used for initial inline styles.
  const estScale = estimateInitialScale();

  // Cycle active station only when not pinned to a specific one
  useEffect(() => {
    if (pinnedIndex >= 0) return;
    const id = setInterval(
      () => setActive((p) => (p + 1) % STATIONS.length),
      1800
    );
    return () => clearInterval(id);
  }, [pinnedIndex]);

  // Correct scale to exact container width, before first paint
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
    <div className="not-prose my-8">
      {/* Initial height is set from the estimated scale so the wrapper never
          starts at the full 380px natural height before useLayoutEffect runs. */}
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
        {/* suppressHydrationWarning: SSR returns 0.56 (no window); client may
            compute a slightly different value. useLayoutEffect corrects both
            wrapper height and inner transform before first paint. */}
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
          {/* SVG wires — drawn first so station cards layer above */}
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
                id="lfd-arrow"
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
                id="lfd-arrow-dark"
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
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                d={`M ${LEFT_X[i] + BOX_W} ${ARROW_Y} L ${LEFT_X[i + 1]} ${ARROW_Y}`}
                stroke="var(--text-secondary)"
                strokeWidth="1.25"
                fill="none"
                markerEnd="url(#lfd-arrow)"
                strokeLinecap="round"
              />
            ))}

            {/* Yellow U-loop — highlighter band */}
            <path
              d="M 982 240 L 982 310 L 98 310 L 98 240"
              fill="none"
              stroke="var(--surface-cta-primary)"
              strokeWidth="11"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            />
            {/* Thin dark line drawn on top of the yellow band, with arrow into Trace */}
            <path
              d="M 982 240 L 982 310 L 98 310 L 98 240"
              fill="none"
              stroke="var(--text-primary)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd="url(#lfd-arrow-dark)"
            />
          </svg>

          {/* DEPLOY label centered on the bottom of the U */}
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
            }}
          >
            Deploy
          </div>

          {/* Station cards */}
          {STATIONS.map((station, i) => (
            <Link
              key={station.id}
              href={station.href}
              className="corner-box-corners--hover"
              style={{
                position: "absolute",
                left: i === pinnedIndex ? LEFT_X[i] - 1 : LEFT_X[i],
                top: i === pinnedIndex ? BOX_TOP - 1 : BOX_TOP,
                width: i === pinnedIndex ? BOX_W + 2 : BOX_W,
                height: i === pinnedIndex ? BOX_H + 2 : BOX_H,
                background: "var(--surface-bg)",
                border: i === pinnedIndex
                  ? "2px solid var(--text-primary)"
                  : "1px solid var(--line-structure)",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                padding: "18px 20px",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor =
                  i === pinnedIndex ? "var(--text-primary)" : "var(--line-cta)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor =
                  i === pinnedIndex ? "var(--text-primary)" : "var(--line-structure)")
              }
            >
              {/* Pulse indicator dot */}
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background:
                    i === active
                      ? "var(--callout-success)"
                      : "var(--text-disabled)",
                  boxShadow:
                    i === active
                      ? "0 0 0 3px color-mix(in oklab, var(--callout-success) 25%, transparent)"
                      : "none",
                  transition: "background 0.25s ease, box-shadow 0.25s ease",
                }}
              />

              {/* Online / Offline label with yellow highlight underline */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background:
                    "linear-gradient(transparent 60%, color-mix(in oklab, var(--surface-cta-primary) 75%, transparent) 60% 92%, transparent 92%)",
                  padding: "0 4px",
                  alignSelf: "flex-start",
                  marginLeft: -2,
                }}
              >
                {station.label}
              </div>

              {/* Station title */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  marginTop: 6,
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

              {/* Meta tags */}
              <div
                style={{
                  marginTop: 10,
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.02em",
                  lineHeight: 1.5,
                }}
              >
                {station.meta.join(" · ")}
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
