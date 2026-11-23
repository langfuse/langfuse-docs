import { useId } from "react";
import styles from "./diagram-fit.module.css";

const FULL_RUN_STEPS = [122, 152, 182, 212, 242];
const SKIPPED_STEPS = [198, 224, 250];

export function SkillRoutingVsQualityDiagram() {
  const arrowId = useId();
  const arrowStartId = useId();

  return (
    <figure className={`not-prose my-8 ${styles.figure} ${styles.wide}`}>
      {/* Desktop / tablet layout */}
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 680 322"
          role="img"
          aria-label="Comparison of skill routing vs. skill quality evaluations: skill routing leaves the skill available and stops as soon as the agent picks or skips the skill, skipping the rest of the execution; skill quality runs full trajectories in parallel comparing a baseline (no skill or previous version) against a forced skill and compares their results."
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
              <path d="M0 1 L7 4 L0 7 Z" fill="var(--text-secondary)" />
            </marker>
            <marker
              id={arrowStartId}
              viewBox="0 0 8 8"
              refX="1"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M8 1 L1 4 L8 7 Z" fill="var(--text-secondary)" />
            </marker>
          </defs>

          {/* Left panel: Skill routing */}
          <text
            x="149"
            y="22"
            fontSize="15"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            Skill routing
          </text>

          {/* Left start box */}
          <rect
            x="36"
            y="54"
            width="136"
            height="44"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="104"
            y="72"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            skill available
          </text>
          <text
            x="104"
            y="88"
            fontSize="11.5"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            not forced
          </text>

          {/* Left active timeline (steps 1-2) */}
          <line
            x1="104"
            y1="98"
            x2="104"
            y2="174"
            stroke="var(--text-secondary)"
            strokeWidth="1"
          />
          <circle
            cx="104"
            cy="122"
            r="4.5"
            fill="var(--surface-cta-primary)"
            stroke="var(--text-secondary)"
            strokeWidth="1"
          />
          <circle
            cx="104"
            cy="152"
            r="4.5"
            fill="var(--surface-cta-primary)"
            stroke="var(--text-secondary)"
            strokeWidth="1"
          />

          {/* Selection callout at step 2 */}
          <line
            x1="109"
            y1="152"
            x2="164"
            y2="152"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            strokeDasharray="4 3"
          />
          <rect
            x="164"
            y="137"
            width="120"
            height="30"
            rx="2"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="224"
            y="156"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            picks skill?
          </text>

          {/* Stop bar */}
          <line
            x1="74"
            y1="174"
            x2="134"
            y2="174"
            stroke="var(--text-primary)"
            strokeWidth="1.5"
          />
          <text
            x="144"
            y="178"
            fontSize="12.5"
            fontWeight="500"
            fill="var(--text-primary)"
          >
            stop here
          </text>

          {/* Ghosted remaining execution */}
          <line
            x1="104"
            y1="178"
            x2="104"
            y2="266"
            stroke="var(--line-structure)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          {SKIPPED_STEPS.map((y) => (
            <circle
              key={`skip-${y}`}
              cx="104"
              cy={y}
              r="4.5"
              fill="var(--surface-bg)"
              stroke="var(--line-structure)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          ))}
          <text x="122" y="228" fontSize="12" fill="var(--text-tertiary)">
            rest of run skipped
          </text>

          {/* Vertical dotted separator */}
          <line
            x1="310"
            y1="8"
            x2="310"
            y2="312"
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

          {/* Right Column A: Baseline */}
          <rect
            x="348"
            y="54"
            width="132"
            height="44"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="414"
            y="72"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            baseline
          </text>
          <text
            x="414"
            y="88"
            fontSize="11.5"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            no skill / prev. v
          </text>

          <line
            x1="414"
            y1="98"
            x2="414"
            y2="268"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            markerEnd={`url(#${arrowId})`}
          />
          {FULL_RUN_STEPS.map((y) => (
            <circle
              key={`base-${y}`}
              cx="414"
              cy={y}
              r="4.5"
              fill="var(--surface-bg)"
              stroke="var(--text-secondary)"
              strokeWidth="1"
            />
          ))}

          <rect
            x="368"
            y="272"
            width="92"
            height="32"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="414"
            y="292"
            fontSize="13"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            result
          </text>

          {/* Right Column B: Forced skill */}
          <rect
            x="520"
            y="54"
            width="132"
            height="44"
            rx="2"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="586"
            y="72"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            forced skill
          </text>
          <text
            x="586"
            y="88"
            fontSize="11.5"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            loaded in context
          </text>

          <line
            x1="586"
            y1="98"
            x2="586"
            y2="268"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            markerEnd={`url(#${arrowId})`}
          />
          {FULL_RUN_STEPS.map((y) => (
            <circle
              key={`forced-${y}`}
              cx="586"
              cy={y}
              r="4.5"
              fill="var(--surface-cta-primary)"
              stroke="var(--text-secondary)"
              strokeWidth="1"
            />
          ))}

          <rect
            x="540"
            y="272"
            width="92"
            height="32"
            rx="2"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="586"
            y="292"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            result
          </text>

          {/* Compare arrow between results */}
          <text
            x="500"
            y="278"
            fontSize="12.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            compare
          </text>
          <line
            x1="466"
            y1="288"
            x2="534"
            y2="288"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            markerStart={`url(#${arrowStartId})`}
            markerEnd={`url(#${arrowId})`}
          />
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} space-y-3 text-sm text-text-secondary`}>
        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="font-medium text-text-primary">Skill routing</div>
          <p className="mt-1.5 text-xs">
            Run with <span className="font-mono text-text-primary">skill available</span> (not forced), check whether the agent{" "}
            <span className="bg-surface-cta-primary px-1 font-medium text-text-primary">
              picks the right skill
            </span>
            , and stop there without running the rest of the execution.
          </p>
        </div>

        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="font-medium text-text-primary">Skill quality</div>
          <p className="mt-1.5 text-xs">
            Run the full task in parallel with a{" "}
            <span className="font-mono text-text-primary">baseline</span> (no skill or previous version) vs.{" "}
            <span className="bg-surface-cta-primary px-1 font-mono font-medium text-text-primary">
              forced skill
            </span>
            , then compare outcomes, turns, and cost.
          </p>
        </div>
      </div>
    </figure>
  );
}
