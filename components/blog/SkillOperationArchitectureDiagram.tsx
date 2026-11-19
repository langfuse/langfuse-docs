import {
  Box,
  HorizontalArrow,
  StackArrow,
  VerticalArrow,
} from "./diagram-primitives";
import { cn } from "@/lib/utils";
import styles from "./diagram-fit.module.css";

function DownConnector({
  dashed,
  muted,
  children,
}: {
  dashed?: boolean;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 py-2 text-center text-xs",
        muted ? "text-text-tertiary opacity-65" : "text-text-secondary",
      )}
    >
      <div className="h-4">
        <VerticalArrow dashed={dashed} />
      </div>
      <span className="px-2 leading-snug">{children}</span>
      <div className="h-4">
        <VerticalArrow dashed={dashed} />
      </div>
    </div>
  );
}

export function SkillOperationArchitectureDiagram() {
  return (
    <figure className={`not-prose my-8 ${styles.figure} ${styles.wide}`}>
      <div className={`${styles.desktop} text-xs text-text-secondary`}>
        {/* Top: Single source of truth */}
        <Box>
          <div className="flex flex-col gap-0.5">
            <span>
              <code className="font-mono">langfuse/skills</code> on GitHub
            </span>
            <span className="font-mono text-[10px] font-normal text-text-tertiary">
              SKILL.md + references/*.md (single source of truth)
            </span>
          </div>
        </Box>

        {/* Two distribution branches: External vs Hosted */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col">
            <DownConnector>
              Cloned via GitHub &amp;{" "}
              <code className="font-mono">skills.sh</code> (22k / 2 weeks)
            </DownConnector>
            <div className="flex items-center justify-center border border-dashed border-line-structure bg-surface-bg px-3 py-4 text-center font-medium text-text-primary">
              <div className="flex flex-col gap-0.5">
                <span>External coding agents</span>
                <span className="font-mono text-[10px] font-normal text-text-tertiary">
                  Claude Code, Codex, Cursor on user machines
                </span>
              </div>
            </div>
            <DownConnector dashed muted>
              Opt-in skill feedback only (no trace visibility)
            </DownConnector>
          </div>

          <div className="flex flex-col">
            <DownConnector>
              Synced via GitHub Action to{" "}
              <span className="bg-surface-cta-primary px-1 text-text-primary">
                Skill Management
              </span>
            </DownConnector>
            <Box>
              <div className="flex flex-col gap-0.5">
                <span>Halo (in-app assistant)</span>
                <span className="font-mono text-[10px] font-normal text-text-tertiary">
                  runs on Langfuse infrastructure
                </span>
              </div>
            </Box>
            <DownConnector>
              Live traces, loaded reference files &amp; user signals
            </DownConnector>
          </div>
        </div>

        {/* Bottom: Observability & offline evaluation engine */}
        <div className="border border-dashed border-line-divider-dash p-4">
          <div className="grid grid-cols-[1fr_1.35fr_1fr] items-center gap-3">
            <Box>
              <div className="flex flex-col gap-0.5">
                <span>Langfuse harness project</span>
                <span className="font-mono text-[10px] font-normal text-text-tertiary">
                  Halo traces, datasets &amp; experiment runs
                </span>
              </div>
            </Box>

            <div className="flex flex-col gap-3 py-1">
              <div className="flex flex-col items-center gap-1">
                <span className="px-1 text-center leading-snug">
                  Webhook POST +{" "}
                  <code className="bg-surface-cta-primary px-1 font-mono text-text-primary">
                    skill.commit
                  </code>
                </span>
                <HorizontalArrow />
              </div>
              <div className="flex flex-col items-center gap-1">
                <HorizontalArrow direction="left" />
                <span className="px-1 text-center leading-snug">
                  Seeded traces &amp; routing / workflow scores
                </span>
              </div>
            </div>

            <Box>
              <div className="flex flex-col gap-0.5">
                <span>Modal Sandboxes</span>
                <span className="font-mono text-[10px] font-normal text-text-tertiary">
                  headless Claude Code, Codex, Cursor
                </span>
              </div>
            </Box>
          </div>
        </div>

        {/* Return loop to source of truth */}
        <div className="flex flex-col items-center pt-2">
          <div className="h-3">
            <VerticalArrow direction="up" />
          </div>
          <div className="mt-1 border border-line-structure bg-surface-cta-primary px-3 py-1.5 font-mono text-[11px] text-text-primary">
            Ship verified skill updates back to langfuse/skills &amp; Skill
            Management
          </div>
        </div>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} text-xs text-text-secondary`}>
        <div className={styles.stack}>
          <Box>langfuse/skills on GitHub (SKILL.md + references/*.md)</Box>
          <StackArrow step={1}>
            Cloned via GitHub &amp; skills.sh (22k / 2 weeks)
          </StackArrow>
          <div className="flex items-center justify-center border border-dashed border-line-structure bg-surface-bg px-3 py-4 text-center font-medium text-text-primary">
            External coding agents (opt-in feedback only, no traces)
          </div>

          <div className="mt-4">
            <Box>langfuse/skills on GitHub</Box>
          </div>
          <StackArrow step={2}>
            Synced via GitHub Action to Skill Management
          </StackArrow>
          <Box>Halo (in-app assistant)</Box>
          <StackArrow step={3}>
            Live traces, loaded reference files &amp; user signals
          </StackArrow>
          <Box>Langfuse harness project (traces, datasets &amp; runs)</Box>
          <StackArrow step={4}>
            Webhook triggers headless agents in Modal Sandboxes
          </StackArrow>
          <Box>Modal Sandboxes (Claude Code, Codex, Cursor)</Box>
          <StackArrow step={5}>
            Seeded traces &amp; scores verify candidate commits
          </StackArrow>
          <div className="border border-line-structure bg-surface-cta-primary px-3 py-2.5 text-center font-mono text-[11px] text-text-primary">
            Ship verified updates back to langfuse/skills &amp; Skill Management
          </div>
        </div>
      </div>
    </figure>
  );
}
