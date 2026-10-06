import { cn } from "@/lib/utils";
import {
  financialServicesEnterpriseRequirements,
  financialServicesEvalGroups,
} from "./content";

function EvalCard({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex h-full flex-col gap-3 border border-line-divider-dash bg-surface-bg p-6 no-underline transition-colors hover:border-line-cta"
    >
      <h3 className="flex items-center gap-2.5 text-[18px] leading-[1.2] text-text-primary">
        <span
          aria-hidden="true"
          className="flex size-4 shrink-0 items-center justify-center bg-surface-cta-primary"
        >
          <span className="text-[11px] leading-none text-text-primary">✓</span>
        </span>
        {title}
      </h3>
      <p className="text-[13px] leading-[1.45] text-text-secondary">{body}</p>
      <span className="mt-auto pt-1 font-mono text-[11px] text-text-tertiary group-hover:text-text-primary">
        Details →
      </span>
    </a>
  );
}

const columnsClass = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
} as const;

function EvalGroup({
  title,
  columns,
  items,
}: {
  title: string;
  columns: 2 | 3;
  items: readonly { title: string; body: string; href: string }[];
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-text-tertiary">
        {title}
      </p>
      <div className={cn("mt-4 grid gap-5", columnsClass[columns])}>
        {items.map((item) => (
          <EvalCard key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}

export function EvalCapabilityGrid() {
  return (
    <div className="mt-10 flex flex-col gap-10">
      {financialServicesEvalGroups.map((group) => (
        <EvalGroup
          key={group.title}
          title={group.title}
          columns={group.columns}
          items={group.items}
        />
      ))}
      <EvalGroup
        title="Built for your enterprise requirements"
        columns={3}
        items={financialServicesEnterpriseRequirements}
      />
    </div>
  );
}
