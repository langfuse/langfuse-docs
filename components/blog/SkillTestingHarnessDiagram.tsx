import { useId } from "react";
import styles from "./diagram-fit.module.css";

export function SkillTestingHarnessDiagram() {
  const arrowId = useId();

  return (
    <figure className={`not-prose my-8 ${styles.figure} ${styles.wide}`}>
      {/* Desktop / tablet layout */}
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 760 330"
          role="img"
          aria-label="Offline evaluation setup across three components: Langfuse stores skills, datasets, traces, and experiment runs; Modal runs the webhook, orchestrator, and coding agent sandboxes; and a GitHub repo deploys Modal code and coding agent starter environments."
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

          {/* Left box: Langfuse */}
          <rect
            x="16"
            y="20"
            width="188"
            height="190"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="0.95"
          />
          <text
            x="32"
            y="46"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
          >
            Langfuse
          </text>
          <line
            x1="32"
            y1="58"
            x2="188"
            y2="58"
            stroke="var(--line-structure)"
            strokeWidth="0.75"
          />
          <rect
            x="30"
            y="72"
            width="46"
            height="20"
            rx="2"
            fill="var(--surface-cta-primary)"
          />
          <text
            x="36"
            y="86"
            fontSize="12.5"
            fontWeight="500"
            fill="var(--text-primary)"
          >
            skills
          </text>
          <text x="36" y="114" fontSize="12.5" fill="var(--text-secondary)">
            datasets
          </text>
          <text x="36" y="138" fontSize="12.5" fill="var(--text-secondary)">
            traces &amp; scores
          </text>
          <text x="36" y="162" fontSize="12.5" fill="var(--text-secondary)">
            experiment runs
          </text>

          {/* Top-right box: Modal */}
          <rect
            x="520"
            y="20"
            width="224"
            height="156"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="0.95"
          />
          <text
            x="536"
            y="46"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
          >
            Modal
          </text>
          <line
            x1="536"
            y1="58"
            x2="728"
            y2="58"
            stroke="var(--line-structure)"
            strokeWidth="0.75"
          />
          <text x="536" y="82" fontSize="12.5" fill="var(--text-secondary)">
            webhook &amp; orchestrator
          </text>
          <text x="536" y="108" fontSize="12.5" fill="var(--text-secondary)">
            coding agent sandboxes
          </text>
          <text x="536" y="128" fontSize="11" fill="var(--text-tertiary)">
            Claude Code, Codex, Cursor
          </text>

          {/* Bottom-right box: GitHub repo */}
          <rect
            x="520"
            y="222"
            width="224"
            height="96"
            rx="2"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="0.95"
          />
          <text
            x="536"
            y="248"
            fontSize="13.5"
            fontWeight="500"
            fill="var(--text-primary)"
          >
            GitHub repo
          </text>
          <line
            x1="536"
            y1="260"
            x2="728"
            y2="260"
            stroke="var(--line-structure)"
            strokeWidth="0.75"
          />
          <text x="536" y="282" fontSize="12.5" fill="var(--text-secondary)">
            code to deploy to Modal
          </text>
          <text x="536" y="304" fontSize="12.5" fill="var(--text-secondary)">
            coding agent envs
          </text>

          {/* Arrow: GitHub repo -> Modal */}
          <line
            x1="632"
            y1="222"
            x2="632"
            y2="180"
            stroke="var(--text-secondary)"
            strokeWidth="0.95"
            markerEnd={`url(#${arrowId})`}
          />
          <text x="642" y="204" fontSize="11" fill="var(--text-tertiary)">
            deploys
          </text>

          {/* Step 1: Langfuse -> Modal webhook */}
          <text
            x="362"
            y="34"
            fontSize="11.5"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
          >
            1. Webhook triggers agent runs
          </text>
          <text
            x="362"
            y="50"
            fontSize="11"
            fill="var(--text-tertiary)"
            textAnchor="middle"
          >
            skill version, dataset ID
          </text>
          <line
            x1="204"
            y1="62"
            x2="516"
            y2="62"
            stroke="var(--text-secondary)"
            strokeWidth="0.95"
            markerEnd={`url(#${arrowId})`}
          />

          {/* Step 2: Modal <-> Langfuse retrieve dataset items + skill */}
          <text
            x="362"
            y="98"
            fontSize="11.5"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            2. Retrieve dataset items &amp; skill
          </text>
          <line
            x1="520"
            y1="108"
            x2="208"
            y2="108"
            stroke="var(--text-secondary)"
            strokeWidth="0.95"
            markerEnd={`url(#${arrowId})`}
          />
          <line
            x1="204"
            y1="120"
            x2="516"
            y2="120"
            stroke="var(--text-secondary)"
            strokeWidth="0.95"
            strokeDasharray="4 3"
            markerEnd={`url(#${arrowId})`}
          />

          {/* Step 3: Modal -> Langfuse results ingested */}
          <text
            x="362"
            y="150"
            fontSize="11.5"
            fill="var(--text-secondary)"
            textAnchor="middle"
          >
            3. Traces &amp; results ingested into Langfuse
          </text>
          <line
            x1="520"
            y1="160"
            x2="208"
            y2="160"
            stroke="var(--text-secondary)"
            strokeWidth="0.95"
            markerEnd={`url(#${arrowId})`}
          />
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} text-xs text-text-secondary`}>
        <div className="space-y-2.5">
          <div className="border border-line-structure bg-surface-bg p-3">
            <div className="font-medium text-text-primary">Langfuse</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[11px]">
              <span className="bg-surface-cta-primary px-1.5 py-0.5 font-medium text-text-primary">
                skills
              </span>
              <span className="border border-line-structure px-1.5 py-0.5">
                datasets
              </span>
              <span className="border border-line-structure px-1.5 py-0.5">
                traces &amp; scores
              </span>
              <span className="border border-line-structure px-1.5 py-0.5">
                experiment runs
              </span>
            </div>
          </div>

          <div className="space-y-1 px-2 text-[11px] text-text-secondary">
            <div>1. Webhook triggers agent runs (skill version, dataset ID)</div>
            <div>2. Modal retrieves dataset items &amp; skill from Langfuse</div>
            <div>3. Traces &amp; results ingested back into Langfuse</div>
          </div>

          <div className="border border-line-structure bg-surface-bg p-3">
            <div className="font-medium text-text-primary">Modal</div>
            <div className="mt-1 text-[11px] text-text-secondary">
              webhook &amp; orchestrator, coding agent sandboxes (Claude Code,
              Codex, Cursor)
            </div>
          </div>

          <div className="px-2 text-[11px] text-text-tertiary">
            ↑ deploys from GitHub repo
          </div>

          <div className="border border-line-structure bg-surface-bg p-3">
            <div className="font-medium text-text-primary">GitHub repo</div>
            <div className="mt-1 text-[11px] text-text-secondary">
              code to deploy to Modal, coding agent envs
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
