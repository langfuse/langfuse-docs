import { Box, Label, StackArrow, VerticalArrow } from "./diagram-primitives";
import styles from "./diagram-fit.module.css";

function Subtext({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1 block text-[11px] font-normal text-text-tertiary">
      {children}
    </span>
  );
}

export function SkillTracingSplitDiagram() {
  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      <div
        className={`${styles.desktop} flex flex-col text-xs text-text-secondary`}
      >
        <div className="grid grid-cols-2 gap-4">
          <Box>
            <div>
              Active: available skill catalog
              <Subtext>
                Reported once via{" "}
                <code className="bg-surface-cta-primary px-1 font-mono text-text-primary">
                  skills_available
                </code>{" "}
                on model and tool spans
              </Subtext>
            </div>
          </Box>
          <Box>
            <div>
              Passive: existing tool spans
              <Subtext>
                <code className="font-mono">Skill</code>,{" "}
                <code className="font-mono">loadSkill</code>,{" "}
                <code className="font-mono">skill_read</code>,{" "}
                <code className="font-mono">Read</code>, Codex{" "}
                <code className="font-mono">cat</code>
              </Subtext>
            </div>
          </Box>
        </div>

        <div className="grid grid-cols-2 gap-4 py-1.5">
          <div className="flex flex-col items-center">
            <Label step={1} className="mb-1 text-center">
              Carries skill names and versions
            </Label>
            <div className="h-5">
              <VerticalArrow />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Label step={2} className="mb-1 text-center">
              Carries tool name, arguments, output, and error status
            </Label>
            <div className="h-5">
              <VerticalArrow />
            </div>
          </div>
        </div>

        <Box>
          <div>
            Langfuse ingestion pipeline
            <Subtext>
              Gates on non-error, non-null tool output, uses the catalog to
              allow-list generic file paths, and resolves loaded names to exact
              skill versions
            </Subtext>
          </div>
        </Box>

        <div className="grid grid-cols-2 gap-4 py-1.5">
          <div className="flex flex-col items-center">
            <Label step={3} className="mb-1 text-center">
              Stored on model calls
            </Label>
            <div className="h-5">
              <VerticalArrow />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Label step={4} className="mb-1 text-center">
              Stored on tool calls (catalog discarded after linking)
            </Label>
            <div className="h-5">
              <VerticalArrow />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Box>
            <div>
              GENERATION observations
              <Subtext>
                Available skill list; trace UI splits into Requested and Not
                requested from output tool calls
              </Subtext>
            </div>
          </Box>
          <Box>
            <div>
              TOOL observations
              <Subtext>
                Confirmed loaded skill version and file path; feeds filters and
                per-version Usage analytics
              </Subtext>
            </div>
          </Box>
        </div>
      </div>

      <div className={`${styles.mobile} text-xs text-text-secondary`}>
        <div className={styles.stack}>
          <Box>
            <div>
              Active: available skill catalog
              <Subtext>
                Reported once via{" "}
                <code className="bg-surface-cta-primary px-1 font-mono text-text-primary">
                  skills_available
                </code>{" "}
                on model and tool spans
              </Subtext>
            </div>
          </Box>
          <StackArrow step={1}>Carries skill names and versions</StackArrow>
          <Box>
            <div>
              Passive: existing tool spans
              <Subtext>Skill, loadSkill, skill_read, Read, Codex cat</Subtext>
            </div>
          </Box>
          <StackArrow step={2}>
            Carries tool name, arguments, output, and error status
          </StackArrow>
          <Box>
            <div>
              Langfuse ingestion pipeline
              <Subtext>
                Success gate, path allow-listing from catalog, and version
                resolution
              </Subtext>
            </div>
          </Box>
          <StackArrow step={3}>Stored on model calls</StackArrow>
          <Box>
            <div>
              GENERATION observations
              <Subtext>
                Available skills; trace UI computes Requested vs. Not requested
              </Subtext>
            </div>
          </Box>
          <StackArrow step={4}>
            Stored on tool calls (catalog discarded after linking)
          </StackArrow>
          <Box>
            <div>
              TOOL observations
              <Subtext>
                Confirmed loaded version and file path; feeds Usage analytics
              </Subtext>
            </div>
          </Box>
        </div>
      </div>
    </figure>
  );
}
