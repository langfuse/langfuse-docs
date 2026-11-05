// AI Gateway architecture: clients call the gateway inside Langfuse with a
// gateway key, the gateway calls the external model provider, and the call is
// traced in Langfuse. Used on /docs/gateway/overview and
// /docs/gateway/concepts. Colors and fonts come from the design tokens in
// style.css so the figure follows light and dark mode. Keep the labels in sync
// with renderAiGatewayArchitectureDiagram in lib/markdown-component-renderers.js.

import type { CSSProperties } from "react";

const titleStyle = {
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  fontSize: 14,
  fill: "var(--text-primary)",
} as const;

const bodyStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  fill: "var(--text-secondary)",
} as const;

const bulletStyle = {
  fontFamily: "var(--font-sans)",
  fontSize: 13,
  fill: "var(--text-tertiary)",
} as const;

const solidLine = {
  stroke: "var(--line-cta)",
  strokeWidth: 1.25,
} as const;

const dashedLine = {
  stroke: "var(--text-tertiary)",
  strokeWidth: 1.25,
  strokeDasharray: "4 4",
} as const;

const boxStyle = {
  fill: "var(--surface-bg)",
  stroke: "var(--line-structure)",
  strokeWidth: 1,
} as const;

const cardShadow =
  "drop-shadow(-1px 2px 5px rgba(0, 0, 0, 0.04)) drop-shadow(-4px 8px 9px rgba(0, 0, 0, 0.03))";

// [x1, y1, x2, y2]: request arrows are solid, response arrows dashed.
const REQUESTS: Array<[number, number, number, number]> = [
  [137, 160, 305, 160],
  [137, 264, 305, 264],
  [509, 204, 661, 204],
  [408, 325, 408, 367],
];

const RESPONSES: Array<[number, number, number, number]> = [
  [306, 178, 139, 178],
  [306, 282, 139, 282],
  [662, 240, 511, 240],
];

/** Lines of wrapped SVG text, one baseline every 18px. */
function Lines({
  x,
  y,
  lines,
  style,
}: {
  x: number;
  y: number;
  lines: string[];
  style: CSSProperties;
}) {
  return (
    <text x={x} y={y} style={style}>
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : 18}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function AiGatewayArchitectureDiagram() {
  return (
    <figure className="not-prose my-6 overflow-x-auto">
      <svg
        viewBox="0 0 800 540"
        role="img"
        aria-label="AI Gateway architecture. Coding agents and AI applications authenticate with a gateway key and send the model name and URL along with the request body to the AI gateway, which runs in Langfuse. The gateway authorizes the user with the gateway key, maps the model name and URL to a valid model provider request, sends the API request to the external model provider (OpenAI or Anthropic), and returns the response. Langfuse tracing captures the request data, with different tracing options."
        style={{
          display: "block",
          width: "100%",
          minWidth: 560,
          height: "auto",
        }}
      >
        <defs>
          <marker
            id="ai-gateway-arrow"
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
              fill="none"
              style={{ stroke: "var(--line-cta)" }}
              strokeWidth="1.25"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </marker>
          <filter
            id="ai-gateway-highlight"
            x="-0.04"
            y="-0.08"
            width="1.08"
            height="1.16"
          >
            <feFlood style={{ floodColor: "var(--surface-cta-primary)" }} />
            <feComposite in="SourceGraphic" operator="over" />
          </filter>
        </defs>

        {/* Langfuse boundary */}
        <rect
          x="296.5"
          y="20.5"
          width="223"
          height="499"
          rx="2"
          fill="none"
          style={{ stroke: "var(--line-cta)" }}
          strokeDasharray="3 3"
        />
        <image
          href="/langfuse-icon.svg"
          x="310"
          y="34"
          width="16"
          height="16"
        />
        <text x="332" y="47" style={titleStyle}>
          Langfuse
        </text>

        {/* Arrows */}
        {REQUESTS.map(([x1, y1, x2, y2]) => (
          <line
            key={`req-${x1}-${y1}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            style={solidLine}
            markerEnd="url(#ai-gateway-arrow)"
          />
        ))}
        {RESPONSES.map(([x1, y1, x2, y2]) => (
          <line
            key={`res-${x1}-${y1}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            style={dashedLine}
            markerEnd="url(#ai-gateway-arrow)"
          />
        ))}

        {/* Clients */}
        <rect
          x="0.5"
          y="141.5"
          width="135"
          height="55"
          rx="2"
          style={boxStyle}
        />
        <text x="16" y="174" style={titleStyle}>
          Coding agent
        </text>
        <rect
          x="0.5"
          y="245.5"
          width="135"
          height="55"
          rx="2"
          style={boxStyle}
        />
        <text x="16" y="278" style={titleStyle}>
          AI application
        </text>

        {/* What clients send */}
        <text x="152" y="41.5" style={bulletStyle}>
          –
        </text>
        <Lines
          x={164}
          y={41.5}
          lines={["Authenticate with", "gateway key"]}
          style={bodyStyle}
        />
        <text x="152" y="84" style={bulletStyle}>
          –
        </text>
        <Lines
          x={164}
          y={84}
          lines={["Send model name", "and URL along", "request body"]}
          style={bodyStyle}
        />

        {/* AI gateway */}
        <rect
          x="308.5"
          y="104.5"
          width="199"
          height="219"
          rx="2"
          style={{ ...boxStyle, filter: cardShadow }}
        />
        <text
          x="326"
          y="139"
          filter="url(#ai-gateway-highlight)"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: 15,
            fill: "var(--text-primary)",
          }}
        >
          AI gateway
        </text>
        <text x="326" y="174.5" style={bulletStyle}>
          –
        </text>
        <Lines
          x={338}
          y={174.5}
          lines={["Authorize user with", "gateway key"]}
          style={bodyStyle}
        />
        <text x="326" y="222.5" style={bulletStyle}>
          –
        </text>
        <Lines
          x={338}
          y={222.5}
          lines={[
            "Map model name and",
            "URL to valid model",
            "provider request",
          ]}
          style={bodyStyle}
        />

        {/* Langfuse tracing */}
        <rect
          x="308.5"
          y="370.5"
          width="199"
          height="108"
          rx="2"
          style={{ ...boxStyle, filter: cardShadow }}
        />
        <text
          x="326"
          y="405"
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: 15,
            fill: "var(--text-primary)",
          }}
        >
          Langfuse tracing
        </text>
        <Lines
          x={326}
          y={436.5}
          lines={["Capture request data", "(different tracing options)"]}
          style={bodyStyle}
        />

        {/* Provider call */}
        <Lines
          x={540}
          y={177.5}
          lines={["API request to", "model provider"]}
          style={bodyStyle}
        />
        <text x="540" y="261.5" style={bodyStyle}>
          Response
        </text>

        {/* External model provider */}
        <rect
          x="664.5"
          y="175.5"
          width="135"
          height="111"
          rx="2"
          style={boxStyle}
        />
        <Lines
          x={680}
          y={208}
          lines={["External model", "provider"]}
          style={titleStyle}
        />
        <Lines
          x={680}
          y={245.5}
          lines={["OpenAI,", "Anthropic"]}
          style={{ ...bodyStyle, fill: "var(--text-tertiary)" }}
        />
      </svg>
    </figure>
  );
}
