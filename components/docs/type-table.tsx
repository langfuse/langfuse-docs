import { TypeTable as FumadocsTypeTable } from "fumadocs-ui/components/type-table";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type TypeTableProps = ComponentProps<typeof FumadocsTypeTable>;

/**
 * Fumadocs TypeTable with Langfuse docs chrome.
 *
 * Visual variants (default = 1, flat table):
 * - `?typetable=1` or no query — flat, no radius, matches markdown tables
 * - `?typetable=2` — CornerBox + stripe header (Langfuse chrome)
 * - `?typetable=3` — always-visible descriptions, no accordion
 *
 * Set `data-typetable="1|2|3"` on `<html>` to switch without a query string.
 */
export function TypeTable({ className, type, ...props }: TypeTableProps) {
  return (
    <>
      <FumadocsTypeTable
        className={cn(
          "lf-type-table lf-type-table--accordion relative corner-box-corners",
          className,
        )}
        type={type}
        {...props}
      />
      <OpenTypeTable className={className} type={type} />
    </>
  );
}

/** Variant 3: descriptions stay visible. Accordion content unmounts when closed, so CSS cannot reach it. */
function OpenTypeTable({
  className,
  type,
}: Pick<TypeTableProps, "className" | "type">) {
  return (
    <div
      className={cn("lf-type-table lf-type-table--open not-prose", className)}
    >
      <div className="lf-type-table-open__head">
        <span>Prop</span>
        <span>Type</span>
      </div>
      {Object.entries(type).map(([name, item]) => (
        <div key={name} className="lf-type-table-open__row">
          <div className="lf-type-table-open__meta">
            <code
              className={
                item.deprecated ? "lf-type-table-open__deprecated" : undefined
              }
            >
              {name}
              {item.required ? "" : "?"}
            </code>
            {item.typeDescriptionLink ? (
              <a href={item.typeDescriptionLink}>{item.type}</a>
            ) : (
              <span>{item.type}</span>
            )}
          </div>
          {item.description ? (
            <div className="lf-type-table-open__desc">{item.description}</div>
          ) : null}
          {item.default != null ? (
            <div className="lf-type-table-open__default">
              <span>Default</span>
              <span>{item.default}</span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
