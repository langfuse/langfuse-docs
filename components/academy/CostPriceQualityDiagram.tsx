// Output quality against model price: the plateau where cheaper models still
// deliver the same quality, and (optionally) the question whether a smaller,
// specialized model could sit far to the left of it.
//
// Used on /academy/experiments/cost-optimization. Colors and fonts come from the
// design tokens in style.css so the figures follow light and dark mode.

const CURVE =
  "M120,600 L140,597.6 L160,594.5 L180,590.5 L200,585.3 L220,578.7 L240,570.3 L260,559.7 L280,546.7 L300,530.9 L320,512.2 L340,490.7 L360,466.6 L380,440.7 L400,413.8 L420,386.8 L440,360.9 L460,336.8 L480,315.3 L500,296.7 L520,280.9 L540,267.8 L560,257.3 L580,248.8 L600,242.2 L620,237 L640,233 L660,229.9 L680,227.5 L700,225.7 L740,223.3 L780,221.9 L840,220.8 L900,220.3 L980,220.1 L1130,220";

const DOTS: Array<[number, number]> = [
  [600, 242.2],
  [690, 226.6],
  [780, 221.9],
  [870, 220.5],
  [960, 220.1],
  [1050, 220],
];

const STEP_ARROWS = [
  "M1034,236 L976,236.1",
  "M944,236.2 L886,236.4",
  "M854,236.7 L820,237.1 L796,237.5",
  "M764,238.4 L740,239.3 L720,240.3 L706,241.3",
  "M674,243.2 L660,245.9 L640,249 L630,250.9 L616,253.6",
];

const axisLabelStyle = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
} as const;

const noteStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 17,
  letterSpacing: "-0.005em",
} as const;

function PriceQualityFigure({ specialized }: { specialized: boolean }) {
  const markerId = specialized
    ? "cost-specialized-model-arrow"
    : "cost-price-quality-arrow";
  const arrow = `url(#${markerId})`;
  const label = specialized
    ? "Output quality against model price. You start with an expensive model on the quality plateau, try cheaper models until quality is about to drop, and ask whether a smaller, specialized model could reach the same quality at a much lower price."
    : "Output quality against model price. You start with an expensive model on the quality plateau and try cheaper models until quality is about to drop.";

  return (
    <figure className="not-prose my-6" style={{ overflowX: "auto" }}>
      <svg
        viewBox="0 0 1200 680"
        role="img"
        aria-label={label}
        style={{
          display: "block",
          width: "100%",
          minWidth: 640,
          height: "auto",
        }}
      >
        <defs>
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="10"
            markerHeight="10"
            orient="auto-start-reverse"
            markerUnits="userSpaceOnUse"
          >
            <path
              d="M1,1 L9,5 L1,9"
              fill="none"
              stroke="var(--text-tertiary)"
              strokeWidth="1.25"
            />
          </marker>
        </defs>

        {/* Axes */}
        <polyline
          points="114,58 120,48 126,58"
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
        />
        <polyline
          points="1142,594 1152,600 1142,606"
          fill="none"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
        />
        <line
          x1="120"
          y1="48"
          x2="120"
          y2="600"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
        />
        <line
          x1="120"
          y1="600"
          x2="1152"
          y2="600"
          stroke="var(--text-secondary)"
          strokeWidth="1.5"
        />
        <text
          x="100"
          y="52"
          transform="rotate(-90 100 52)"
          textAnchor="end"
          fill="var(--text-tertiary)"
          style={axisLabelStyle}
        >
          Output quality
        </text>
        <text
          x="1152"
          y="630"
          textAnchor="end"
          fill="var(--text-tertiary)"
          style={axisLabelStyle}
        >
          Model price
        </text>

        {/* Quality curve */}
        <path
          d={CURVE}
          fill="none"
          stroke="var(--text-primary)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {specialized && (
          <line
            x1="246"
            y1="242.2"
            x2="588"
            y2="242.2"
            stroke="var(--text-tertiary)"
            strokeWidth="1.25"
            strokeDasharray="4 4"
          />
        )}

        {/* Steps toward cheaper models */}
        <g stroke="var(--text-tertiary)" strokeWidth="1.25" markerEnd={arrow}>
          {STEP_ARROWS.map((d) => (
            <path key={d} fill="none" d={d} />
          ))}
        </g>

        {/* Models tried */}
        <g
          fill="var(--surface-cta-primary)"
          stroke="var(--text-primary)"
          strokeWidth="1.5"
        >
          {DOTS.map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r="8" />
          ))}
          {specialized && <circle cx="230" cy="242.2" r="8" />}
        </g>
        {specialized && (
          <circle
            cx="230"
            cy="242.2"
            r="15"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        {/* Notes */}
        <line
          x1="1050"
          y1="152"
          x2="1050"
          y2="204"
          stroke="var(--text-tertiary)"
          strokeWidth="1.25"
          strokeDasharray="4 4"
          markerEnd={arrow}
        />
        <text
          x="1050"
          y="138"
          textAnchor="middle"
          fill="var(--text-secondary)"
          style={noteStyle}
        >
          you start here
        </text>
        <line
          x1="634"
          y1="318"
          x2="603"
          y2="258"
          stroke="var(--text-tertiary)"
          strokeWidth="1.25"
          strokeDasharray="4 4"
          markerEnd={arrow}
        />
        <text x="640" y="340" fill="var(--text-secondary)" style={noteStyle}>
          you try cheaper models until you are here
        </text>
        {specialized && (
          <>
            <line
              x1="262"
              y1="150"
              x2="238"
              y2="222"
              stroke="var(--text-tertiary)"
              strokeWidth="1.25"
              strokeDasharray="4 4"
              markerEnd={arrow}
            />
            <text fill="var(--text-secondary)" style={noteStyle}>
              <tspan x="230" y="106">
                can you get here by training a
              </tspan>
              <tspan x="230" y="130">
                smaller, specialized model?
              </tspan>
            </text>
          </>
        )}
      </svg>
    </figure>
  );
}

/** Fig. 1 on the cost optimization page: try cheaper models until quality drops. */
export function CostPriceVsQualityDiagram() {
  return <PriceQualityFigure specialized={false} />;
}

/** Fig. 2 on the cost optimization page: the same curve, plus the specialized-model question. */
export function CostSpecializedModelDiagram() {
  return <PriceQualityFigure specialized />;
}
