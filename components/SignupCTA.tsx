import { cn } from "@/lib/utils";

type SignupCTAProps = {
  message?: string;
  actionLabel?: string;
  href?: string;
  className?: string;
};

export function SignupCTA({
  message = "Try Langfuse yourself",
  actionLabel = "Sign up",
  href = "/cloud",
  className,
}: SignupCTAProps) {
  return (
    <aside
      aria-label="Langfuse signup"
      className={cn("not-prose w-full", className)}
    >
      <div className="grid w-full overflow-hidden rounded-[2px] border border-line-cta sm:grid-cols-[1fr_auto]">
        <div className="flex items-center bg-surface-bg px-4 py-3">
          <span className="text-[14px] font-medium text-text-secondary">
            {message}
          </span>
        </div>
        <a
          href={href}
          className="flex items-center justify-between gap-6 border-t border-line-cta bg-surface-cta-primary px-4 py-3 text-[13px] font-medium text-text-primary no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:border-l sm:border-t-0"
        >
          {actionLabel} <span aria-hidden>→</span>
        </a>
      </div>
    </aside>
  );
}
