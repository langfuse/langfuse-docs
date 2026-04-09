"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "all" | "manual" | "automated";

const BOX_W = 180;
const BOX_H = 80;

// The "observe" box changes label based on phase
const OBSERVE_LABELS: Record<Phase, { label: string; sublabel: string }> = {
  all: { label: "Monitor & Review", sublabel: "Online evals + manual review" },
  manual: { label: "Review & Annotate", sublabel: "Debug, spot issues, label data" },
  automated: { label: "Monitor", sublabel: "Online evals, automated scoring" },
};

const BOXES = [
  {
    id: "tracing",
    label: "Tracing",
    sublabel: "Capture real user data",
    x: 560,
    y: 220,
    manual: true,
    automated: true,
  },
  {
    id: "observe",
    label: "", // dynamic
    sublabel: "", // dynamic
    x: 300,
    y: 220,
    manual: true,
    automated: true,
  },
  {
    id: "datasets",
    label: "Build Datasets",
    sublabel: "Happy path, edge cases, adversarial inputs",
    x: 20,
    y: 220,
    manual: true,
    automated: true,
  },
  {
    id: "changes",
    label: "Make Changes",
    sublabel: "Prompt management, versioning",
    x: 20,
    y: 20,
    manual: true,
    automated: true,
  },
  {
    id: "experiments",
    label: "Run Experiments",
    sublabel: "Validate changes against datasets",
    x: 300,
    y: 20,
    manual: true,
    automated: true,
  },
  {
    id: "evaluate",
    label: "Evaluate",
    sublabel: "Automated quality scoring at scale",
    x: 560,
    y: 20,
    manual: false,
    automated: true,
  },
] as const;

// Connections: [fromId, toId, manual, automated]
const CONNECTIONS: [string, string, boolean, boolean][] = [
  ["tracing", "observe", true, true],
  ["observe", "datasets", true, true],
  ["datasets", "changes", true, true],
  ["changes", "experiments", true, true],
  ["experiments", "tracing", true, false],  // manual: experiments -> deploy -> tracing
  ["experiments", "evaluate", false, true],
  ["evaluate", "tracing", false, true],     // automated: evaluate -> deploy -> tracing
];

function getConnectionPoints(
  fromId: string,
  toId: string
): { x1: number; y1: number; x2: number; y2: number } {
  const from = BOXES.find((b) => b.id === fromId)!;
  const to = BOXES.find((b) => b.id === toId)!;

  const fromCenter = { x: from.x + BOX_W / 2, y: from.y + BOX_H / 2 };
  const toCenter = { x: to.x + BOX_W / 2, y: to.y + BOX_H / 2 };

  const dx = toCenter.x - fromCenter.x;
  const dy = toCenter.y - fromCenter.y;

  let x1: number, y1: number, x2: number, y2: number;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      x1 = from.x + BOX_W;
      y1 = fromCenter.y;
      x2 = to.x;
      y2 = toCenter.y;
    } else {
      x1 = from.x;
      y1 = fromCenter.y;
      x2 = to.x + BOX_W;
      y2 = toCenter.y;
    }
  } else {
    if (dy > 0) {
      x1 = fromCenter.x;
      y1 = from.y + BOX_H;
      x2 = toCenter.x;
      y2 = to.y;
    } else {
      x1 = fromCenter.x;
      y1 = from.y;
      x2 = toCenter.x;
      y2 = to.y + BOX_H;
    }
  }

  return { x1, y1, x2, y2 };
}

