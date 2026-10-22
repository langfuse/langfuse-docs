import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  ClipboardCheck,
  ClipboardPen,
  Code2,
  FileText,
  LineChart,
  MessagesSquare,
  Mic,
  Receipt,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { financialServicesUseCases } from "./content";

const useCaseIcons = {
  "shield-check": ShieldCheck,
  search: Search,
  "line-chart": LineChart,
  "clipboard-check": ClipboardCheck,
  "messages-square": MessagesSquare,
  "code-2": Code2,
  calendar: Calendar,
  "file-text": FileText,
  "clipboard-pen": ClipboardPen,
  receipt: Receipt,
  mic: Mic,
  users: Users,
} as const satisfies Record<string, LucideIcon>;

export type IndustryUseCase = {
  area: string;
  title: string;
  icon: keyof typeof useCaseIcons;
  description: string;
  proof?: string;
  featured?: boolean;
  href?: string;
};

export function UseCaseGrid({
  useCases = financialServicesUseCases,
}: {
  useCases?: readonly IndustryUseCase[];
} = {}) {
  return (
    <div className="mt-8 grid gap-2 md:grid-cols-2">
      {useCases.map((useCase) => {
        const Icon = useCaseIcons[useCase.icon];
        const inner = (
          <>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[20px] leading-[1.15] text-text-primary">
                {useCase.title}
              </h3>
              <Icon
                className="h-5 w-5 shrink-0 text-text-secondary"
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
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
