import { cn } from "@/lib/utils";
import { VerticalArrow } from "./diagram-primitives";
import styles from "./diagram-fit.module.css";

const STAGES = [
  {
    step: "01",
    name: "Installed or fetched",
    detail: "Skill files written to disk via CLI or manifest fetched via API.",
    storage: "Local lockfile only",
    persisted: "local" as const,
  },
  {
    step: "02",
    name: "Available / discoverable",
    detail: "Skill name and description exposed in the prompt or tool listing.",
    storage: "Persisted: skills_available (GENERATION)",
    persisted: "persisted" as const,
  },
  {
    step: "03",
    name: "Requested (intent)",
    detail: "Model emits a skill-loading tool call in its generation output.",
    storage: "Computed in trace UI (not persisted)",
    persisted: "ui" as const,
  },
  {
    step: "04",
    name: "Loaded",
    detail: "Tool observation succeeds with non-null, non-error output.",
    storage: "Persisted: skills_resource_loaded (TOOL)",
    persisted: "persisted" as const,
  },
  {
    step: "05",
    name: "Evicted / compacted",
    detail: "Context window summarized or trimmed later in a long session.",
    storage: "Not modeled yet",
    persisted: "unmodeled" as const,
  },
];

export function SkillLifecycleDiagram() {
  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      <div className="flex flex-col">
        {STAGES.map((stage, index) => (
          <div key={stage.step} className="flex flex-col items-center">
            <div
              className={cn(
                "w-full border px-4 py-3 text-left",
                stage.persisted === "unmodeled"
                  ? "border-dashed border-line-structure bg-surface-1/50"
                  : stage.persisted === "persisted"
                    ? "border-line-cta bg-surface-bg"
                    : "border-line-structure bg-surface-1",
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
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    stage.persisted === "persisted"
                      ? "text-text-primary"
                      : "text-text-tertiary",
                  )}
                >
                  {stage.storage}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                {stage.detail}
              </p>
            </div>
            {index < STAGES.length - 1 ? (
              <div className="h-5">
                <VerticalArrow dashed={index === STAGES.length - 2} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </figure>
  );
}
