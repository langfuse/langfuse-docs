import { Bot, Sparkles, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolObservation = {
  name: string;
  highlight?: boolean;
  error?: boolean;
};

type GenerationTurn = {
  tools: ToolObservation[];
};

const TURNS: GenerationTurn[] = [
  {
    tools: [{ name: "getRequestContext" }],
  },
  {
    tools: [{ name: "skill", highlight: true }],
  },
  {
    tools: [{ name: "skill_read", highlight: true }],
  },
  {
    tools: [{ name: "langfuse_queryMetrics" }],
  },
  {
    tools: [
      { name: "langfuse_listObservations", error: true },
      { name: "langfuse_listObservations" },
    ],
  },
];

export function SkillTraceDiagram() {
  return (
    <figure className="not-prose my-8 border border-line-structure bg-surface-bg px-4 py-3 text-xs sm:px-5">
      {/* Root agent observation */}
      <div className="flex h-6 items-center gap-2 font-mono text-text-primary">
        <Bot
          className="h-3.5 w-3.5 shrink-0 text-muted-magenta"
          aria-hidden="true"
        />
        <span className="font-medium">agent-turn</span>
      </div>

      {/* Child model generations */}
      <ol className="ml-[6px] mt-0.5 space-y-1 pl-5">
        {TURNS.map((turn, turnIndex) => {
          const isLastTurn = turnIndex === TURNS.length - 1;
          return (
            <li key={turnIndex} className="relative">
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -left-5 top-0 w-px bg-line-structure",
                  isLastTurn ? "h-3" : "-bottom-1",
                )}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-5 top-3 h-px w-3.5 bg-line-structure"
              />

              <div className="flex h-6 items-center gap-2 font-mono text-text-primary">
                <Sparkles
                  className="h-3.5 w-3.5 shrink-0 text-muted-blue"
                  aria-hidden="true"
                />
                <span>invoke-model</span>
              </div>

              <ol className="ml-[6px] mt-0.5 space-y-0.5 pl-5">
                {turn.tools.map((tool, toolIndex) => {
                  const isLastTool = toolIndex === turn.tools.length - 1;
                  return (
                    <li key={`${turnIndex}-${toolIndex}`} className="relative">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute -left-5 top-0 w-px bg-line-structure",
                          isLastTool ? "h-3" : "-bottom-0.5",
                        )}
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-5 top-3 h-px w-3.5 bg-line-structure"
                      />

                      <div
                        className={cn(
                          "flex h-6 items-center gap-2 px-1.5 font-mono",
                          tool.highlight && "bg-surface-cta-primary",
                        )}
                      >
                        <Wrench
                          className="h-3 w-3 shrink-0 text-text-secondary"
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
                          <span className="border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 font-sans text-[10px] font-medium leading-none text-destructive">
                            Error
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
    </figure>
  );
}
