import { CornerBox } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    label: "Implementation",
    amount: "$486",
    widthClassName: "w-full",
    accent: true,
  },
  {
    label: "Code review",
    amount: "$379",
    widthClassName: "w-[78%]",
    accent: true,
  },
  {
    label: "Planning",
    amount: "$321",
    widthClassName: "w-[66%]",
    accent: true,
  },
  {
    label: "Bug fix",
    amount: "$178",
    widthClassName: "w-[37%]",
    accent: false,
  },
  {
    label: "Documentation",
    amount: "$104",
    widthClassName: "w-[21%]",
    accent: false,
  },
  { label: "Other", amount: "$72", widthClassName: "w-[15%]", accent: false },
] as const;

const SUMMARY = [
  { label: "Total spend", value: "$1,540" },
  { label: "Sessions", value: "4,812" },
  { label: "Budget left", value: "28%" },
] as const;

export function SpendByTaskMock() {
  return (
    <CornerBox
      className="w-full"
      aria-label="Spend by task category, last 30 days, engineering"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line-structure px-3 py-2 font-mono text-[9px] uppercase tracking-[0.08em]">
        <span className="text-text-secondary">Spend by task category</span>
        <span className="text-right text-text-tertiary">
          Last 30 days · Eng
        </span>
      </div>

      <div className="space-y-2.5 px-3 py-3">
        {CATEGORIES.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[6.75rem_minmax(0,1fr)_2.5rem] items-center gap-2"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-text-secondary">
              {item.label}
            </span>
            <div className="h-2.5 bg-surface-1">
              <div
                className={cn(
                  "h-full",
                  item.widthClassName,
                  item.accent ? "bg-surface-cta-primary" : "bg-text-primary",
                )}
              />
            </div>
            <span className="text-right font-mono text-[11px] tabular-nums text-text-primary">
              {item.amount}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 border-t border-line-structure">
        {SUMMARY.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              "px-3 py-2.5",
              index > 0 && "border-l border-dashed border-line-structure",
            )}
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
              {item.label}
            </p>
            <p className="mt-1 text-[18px] leading-none text-text-primary">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </CornerBox>
  );
}
