import { cn } from "@/lib/utils";
import { invoiceIntakeTrace } from "./content";

function CropMark({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute h-2.5 w-2.5 border-text-primary",
        className,
      )}
    />
  );
}

export function InvoiceIntakeTraceMock() {
  return (
    <div className="relative w-full px-1 py-1">
      <CropMark className="left-0 top-0 border-l border-t" />
      <CropMark className="right-0 top-0 border-r border-t" />
      <CropMark className="bottom-0 left-0 border-b border-l" />
      <CropMark className="bottom-0 right-0 border-b border-r" />

      <div className="border border-line-structure bg-surface-bg shadow-sm">
        <div className="space-y-2.5 px-3 py-3">
          {invoiceIntakeTrace.steps.map((step) => (
            <div key={step.name} className="flex items-center gap-3">
              <p
                className={cn(
                  "w-[7.75rem] shrink-0 font-mono text-[11px] leading-none text-text-secondary",
                  step.indent && "pl-3",
                )}
              >
                {step.name}
              </p>
              <div className="relative flex min-h-3 min-w-0 flex-1 items-center">
                <span
                  className={cn(
                    "absolute h-3",
                    step.highlight
                      ? "border border-text-primary bg-surface-cta-primary"
                      : "bg-text-secondary",
                  )}
                  style={{ left: step.offset, width: step.width }}
                />
                {step.cost ? (
                  <span
                    className="absolute font-mono text-[10px] leading-none text-text-tertiary"
                    style={{
                      left: `calc(${step.offset} + ${step.width} + 0.4rem)`,
                    }}
                  >
                    {step.cost}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line-structure px-3 py-2 font-mono text-[10px] text-text-tertiary">
          {invoiceIntakeTrace.insight}
        </div>
      </div>
    </div>
  );
}
