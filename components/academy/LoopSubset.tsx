"use client";

import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

const STATION_DATA = {
  trace: {
    label: "Online",
    title: "Trace",
    meta: ["traces", "sessions", "agents", "prompts"],
    href: "/academy/tracing",
  },
  monitor: {
    label: "Online",
    title: "Monitor",
    meta: ["dashboards", "LLM-as-judge", "feedback"],
    href: "/academy/monitoring",
  },
  dataset: {
    label: "Offline",
    title: "Build\ndatasets",
    meta: ["datasets", "features-as-tests"],
    href: "/academy/datasets",
    smallTitle: true,
  },
  change: {
    label: "Offline",
    title: "Experiment",
    meta: ["prompts", "models", "code variants"],
    href: "/academy/experiments",
  },
  eval: {
    label: "Offline",
    title: "Evaluate",
    meta: ["judges", "custom evals", "annotation"],
    href: "/academy/evaluate",
  },
} as const;

type StationId = keyof typeof STATION_DATA;

function Arrow() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        padding: "0 8px",
      }}
    >
      <svg
        width="24"
        height="14"
        viewBox="0 0 24 14"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 7 L17 7"
          stroke="var(--text-secondary)"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M12 2 L22 7 L12 12"
          stroke="var(--text-secondary)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function StationRow({ ids }: { ids: StationId[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setActive((p) => (p + 1) % ids.length),
      1800
    );
    return () => clearInterval(interval);
  }, [ids.length]);

  return (
    <div className="not-prose my-6">
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {ids.map((id, i) => {
          const s = STATION_DATA[id];
          return (
            <Fragment key={id}>
              <Link
                href={s.href}
                className="corner-box-corners--hover"
                style={{
                  flex: 1,
                  minWidth: 0,
                  position: "relative",
                  background: "var(--surface-bg)",
                  border: "1px solid var(--line-structure)",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  padding: "18px 20px",
                  minHeight: 200,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--line-cta)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--line-structure)")
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

                {/* Online / Offline label */}
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
                  {s.label}
                </div>

                {/* Title */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    marginTop: 6,
                    fontFamily: "var(--font-analog)",
                    fontWeight: 500,
                    fontSize: "smallTitle" in s && s.smallTitle ? 22 : 26,
                    lineHeight: 1.05,
                    color: "var(--text-primary)",
                    whiteSpace: "pre-line",
                  }}
                >
                  {s.title}
                </div>

                {/* Meta */}
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
                  {s.meta.join(" · ")}
                </div>
              </Link>

              {i < ids.length - 1 && <Arrow />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function OnlineLoop() {
  return <StationRow ids={["trace", "monitor"]} />;
}

export function OfflineLoop() {
  return <StationRow ids={["dataset", "change", "eval"]} />;
}
