import styles from "./diagram-fit.module.css";

export function SkillStructureDiagram() {
  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      <div className="border border-line-structure bg-surface-1 text-left">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-structure bg-surface-bg px-4 py-2.5">
          <span className="font-mono text-xs font-medium text-text-primary">
            my-skill/
          </span>
          <span className="font-mono text-[11px] text-text-tertiary">
            Agent Skill directory
          </span>
        </div>

        <div className="px-4 py-3.5 text-xs">
          <div className="space-y-3 border-l border-line-structure pl-4">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono font-medium text-text-primary">
                    SKILL.md
                  </span>
                  <span className="font-mono text-[11px] text-text-tertiary">
                    required
                  </span>
                </div>
                <span className="text-text-secondary">
                  Entrypoint metadata and instructions
                </span>
              </div>

              <div className="mt-2 divide-y divide-line-structure border border-line-structure bg-surface-bg">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-3 py-2">
                  <span className="font-mono text-[11px] text-text-primary">
                    YAML frontmatter (name, description)
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    Exposed at startup for discovery
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-3 py-2">
                  <span className="font-mono text-[11px] text-text-primary">
                    Markdown body
                  </span>
                  <span className="text-[11px] text-text-secondary">
                    Loaded when the model invokes the skill
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-medium text-text-primary">
                  references/
                </span>
                <span className="font-mono text-[11px] text-text-tertiary">
                  optional
                </span>
              </div>
              <span className="text-text-secondary">
                Supporting docs opened on demand
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono font-medium text-text-primary">
                  scripts/
                </span>
                <span className="font-mono text-[11px] text-text-tertiary">
                  optional
                </span>
              </div>
              <span className="text-text-secondary">
                Helper scripts executed for specific steps
              </span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
