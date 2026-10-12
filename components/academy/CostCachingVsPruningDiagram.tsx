// Caching versus pruning: with caching, later LLM calls in the loop re-read the
// shared prefix as cheaper cached tokens; with pruning, each call's context is
// made smaller so there are fewer tokens to read at all. Used on
// /academy/experiments/cost-optimization. Colors and fonts come from the design
// tokens in style.css so the figure follows light and dark mode.

const HATCH = "url(#cost-caching-hatch)";
const UNCACHED = "var(--surface-cta-primary)";

const BRAIN_PATHS = [
  "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
  "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",
  "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",
  "M17.599 6.5a3 3 0 0 0 .399-1.375",
  "M6.003 5.125A3 3 0 0 0 6.401 6.5",
  "M3.477 10.896a4 4 0 0 1 .585-.396",
  "M19.938 10.5a4 4 0 0 1 .585.396",
  "M6 18a4 4 0 0 1-1.967-.516",
  "M19.967 17.484A4 4 0 0 1 18 18",
];

// Context stacks per LLM call: [x, y, width, height, fill]
const CACHING_BLOCKS: Array<[number, number, number, number, string]> = [
  [40, 120, 120, 146, UNCACHED],
  [230, 120, 120, 146, HATCH],
  [230, 266, 120, 42, UNCACHED],
  [420, 120, 120, 146, HATCH],
  [420, 266, 120, 42, HATCH],
  [420, 308, 120, 42, UNCACHED],
];

const PRUNING_BLOCKS: Array<[number, number, number, number, string]> = [
  [660, 120, 120, 146, UNCACHED],
  [850, 120, 120, 108, UNCACHED],
  [850, 228, 120, 55, UNCACHED],
  [1040, 120, 120, 83, UNCACHED],
  [1040, 203, 120, 25, UNCACHED],
  [1040, 228, 120, 42, UNCACHED],
];

const CALL_ARROWS: Array<[number, number, number]> = [
  [166, 224, 193],
  [356, 414, 193],
  [356, 414, 287],
];

const BRAINS: Array<[number, number]> = [
  [185, 152],
  [375, 152],
  [375, 246],
];

const SHRINK_LINES: Array<[number, number, number, number]> = [
  [786, 120, 844, 120],
  [786, 266, 844, 228],
  [976, 120, 1034, 120],
  [976, 228, 1034, 203],
  [976, 283, 1034, 228],
];

const headingStyle = {
  fontFamily: "var(--font-sans)",
  fontWeight: 450,
  fontSize: 22,
  letterSpacing: "-0.005em",
} as const;

const legendStyle = {
  fontFamily: "var(--font-sans)",
  fontWeight: 450,
  fontSize: 17,
  letterSpacing: "-0.005em",
} as const;

/** Caching keeps the shared prefix but makes it cheap; pruning removes tokens. */
export function CostCachingVsPruningDiagram() {
  return (
    <figure className="not-prose my-6">
      <svg
        viewBox="0 0 1200 440"
        role="img"
        aria-label="Caching versus pruning. With caching, every LLM call still reads the full context, but from the second call on the shared prefix is served as cheaper cached tokens and only the new part is uncached. With pruning, the context of each call is made smaller, so there are fewer tokens to read at all."
        style={{ display: "block", width: "100%", height: "auto" }}
      >
        <defs>
          <pattern
            id="cost-caching-hatch"
            patternUnits="userSpaceOnUse"
            width="6"
            height="6"
            patternTransform="rotate(45)"
          >
            <rect width="6" height="6" fill="var(--surface-bg)" />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="6"
              stroke="var(--text-secondary)"
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
          </pattern>
          <marker
            id="cost-caching-arrow"
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
          <g
            id="cost-caching-brain"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {BRAIN_PATHS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </defs>

        <text x="40" y="84" fill="var(--text-primary)" style={headingStyle}>
          Caching
        </text>
        <text x="660" y="84" fill="var(--text-primary)" style={headingStyle}>
          Pruning
        </text>
        <line
          x1="600"
          y1="56"
          x2="600"
          y2="360"
          stroke="var(--line-divider-dash)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        <g stroke="var(--text-secondary)" strokeWidth="1.5">
          {[...CACHING_BLOCKS, ...PRUNING_BLOCKS].map(([x, y, w, h, fill]) => (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={fill}
            />
          ))}
        </g>

        <g
          stroke="var(--text-secondary)"
          strokeWidth="1.25"
          markerEnd="url(#cost-caching-arrow)"
        >
          {CALL_ARROWS.map(([x1, x2, y]) => (
            <line key={`${x1}-${y}`} x1={x1} y1={y} x2={x2} y2={y} />
          ))}
        </g>
        {BRAINS.map(([x, y]) => (
          <use
            key={`${x}-${y}`}
            href="#cost-caching-brain"
            transform={`translate(${x} ${y}) scale(0.85)`}
          />
        ))}

        <g
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
          strokeDasharray="1.5 5"
          strokeLinecap="round"
        >
          {SHRINK_LINES.map(([x1, y1, x2, y2]) => (
            <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>

        {/* Legend */}
        <rect
          x="40"
          y="393"
          width="16"
          height="16"
          fill={UNCACHED}
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
        />
        <text x="66" y="406" fill="var(--text-secondary)" style={legendStyle}>
          uncached tokens
        </text>
        <rect
          x="210"
          y="393"
          width="16"
          height="16"
          fill={HATCH}
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
        />
        <text x="236" y="406" fill="var(--text-secondary)" style={legendStyle}>
          cached tokens
        </text>
      </svg>
    </figure>
  );
}
