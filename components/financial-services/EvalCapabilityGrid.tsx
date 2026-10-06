import {
  financialServicesEnterpriseRequirements,
  financialServicesEvalCapabilities,
} from "./content";

function EvalCard({
  title,
  body,
  index,
}: {
  title: string;
  body: string;
  index: number;
}) {
  return (
    <article className="flex gap-3 border border-line-structure bg-surface-bg p-5">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center bg-surface-cta-primary"
      >
        <span className="text-[11px] leading-none text-text-primary">✓</span>
      </span>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
          {String(index).padStart(2, "0")}
        </p>
        <h3 className="mt-1 text-[18px] leading-[1.2] text-text-primary">
          {title}
        </h3>
        <p className="mt-2 text-[13px] leading-[1.45] text-text-secondary">
          {body}
        </p>
      </div>
    </article>
  );
}

export function EvalCapabilityGrid() {
  return (
    <>
      <div className="mt-8 grid gap-2 md:grid-cols-2">
        {financialServicesEvalCapabilities.map((item, index) => (
          <EvalCard
            key={item.title}
            title={item.title}
            body={item.body}
            index={index + 1}
          />
        ))}
      </div>
      <h3 className="mt-10 text-[22px] leading-[1.2] text-text-primary">
        Built for your enterprise requirements
      </h3>
      <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {financialServicesEnterpriseRequirements.map((item, index) => (
          <EvalCard
            key={item.title}
            title={item.title}
            body={item.body}
            index={financialServicesEvalCapabilities.length + index + 1}
          />
        ))}
      </div>
    </>
  );
}
