// Delegating to sub-agents: without them, one agent carries the growing context
// of every task through every LLM call; with them, each task starts from a
// small context and only a summary comes back. Used on
// /academy/experiments/cost-optimization. Colors and fonts come from the design
// tokens in style.css so the figure follows light and dark mode.

// Context per LLM call: [x, y, width, height]
const BOXES: Array<[number, number, number, number]> = [
  // without sub-agents: one agent, context keeps growing
  [40, 130, 90, 102],
  [183, 130, 90, 127],
  [326, 130, 90, 146],
  [469, 130, 90, 158],
  [612, 130, 90, 178],
  // with sub-agents: main agent, then a small context per delegated task
  [782, 130, 90, 102],
  [925, 130, 90, 49],
  [1068, 130, 90, 64],
  [925, 262, 90, 47],
  [1068, 262, 90, 68],
];

const ARROWS: Array<[number, number, number]> = [
  [136, 177, 153],
  [279, 320, 153],
  [422, 463, 153],
  [565, 606, 153],
  [878, 919, 153],
  [1021, 1062, 153],
  [1021, 1062, 285],
];

const BRACES = [
  "M183,118 L183,104 L416,104 L416,118",
  "M469,118 L469,104 L702,104 L702,118",
  "M925,118 L925,104 L1158,104 L1158,118",
  "M925,250 L925,236 L1158,236 L1158,250",
];

const TASK_LABELS: Array<[number, number, string]> = [
  [299.5, 90, "task A"],
  [585.5, 90, "task B"],
  [1041.5, 90, "task A"],
  [1041.5, 222, "task B"],
];

const headingStyle = {
  fontFamily: "var(--font-sans)",
  fontWeight: 450,
  fontSize: 22,
  letterSpacing: "-0.005em",
} as const;

const labelStyle = {
  fontFamily: "var(--font-sans)",
  fontWeight: 450,
  fontSize: 17,
  letterSpacing: "-0.005em",
} as const;

/** The same two tasks handled without and with sub-agents. */
export function CostSubAgentsDiagram() {
  return (
    <figure className="not-prose my-6" style={{ overflowX: "auto" }}>
      <svg
        viewBox="0 0 1200 370"
        role="img"
        aria-label="The same two tasks handled without and with sub-agents. Without sub-agents, one agent carries the growing context of task A and task B through every LLM call. With sub-agents, the main agent hands task A and task B to sub-agents that start from a small context, so the large context is never re-read."
        style={{
          display: "block",
          width: "100%",
          minWidth: 640,
          height: "auto",
        }}
      >
        <defs>
          <filter
            id="cost-sub-agents-highlight"
            x="-0.04"
            y="-0.08"
            width="1.08"
            height="1.16"
          >
            <feFlood style={{ floodColor: "var(--surface-cta-primary)" }} />
            <feComposite in="SourceGraphic" operator="over" />
          </filter>
          <marker
            id="cost-sub-agents-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="12"
            markerHeight="12"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d="M1,1 L9,5 L1,9"
              fill="none"
              stroke="var(--text-secondary)"
              strokeWidth="1.25"
            />
          </marker>
        </defs>

        <text
          x="40"
          y="50"
          fill="var(--text-primary)"
          style={headingStyle}
          filter="url(#cost-sub-agents-highlight)"
        >
          without sub-agents
        </text>
        <text
          x="782"
          y="50"
          fill="var(--text-primary)"
          style={headingStyle}
          filter="url(#cost-sub-agents-highlight)"
        >
          with sub-agents
        </text>
        <line
          x1="742"
          y1="30"
          x2="742"
          y2="340"
          stroke="var(--line-divider-dash)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        <g fill="none" stroke="var(--text-secondary)" strokeWidth="1.25">
          {BRACES.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g textAnchor="middle" fill="var(--text-secondary)" style={labelStyle}>
          {TASK_LABELS.map(([x, y, text]) => (
            <text key={`${x}-${y}`} x={x} y={y}>
              {text}
            </text>
          ))}
        </g>

        <g
          fill="var(--surface-bg)"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
        >
          {BOXES.map(([x, y, w, h]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
          ))}
        </g>

        <g
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="1.25"
          markerEnd="url(#cost-sub-agents-arrow)"
        >
          {ARROWS.map(([x1, x2, y]) => (
            <line key={`${x1}-${y}`} x1={x1} y1={y} x2={x2} y2={y} />
          ))}
          <path d="M872,200 L898,200 L898,285 L919,285" />
        </g>
      </svg>
    </figure>
  );
}
