import { useId } from "react";
import styles from "./diagram-fit.module.css";

function UserGlyph({ x, y }: { x: number; y: number }) {
  return (
    <g
      stroke="var(--line-cta)"
      strokeWidth="1.4"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx={x} cy={y - 16} r="8" />
      <line x1={x} y1={y - 8} x2={x} y2={y + 10} />
      <line x1={x - 10} y1={y - 1} x2={x + 10} y2={y - 1} />
      <line x1={x} y1={y + 10} x2={x - 10} y2={y + 22} />
      <line x1={x} y1={y + 10} x2={x + 10} y2={y + 22} />
    </g>
  );
}

function HarnessBox({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <text
        x={x + 2}
        y={y - 8}
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
        height="84"
        rx="2"
        fill="var(--surface-bg)"
        stroke="var(--line-cta)"
        strokeWidth="1.25"
      />
      <rect
        x={x + 10}
        y={y + 14}
        width="44"
        height="18"
        rx="2"
        fill="var(--surface-cta-primary)"
      />
      <text
        x={x + 14}
        y={y + 27}
        fontSize="12.5"
        fontWeight="500"
        fill="var(--text-primary)"
        textAnchor="start"
      >
        skills
      </text>
      <text
        x={x + 14}
        y={y + 49}
        fontSize="12.5"
        fill="var(--text-secondary)"
        textAnchor="start"
      >
        tools
      </text>
      <text
        x={x + 14}
        y={y + 68}
        fontSize="12.5"
        fill="var(--text-tertiary)"
        textAnchor="start"
      >
        ...
      </text>
    </g>
  );
}

export function SkillBoundaryDiagram() {
  const uid = useId().replace(/:/g, "");
  const arrowId = `sbd-arrow-${uid}`;

  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      {/* Desktop / tablet SVG diagram */}
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 760 416"
          role="img"
          aria-label="Comparison of environment boundaries for agent-owned skills versus distributed skills. For skills in an agent you build, both the harness and the agent live inside your environment while users interact externally. For distributed skills, the skill leaves your environment and the harness, agent, and users all live externally."
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

          {/* Row 1: Skills for an agent you build */}
          <text
            x="12"
            y="20"
            fontSize="13"
            fontWeight="600"
            fill="var(--text-primary)"
          >
            (1) Skills for an agent you build
          </text>

          {/* Row 1 zone shading and headers */}
          <rect
            x="96"
            y="54"
            width="394"
            height="130"
            fill="var(--surface-1)"
            fillOpacity="0.5"
          />
          <text
            x="293"
            y="44"
            fontSize="12"
            fontWeight="500"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            Your environment
          </text>
          <text
            x="625"
            y="44"
            fontSize="12"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            External
          </text>
          <line
            x1="96"
            y1="54"
            x2="96"
            y2="184"
            stroke="var(--line-divider-dash)"
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />
          <line
            x1="490"
            y1="54"
            x2="490"
            y2="184"
            stroke="var(--line-divider-dash)"
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />

          {/* Row 1 flow */}
          <text
            x="40"
            y="112"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            skill
          </text>
          <line
            x1="62"
            y1="108"
            x2="210"
            y2="108"
            stroke="var(--line-cta)"
            strokeWidth="1.4"
            markerEnd={`url(#${arrowId})`}
          />

          <HarnessBox x={214} y={84} />

          <line
            x1="318"
            y1="116"
            x2="424"
            y2="116"
            stroke="var(--line-cta)"
            strokeWidth="1.4"
            markerEnd={`url(#${arrowId})`}
          />
          <text
            x="456"
            y="120"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            agent
          </text>

          <text
            x="592"
            y="104"
            fontSize="11.5"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            users interact with
          </text>
          <line
            x1="696"
            y1="116"
            x2="486"
            y2="116"
            stroke="var(--line-cta)"
            strokeWidth="1.4"
            markerEnd={`url(#${arrowId})`}
          />
          <UserGlyph x={716} y={116} />

          {/* Divider between rows */}
          <line
            x1="12"
            y1="208"
            x2="748"
            y2="208"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />

          {/* Row 2: Distributed skills */}
          <text
            x="12"
            y="236"
            fontSize="13"
            fontWeight="600"
            fill="var(--text-primary)"
          >
            (2) Distributed skills
          </text>

          {/* Row 2 zone shading and headers */}
          <rect
            x="96"
            y="270"
            width="136"
            height="130"
            fill="var(--surface-1)"
            fillOpacity="0.5"
          />
          <text
            x="164"
            y="260"
            fontSize="12"
            fontWeight="500"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            Your environment
          </text>
          <text
            x="496"
            y="260"
            fontSize="12"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            External
          </text>
          <line
            x1="96"
            y1="270"
            x2="96"
            y2="400"
            stroke="var(--line-divider-dash)"
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />
          <line
            x1="232"
            y1="270"
            x2="232"
            y2="400"
            stroke="var(--line-divider-dash)"
            strokeWidth="1.4"
            strokeDasharray="5 4"
          />

          {/* Row 2 flow */}
          <text
            x="40"
            y="328"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            skill
          </text>
          <line
            x1="62"
            y1="324"
            x2="272"
            y2="324"
            stroke="var(--line-cta)"
            strokeWidth="1.4"
            markerEnd={`url(#${arrowId})`}
          />

          <HarnessBox x={276} y={300} />

          <line
            x1="380"
            y1="332"
            x2="496"
            y2="332"
            stroke="var(--line-cta)"
            strokeWidth="1.4"
            markerEnd={`url(#${arrowId})`}
          />
          <text
            x="528"
            y="336"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            agent
          </text>

          <text
            x="628"
            y="320"
            fontSize="11.5"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            users interact with
          </text>
          <line
            x1="696"
            y1="332"
            x2="558"
            y2="332"
            stroke="var(--line-cta)"
            strokeWidth="1.4"
            markerEnd={`url(#${arrowId})`}
          />
          <UserGlyph x={716} y={332} />
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} space-y-4 text-xs text-text-secondary`}>
        <div className="border border-line-structure bg-surface-bg p-4">
          <div className="font-semibold text-text-primary">
            (1) Skills for an agent you build
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="border border-dashed border-line-divider-dash bg-surface-1/50 p-2.5">
              <div className="font-medium text-text-primary">
                Your environment
              </div>
              <div className="mt-1">
                Skill feeds into your harness (skills, tools, ...) and your
                agent.
              </div>
            </div>
            <div className="border border-dashed border-line-divider-dash p-2.5">
              <div className="font-medium text-text-tertiary">External</div>
              <div className="mt-1">Users interact with your agent.</div>
            </div>
          </div>
        </div>

        <div className="border border-line-structure bg-surface-bg p-4">
          <div className="font-semibold text-text-primary">
            (2) Distributed skills
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="border border-dashed border-line-divider-dash bg-surface-1/50 p-2.5">
              <div className="font-medium text-text-primary">
                Your environment
              </div>
              <div className="mt-1">
                Only the skill leaves your environment.
              </div>
            </div>
            <div className="border border-dashed border-line-divider-dash p-2.5">
              <div className="font-medium text-text-tertiary">External</div>
              <div className="mt-1">
                Harness (skills, tools, ...), agent, and users all live
                externally.
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
