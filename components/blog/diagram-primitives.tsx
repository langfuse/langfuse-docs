import { cn } from "@/lib/utils";

// Shared building blocks for the step diagrams in the Langfuse Assistant post.

export function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center border border-line-structure bg-surface-bg px-3 py-4 text-center font-medium text-text-primary">
      {children}
    </div>
  );
}

export function Label({
  step,
  className,
  children,
}: {
  step: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("leading-snug", className)}>
      <span className="mr-1 font-mono text-[10px] text-text-tertiary">
        {step}
      </span>
      {children}
    </div>
  );
}

// Solid triangle pointing right; rotate it for other directions.
export function Head({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 7 9"
      aria-hidden="true"
      className={cn("absolute h-[9px] w-[7px] text-line-cta", className)}
    >
      <path d="M0 0 7 4.5 0 9Z" fill="currentColor" />
    </svg>
  );
}

export function HorizontalArrow({
  direction = "right",
  dashed,
}: {
  direction?: "left" | "right";
  dashed?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative w-full border-t border-line-cta",
        dashed && "border-dashed",
      )}
    >
      {direction === "right" ? (
        <Head className="-right-px -top-[5px]" />
      ) : (
        <Head className="-left-px -top-[5px] rotate-180" />
      )}
    </div>
  );
}

export function VerticalArrow({
  direction = "down",
  dashed,
}: {
  direction?: "up" | "down";
  dashed?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative h-full border-l border-line-cta",
        dashed && "border-dashed",
      )}
    >
      {direction === "down" ? (
        <Head className="-bottom-px -left-[4px] rotate-90" />
      ) : (
        <Head className="-left-[4px] -top-px -rotate-90" />
      )}
    </div>
  );
}
