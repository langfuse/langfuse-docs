import { useId } from "react";
import styles from "./diagram-fit.module.css";

export function SkillRoutingEvalFlowDiagram() {
  const dashedArrowId = useId();
  const solidArrowId = useId();

  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      {/* Desktop / tablet layout */}
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 680 278"
          role="img"
          aria-label="Routing evaluation flow: a dataset item contains input (prompt), metadata (environment config, files, and more), and expected output (skill or file that should be used). Input and metadata feed into running the agent to produce a trace, and a code-based evaluator checks the trace against the expected output."
          className="block h-auto w-full text-text-primary"
        >
          <defs>
            <marker
              id={dashedArrowId}
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
              id={solidArrowId}
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

          {/* Table label */}
          <text x="8" y="18" fontSize="13" fill="var(--text-tertiary)">
            dataset item
          </text>

          {/* Dataset item table */}
          <rect
            x="8"
            y="28"
            width="664"
            height="82"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <line
            x1="8"
            y1="66"
            x2="672"
            y2="66"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <line
            x1="138"
            y1="28"
            x2="138"
            y2="110"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <line
            x1="418"
            y1="28"
            x2="418"
            y2="110"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />

          {/* Table headers */}
          <text
            x="24"
            y="51"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
          >
            input
          </text>
          <text
            x="154"
            y="51"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
          >
            metadata
          </text>
          <text
            x="434"
            y="51"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
          >
            expected output
          </text>

          {/* Table values */}
          <text x="24" y="92" fontSize="13.5" fill="var(--text-secondary)">
            prompt
          </text>
          <text x="154" y="92" fontSize="13.5" fill="var(--text-secondary)">
            environment config, files, ...
          </text>
          <text x="434" y="92" fontSize="13.5" fill="var(--text-secondary)">
            skill/file that should be used
          </text>

          {/* Orthogonal dashed connectors: input & metadata -> run agent */}
          <path
            d="M 73 114 V 168 H 277 V 114"
            fill="none"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <line
            x1="175"
            y1="168"
            x2="175"
            y2="220"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            strokeDasharray="4 4"
            markerEnd={`url(#${dashedArrowId})`}
          />

          {/* Dashed arrow: expected output -> trace with plain text label */}
          <line
            x1="545"
            y1="114"
            x2="545"
            y2="144"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x="545"
            y="163"
            fontSize="13"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            check trace with
          </text>
          <text
            x="545"
            y="180"
            fontSize="13"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            code-based evaluator
          </text>
          <line
            x1="545"
            y1="192"
            x2="545"
            y2="220"
            stroke="var(--text-secondary)"
            strokeWidth="1"
            strokeDasharray="4 4"
            markerEnd={`url(#${dashedArrowId})`}
          />

          {/* run agent node */}
          <rect
            x="113"
            y="224"
            width="124"
            height="40"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="175"
            y="244"
            fontSize="14"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
          >
            run agent
          </text>

          {/* Solid arrow: run agent -> trace */}
          <line
            x1="241"
            y1="244"
            x2="481"
            y2="244"
            stroke="var(--text-primary)"
            strokeWidth="1.2"
            markerEnd={`url(#${solidArrowId})`}
          />

          {/* trace node */}
          <rect
            x="487"
            y="224"
            width="116"
            height="40"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
          />
          <text
            x="545"
            y="244"
            fontSize="14"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
          >
            trace
          </text>
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} space-y-3 text-sm text-text-secondary`}>
        <div className="border border-line-structure bg-surface-bg p-3.5">
          <div className="text-xs text-text-tertiary">dataset item</div>
          <dl className="mt-2 space-y-1.5 text-xs">
            <div>
              <dt className="inline font-medium text-text-primary">input: </dt>
              <dd className="inline">prompt</dd>
            </div>
            <div>
              <dt className="inline font-medium text-text-primary">
                metadata:{" "}
              </dt>
              <dd className="inline">environment config, files, ...</dd>
            </div>
            <div>
              <dt className="inline font-medium text-text-primary">
                expected output:{" "}
              </dt>
              <dd className="inline">skill/file that should be used</dd>
            </div>
          </dl>
        </div>

        <div className="border border-line-structure bg-surface-bg p-3.5 text-xs">
          <div className="font-medium text-text-primary">
            1. run agent → trace
          </div>
          <p className="mt-1">
            Feed input (prompt) and metadata (environment config, files) into
            the agent to produce a trace.
          </p>
        </div>

        <div className="border border-line-structure bg-surface-bg p-3.5 text-xs">
          <div className="font-medium text-text-primary">
            2. check trace with code-based evaluator
          </div>
          <p className="mt-1">
            Compare the skills and files recorded on the trace against expected
            output.
          </p>
        </div>
      </div>
    </figure>
  );
}
