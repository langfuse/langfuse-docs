import { cn } from "@/lib/utils";
import { financialServicesTrace } from "./content";

const barClassByType = {
  agent: "bg-surface-2",
  tool: "bg-[var(--callout-info)]",
  llm: "bg-text-secondary",
  eval: "bg-surface-cta-primary",
} as const;

export function CreditOnboardingTraceMock() {
  return (
    <div className="w-full border border-line-structure bg-surface-bg shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-line-structure px-4 py-2.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
          Illustrative · {financialServicesTrace.label}
        </p>
        <p className="font-mono text-[10px] text-text-tertiary">trace</p>
      </div>

      <div className="space-y-2.5 px-4 py-4">
        {financialServicesTrace.spans.map((span) => (
          <div key={span.name} className="flex items-center gap-2 sm:gap-3">
            <p
              className={cn(
                "w-[3.25rem] shrink-0 font-mono text-[10px] uppercase leading-none tracking-[0.04em] text-text-tertiary",
                span.indent && "pl-2",
              )}
            >
              {span.type}
            </p>
            <p
              className={cn(
                "w-[8.75rem] shrink-0 truncate font-mono text-[11px] leading-none text-text-secondary sm:w-[10.5rem]",
              )}
            >
              {span.name}
            </p>
            <div className="relative flex min-h-3 min-w-0 flex-1 items-center">
              <span
                className={cn(
                  "absolute h-3",
                  span.highlight
                    ? "border border-text-primary bg-surface-cta-primary"
                    : barClassByType[span.type],
                )}
                style={{ left: span.offset, width: span.width }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1 border-t border-line-structure px-4 py-3">
        <p className="text-[13px] font-medium leading-snug text-text-primary">
          {financialServicesTrace.outcome}
        </p>
        <p className="font-mono text-[11px] leading-snug text-text-tertiary">
          {financialServicesTrace.detail}
        </p>
      </div>
    </div>
  );
}
