import { useId } from "react";
import styles from "./diagram-fit.module.css";

const ITERATIONS = [
  { label: "iteration 1", y: 106 },
  { label: "iteration 2", y: 150 },
  { label: "iteration 3", y: 194 },
  { label: "iteration 4", y: 238 },
  { label: "iteration 5", y: 282 },
  { label: "iteration 6", y: 326 },
  { label: "iteration 7", y: 370 },
];

export function SkillContextDisclosureDiagram() {
  const arrowId = useId();

  return (
    <figure className={`not-prose my-8 ${styles.figure} ${styles.wide}`}>
      {/* Desktop / tablet layout */}
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 680 440"
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
              markerWidth="5.5"
              markerHeight="5.5"
              orient="auto"
            >
              <path d="M0 1 L7 4 L0 7 Z" fill="var(--text-secondary)" />
            </marker>
          </defs>

          {/* Left panel: Prompt */}
          <text
            x="129"
            y="22"
            fontSize="15"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            Prompt
          </text>
          <text x="8" y="58" fontSize="13" fill="var(--text-tertiary)">
            agent context
          </text>

          {/* Left context container */}
          <rect
            x="8"
            y="68"
            width="134"
            height="352"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="0.75"
          />

          {/* Full-height prompt strip */}
          <rect
            x="8"
            y="68"
            width="30"
            height="352"
            rx="1"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="0.75"
          />
          <text
            x="23"
            y="244"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 23 244)"
          >
            prompt
          </text>

          {/* Left iteration timeline */}
          <line
            x1="166"
            y1="68"
            x2="166"
            y2="426"
            stroke="var(--text-secondary)"
            strokeWidth="0.75"
            markerEnd={`url(#${arrowId})`}
          />
          {ITERATIONS.map((iter) => (
            <g key={`left-${iter.label}`}>
              <circle
                cx="166"
                cy={iter.y}
                r="4.5"
                fill="var(--surface-cta-primary)"
                stroke="var(--text-secondary)"
                strokeWidth="0.75"
              />
              <text
                x="180"
                y={iter.y + 4.5}
                fontSize="13.5"
                fill="var(--text-secondary)"
              >
                {iter.label}
              </text>
            </g>
          ))}

          {/* Vertical dotted separator between Prompt and Skill */}
          <line
            x1="271"
            y1="8"
            x2="271"
            y2="428"
            stroke="var(--text-primary)"
            strokeWidth="0.75"
            strokeDasharray="2 4"
          />

          {/* Right panel: Skill */}
          <text
            x="482"
            y="22"
            fontSize="15"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            Skill
          </text>
          <text x="292" y="58" fontSize="13" fill="var(--text-tertiary)">
            agent context
          </text>

          {/* Right context container */}
          <rect
            x="292"
            y="68"
            width="152"
            height="352"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="0.75"
          />

          {/* Frontmatter strip (iterations 1-7) */}
          <rect
            x="292"
            y="68"
            width="30"
            height="352"
            rx="1"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="0.75"
          />
          <text
            x="307"
            y="244"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 307 244)"
          >
            frontmatter
          </text>

          {/* SKILL.md strip (iterations 3-7) */}
          <rect
            x="322"
            y="194"
            width="30"
            height="226"
            rx="1"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="0.75"
          />
          <text
            x="337"
            y="307"
            fontSize="13"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 337 307)"
          >
            SKILL.md
          </text>

          {/* references/file-1.md strip (iterations 6-7) */}
          <rect
            x="352"
            y="326"
            width="36"
            height="94"
            rx="1"
            fill="var(--surface-cta-primary)"
            stroke="var(--line-structure)"
            strokeWidth="0.75"
          />
          <text
            x="364"
            y="373"
            fontSize="11.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 364 373)"
          >
            references/
          </text>
          <text
            x="378"
            y="373"
            fontSize="11.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 378 373)"
          >
            file-1.md
          </text>

          {/* Dashed trigger line: iteration 3 -> SKILL.md */}
          <line
            x1="352"
            y1="194"
            x2="583"
            y2="194"
            stroke="var(--text-tertiary)"
            strokeWidth="0.75"
            strokeDasharray="4 3"
          />
          <text x="456" y="168" fontSize="13" fill="var(--text-secondary)">
            agent decides
          </text>
          <text x="456" y="185" fontSize="13" fill="var(--text-secondary)">
            to use skill
          </text>

          {/* Dashed trigger line: iteration 6 -> references/file-1.md */}
          <line
            x1="388"
            y1="326"
            x2="583"
            y2="326"
            stroke="var(--text-tertiary)"
            strokeWidth="0.75"
            strokeDasharray="4 3"
          />
          <text x="456" y="300" fontSize="13" fill="var(--text-secondary)">
            agent reads skill
          </text>
          <text x="456" y="317" fontSize="13" fill="var(--text-secondary)">
            reference file
          </text>

          {/* Right iteration timeline */}
          <line
            x1="588"
            y1="68"
            x2="588"
            y2="426"
            stroke="var(--text-secondary)"
            strokeWidth="0.75"
            markerEnd={`url(#${arrowId})`}
          />
          {ITERATIONS.map((iter) => (
            <g key={`right-${iter.label}`}>
              <circle
                cx="588"
                cy={iter.y}
                r="4.5"
                fill="var(--surface-cta-primary)"
                stroke="var(--text-secondary)"
                strokeWidth="0.75"
              />
              <text
                x="602"
                y={iter.y + 4.5}
                fontSize="13.5"
                fill="var(--text-secondary)"
              >
                {iter.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} space-y-3 text-sm text-text-secondary`}>
        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="font-medium text-text-primary">Prompt</div>
          <div className="mt-1 text-xs text-text-tertiary">
            agent context across iterations 1 to 7
          </div>
          <div className="mt-2 inline-block border border-line-structure bg-surface-cta-primary px-2 py-0.5 font-mono text-xs font-medium text-text-primary">
            prompt
          </div>
          <p className="mt-1.5 text-xs">
            Always present in context from iteration 1 through iteration 7.
          </p>
        </div>

        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="font-medium text-text-primary">Skill</div>
          <div className="mt-1 text-xs text-text-tertiary">
            agent context across iterations 1 to 7
          </div>
          <ol className="mt-2 space-y-1.5 text-xs">
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
