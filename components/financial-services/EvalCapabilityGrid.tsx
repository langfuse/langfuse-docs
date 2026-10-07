import { Plus } from "lucide-react";
import { financialServicesEvalColumns } from "./content";

export function EvalCapabilityGrid() {
  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-8">
      {financialServicesEvalColumns.map((column) => (
        <div key={column.title} className="min-w-0">
          <h3 className="text-[22px] leading-[1.15] text-text-primary sm:text-[24px]">
            {column.title}
          </h3>
          <p className="mt-2 max-w-[34ch] text-[13px] leading-[1.45] text-text-secondary">
            {column.summary}
          </p>
          <div className="mt-5 border-t border-line-structure">
            {column.items.map((item) => (
              <details
                key={item.title}
                className="group border-b border-line-structure"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 text-left text-[14px] font-medium leading-[1.3] text-text-primary marker:content-none [&::-webkit-details-marker]:hidden">
                  <span>{item.title}</span>
                  <Plus
                    className="h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-200 group-open:rotate-45"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </summary>
                <p className="m-0 pb-4 pr-8 text-[13px] leading-[1.45] text-text-secondary">
                  {item.body}
                </p>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
