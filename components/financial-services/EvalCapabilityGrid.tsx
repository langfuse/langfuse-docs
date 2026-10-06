import { financialServicesEvalCapabilities } from "./content";

export function EvalCapabilityGrid() {
  return (
    <div className="mt-8 grid gap-2 md:grid-cols-2">
      {financialServicesEvalCapabilities.map((item, index) => (
        <article
          key={item.title}
          className="border border-line-structure bg-surface-bg p-5"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-[18px] leading-[1.2] text-text-primary">
            {item.title}
          </h3>
          <p className="mt-2 text-[13px] leading-[1.45] text-text-secondary">
            {item.body}
          </p>
        </article>
      ))}
    </div>
  );
}
