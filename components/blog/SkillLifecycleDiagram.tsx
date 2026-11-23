import Link from "next/link";
import { cn } from "@/lib/utils";
import { VerticalArrow } from "./diagram-primitives";
import styles from "./diagram-fit.module.css";

interface LifecycleStage {
  step: string;
  name: string;
  detail: string;
  badge: React.ReactNode;
  accent?: boolean;
}

const COVERED_STAGES: LifecycleStage[] = [
  {
    step: "01",
    name: "Installed or fetched",
    detail: "Skill files sit on disk or are fetched from the registry.",
    badge: (
      <span className="font-mono text-[11px] text-text-secondary">
        Install via{" "}
        <Link
          href="/docs/skill-management/get-started#cli-install"
          className="text-text-primary underline decoration-line-cta underline-offset-2 transition-colors hover:text-text-secondary"
        >
          CLI
        </Link>{" "}
        /{" "}
        <a
          href="https://api.reference.langfuse.com/#tag/skills"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-primary underline decoration-line-cta underline-offset-2 transition-colors hover:text-text-secondary"
        >
          API
        </a>
      </span>
    ),
  },
  {
    step: "02",
    name: "Available",
    detail:
      "Skill name and description appear in the system prompt or tool list.",
    badge: (
      <span className="font-mono text-[11px] text-text-primary">
        Recorded on GENERATION
      </span>
    ),
    accent: true,
  },
  {
    step: "03",
    name: "Requested (intent)",
    detail: "Model calls a skill-loading tool in its output.",
    badge: (
      <span className="font-mono text-[11px] text-text-tertiary">
        Computed in trace UI
      </span>
    ),
  },
  {
    step: "04",
    name: "Loaded",
    detail: "Tool call succeeds and returns non-null output.",
    badge: (
      <span className="font-mono text-[11px] text-text-primary">
        Recorded on TOOL
      </span>
    ),
    accent: true,
  },
];

const UNCOVERED_STAGE: LifecycleStage = {
  step: "05",
  name: "Evicted or compacted",
  detail: "Session compacts context; skill may be dropped or re-attached.",
  badge: (
    <span className="font-mono text-[11px] text-text-tertiary">
      Not covered today
    </span>
  ),
};

export function SkillLifecycleDiagram() {
  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      <div className="flex flex-col items-center">
        <div className="w-full border border-line-cta bg-surface-1 p-4 text-left">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-mono text-[11px] font-medium text-text-primary">
              End-to-end coverage by Langfuse Skill Management
            </span>
          </div>

          <div className="flex flex-col">
            {COVERED_STAGES.map((stage, index) => (
              <div key={stage.step} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-full border bg-surface-bg px-4 py-3 text-left",
                    stage.accent ? "border-line-cta" : "border-line-structure",
                  )}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs text-text-tertiary">
                        {stage.step}
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        {stage.name}
                      </span>
                    </div>
                    {stage.badge}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                    {stage.detail}
                  </p>
                </div>
                {index < COVERED_STAGES.length - 1 ? (
                  <div className="h-5">
                    <VerticalArrow />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="h-6">
          <VerticalArrow dashed />
        </div>

        <div className="w-full border border-dashed border-line-structure bg-surface-1/50 px-4 py-3 text-left">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs text-text-tertiary">
                {UNCOVERED_STAGE.step}
              </span>
              <span className="text-sm font-medium text-text-primary">
                {UNCOVERED_STAGE.name}
              </span>
            </div>
            {UNCOVERED_STAGE.badge}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            {UNCOVERED_STAGE.detail}
          </p>
        </div>
      </div>
    </figure>
  );
}
