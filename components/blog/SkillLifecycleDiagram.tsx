import { cn } from "@/lib/utils";
import { VerticalArrow } from "./diagram-primitives";
import styles from "./diagram-fit.module.css";

const STAGES = [
  {
    step: "01",
    name: "Installed or fetched",
    detail: "Skill files sit on disk or are fetched from the registry.",
    storage: "Not on traces yet",
    state: "local" as const,
  },
  {
    step: "02",
    name: "Available / discoverable",
    detail:
      "Skill name and description appear in the system prompt or listing.",
    storage: "Recorded on GENERATION",
    state: "persisted" as const,
  },
  {
    step: "03",
    name: "Requested (intent)",
    detail: "Model emits a tool call asking to load a skill in its output.",
    storage: "Computed in trace UI",
    state: "ui" as const,
  },
  {
    step: "04",
    name: "Loaded",
    detail: "Skill-loading tool succeeds and returns non-null output.",
    storage: "Recorded on TOOL",
    state: "persisted" as const,
  },
  {
    step: "05",
    name: "Evicted / compacted",
    detail:
      "Long session compacts context; skill may be dropped or re-attached.",
    storage: "Not modeled yet",
    state: "unmodeled" as const,
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
                stage.state === "unmodeled"
                  ? "border-dashed border-line-structure bg-surface-1/50"
                  : stage.state === "persisted"
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
                    stage.state === "persisted"
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
