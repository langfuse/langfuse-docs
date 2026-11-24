import { Head, VerticalArrow } from "./diagram-primitives";
import styles from "./diagram-fit.module.css";

interface TurnNode {
  label: string;
  position: string;
  state: "before" | "loaded" | "in-context" | "uncertain";
}

const TURNS: TurnNode[] = [
  { label: "T1", position: "8%", state: "before" },
  { label: "T2", position: "22%", state: "loaded" },
  { label: "T3", position: "36%", state: "in-context" },
  { label: "T4", position: "50%", state: "in-context" },
  { label: "T5", position: "64%", state: "in-context" },
  { label: "T6", position: "82%", state: "uncertain" },
  { label: "T7", position: "93%", state: "uncertain" },
];

export function SkillCompactionDiagram() {
  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      <div className="border border-line-structure bg-surface-1 px-5 py-5 text-left">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-mono text-[11px] font-medium text-text-primary">
            Session timeline across context compaction
          </span>
          <span className="font-mono text-[11px] text-text-tertiary">
            Turns 1 to 7
          </span>
        </div>

        <div className={`${styles.desktop} select-none`}>
          {/* Top context brackets */}
          <div className="relative h-10">
            <div
              className="absolute bottom-0 flex flex-col items-center"
              style={{ left: "22%", width: "51%" }}
            >
              <span className="mb-1.5 font-mono text-[11px] font-medium text-text-primary">
                Skill in context
              </span>
              <div className="h-3 w-full border-l border-r border-t border-dashed border-line-cta" />
            </div>

            <div
              className="absolute bottom-0 flex flex-col items-center"
              style={{ left: "75%", width: "22%" }}
            >
              <span className="mb-1.5 font-mono text-[11px] text-text-tertiary">
                Still in context?
              </span>
              <div className="h-3 w-full border-l border-r border-t border-dashed border-line-cta/45" />
            </div>
          </div>

          {/* Horizontal session timeline */}
          <div className="relative my-2 h-8">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-line-cta"
            >
              <Head className="-right-px -top-[5px]" />
            </div>

            {/* Compaction cut marker */}
            <div
              aria-hidden="true"
              className="absolute top-1/2 h-6 -translate-x-1/2 -translate-y-1/2 border-l-2 border-dashed border-line-cta"
              style={{ left: "74%" }}
            />

            {TURNS.map((turn) => (
              <div
                key={turn.label}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ left: turn.position }}
              >
                <div
                  title={turn.label}
                  className={
                    turn.state === "loaded"
                      ? "size-3.5 rounded-full border-2 border-line-cta bg-surface-cta-primary"
                      : turn.state === "in-context"
                        ? "size-3 rounded-full border border-line-cta bg-surface-cta-primary"
                        : turn.state === "uncertain"
                          ? "size-3 rounded-full border border-dashed border-line-cta/60 bg-surface-bg"
                          : "size-3 rounded-full border border-line-structure bg-surface-bg"
                  }
                />
              </div>
            ))}
          </div>

          {/* Bottom event callouts */}
          <div className="relative h-16">
            <div
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center text-center"
              style={{ left: "22%" }}
            >
              <div className="h-5">
                <VerticalArrow direction="up" />
              </div>
              <span className="mt-1.5 font-mono text-[11px] font-medium text-text-primary">
                Skill loaded
              </span>
              <span className="text-[11px] text-text-tertiary">
                TOOL span recorded
              </span>
            </div>

            <div
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center text-center"
              style={{ left: "74%" }}
            >
              <div className="h-5">
                <VerticalArrow direction="up" dashed />
              </div>
              <span className="mt-1.5 font-mono text-[11px] font-medium text-text-primary">
                Compaction
              </span>
              <span className="text-[11px] text-text-tertiary">
                Dropped or re-attached?
              </span>
            </div>
          </div>
        </div>

        {/* Mobile stacked timeline */}
        <div className={`${styles.mobile} text-xs text-text-secondary`}>
          <div className="space-y-2">
            <div className="flex items-center justify-between border border-line-structure bg-surface-bg px-3 py-2">
              <span className="font-mono text-[11px] text-text-tertiary">
                Turn 1
              </span>
              <span>Session starts</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-4">
                <VerticalArrow />
              </div>
            </div>

            <div className="border border-line-cta bg-surface-bg px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[11px] font-medium text-text-primary">
                  Turn 2: Skill loaded
                </span>
                <span className="font-mono text-[10px] text-text-tertiary">
                  TOOL span recorded
                </span>
              </div>
              <p className="mt-1 text-[11px] text-text-secondary">
                Skill stays in context across turns 2 to 5.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-4">
                <VerticalArrow dashed />
              </div>
            </div>

            <div className="border border-dashed border-line-cta bg-surface-bg/70 px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[11px] font-medium text-text-primary">
                  Compaction
                </span>
                <span className="font-mono text-[10px] text-text-tertiary">
                  Context limit reached
                </span>
              </div>
              <p className="mt-1 text-[11px] text-text-secondary">
                Turns 6+: Still in context? Depends on whether the harness drops
                or re-attaches the skill.
              </p>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