function Arrow({
  fromId,
  toId,
  active,
  dimmed,
}: {
  fromId: string;
  toId: string;
  active: boolean;
  dimmed: boolean;
}) {
  const { x1, y1, x2, y2 } = getConnectionPoints(fromId, toId);

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const curvature = dist * 0.15;

  const nx = -dy / dist;
  const ny = dx / dist;
  const cx = midX + nx * curvature;
  const cy = midY + ny * curvature;

  const markerId = `arrow-${fromId}-${toId}`;

  const arrowLen = 8;
  const endDx = x2 - cx;
  const endDy = y2 - cy;
  const endDist = Math.sqrt(endDx * endDx + endDy * endDy);
  const shortenedX2 = x2 - (endDx / endDist) * arrowLen;
  const shortenedY2 = y2 - (endDy / endDist) * arrowLen;

  return (
    <motion.g
      animate={{ opacity: dimmed ? 0.12 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <path
            d="M0,0 L8,3 L0,6"
            fill="none"
            stroke={active ? "hsl(24, 95%, 55%)" : "hsl(var(--muted-foreground))"}
            strokeWidth="1.5"
          />
        </marker>
      </defs>
      <path
        d={`M ${x1} ${y1} Q ${cx} ${cy} ${shortenedX2} ${shortenedY2}`}
        fill="none"
        stroke={active ? "hsl(24, 95%, 55%)" : "hsl(var(--muted-foreground))"}
        strokeWidth={active ? 2 : 1.5}
        markerEnd={`url(#${markerId})`}
      />
    </motion.g>
  );
}

function DynamicBox({
  x,
  y,
  phase,
  active,
  href,
}: {
  x: number;
  y: number;
  phase: Phase;
  active: boolean;
  href: string;
}) {
  const { label, sublabel } = OBSERVE_LABELS[phase];

  return (
    <a href={href}>
      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={BOX_H}
        rx={8}
        ry={8}
        fill={active ? "hsl(24, 95%, 55%)" : "hsl(var(--card))"}
        stroke={active ? "hsl(24, 95%, 55%)" : "hsl(var(--border))"}
        strokeWidth={active ? 2 : 1}
        style={{ cursor: "pointer" }}
      />
      <AnimatePresence mode="wait">
        <motion.g
          key={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <text
            x={x + BOX_W / 2}
            y={y + 34}
            textAnchor="middle"
            fill={active ? "white" : "hsl(var(--foreground))"}
            fontSize={14}
            fontWeight={600}
            style={{ pointerEvents: "none" }}
          >
            {label}
          </text>
          <text
            x={x + BOX_W / 2}
            y={y + 54}
            textAnchor="middle"
            fill={active ? "rgba(255,255,255,0.8)" : "hsl(var(--muted-foreground))"}
            fontSize={10}
            style={{ pointerEvents: "none" }}
          >
            {sublabel}
          </text>
        </motion.g>
      </AnimatePresence>
    </a>
  );
}

function Box({
  label,
  sublabel,
  x,
  y,
  active,
  dimmed,
  href,
}: {
  label: string;
  sublabel: string;
  x: number;
  y: number;
  active: boolean;
  dimmed: boolean;
  href: string;
}) {
  return (
    <motion.g
      animate={{ opacity: dimmed ? 0.15 : 1 }}
      transition={{ duration: 0.4 }}
    >
      <a href={href}>
        <rect
          x={x}
          y={y}
          width={BOX_W}
          height={BOX_H}
          rx={8}
          ry={8}
          fill={active ? "hsl(24, 95%, 55%)" : "hsl(var(--card))"}
          stroke={active ? "hsl(24, 95%, 55%)" : "hsl(var(--border))"}
          strokeWidth={active ? 2 : 1}
          style={{ cursor: "pointer" }}
        />
        <text
          x={x + BOX_W / 2}
          y={y + 34}
          textAnchor="middle"
          fill={active ? "white" : "hsl(var(--foreground))"}
          fontSize={14}
          fontWeight={600}
          style={{ pointerEvents: "none" }}
        >
          {label}
        </text>
        <text
          x={x + BOX_W / 2}
          y={y + 54}
          textAnchor="middle"
          fill={active ? "rgba(255,255,255,0.8)" : "hsl(var(--muted-foreground))"}
          fontSize={10}
          style={{ pointerEvents: "none" }}
        >
          {sublabel}
        </text>
      </a>
    </motion.g>
  );
}

function DeployLabel({ phase }: { phase: Phase }) {
  const fromId = phase === "manual" ? "experiments" : "evaluate";
  const { x1, y1, x2, y2 } = getConnectionPoints(fromId, "tracing");
  const mx = (x1 + x2) / 2 + 15;
  const my = (y1 + y2) / 2;

  return (
    <text
      x={mx}
      y={my}
      textAnchor="middle"
      fill="hsl(24, 95%, 55%)"
      fontSize={11}
      fontWeight={600}
      fontStyle="italic"
    >
      Deploy
    </text>
  );
}

export function ImprovementLoop() {
  const [phase, setPhase] = useState<Phase>("all");

  const isBoxActive = (box: (typeof BOXES)[number]) => {
    if (phase === "all") return false;
    if (phase === "manual") return box.manual;
    if (phase === "automated") return box.automated;
    return false;
  };

  const isBoxDimmed = (box: (typeof BOXES)[number]) => {
    if (phase === "all") return false;
    if (phase === "manual") return !box.manual;
    if (phase === "automated") return !box.automated;
    return false;
  };

  const isConnectionActive = (conn: (typeof CONNECTIONS)[number]) => {
    if (phase === "all") return false;
    if (phase === "manual") return conn[2];
    if (phase === "automated") return conn[3];
    return false;
  };

  const isConnectionDimmed = (conn: (typeof CONNECTIONS)[number]) => {
    if (phase === "all") return false;
    if (phase === "manual") return !conn[2];
    if (phase === "automated") return !conn[3];
    return false;
  };

  const sectionHrefs: Record<string, string> = {
    tracing: "/academy/tracing",
    observe: "/academy/review-and-annotate",
    datasets: "/academy/datasets",
    changes: "/academy/make-changes",
    experiments: "/academy/experiments",
    evaluate: "/academy/evaluate",
  };

  return (
    <div className="not-prose mt-2 mb-8">
      {/* SVG Diagram */}
      <div className="flex justify-center">
        <svg
          viewBox="0 0 780 340"
          className="w-full max-w-3xl"
          style={{ fontFamily: "var(--font-sans, system-ui, sans-serif)" }}
        >
          {/* Arrows */}
          {CONNECTIONS.map(([from, to, p1, p2]) => (
            <Arrow
              key={`${from}-${to}`}
              fromId={from}
              toId={to}
              active={isConnectionActive([from, to, p1, p2])}
              dimmed={isConnectionDimmed([from, to, p1, p2])}
            />
          ))}

          {/* Deploy labels */}
          {(phase === "all" || phase === "manual") && (
            <DeployLabel phase="manual" />
          )}
          {phase === "automated" && <DeployLabel phase="automated" />}

          {/* Static boxes */}
          {BOXES.filter((b) => b.id !== "observe").map((box) => (
            <Box
              key={box.id}
              label={box.label}
              sublabel={box.sublabel}
              x={box.x}
              y={box.y}
              active={isBoxActive(box)}
              dimmed={isBoxDimmed(box)}
              href={sectionHrefs[box.id]}
            />
          ))}

          {/* Dynamic observe box */}
          <DynamicBox
            x={300}
            y={220}
            phase={phase}
            active={phase !== "all"}
            href={sectionHrefs.observe}
          />
        </svg>
      </div>

      {/* Phase toggle */}
      <div className="flex items-center justify-center gap-2 mt-6 mb-2">
        {(
          [
            ["all", "Full Loop"],
            ["manual", "Manual"],
            ["automated", "Automated"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPhase(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              phase === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Phase description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-4 text-center text-sm text-muted-foreground max-w-lg mx-auto"
        >
          {phase === "all" && (
            <p>
              The full continuous improvement loop. Start with the manual path
              to build your foundation, then add automation as your product matures.
            </p>
          )}
          {phase === "manual" && (
            <p>
              Start here. Manually review your traces, annotate what you see, build
              datasets from real production data, and run experiments to validate
              changes before deploying.
            </p>
          )}
          {phase === "automated" && (
            <p>
              Once you know what to measure, add monitoring with online evaluations
              and automated scoring to your loop — letting you iterate faster at scale.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
