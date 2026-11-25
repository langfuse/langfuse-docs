import { Fragment } from "react";
import { AiGatewayDiagramFigure } from "./AiGatewayDiagramShared";
import styles from "./AiGatewayDiagram.module.css";

// Keep labels in sync with renderTopicsArchitectureDiagram in
// lib/markdown-component-renderers.js.
const traceSteps = [
  {
    title: "Trace arrives",
    description: [],
    x: 16,
    width: 130,
    highlight: false,
  },
  {
    title: "Wait",
    description: [
      "Treat trace as finished",
      "after a delay since the",
      "last observation arrived",
    ],
    x: 192,
    width: 180,
    highlight: false,
  },
  {
    title: "Analyze facets",
    description: ["One result per", "active facet and trace"],
    x: 392,
    width: 180,
    highlight: true,
  },
  {
    title: "Embed",
    description: ["Embed each", "facet summary"],
    x: 618,
    width: 166,
    highlight: false,
  },
];

const groupingSteps = [
  {
    title: "Cluster embeddings",
    description: ["Group similar summaries", "within each facet"],
    x: 160,
    width: 224,
    highlight: false,
  },
  {
    title: "Name clusters",
    description: ["Generate topic names", "and descriptions"],
    x: 456,
    width: 224,
    highlight: true,
  },
];

const ariaLabel =
  "Topics analyzes matching traces after a configurable delay since the last observation. The model returns one result per active facet. Topics embeds each text summary, clusters similar summaries within each facet, and names the clusters. Live maps refresh daily. Snapshots run once for a selected time window and can reuse existing summaries.";

const titleStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 15,
  fontWeight: 600,
  fill: "var(--text-primary)",
} as const;

const bodyStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  fill: "var(--text-secondary)",
} as const;

const lineStyle = {
  fill: "none",
  stroke: "var(--line-cta)",
  strokeWidth: 1.25,
  strokeLinejoin: "round",
} as const;

function DiagramCard({
  step,
  y,
  height,
}: {
  step: (typeof traceSteps)[number];
  y: number;
  height: number;
}) {
  return (
    <g>
      <rect
        x={step.x}
        y={y}
        width={step.width}
        height={height}
        rx={2}
        style={{
          fill: "var(--surface-bg)",
          stroke: "var(--line-structure)",
          filter: step.highlight
            ? "drop-shadow(-1px 2px 5px rgba(0, 0, 0, 0.04)) drop-shadow(-4px 8px 9px rgba(0, 0, 0, 0.03))"
            : undefined,
        }}
      />
      <text
        x={step.x + 16}
        y={step.description.length ? y + 29 : y + height / 2 + 5}
        style={titleStyle}
        filter={step.highlight ? "url(#topics-highlight)" : undefined}
      >
        {step.title}
      </text>
      {step.description.length > 0 && (
        <text x={step.x + 16} y={y + 57} style={bodyStyle}>
          {step.description.map((line, i) => (
            <tspan key={line} x={step.x + 16} dy={i === 0 ? 0 : 19}>
              {line}
            </tspan>
          ))}
        </text>
      )}
    </g>
  );
}

function MobileCard({ step }: { step: (typeof traceSteps)[number] }) {
  return (
    <div className={`${styles.card} ${step.highlight ? styles.raised : ""}`}>
      <div
        className={step.highlight ? styles.highlightTitle : styles.cardTitle}
      >
        {step.title}
      </div>
      {step.description.length > 0 && (
        <p className={styles.body}>{step.description.join(" ")}</p>
      )}
    </div>
  );
}

export function TopicsArchitectureDiagram() {
  return (
    <AiGatewayDiagramFigure
      ariaLabel={ariaLabel}
      desktop={
        <svg
          viewBox="0 0 800 464"
          className={styles.diagram}
          role="img"
          aria-label={ariaLabel}
        >
          <defs>
            <marker
              id="topics-arrow"
              viewBox="0 0 8 10"
              refX="7"
              refY="5"
              markerWidth="8"
              markerHeight="10"
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path
                d="M1 1 L7 5 L1 9"
                style={lineStyle}
                strokeLinecap="round"
              />
            </marker>
            <filter
              id="topics-highlight"
              x="-0.04"
              y="-0.08"
              width="1.08"
              height="1.16"
            >
              <feFlood style={{ floodColor: "var(--surface-cta-primary)" }} />
              <feComposite in="SourceGraphic" operator="over" />
            </filter>
          </defs>

          <text x="16" y="32" style={titleStyle}>
            As traces arrive
          </text>
          {traceSteps.map((step) => (
            <DiagramCard key={step.title} step={step} y={62} height={114} />
          ))}
          {traceSteps.slice(0, -1).map((step, i) => (
            <path
              key={step.title}
              d={`M ${step.x + step.width} 119 H ${traceSteps[i + 1].x - 2}`}
              style={lineStyle}
              markerEnd="url(#topics-arrow)"
            />
          ))}
          <text x="169" y="105" textAnchor="middle" style={bodyStyle}>
            Filters
          </text>

          <rect
            x="16"
            y="230"
            width="768"
            height="218"
            rx="2"
            style={{ ...lineStyle, strokeDasharray: "3 3" }}
          />
          <text x="32" y="259" style={titleStyle}>
            Topic discovery
          </text>
          <text x="768" y="259" textAnchor="end" style={bodyStyle}>
            Daily live maps / one-off snapshots
          </text>
          <path
            d="M 701 176 V 208 Q 701 216 693 216 H 280 Q 272 216 272 224 V 286"
            style={lineStyle}
            markerEnd="url(#topics-arrow)"
          />
          {groupingSteps.map((step) => (
            <DiagramCard key={step.title} step={step} y={288} height={88} />
          ))}
          <path
            d="M 384 332 H 454"
            style={lineStyle}
            markerEnd="url(#topics-arrow)"
          />
          <path
            d="M 568 376 V 406 Q 568 414 560 414 H 280 Q 272 414 272 406 V 378"
            style={{
              ...lineStyle,
              stroke: "var(--text-tertiary)",
              strokeDasharray: "4 4",
            }}
            markerEnd="url(#topics-arrow)"
          />
          <text x="420" y="403" textAnchor="middle" style={bodyStyle}>
            Live maps repeat daily
          </text>
        </svg>
      }
    >
      <div className={styles.boundaryHeader}>As traces arrive</div>
      {traceSteps.map((step, i) => (
        <Fragment key={step.title}>
          <MobileCard step={step} />
          <div className={styles.connector}>
            <span className={styles.rail} aria-hidden="true" />
            {i === 0 && <span>Only traces matching your filters</span>}
          </div>
        </Fragment>
      ))}
      <div className={styles.boundary}>
        <div>
          <div className={styles.boundaryHeader}>Topic discovery</div>
          <p className={styles.meta}>Daily live maps / one-off snapshots</p>
        </div>
        <MobileCard step={groupingSteps[0]} />
        <div className={styles.connector} aria-hidden="true">
          <span className={styles.rail} />
        </div>
        <MobileCard step={groupingSteps[1]} />
        <div className={`${styles.connector} ${styles.dashedConnector}`}>
          <span className={styles.rail} aria-hidden="true" />
          <span>Live maps repeat clustering and naming daily</span>
        </div>
      </div>
    </AiGatewayDiagramFigure>
  );
}
