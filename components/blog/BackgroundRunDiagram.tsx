import {
  Box,
  HorizontalArrow,
  Label,
  VerticalArrow,
} from "./diagram-primitives";

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
    <figure className="not-prose my-8 overflow-x-auto">
      <div className="grid min-w-[640px] grid-cols-[0.85fr_1.5fr_0.85fr_1.5fr_0.85fr] grid-rows-[auto_5rem_auto] text-xs text-text-secondary">
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
    </figure>
  );
}
