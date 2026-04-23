import Link from "next/link";
import { cn } from "@/lib/utils";

const chipClassName =
  "integration-chip inline-flex items-center gap-2 px-1.5 py-1 border border-line-structure text-[13px] font-normal text-text-secondary leading-none whitespace-nowrap";

interface IntegrationLabelProps {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  className?: string;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
}

export const IntegrationLabel: React.FC<IntegrationLabelProps> = ({
  icon,
  label,
  href,
  className,
  onMouseEnter,
  onMouseLeave,
}) => {
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
};
