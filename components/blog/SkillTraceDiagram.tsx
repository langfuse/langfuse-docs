import { Bot, Sparkles, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolObservation = {
  name: string;
  highlight?: boolean;
  badge?: string;
  error?: boolean;
  note?: string;
};

type GenerationTurn = {
  generationNote?: string[];
  tools: ToolObservation[];
};

const TURNS: GenerationTurn[] = [
  {
    tools: [{ name: "getRequestContext" }],
  },
  {
    generationNote: ["available: langfuse v12", "requested"],
    tools: [
      {
        name: "skill",
        highlight: true,
        badge: "loaded: SKILL.md",
      },
    ],
  },
  {
    tools: [
      {
        name: "skill_read",
        highlight: true,
        badge: "loaded: references/setting-up-evals.md",
      },
    ],
  },
  {
    tools: [{ name: "langfuse_queryMetrics" }],
  },
  {
    tools: [{ name: "langfuse_listObservations" }],
  },
  {
    tools: [
      { name: "langfuse_listObservations", error: true },
      { name: "langfuse_listObservations", note: "retry" },
    ],
  },
];

export function SkillTraceDiagram() {
  return (
    <figure className="not-prose my-8 border border-line-structure bg-surface-bg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-structure px-4 py-2 text-[11px] text-text-tertiary">
        <span className="font-mono text-text-secondary">Trace structure</span>
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="inline-flex items-center gap-1">
            <Bot className="h-3.5 w-3.5 text-muted-magenta" aria-hidden="true" />
            <span>agent</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Sparkles
              className="h-3.5 w-3.5 text-muted-blue"
              aria-hidden="true"
            />
            <span>generation</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Wrench
              className="h-3.5 w-3.5 text-text-secondary"
              aria-hidden="true"
            />
            <span>tool</span>
          </span>
        </div>
      </div>

      <div className="px-4 py-4 text-[13px] sm:px-5">
        {/* Root agent observation */}
        <div className="flex items-center gap-2 py-0.5 font-mono text-text-primary">
          <Bot
            className="h-4 w-4 shrink-0 text-muted-magenta"
            aria-hidden="true"
          />
          <span className="font-medium">agent-turn</span>
        </div>

        {/* Child model generations */}
        <ol className="ml-[7px] mt-1.5 space-y-2 pl-5">
          {TURNS.map((turn, turnIndex) => {
            const isLastTurn = turnIndex === TURNS.length - 1;
            return (
              <li key={turnIndex} className="relative">
                {/* Vertical connector from parent agent-turn */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -left-5 top-0 w-px bg-line-structure",
                    isLastTurn ? "h-[14px]" : "-bottom-2",
                  )}
                />
                {/* Horizontal connector tick */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-5 top-[14px] h-px w-3.5 bg-line-structure"
                />

                {/* Generation row */}
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-0.5">
                  <div className="flex items-center gap-2 font-mono text-text-primary">
                    <Sparkles
                      className="h-3.5 w-3.5 shrink-0 text-muted-blue"
                      aria-hidden="true"
                    />
                    <span>invoke-model</span>
                  </div>
                  {turn.generationNote && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {turn.generationNote.map((note) => (
                        <span
                          key={note}
                          className="border border-line-structure bg-muted/50 px-1.5 py-0.5 font-mono text-[11px] text-text-secondary"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Nested tool calls under this generation */}
                <ol className="ml-[7px] mt-1 space-y-1 pl-5">
                  {turn.tools.map((tool, toolIndex) => {
                    const isLastTool = toolIndex === turn.tools.length - 1;
                    return (
                      <li key={`${turnIndex}-${toolIndex}`} className="relative">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "pointer-events-none absolute -left-5 top-0 w-px bg-line-structure",
                            isLastTool ? "h-[15px]" : "-bottom-1",
                          )}
                        />
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -left-5 top-[15px] h-px w-3.5 bg-line-structure"
                        />

                        <div
                          className={cn(
                            "flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-2 py-1",
                            tool.highlight
                              ? "border border-line-cta bg-surface-cta-primary/25"
                              : "border border-transparent",
                          )}
                        >
                          <div className="flex items-center gap-2 font-mono">
                            <Wrench
                              className="h-3.5 w-3.5 shrink-0 text-text-secondary"
                              aria-hidden="true"
                            />
                            <span
                              className={cn(
                                tool.highlight
                                  ? "font-medium text-text-primary"
                                  : "text-text-secondary",
                              )}
                            >
                              {tool.name}
                            </span>
                            {tool.error && (
                              <span className="border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 font-sans text-[11px] font-medium leading-none text-destructive">
                                Error
                              </span>
                            )}
                          </div>

                          {tool.badge && (
                            <span className="bg-surface-cta-primary px-1.5 py-0.5 font-mono text-[11px] text-text-primary">
                              {tool.badge}
                            </span>
                          )}
                          {tool.note && (
                            <span className="font-mono text-[11px] text-text-tertiary">
                              {tool.note}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}
