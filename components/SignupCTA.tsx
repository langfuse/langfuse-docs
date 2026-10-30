import { HoverCorners } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";

type SignupCTAProps = {
  message?: string;
  actionLabel?: string;
  href?: string;
  className?: string;
};

export function SignupCTA({
  message = "Start with Langfuse",
  actionLabel = "Sign up",
  href = "/cloud",
  className,
}: SignupCTAProps) {
  return (
    <aside
      aria-label="Langfuse signup"
      className={cn("not-prose w-full", className)}
    >
      <a
        href={href}
        className="group button-wrapper relative -m-1 flex p-1 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <HoverCorners />
        <span className="grid w-full rounded-[2px] border border-line-structure bg-surface-bg corner-box-hover-stripes transition-[background] duration-180 ease-out [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)] sm:grid-cols-[1fr_auto]">
          <span className="flex items-center px-4 py-3 text-[14px] font-medium text-text-secondary">
            {message}
          </span>
          <span className="flex items-center justify-between gap-6 border-t border-line-structure bg-surface-cta-primary px-4 py-3 text-[13px] font-medium text-text-primary sm:border-l sm:border-t-0">
            {actionLabel} <span aria-hidden>→</span>
          </span>
        </span>
      </a>
    </aside>
  );
}
