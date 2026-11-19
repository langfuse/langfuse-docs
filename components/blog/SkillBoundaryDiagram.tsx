import { useId } from "react";
import styles from "./diagram-fit.module.css";

type BoundaryVariant = "own-agent" | "distributed";

function UserGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g
      stroke="var(--line-cta)"
      strokeWidth="1.35"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={x} cy={y - 12} r="6.5" />
      <line x1={x} y1={y - 5.5} x2={x} y2={y + 8} />
      <line x1={x - 8} y1={y} x2={x + 8} y2={y} />
      <line x1={x} y1={y + 8} x2={x - 8} y2={y + 18} />
      <line x1={x} y1={y + 8} x2={x + 8} y2={y + 18} />
    </g>
  );
}

function HarnessBox({
  x,
  y,
  height = 80,
}: {
  x: number;
  y: number;
  height?: number;
}) {
  return (
    <g>
      <text
        x={x + 2}
        y={y - 7}
        fontSize="12"
        fill="var(--text-secondary)"
        textAnchor="start"
      >
        harness
      </text>
      <rect
        x={x}
        y={y}
        width="104"
        height={height}
        rx="2"
        fill="var(--surface-bg)"
        stroke="var(--line-cta)"
        strokeWidth="1.25"
      />
      <rect
        x={x + 10}
        y={y + 12}
        width="44"
        height="18"
        rx="2"
        fill="var(--surface-cta-primary)"
      />
      <text
        x={x + 14}
        y={y + 25}
        fontSize="12.5"
        fontWeight="500"
        fill="var(--text-primary)"
        textAnchor="start"
      >
        skills
      </text>
      <text
        x={x + 14}
        y={y + 45}
        fontSize="12.5"
        fill="var(--text-secondary)"
        textAnchor="start"
      >
        tools
      </text>
      <text
        x={x + 14}
        y={y + 63}
        fontSize="12.5"
        fill="var(--text-tertiary)"
        textAnchor="start"
      >
        ...
      </text>
    </g>
  );
}

const DISTRIBUTED_ROWS = [
  { boxY: 52, skillsY: 73, midY: 84 },
  { boxY: 154, skillsY: 175, midY: 186 },
  { boxY: 256, skillsY: 277, midY: 288 },
] as const;

