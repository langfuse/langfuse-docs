import {
  Box,
  HorizontalArrow,
  Label,
  StackArrow,
  VerticalArrow,
} from "./diagram-primitives";
import styles from "./diagram-fit.module.css";

function LabeledArrow({
  step,
  direction,
  children,
}: {
  step: number;
  direction?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Label step={step} className="whitespace-nowrap px-1 text-center">
        {children}
      </Label>
      <HorizontalArrow direction={direction} />
    </div>
  );
}

// Downward arrow centered in its cell, with the label to the left of the line.
function DownArrow({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-1/2">
        <VerticalArrow />
      </div>
      <Label
        step={step}
        className="absolute right-[calc(50%+0.75rem)] top-1/2 w-44 -translate-y-1/2 text-right"
      >
        {children}
      </Label>
    </div>
  );
}

export function BackgroundRunDiagram() {
  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      <div
        className={`${styles.desktop} grid grid-cols-[0.85fr_1.5fr_0.85fr_1.5fr_0.85fr] grid-rows-[auto_5rem_auto] text-xs text-text-secondary`}
      >
        <Box>User</Box>
        <div className="flex flex-col justify-center">
          <LabeledArrow step={1}>Send a message</LabeledArrow>
        </div>
        <Box>App server</Box>
        <div className="flex flex-col justify-center">
          <LabeledArrow step={3}>Enqueue run ID</LabeledArrow>
        </div>
        <Box>BullMQ</Box>

        <div />
        <div />
        <DownArrow step={2}>Save run as queued</DownArrow>
        <div />
        <DownArrow step={4}>Deliver run ID</DownArrow>

        <div />
        <div />
        <Box>Postgres</Box>
        <div className="flex flex-col justify-center gap-4 py-2">
          <LabeledArrow step={5} direction="left">
            Claim the queued run
          </LabeledArrow>
          <LabeledArrow step={6} direction="left">
            Heartbeat every five seconds
          </LabeledArrow>
        </div>
        <Box>Worker</Box>
      </div>
      <div className={`${styles.mobile} text-xs text-text-secondary`}>
        <div className={styles.stack}>
          <Box>User</Box>
          <StackArrow step={1}>Send a message</StackArrow>
          <Box>App server</Box>
          <StackArrow step={2}>Save run as queued</StackArrow>
          <Box>Postgres</Box>
          <StackArrow step={3}>Enqueue run ID</StackArrow>
          <Box>BullMQ</Box>
          <StackArrow step={4}>Deliver run ID</StackArrow>
          <Box>Worker</Box>
          <StackArrow step={5}>Claim the queued run</StackArrow>
          <StackArrow step={6}>Heartbeat every five seconds</StackArrow>
          <Box>Postgres</Box>
        </div>
      </div>
    </figure>
  );
}
