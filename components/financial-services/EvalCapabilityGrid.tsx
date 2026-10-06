import {
  financialServicesEvalSupporting,
  financialServicesEvalWorkflows,
} from "./content";

export function EvalCapabilityGrid() {
  return (
    <div className="mt-8">
      <div className="grid gap-5 md:grid-cols-3">
        {financialServicesEvalWorkflows.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="flex h-full flex-col gap-3 border border-line-structure bg-surface-bg p-6 no-underline transition-colors hover:border-line-cta"
          >
            <h3 className="text-[18px] leading-[1.2] text-text-primary">
              {item.title}
            </h3>
            <p className="text-[13px] leading-[1.45] text-text-secondary">
              {item.body}
            </p>
          </a>
        ))}
      </div>
      <p className="mt-6 max-w-[72ch] text-[13px] leading-[1.55] text-text-secondary">
        Also:{" "}
        {financialServicesEvalSupporting.map((item, index) => {
          const isLast = index === financialServicesEvalSupporting.length - 1;
          const isPenultimate =
            index === financialServicesEvalSupporting.length - 2;
          return (
            <span key={item.href}>
              <a
                href={item.href}
                className="text-text-primary underline decoration-line-structure underline-offset-4 hover:text-text-primary"
              >
                {item.title}
              </a>
              {isLast ? "." : isPenultimate ? ", and " : ", "}
            </span>
          );
        })}
      </p>
    </div>
  );
}
