import { useId } from "react";
import { Box, StackArrow } from "./diagram-primitives";
import styles from "./diagram-fit.module.css";

const STATIONS = [
  { label: "Tracing", x: 18, cx: 70 },
  { label: "Monitoring", x: 152, cx: 204 },
  { label: "Datasets", x: 286, cx: 338 },
  { label: "Experiment", x: 420, cx: 472 },
  { label: "Evaluate", x: 554, cx: 606 },
] as const;

const BOX_W = 104;
const BOX_H = 74;
const BOX_Y = 66;
const BOX_MID_Y = BOX_Y + BOX_H / 2;
const BOX_BOTTOM_Y = BOX_Y + BOX_H;

export function SkillOperationArchitectureDiagram() {
  const uid = useId().replace(/:/g, "");
  const arrowId = `soad-arrow-${uid}`;
  const arrowMutedId = `soad-arrow-muted-${uid}`;

  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      {/* Desktop / tablet SVG diagram */}
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 840 330"
          role="img"
          aria-label="High-level skill evaluation loop: Tracing, Monitoring, Datasets, Experiment, and Evaluate, with an iterate loop from Evaluate to Experiment, shipping to GitHub for Langfuse Halo and external coding agents, Halo feeding back into Tracing, and external coding agents sending feedback via API/MCP into Datasets and Experiment."
          className="block h-auto w-full font-sans"
        >
          <defs>
            <marker
              id={arrowId}
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path
                d="M1 1.5 L8.5 5 L1 8.5"
                fill="none"
                stroke="var(--line-cta)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
            <marker
              id={arrowMutedId}
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path
                d="M1 1.5 L8.5 5 L1 8.5"
                fill="none"
                stroke="var(--text-tertiary)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </marker>
          </defs>

          {/* Top dashed feedback loop from external coding agents into Datasets and Experiment */}
          <path
            d="M 532 304 L 696 304 L 696 22 L 338 22 L 338 63"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="1.4"
            strokeDasharray="6 4"
            markerEnd={`url(#${arrowMutedId})`}
          />
          <path
            d="M 472 22 L 472 63"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="1.4"
            strokeDasharray="6 4"
            markerEnd={`url(#${arrowMutedId})`}
          />
          <text
            x="708"
            y="148"
            fontSize="12"
            fill="var(--text-secondary)"
            textAnchor="start"
          >
            <tspan x="708" dy="0">
              Agent gives feedback
            </tspan>
            <tspan x="708" dy="16">
              via API / MCP
            </tspan>
          </text>

          {/* Left dashed feedback loop from Langfuse Halo into Tracing */}
          <path
            d="M 176 304 L 70 304 L 70 143"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="1.4"
            strokeDasharray="6 4"
            markerEnd={`url(#${arrowMutedId})`}
          />

          {/* Five loop stations */}
          {STATIONS.map((station, index) => (
            <g key={station.label}>
              <rect
                x={station.x}
                y={BOX_Y}
                width={BOX_W}
                height={BOX_H}
                rx="2"
                fill="var(--surface-bg)"
                stroke="var(--line-structure)"
                strokeWidth="1.25"
              />
              <text
                x={station.cx}
                y={BOX_MID_Y + 4}
                fontSize="13.5"
                fontWeight="500"
                fill="var(--text-primary)"
                textAnchor="middle"
              >
                {station.label}
              </text>

              {index < STATIONS.length - 1 && (
                <line
                  x1={station.x + BOX_W}
                  y1={BOX_MID_Y}
                  x2={STATIONS[index + 1].x - 3}
                  y2={BOX_MID_Y}
                  stroke="var(--line-cta)"
                  strokeWidth="1.4"
                  markerEnd={`url(#${arrowId})`}
                />
              )}
            </g>
          ))}

          {/* Offline iterate arrow: Evaluate -> Experiment */}
          <path
            d={`M 592 ${BOX_BOTTOM_Y} L 592 178 L 472 178 L 472 ${BOX_BOTTOM_Y + 3}`}
            fill="none"
            stroke="var(--line-cta)"
            strokeWidth="1.4"
            markerEnd={`url(#${arrowId})`}
          />
          <text
            x="532"
            y="169"
            fontSize="12"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            iterate
          </text>

          {/* Evaluate -> Ship to GitHub */}
          <path
            d={`M 618 ${BOX_BOTTOM_Y} L 618 217 L 409 217`}
            fill="none"
            stroke="var(--line-cta)"
            strokeWidth="1.4"
            markerEnd={`url(#${arrowId})`}
          />

          {/* Ship to GitHub box */}
          <rect
            x="266"
            y="196"
            width="140"
            height="42"
            rx="2"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-cta)"
            strokeWidth="1.25"
          />
          <text
            x="336"
            y="221"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            Ship to GitHub
          </text>

          {/* Branch arrows down to Langfuse Halo and External coding agents */}
          <line
            x1="316"
            y1="238"
            x2="250"
            y2="284"
            stroke="var(--line-cta)"
            strokeWidth="1.4"
            markerEnd={`url(#${arrowId})`}
          />
          <line
            x1="356"
            y1="238"
            x2="422"
            y2="284"
            stroke="var(--line-cta)"
            strokeWidth="1.4"
            markerEnd={`url(#${arrowId})`}
          />

          {/* Distribution targets */}
          <text
            x="232"
            y="308"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            Langfuse Halo
          </text>
          <text
            x="446"
            y="308"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            External coding agents
          </text>
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} text-xs text-text-secondary`}>
        <div className={styles.stack}>
          <Box>Tracing</Box>
          <StackArrow step={1}>Monitor live traces</StackArrow>
          <Box>Monitoring</Box>
          <StackArrow step={2}>Curate test cases</StackArrow>
          <Box>Datasets</Box>
          <StackArrow step={3}>Run skill variants</StackArrow>
          <Box>Experiment</Box>
          <StackArrow step={4}>Score and iterate</StackArrow>
          <Box>Evaluate</Box>
          <StackArrow step={5}>Release</StackArrow>
          <div className="flex items-center justify-center border border-line-cta bg-surface-cta-primary px-3 py-3 text-center font-medium text-text-primary">
            Ship to GitHub
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="border border-dashed border-line-structure bg-surface-bg p-3 text-center">
              <div className="font-medium text-text-primary">Langfuse Halo</div>
              <div className="mt-1 text-[11px] text-text-tertiary">
                Feeds back into Tracing
              </div>
            </div>
            <div className="border border-dashed border-line-structure bg-surface-bg p-3 text-center">
              <div className="font-medium text-text-primary">
                External coding agents
              </div>
              <div className="mt-1 text-[11px] text-text-tertiary">
                Agent gives feedback via API / MCP into Datasets and Experiment
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
