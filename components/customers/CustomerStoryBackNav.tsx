"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type CustomerStoryNavVariant = "back-link" | "centered" | "breadcrumb";

/** Default while comparing options. Override with `?nav=centered` or `?nav=breadcrumb`. */
const DEFAULT_VARIANT: CustomerStoryNavVariant = "back-link";

const INDEX_HREF = "/users";
const INDEX_LABEL = "Customer stories";

function titleFromSlug(pathname: string): string {
  const slug = pathname.split("/").filter(Boolean).pop() ?? "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function resolveVariant(raw: string | null): CustomerStoryNavVariant {
  if (raw === "back-link" || raw === "centered" || raw === "breadcrumb") {
    return raw;
  }
  return DEFAULT_VARIANT;
}

function BackLink() {
  return (
    <Link
      href={INDEX_HREF}
      className="mb-1 text-[15px] text-text-primary no-underline hover:text-text-secondary hover:no-underline"
    >
      ← Back to customer stories
    </Link>
  );
}

function CenteredLink() {
  return (
    <Link
      href={INDEX_HREF}
      className="inline-flex items-center gap-0.5 text-[13px] font-[430] tracking-[-0.26px] text-text-tertiary no-underline transition-colors hover:text-text-primary hover:no-underline"
    >
      <ChevronLeft className="size-3.5 shrink-0" aria-hidden />
      {INDEX_LABEL}
    </Link>
  );
}

function BreadcrumbTrail({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb">
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

function CustomerStoryBackNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const variant = resolveVariant(searchParams.get("nav"));
  const current = titleFromSlug(pathname ?? "");

  return (
    <div
      className={cn(
        "not-prose",
        variant === "centered" ? "self-center" : "self-start",
      )}
    >
      {variant === "back-link" ? (
        <BackLink />
      ) : variant === "centered" ? (
        <CenteredLink />
      ) : (
        <BreadcrumbTrail current={current} />
      )}
    </div>
  );
}

export function CustomerStoryBackNav() {
  return (
    <Suspense fallback={null}>
      <CustomerStoryBackNavInner />
    </Suspense>
  );
}
