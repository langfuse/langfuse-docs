import { financialServicesUseCases } from "./content";

export function UseCaseGrid() {
  return (
    <div className="mt-8 grid gap-2 md:grid-cols-2">
      {financialServicesUseCases.map((useCase, index) => {
        const inner = (
          <>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
              {String(index + 1).padStart(2, "0")} · {useCase.area}
              {"proof" in useCase && useCase.proof ? (
                <span className="ml-2 text-text-secondary">
                  {useCase.proof}
                </span>
              ) : null}
            </p>
            <h3 className="mt-2 text-[20px] leading-[1.15] text-text-primary">
              {useCase.title}
            </h3>
            <p className="mt-3 text-[13px] leading-[1.45] text-text-secondary">
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
                Workflow
              </span>
              <span className="mt-1 block">{useCase.workflow}</span>
            </p>
            <p className="mt-3 text-[13px] leading-[1.45] text-text-secondary">
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
                Inspect & evaluate
              </span>
              <span className="mt-1 block">{useCase.inspect}</span>
            </p>
          </>
        );

        const className =
          "block h-full border border-line-structure bg-surface-bg p-5";

        if ("href" in useCase && useCase.href) {
          return (
            <a
              key={useCase.title}
              href={useCase.href}
              className={`${className} no-underline transition-colors hover:border-line-cta`}
            >
              {inner}
            </a>
          );
        }

        return (
          <article key={useCase.title} className={className}>
            {inner}
          </article>
        );
      })}
    </div>
  );
}
