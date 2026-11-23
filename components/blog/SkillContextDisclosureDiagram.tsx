import { useId } from "react";
import styles from "./diagram-fit.module.css";

const ITERATIONS = [
  { label: "iteration 1", y: 70 },
  { label: "iteration 2", y: 108 },
  { label: "iteration 3", y: 146 },
  { label: "iteration 4", y: 184 },
  { label: "iteration 5", y: 222 },
  { label: "iteration 6", y: 260 },
  { label: "iteration 7", y: 298 },
];

export function SkillContextDisclosureDiagram() {
  const arrowId = useId();

  return (
    <figure className={`not-prose my-8 ${styles.figure} ${styles.wide}`}>
      {/* Desktop / tablet layout */}
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 760 364"
          role="img"
          aria-label="Comparison of agent context across 7 iterations: a system prompt stays in context from iteration 1 to 7, whereas a skill starts with only frontmatter, loads SKILL.md when the agent decides to use the skill at iteration 3, and loads references/file-1.md when the agent reads a reference file at iteration 6."
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
          </defs>

          {/* Left panel: Prompt */}
          <text
            x="142"
            y="20"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            Prompt
          </text>

          {/* Left context container */}
          <rect
            x="20"
            y="36"
            width="132"
            height="306"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="0.95"
          />

          {/* Full-height prompt strip */}
          <rect
            x="20"
            y="36"
            width="28"
            height="306"
            rx="1"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="0.95"
          />
          <text
            x="34"
            y="189"
            fontSize="11.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 34 189)"
          >
            prompt
          </text>
          <text
            x="100"
            y="54"
            fontSize="11"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            agent context
          </text>

          {/* Left iteration timeline */}
          <line
            x1="188"
            y1="36"
            x2="188"
            y2="344"
            stroke="var(--text-secondary)"
            strokeWidth="0.95"
            markerEnd={`url(#${arrowId})`}
          />
          {ITERATIONS.map((iter) => (
            <g key={`left-${iter.label}`}>
              <circle
                cx="188"
                cy={iter.y}
                r="4"
                fill="var(--surface-cta-primary)"
                stroke="var(--text-secondary)"
                strokeWidth="0.95"
              />
              <text
                x="204"
                y={iter.y + 4}
                fontSize="11.5"
                fill="var(--text-secondary)"
              >
                {iter.label}
              </text>
            </g>
          ))}

          {/* Right panel: Skill */}
          <text
            x="530"
            y="20"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            Skill
          </text>

          {/* Right context container */}
          <rect
            x="340"
            y="36"
            width="148"
            height="306"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="0.95"
          />

          {/* Frontmatter strip (iterations 1-7) */}
          <rect
            x="340"
            y="36"
            width="28"
            height="306"
            rx="1"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="0.95"
          />
          <text
            x="354"
            y="189"
            fontSize="11.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 354 189)"
          >
            frontmatter
          </text>
          <text
            x="428"
            y="54"
            fontSize="11"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            agent context
          </text>

          {/* SKILL.md strip (iterations 3-7) */}
          <rect
            x="368"
            y="146"
            width="28"
            height="196"
            rx="1"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="0.95"
          />
          <text
            x="382"
            y="244"
            fontSize="11"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 382 244)"
          >
            SKILL.md
          </text>

          {/* references/file-1.md strip (iterations 6-7) */}
          <rect
            x="396"
            y="260"
            width="32"
            height="82"
            rx="1"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="0.95"
          />
          <text
            x="407"
            y="301"
            fontSize="9.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 407 301)"
          >
            references/
          </text>
          <text
            x="419"
            y="301"
            fontSize="9.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 419 301)"
          >
            file-1.md
          </text>

          {/* Dashed trigger line: iteration 3 -> SKILL.md */}
          <line
            x1="396"
            y1="146"
            x2="636"
            y2="146"
            stroke="var(--text-secondary)"
            strokeWidth="0.95"
            strokeDasharray="4 3"
          />
          <text x="502" y="124" fontSize="11" fill="var(--text-secondary)">
            agent decides
          </text>
          <text x="502" y="138" fontSize="11" fill="var(--text-secondary)">
            to use skill
          </text>

          {/* Dashed trigger line: iteration 6 -> references/file-1.md */}
          <line
            x1="428"
            y1="260"
            x2="636"
            y2="260"
            stroke="var(--text-secondary)"
            strokeWidth="0.95"
            strokeDasharray="4 3"
          />
          <text x="502" y="238" fontSize="11" fill="var(--text-secondary)">
            agent reads skill
          </text>
          <text x="502" y="252" fontSize="11" fill="var(--text-secondary)">
            reference file
          </text>

          {/* Right iteration timeline */}
          <line
            x1="640"
            y1="36"
            x2="640"
            y2="344"
            stroke="var(--text-secondary)"
            strokeWidth="0.95"
            markerEnd={`url(#${arrowId})`}
          />
          {ITERATIONS.map((iter) => (
            <g key={`right-${iter.label}`}>
              <circle
                cx="640"
                cy={iter.y}
                r="4"
                fill="var(--surface-cta-primary)"
                stroke="var(--text-secondary)"
                strokeWidth="0.95"
              />
              <text
                x="656"
                y={iter.y + 4}
                fontSize="11.5"
                fill="var(--text-secondary)"
              >
                {iter.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} space-y-3 text-xs text-text-secondary`}>
        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="font-medium text-text-primary">Prompt</div>
          <div className="mt-1 text-[11px] text-text-tertiary">
            agent context across iterations 1 to 7
          </div>
          <div className="mt-2 inline-block border border-line-structure bg-surface-cta-primary px-2 py-0.5 font-mono text-[11px] font-medium text-text-primary">
            prompt
          </div>
          <p className="mt-1.5 text-[11px]">
            Always present in context from iteration 1 through iteration 7.
          </p>
        </div>

        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="font-medium text-text-primary">Skill</div>
          <div className="mt-1 text-[11px] text-text-tertiary">
            agent context across iterations 1 to 7
          </div>
          <ol className="mt-2 space-y-1.5 text-[11px]">
            <li>
              <span className="font-mono text-text-primary">iteration 1:</span>{" "}
              only{" "}
              <span className="bg-surface-cta-primary px-1 font-mono text-text-primary">
                frontmatter
              </span>{" "}
              is in context.
            </li>
            <li>
              <span className="font-mono text-text-primary">iteration 3:</span>{" "}
              agent decides to use skill, loading{" "}
              <span className="bg-surface-cta-primary px-1 font-mono text-text-primary">
                SKILL.md
              </span>
              .
            </li>
            <li>
              <span className="font-mono text-text-primary">iteration 6:</span>{" "}
              agent reads skill reference file, loading{" "}
              <span className="bg-surface-cta-primary px-1 font-mono text-text-primary">
                references/file-1.md
              </span>
              .
            </li>
          </ol>
        </div>
      </div>
    </figure>
  );
}
