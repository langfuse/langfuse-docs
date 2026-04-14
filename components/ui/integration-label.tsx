import { cn } from "@/lib/utils";

export function IntegrationLabel({
  icon,
  label,
  className,
}: {
  icon?: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "integration-chip inline-flex items-center gap-2 px-1.5 py-1 border border-line-structure text-[13px] font-normal text-text-secondary leading-none whitespace-nowrap",
        className
      )}
    >
      {icon ? (
        <span className="shrink-0 w-[18px] h-[18px] flex items-center justify-center">
          {icon}
        </span>
      ) : null}
      {label}
    </span>
  );
}
