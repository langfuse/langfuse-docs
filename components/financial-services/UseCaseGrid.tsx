import type { LucideIcon } from "lucide-react";
import {
  ClipboardCheck,
  Code2,
  LineChart,
  MessagesSquare,
  Search,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { financialServicesUseCases } from "./content";

const useCaseIcons: Record<
  (typeof financialServicesUseCases)[number]["icon"],
  LucideIcon
> = {
  "shield-check": ShieldCheck,
  search: Search,
  "line-chart": LineChart,
  "clipboard-check": ClipboardCheck,
  "messages-square": MessagesSquare,
  "code-2": Code2,
};

export function UseCaseGrid() {
  return (
    <div className="mt-8 grid gap-2 md:grid-cols-2">
      {financialServicesUseCases.map((useCase, index) => {
        const Icon = useCaseIcons[useCase.icon];
        const inner = (
          <>
            <div className="flex items-start justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
                {String(index + 1).padStart(2, "0")} · {useCase.area}
                {"proof" in useCase && useCase.proof ? (
                  <span className="ml-2 text-text-secondary">
                    {useCase.proof}
                  </span>
                ) : null}
              </p>
              <Icon
                className="h-5 w-5 shrink-0 text-text-secondary"
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
            <h3 className="mt-2 text-[20px] leading-[1.15] text-text-primary">
              {useCase.title}
            </h3>
            <p className="mt-3 text-[13px] leading-[1.45] text-text-secondary">
              {useCase.description}
            </p>
          </>
        );

        const className = cn(
          "block h-full border border-line-structure p-5",
          "featured" in useCase && useCase.featured
            ? "bg-stripe-pattern"
            : "bg-surface-bg",
        );

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
