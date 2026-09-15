import { type ReactNode } from "react";

const VARIANT_STYLES = {
  full: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  partial: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  deprecated:
    "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
  none: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300",
} as const;

/**
 * Status badge for compatibility-matrix cells (see /docs/compatibility).
 * `full` = everything works, `partial` = works with a limitation named in the
 * badge text, `none` = not supported.
 */
export function CompatBadge({
  variant,
  children,
}: {
  variant: keyof typeof VARIANT_STYLES;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${VARIANT_STYLES[variant]}`}
    >
      {children}
    </span>
  );
}
