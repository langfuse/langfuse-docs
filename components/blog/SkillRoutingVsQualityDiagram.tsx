import { useId } from "react";
import styles from "./diagram-fit.module.css";

const SKILL_ROWS = [74, 108, 142, 176, 210, 244, 278];
const SELECTED_SKILL_INDEX = 3;

const QUALITY_METRICS = [
  { label: "pass rate", y: 136, v1Width: 102, v2Width: 162 },
  { label: "completeness", y: 192, v1Width: 88, v2Width: 170 },
  { label: "efficiency", y: 248, v1Width: 112, v2Width: 154 },
];

export function SkillRoutingVsQualityDiagram() {
  const arrowId = useId();

  return (
    <figure className={`not-prose my-8 ${styles.figure} ${styles.wide}`}>
      {/* Desktop / tablet layout */}
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 680 306"
          role="img"
          aria-label="Comparison of skill routing vs. skill quality evaluations: skill routing shows an agent selecting the right skill out of a list of available skills; skill quality compares skill v1 against skill v2 across quality metrics (pass rate, completeness, and efficiency)."
          className="block h-auto w-full text-text-primary"
        >
          <defs>
            <marker
              id={arrowId}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M0 1 L7 4 L0 7 Z" fill="var(--text-primary)" />
            </marker>
          </defs>

          {/* Left panel: Skill routing */}
          <text
            x="148"
            y="22"
            fontSize="15"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            Skill routing
          </text>

          {/* Agent node */}
          <rect
            x="22"
            y="158"
            width="76"
            height="36"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="60"
            y="180"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            agent
          </text>

          {/* Arrow from agent to selected skill */}
          <line
            x1="98"
            y1="176"
            x2="196"
            y2="176"
            stroke="var(--text-primary)"
            strokeWidth="1.25"
            markerEnd={`url(#${arrowId})`}
          />

          {/* Vertical list of skills */}
          {SKILL_ROWS.map((y, index) => {
            const isSelected = index === SELECTED_SKILL_INDEX;
            return (
              <g key={`skill-${y}`}>
                {isSelected && (
                  <rect
                    x="202"
                    y={y - 15}
                    width="64"
                    height="30"
                    rx="2"
                    fill="var(--surface-cta-primary)"
                    stroke="var(--line-structure)"
                    strokeWidth="1"
                  />
                )}
                <text
                  x="234"
                  y={y + 4.5}
                  fontSize="13.5"
                  fontWeight={isSelected ? "500" : "400"}
                  fill={
                    isSelected ? "var(--text-primary)" : "var(--text-secondary)"
                  }
                  textAnchor="middle"
                >
                  skill
                </text>
              </g>
            );
          })}

          {/* Vertical dotted separator */}
          <line
            x1="310"
            y1="8"
            x2="310"
            y2="296"
            stroke="var(--text-primary)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {/* Right panel: Skill quality */}
          <text
            x="500"
            y="22"
            fontSize="15"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            Skill quality
          </text>

          {/* skill v1 vs skill v2 header */}
          <rect
            x="356"
            y="64"
            width="104"
            height="36"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="408"
            y="86"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            skill v1
          </text>

          <text
            x="500"
            y="86"
            fontSize="13.5"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            vs
          </text>

          <rect
            x="540"
            y="64"
            width="104"
            height="36"
            rx="2"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="592"
            y="86"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            skill v2
          </text>

          {/* Quality metric comparison bars */}
          <line
            x1="460"
            y1="126"
            x2="460"
            y2="282"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          {QUALITY_METRICS.map((metric) => (
            <g key={metric.label}>
              <text
                x="356"
                y={metric.y + 16}
                fontSize="13"
                fill="var(--text-secondary)"
              >
                {metric.label}
              </text>
              <rect
                x="460"
                y={metric.y}
                width={metric.v1Width}
                height="11"
                rx="1"
                fill="var(--surface-bg)"
                stroke="var(--line-structure)"
                strokeWidth="1"
              />
              <rect
                x="460"
                y={metric.y + 15}
                width={metric.v2Width}
                height="11"
                rx="1"
                fill="var(--surface-cta-primary)"
                stroke="var(--line-structure)"
                strokeWidth="1"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} space-y-3 text-sm text-text-secondary`}>
        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="font-medium text-text-primary">Skill routing</div>
          <p className="mt-1.5 text-xs">
            An <span className="font-mono text-text-primary">agent</span>{" "}
            selects the{" "}
            <span className="bg-surface-cta-primary px-1 font-mono font-medium text-text-primary">
              right skill
            </span>{" "}
            from all available skills without interfering with the rest.
          </p>
        </div>

        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="font-medium text-text-primary">Skill quality</div>
          <p className="mt-1.5 text-xs">
            Compare <span className="font-mono text-text-primary">skill v1</span>{" "}
            vs.{" "}
            <span className="bg-surface-cta-primary px-1 font-mono font-medium text-text-primary">
              skill v2
            </span>{" "}
            across quality metrics (pass rate, completeness, efficiency).
          </p>
        </div>
      </div>
    </figure>
  );
}
