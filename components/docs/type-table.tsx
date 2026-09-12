import { TypeTable as FumadocsTypeTable } from "fumadocs-ui/components/type-table";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type TypeTableProps = ComponentProps<typeof FumadocsTypeTable>;

/**
 * Fumadocs TypeTable styled to match Langfuse docs tables: rectangular,
 * 1px structure border, no card radius or shadow.
 */
export function TypeTable({ className, ...props }: TypeTableProps) {
  return (
    <FumadocsTypeTable className={cn("lf-type-table", className)} {...props} />
  );
}
