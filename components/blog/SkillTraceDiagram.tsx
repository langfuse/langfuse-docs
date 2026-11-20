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
    <figure className="not-prose my-8 border border-line-structure bg-surface-bg px-4 py-4 text-[13px] sm:px-5">
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
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -left-5 top-0 w-px bg-line-structure",
                  isLastTurn ? "h-[14px]" : "-bottom-2",
                )}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-5 top-[14px] h-px w-3.5 bg-line-structure"
              />

              <div className="flex items-center gap-2 py-0.5 font-mono text-text-primary">
                <Sparkles
                  className="h-3.5 w-3.5 shrink-0 text-muted-blue"
                  aria-hidden="true"
                />
                <span>invoke-model</span>
              </div>

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
                          "flex items-center gap-2 px-2 py-1 font-mono",
                          tool.highlight
                            ? "border border-line-cta bg-surface-cta-primary/25"
                            : "border border-transparent",
                        )}
                      >
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
