import { useId } from "react";
import styles from "./diagram-fit.module.css";

const QUALITY_STEPS = [128, 160, 192, 224];

export function SkillRoutingVsQualityDiagram() {
  const arrowId = useId();
  const arrowStartId = useId();

  return (
    <figure className={`not-prose my-8 ${styles.figure} ${styles.wide}`}>
      {/* Desktop / tablet layout */}
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 680 330"
          role="img"
          aria-label="Comparison of skill routing vs. skill quality evaluations: skill routing tests whether an agent routes a user prompt to the right skill among all available skills (skill A, edited skill B, skill C, or no skill) without interfering with other skills; skill quality forces skill B (v2) into context and compares the full run result against a baseline (no skill or v1)."
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

          {/* User prompt box */}
          <rect
            x="76"
            y="56"
            width="146"
            height="34"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="149"
            y="77"
            fontSize="13"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            user prompt
          </text>

          {/* Arrow: prompt -> agent */}
          <line
            x1="149"
            y1="90"
            x2="149"
            y2="112"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            markerEnd={`url(#${arrowId})`}
          />

          {/* Agent box */}
          <rect
            x="99"
            y="114"
            width="100"
            height="34"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="149"
            y="135"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            agent
          </text>

          {/* Arrow: agent -> available skills */}
          <line
            x1="149"
            y1="148"
            x2="149"
            y2="184"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            markerEnd={`url(#${arrowId})`}
          />
          <text x="159" y="170" fontSize="12" fill="var(--text-secondary)">
            selects
          </text>

          {/* Available skills catalog */}
          <text x="14" y="179" fontSize="12" fill="var(--text-tertiary)">
            all available skills
          </text>
          <rect
            x="14"
            y="186"
            width="270"
            height="108"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />

          {/* 2x2 grid of skills */}
          <rect
            x="28"
            y="200"
            width="114"
            height="34"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="85"
            y="221"
            fontSize="13"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            skill A
          </text>

          <rect
            x="156"
            y="200"
            width="114"
            height="34"
            rx="2"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="213"
            y="221"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            skill B (v2)
          </text>

          <rect
            x="28"
            y="246"
            width="114"
            height="34"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="85"
            y="267"
            fontSize="13"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            skill C
          </text>

          <rect
            x="156"
            y="246"
            width="114"
            height="34"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
          <text
            x="213"
            y="267"
            fontSize="13"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            no skill
          </text>

          <text
            x="149"
            y="316"
            fontSize="12"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            right pick, no interference with other skills
          </text>

          {/* Vertical dotted separator */}
          <line
            x1="310"
            y1="8"
            x2="310"
            y2="320"
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
            y="56"
            width="132"
            height="44"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="414"
            y="74"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            baseline
          </text>
          <text
            x="414"
            y="90"
            fontSize="11.5"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            no skill or v1
          </text>

          <line
            x1="414"
            y1="100"
            x2="414"
            y2="254"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            markerEnd={`url(#${arrowId})`}
          />
          {QUALITY_STEPS.map((y) => (
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
            y="258"
            width="92"
            height="34"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="414"
            y="279"
            fontSize="13"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            result
          </text>

          {/* Right Column B: Forced skill */}
          <rect
            x="520"
            y="56"
            width="132"
            height="44"
            rx="2"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="586"
            y="74"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            skill B (v2)
          </text>
          <text
            x="586"
            y="90"
            fontSize="11.5"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            forced in context
          </text>

          <line
            x1="586"
            y1="100"
            x2="586"
            y2="254"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            markerEnd={`url(#${arrowId})`}
          />
          {QUALITY_STEPS.map((y) => (
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
            y="258"
            width="92"
            height="34"
            rx="2"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="586"
            y="279"
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
            y="265"
            fontSize="12.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            compare
          </text>
          <line
            x1="466"
            y1="275"
            x2="534"
            y2="275"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            markerStart={`url(#${arrowStartId})`}
            markerEnd={`url(#${arrowId})`}
          />

          <text
            x="500"
            y="316"
            fontSize="12"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            is the new version better when used?
          </text>
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} space-y-3 text-sm text-text-secondary`}>
        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="font-medium text-text-primary">Skill routing</div>
          <p className="mt-1.5 text-xs">
            Test in the context of all available skills (
            <span className="font-mono text-text-primary">skill A</span>,{" "}
            <span className="bg-surface-cta-primary px-1 font-mono font-medium text-text-primary">
              skill B (v2)
            </span>
            , <span className="font-mono text-text-primary">skill C</span>, or{" "}
            <span className="font-mono text-text-primary">no skill</span>) to
            verify the agent picks the right one without interfering with other
            skills.
          </p>
        </div>

        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="font-medium text-text-primary">Skill quality</div>
          <p className="mt-1.5 text-xs">
            Assume{" "}
            <span className="bg-surface-cta-primary px-1 font-mono font-medium text-text-primary">
              skill B (v2)
            </span>{" "}
            is forced into context, run the full task against a{" "}
            <span className="font-mono text-text-primary">baseline</span> (no
            skill or v1), and compare the results.
          </p>
        </div>
      </div>
    </figure>
  );
}
