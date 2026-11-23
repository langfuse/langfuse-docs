import { Box, Label, StackArrow, VerticalArrow } from "./diagram-primitives";
import styles from "./diagram-fit.module.css";

function Subtext({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1 block text-[11px] font-normal text-text-tertiary">
      {children}
    </span>
  );
}

export function SkillLockfileBridgeDiagram() {
  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      <div
        className={`${styles.desktop} flex flex-col text-xs text-text-secondary`}
      >
        <Box>
          <div>
            Langfuse registry
            <Subtext>
              Postgres (skills, skill_files) and SHA-256 skill_blobs
            </Subtext>
          </div>
        </Box>

        <div className="flex flex-col items-center py-1.5">
          <Label step={1} className="mb-1 text-center">
            <code className="bg-surface-cta-primary px-1 font-mono">
              langfuse skills install
            </code>{" "}
            verifies SHA-256 per file and writes atomically
          </Label>
          <div className="h-5">
            <VerticalArrow />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Box>
            <div>
              <code className="font-mono text-xs">
                .agents/skills/&lt;name&gt;/
              </code>
              <Subtext>SKILL.md, references/, scripts/</Subtext>
            </div>
          </Box>
          <Box>
            <div>
              <code className="font-mono text-xs">langfuse-skills.lock</code>
              <Subtext>path, name, selector, resolved version</Subtext>
            </div>
          </Box>
        </div>

        <div className="grid grid-cols-2 gap-4 py-1.5">
          <div className="flex flex-col items-center">
            <Label step={2} className="mb-1 text-center">
              Harness reads skill folders from disk
            </Label>
            <div className="h-5">
              <VerticalArrow />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Label step={3} className="mb-1 text-center">
              SDK scans folders and lockfile (no network calls)
            </Label>
            <div className="h-5">
              <VerticalArrow />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Box>
            <div>
              Agent harness
              <Subtext>Exposes metadata and loads files via tools</Subtext>
            </div>
          </Box>
          <Box>
            <div>
              <code className="font-mono text-xs">discoverSkills()</code>
              <Subtext>Recovers exact version for each locked folder</Subtext>
            </div>
          </Box>
        </div>

        <div className="grid grid-cols-2 gap-4 py-1.5">
          <div className="flex flex-col items-center">
            <Label step={4} className="mb-1 text-center">
              Emits model and tool spans
            </Label>
            <div className="h-5">
              <VerticalArrow />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Label step={5} className="mb-1 text-center">
              Attaches catalog via{" "}
              <code className="bg-surface-cta-primary px-1 font-mono">
                propagateAttributes
              </code>
            </Label>
            <div className="h-5">
              <VerticalArrow />
            </div>
          </div>
        </div>

        <Box>
          <div>
            OpenTelemetry spans (GENERATION and TOOL)
            <Subtext>
              langfuse.observation.skills_available = [{"{"} name, version {"}"}
              ]
            </Subtext>
          </div>
        </Box>
      </div>

      <div className={`${styles.mobile} text-xs text-text-secondary`}>
        <div className={styles.stack}>
          <Box>
            <div>
              Langfuse registry
              <Subtext>
                Postgres (skills, skill_files) and SHA-256 blobs
              </Subtext>
            </div>
          </Box>
          <StackArrow step={1}>
            <code className="bg-surface-cta-primary px-1 font-mono">
              langfuse skills install
            </code>{" "}
            verifies SHA-256 and writes atomically
          </StackArrow>
          <Box>
            <div>
              <code className="font-mono text-xs">
                .agents/skills/&lt;name&gt;/
              </code>{" "}
              and{" "}
              <code className="font-mono text-xs">langfuse-skills.lock</code>
              <Subtext>
                Skill files plus path, name, selector, and version
              </Subtext>
            </div>
          </Box>
          <StackArrow step={2}>
            Agent harness reads skill files from disk
          </StackArrow>
          <Box>Agent harness</Box>
          <StackArrow step={3}>
            <code className="bg-surface-cta-primary px-1 font-mono">
              discoverSkills()
            </code>{" "}
            reads folders and lockfile (no network calls)
          </StackArrow>
          <Box>
            <div>
              Langfuse SDK
              <Subtext>Recovers exact version per locked skill</Subtext>
            </div>
          </Box>
          <StackArrow step={4}>
            Harness emits model and tool spans;{" "}
            <code className="bg-surface-cta-primary px-1 font-mono">
              propagateAttributes
            </code>{" "}
            attaches catalog in-process
          </StackArrow>
          <Box>
            <div>
              OpenTelemetry spans (GENERATION and TOOL)
              <Subtext>
                langfuse.observation.skills_available = [{"{"} name, version{" "}
                {"}"}]
              </Subtext>
            </div>
          </Box>
        </div>
      </div>
    </figure>
  );
}
