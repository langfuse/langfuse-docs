import {
  Box,
  HorizontalArrow,
  Label,
  StackArrow,
  VerticalArrow,
} from "./diagram-primitives";
import styles from "./diagram-fit.module.css";

function LabeledHorizontalArrow({
  step,
  direction = "right",
  dashed,
  children,
}: {
  step: number;
  direction?: "left" | "right";
  dashed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Label step={step} className="px-2 text-center">
        {children}
      </Label>
      <HorizontalArrow direction={direction} dashed={dashed} />
    </div>
  );
}

export function SkillTestingHarnessDiagram() {
  return (
    <figure className={`not-prose my-8 ${styles.figure} ${styles.wide}`}>
      <div
        className={`${styles.desktop} grid grid-cols-[1fr_1.45fr_1fr] grid-rows-[auto_5.5rem_auto] text-xs text-text-secondary`}
      >
        <Box>
          <div className="flex flex-col gap-0.5">
            <span>Langfuse dataset</span>
            <span className="font-mono text-[10px] font-normal text-text-tertiary">
              harness project
            </span>
          </div>
        </Box>

        <div className="flex flex-col justify-center">
          <LabeledHorizontalArrow step={1}>
            Webhook POST with{" "}
            <code className="bg-surface-cta-primary px-1 font-mono">
              skill.version
            </code>
          </LabeledHorizontalArrow>
        </div>

        <Box>
          <div className="flex flex-col gap-0.5">
            <span>Modal webhook &amp; orchestrator</span>
            <span className="font-mono text-[10px] font-normal text-text-tertiary">
              ACK fast, spawn async
            </span>
          </div>
        </Box>

        <div className="relative">
          <div className="absolute inset-y-0 left-1/2">
            <VerticalArrow direction="up" dashed />
          </div>
          <Label
            step={4}
            className="absolute left-[calc(50%+0.75rem)] top-1/2 w-40 -translate-y-1/2"
          >
            Compare per-agent runs side by side
          </Label>
        </div>

        <div />

        <div className="relative">
          <div className="absolute inset-y-0 left-1/2">
            <VerticalArrow />
          </div>
          <Label
            step={2}
            className="absolute right-[calc(50%+0.75rem)] top-1/2 w-48 -translate-y-1/2 text-right"
          >
            Reset scratch project &amp; fan out{" "}
            <code className="bg-surface-cta-primary px-1 font-mono">
              item × agent
            </code>
          </Label>
        </div>

        <Box>
          <div className="flex flex-col gap-0.5">
            <span>Langfuse experiment runs</span>
            <span className="font-mono text-[10px] font-normal text-text-tertiary">
              traces + scores per agent
            </span>
          </div>
        </Box>

        <div className="flex flex-col justify-center">
          <LabeledHorizontalArrow step={3} direction="left">
            Emit seeded traces &amp; attach scores
          </LabeledHorizontalArrow>
        </div>

        <Box>
          <div className="flex flex-col gap-0.5">
            <span>Isolated Modal Sandboxes</span>
            <span className="font-mono text-[10px] font-normal text-text-tertiary">
              Claude Code, Codex, Cursor + env_folder
            </span>
          </div>
        </Box>
      </div>

      <div className={`${styles.mobile} text-xs text-text-secondary`}>
        <div className={styles.stack}>
          <Box>Langfuse dataset (harness project)</Box>
          <StackArrow step={1}>
            Webhook POST with{" "}
            <code className="bg-surface-cta-primary px-1 font-mono">
              skill.version
            </code>
          </StackArrow>
          <Box>Modal webhook &amp; orchestrator</Box>
          <StackArrow step={2}>
            Reset scratch project &amp; fan out{" "}
            <code className="bg-surface-cta-primary px-1 font-mono">
              item × agent
            </code>
          </StackArrow>
          <Box>
            Isolated Modal Sandboxes (Claude Code, Codex, Cursor + env_folder)
          </Box>
          <StackArrow step={3}>
            Emit seeded traces &amp; attach scores
          </StackArrow>
          <Box>Langfuse experiment runs (traces + scores per agent)</Box>
          <StackArrow step={4} dashed>
            Compare per-agent runs side by side
          </StackArrow>
          <Box>Langfuse dataset (harness project)</Box>
        </div>
      </div>
    </figure>
  );
}
