import type { ReactNode, MouseEventHandler } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const chipClassName =
  "integration-chip inline-flex items-center gap-2 px-1.5 py-1 border border-line-structure text-[13px] font-normal text-text-secondary leading-none whitespace-nowrap";

interface IntegrationLabelProps {
  icon?: ReactNode;
  label: string;
  href?: string;
  className?: string;
  onMouseEnter?: MouseEventHandler;
  onMouseLeave?: MouseEventHandler;
}

export function IntegrationLabel({
  icon,
  label,
  href,
  className,
  onMouseEnter,
  onMouseLeave,
}: IntegrationLabelProps) {
  const inner = (
    <>
      {icon ? (
        <span className="shrink-0 w-[12px] h-[12px] flex items-center justify-center">
          {icon}
        </span>
      ) : null}
      {label}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={cn(chipClassName, className)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {inner}
      </Link>
    );
  }

  return (
    <span
      className={cn(chipClassName, className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {inner}
    </span>
  );
}
