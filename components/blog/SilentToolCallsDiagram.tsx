import {
  Box,
  Head,
  HorizontalArrow,
  Label,
  StackArrow,
  VerticalArrow,
} from "./diagram-primitives";
import styles from "./diagram-fit.module.css";

export function SilentToolCallsDiagram() {
  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      <div
        className={`${styles.desktop} grid grid-cols-[1fr_1.3fr_1fr] grid-rows-[auto_6rem_auto] text-xs text-text-secondary`}
      >
        <Box>Halo</Box>
        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <Label step={1}>
              Tool call with{" "}
              <code className="bg-surface-cta-primary px-1 font-mono">
                silent: true
              </code>
            </Label>
            <HorizontalArrow />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <HorizontalArrow direction="left" dashed />
            <Label step={3}>File path instead of the result</Label>
          </div>
        </div>
        <Box>MCP tool worker</Box>

        <div className="grid grid-cols-[1fr_auto_auto_1fr] gap-x-3">
          <Label step={4} className="self-center text-right">
            Run grep, head, jq, Python
          </Label>
          <VerticalArrow />
          <VerticalArrow direction="up" dashed />
          <Label step={5} className="self-center">
            Only the output
          </Label>
        </div>
        <div />
        <div className="relative">
          {/* Same left-1/2 position as the connector below, so the line is continuous. */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 top-0 border-l border-line-cta"
          />
          <div className="flex h-full items-center pl-[calc(50%+0.75rem)]">
            <Label step={2}>
              Saved calls written in as JSON files before the next sandbox
              operation
            </Label>
          </div>
        </div>

        <Box>Sandbox VM</Box>
        {/* Connector from the MCP tool worker line back to the sandbox. */}
        <div aria-hidden="true" className="relative">
          <div className="absolute inset-x-0 top-1/2 border-t border-line-cta" />
          <Head className="-left-px top-[calc(50%-5px)] rotate-180" />
        </div>
        <div aria-hidden="true" className="relative">
          <div className="absolute left-0 right-1/2 top-1/2 border-t border-line-cta" />
          <div className="absolute bottom-1/2 left-1/2 top-0 border-l border-line-cta" />
        </div>
      </div>
      <div className={`${styles.mobile} text-xs text-text-secondary`}>
        <div className={styles.stack}>
          <Box>Halo</Box>
          <StackArrow step={1}>
            Tool call with{" "}
            <code className="bg-surface-cta-primary px-1 font-mono">
              silent: true
            </code>
          </StackArrow>
          <Box>MCP tool worker</Box>
          <StackArrow step={2}>
            Saved calls written in as JSON files before the next sandbox
            operation
          </StackArrow>
          <Box>Sandbox VM</Box>
          <StackArrow step={4}>Run grep, head, jq, Python</StackArrow>
          <StackArrow step={5} dashed>
            Only the output
          </StackArrow>
          <StackArrow step={3} dashed>
            File path instead of the result
          </StackArrow>
          <Box>Halo</Box>
        </div>
      </div>
    </figure>
  );
}
