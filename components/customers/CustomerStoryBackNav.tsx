import Link from "next/link";
import { ChevronRight } from "lucide-react";

const INDEX_HREF = "/users";
const INDEX_LABEL = "Customer stories";

const SLUG_LABELS: Record<string, string> = {
  merckgroup: "Merck",
  sumup: "SumUp",
  "magic-patterns-ai-design-tools": "Magic Patterns",
};

export function companyLabelFromLogo(customerLogo: string): string {
  const slug = customerLogo.match(/\/customers\/([^/]+)\//)?.[1] ?? "";
  if (!slug) return "Story";
  if (SLUG_LABELS[slug]) return SLUG_LABELS[slug];
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function CustomerStoryBackNav({ current }: { current: string }) {
  return (
    <nav className="not-prose self-start" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1.5 text-sm text-text-tertiary">
        <li>
          <Link
            href={INDEX_HREF}
            className="truncate no-underline transition-colors hover:text-text-primary hover:no-underline"
          >
            {INDEX_LABEL}
          </Link>
        </li>
        <li aria-hidden>
          <ChevronRight className="size-3.5 shrink-0" />
        </li>
        <li
          className="truncate font-medium text-text-primary"
          aria-current="page"
        >
          {current}
        </li>
      </ol>
    </nav>
  );
}