export function SkillBoundaryDiagram({
  variant = "own-agent",
}: {
  variant?: BoundaryVariant;
}) {
  const uid = useId().replace(/:/g, "");
  const arrowId = `sbd-arrow-${uid}`;

  if (variant === "distributed") {
    return (
      <figure className={`not-prose my-6 ${styles.figure}`}>
        <div className={styles.desktop}>
          <svg
            viewBox="0 0 760 352"
            role="img"
            aria-label="Distributed skills boundary diagram: one skill leaves your environment and fans out into multiple separate external harnesses, agents, and users."
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
            </defs>

            {/* Zone shading and headers */}
            <rect
              x="96"
              y="32"
              width="136"
              height="312"
              fill="var(--surface-1)"
              fillOpacity="0.5"
            />
            <text
              x="164"
              y="22"
              fontSize="12"
              fontWeight="500"
              fill="var(--text-secondary)"
              textAnchor="middle"
            >
              Your environment
            </text>
            <text
              x="496"
              y="22"
              fontSize="12"
              fill="var(--text-tertiary)"
              textAnchor="middle"
            >
              External
            </text>
            <line
              x1="96"
              y1="32"
              x2="96"
              y2="344"
              stroke="var(--line-divider-dash)"
              strokeWidth="1.4"
              strokeDasharray="5 4"
            />
            <line
              x1="232"
              y1="32"
              x2="232"
              y2="344"
              stroke="var(--line-divider-dash)"
              strokeWidth="1.4"
              strokeDasharray="5 4"
            />

            {/* Single skill fanning out to 3 external harnesses */}
            <text
              x="38"
              y="188"
              fontSize="13"
              fontWeight="500"
              fill="var(--text-primary)"
              textAnchor="middle"
            >
              skill
            </text>

            {DISTRIBUTED_ROWS.map((row, idx) => (
              <g key={row.boxY}>
                <line
                  x1="60"
                  y1={180 + idx * 4}
                  x2="272"
                  y2={row.skillsY}
                  stroke="var(--line-cta)"
                  strokeWidth="1.35"
                  markerEnd={`url(#${arrowId})`}
                />

                <HarnessBox x={276} y={row.boxY} height={76} />

                <line
                  x1="380"
                  y1={row.midY}
                  x2="496"
                  y2={row.midY}
                  stroke="var(--line-cta)"
                  strokeWidth="1.35"
                  markerEnd={`url(#${arrowId})`}
                />
                <text
                  x="528"
                  y={row.midY + 4}
                  fontSize="13"
                  fontWeight="500"
                  fill="var(--text-primary)"
                  textAnchor="middle"
                >
                  agent
                </text>

                <text
                  x="628"
                  y={row.midY - 10}
                  fontSize="11.5"
                  fill="var(--text-secondary)"
                  textAnchor="middle"
                >
                  user interacts with
                </text>
                <line
                  x1="698"
                  y1={row.midY}
                  x2="558"
                  y2={row.midY}
                  stroke="var(--line-cta)"
                  strokeWidth="1.35"
                  markerEnd={`url(#${arrowId})`}
                />
                <UserGlyph x={718} y={row.midY} />
              </g>
            ))}
          </svg>
        </div>

        <div className={`${styles.mobile} text-xs text-text-secondary`}>
          <div className="grid grid-cols-2 gap-2 border border-line-structure bg-surface-bg p-3">
            <div className="border border-dashed border-line-divider-dash bg-surface-1/50 p-2.5">
              <div className="font-medium text-text-primary">
                Your environment
              </div>
              <div className="mt-1">
                One skill leaves your environment and fans out externally.
              </div>
            </div>
            <div className="border border-dashed border-line-divider-dash p-2.5">
              <div className="font-medium text-text-tertiary">External</div>
              <div className="mt-1">
                Each user runs their own harness (skills, tools, ...) and agent.
              </div>
            </div>
          </div>
        </div>
      </figure>
    );
  }

  return (
    <figure className={`not-prose my-6 ${styles.figure}`}>
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 760 238"
          role="img"
          aria-label="Agent-owned skill boundary diagram: one skill feeds a single harness and agent inside your environment, while multiple external users interact with that agent."
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
          </defs>

          {/* Zone shading and headers */}
          <rect
            x="96"
            y="32"
            width="394"
            height="196"
            fill="var(--surface-1)"
            fillOpacity="0.5"
          />
          <text
            x="293"
            y="22"
            fontSize="12"
            fontWeight="500"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            Your environment
          </text>
          <text
            x="625"
            y="22"
            fontSize="12"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            External
          </text>
          <line
            x1="96"
            y1="32"
            x2="96"
            y2="228"
            stroke="var(--line-divider-dash)"
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />
          <line
            x1="490"
            y1="32"
            x2="490"
            y2="228"
            stroke="var(--line-divider-dash)"
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />

          {/* Skill -> harness -> agent inside Your environment */}
          <text
            x="38"
            y="88"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            skill
          </text>
          <line
            x1="60"
            y1="84"
            x2="210"
            y2="84"
            stroke="var(--line-cta)"
            strokeWidth="1.35"
            markerEnd={`url(#${arrowId})`}
          />

          <HarnessBox x={214} y={63} height={80} />

          <line
            x1="318"
            y1="84"
            x2="424"
            y2="84"
            stroke="var(--line-cta)"
            strokeWidth="1.35"
            markerEnd={`url(#${arrowId})`}
          />
          <text
            x="456"
            y="88"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            agent
          </text>

          {/* Multiple external users interacting with the single agent */}
          <text
            x="594"
            y="72"
            fontSize="11.5"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            users interact with
          </text>
          <line
            x1="698"
            y1="84"
            x2="486"
            y2="84"
            stroke="var(--line-cta)"
            strokeWidth="1.35"
            markerEnd={`url(#${arrowId})`}
          />
          <line
            x1="698"
            y1="142"
            x2="486"
            y2="86"
            stroke="var(--line-cta)"
            strokeWidth="1.35"
            markerEnd={`url(#${arrowId})`}
          />
          <line
            x1="698"
            y1="200"
            x2="486"
            y2="89"
            stroke="var(--line-cta)"
            strokeWidth="1.35"
            markerEnd={`url(#${arrowId})`}
          />

          <UserGlyph x={718} y={84} />
          <UserGlyph x={718} y={142} />
          <UserGlyph x={718} y={200} />
        </svg>
      </div>

      <div className={`${styles.mobile} text-xs text-text-secondary`}>
        <div className="grid grid-cols-2 gap-2 border border-line-structure bg-surface-bg p-3">
          <div className="border border-dashed border-line-divider-dash bg-surface-1/50 p-2.5">
            <div className="font-medium text-text-primary">
              Your environment
            </div>
            <div className="mt-1">
              One skill feeds your harness (skills, tools, ...) and single
              agent.
            </div>
          </div>
          <div className="border border-dashed border-line-divider-dash p-2.5">
            <div className="font-medium text-text-tertiary">External</div>
            <div className="mt-1">Multiple users interact with your agent.</div>
          </div>
        </div>
      </div>
    </figure>
  );
}
