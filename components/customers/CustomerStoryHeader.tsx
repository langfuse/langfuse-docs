"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import { Authors } from "../Authors";
import {
  CustomerStoryBackNav,
  companyLabelFromLogo,
} from "./CustomerStoryBackNav";

export const CUSTOMER_STORY_HEADER_VARIANTS = [
  "editorial",
  "masthead",
  "centered",
] as const;

export type CustomerStoryHeaderVariant =
  (typeof CUSTOMER_STORY_HEADER_VARIANTS)[number];

const DEFAULT_VARIANT: CustomerStoryHeaderVariant = "editorial";

function isHeaderVariant(
  value: string | null,
): value is CustomerStoryHeaderVariant {
  return CUSTOMER_STORY_HEADER_VARIANTS.includes(
    value as CustomerStoryHeaderVariant,
  );
}

function StoryLogo({
  src,
  srcDark,
  company,
  align = "left",
  size = "md",
}: {
  src: string;
  srcDark?: string;
  company: string;
  align?: "left" | "center";
  size?: "sm" | "md";
}) {
  const height = size === "sm" ? "h-8" : "h-10";
  const width = size === "sm" ? "w-32" : "w-40";

  return (
    <div
      className={cn("relative", height, width, align === "center" && "mx-auto")}
    >
      {srcDark ? (
        <>
          <Image
            src={src}
            alt={`${company} logo`}
            fill
            sizes="160px"
            className={cn(
              "object-contain",
              align === "center" ? "object-center" : "object-left",
              "dark:hidden",
            )}
            unoptimized
          />
          <Image
            src={srcDark}
            alt={`${company} logo`}
            fill
            sizes="160px"
            className={cn(
              "hidden object-contain dark:block",
              align === "center" ? "object-center" : "object-left",
            )}
            unoptimized
          />
        </>
      ) : (
        <Image
          src={src}
          alt={`${company} logo`}
          fill
          sizes="160px"
          className={cn(
            "object-contain dark:invert dark:brightness-0 dark:contrast-200",
            align === "center" ? "object-center" : "object-left",
          )}
          unoptimized
        />
      )}
    </div>
  );
}

function MetaLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-text-tertiary">
      {children}
    </span>
  );
}

function StoryTag({ tag }: { tag?: string }) {
  if (!tag) return null;
  return (
    <span className="inline-flex w-fit bg-[#FBFF7A] px-2 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-text-primary">
      {tag}
    </span>
  );
}

function EditorialHeader({
  company,
  title,
  description,
  date,
  tag,
  customerLogo,
  customerLogoDark,
  authors,
}: Omit<CustomerStoryHeaderProps, "variant"> & { company: string }) {
  return (
    <div className="not-prose flex flex-col gap-6">
      <CustomerStoryBackNav current={company} />
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <MetaLabel>Customer story</MetaLabel>
        {date ? <MetaLabel>{date}</MetaLabel> : null}
      </div>
      <StoryLogo
        src={customerLogo}
        srcDark={customerLogoDark}
        company={company}
      />
      <div className="flex flex-col gap-4">
        <Heading
          as="h1"
          size="large"
          className="m-0 max-w-[18ch] text-left text-balance"
        >
          {title}
        </Heading>
        {description ? (
          <p className="m-0 max-w-[46ch] text-[15px] leading-[1.5] text-text-tertiary text-pretty">
            {description}
          </p>
        ) : null}
        <StoryTag tag={tag} />
      </div>
      {authors.length > 0 ? (
        <Authors authors={authors} className="max-w-none justify-start py-0" />
      ) : null}
    </div>
  );
}

function MastheadHeader({
  company,
  title,
  description,
  date,
  tag,
  customerLogo,
  customerLogoDark,
  authors,
}: Omit<CustomerStoryHeaderProps, "variant"> & { company: string }) {
  return (
    <div className="not-prose border-y border-line-structure bg-surface-bg -mx-4 px-4 py-8 md:mx-0 md:px-0">
      <CustomerStoryBackNav current={company} />
      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="shrink-0 sm:w-[140px] sm:pt-1">
          <StoryLogo
            src={customerLogo}
            srcDark={customerLogoDark}
            company={company}
            size="sm"
          />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <Heading as="h1" size="large" className="m-0 text-left text-balance">
            {title}
          </Heading>
          {description ? (
            <p className="m-0 max-w-[46ch] text-[15px] leading-[1.5] text-text-tertiary text-pretty">
              {description}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {date ? <MetaLabel>{date}</MetaLabel> : null}
            {date && tag ? (
              <span className="text-text-disabled" aria-hidden>
                ·
              </span>
            ) : null}
            <StoryTag tag={tag} />
          </div>
          {authors.length > 0 ? (
            <Authors
              authors={authors}
              className="max-w-none justify-start py-0"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CenteredHeader({
  company,
  title,
  description,
  date,
  tag,
  customerLogo,
  customerLogoDark,
  authors,
}: Omit<CustomerStoryHeaderProps, "variant"> & { company: string }) {
  return (
    <div className="not-prose flex flex-col gap-5">
      <CustomerStoryBackNav current={company} />
      <div className="flex flex-col items-center text-center">
        <StoryLogo
          src={customerLogo}
          srcDark={customerLogoDark}
          company={company}
          align="center"
        />
        <Heading
          as="h1"
          size="large"
          className="mt-6 mb-0 max-w-[20ch] text-balance"
        >
          {title}
        </Heading>
        {description ? (
          <p className="mt-4 mb-0 max-w-[42ch] text-[15px] leading-[1.5] text-text-tertiary text-pretty">
            {description}
          </p>
        ) : null}
        <div className="mt-5 flex flex-col items-center gap-3">
          <StoryTag tag={tag} />
          {date ? <MetaLabel>{date}</MetaLabel> : null}
        </div>
        {authors.length > 0 ? (
          <Authors authors={authors} className="py-4" />
        ) : null}
      </div>
    </div>
  );
}

export type CustomerStoryHeaderProps = {
  title: string;
  description?: string;
  date?: string;
  tag?: string;
  customerLogo: string;
  customerLogoDark?: string;
  authors?: string[];
  variant?: CustomerStoryHeaderVariant;
};

export function CustomerStoryHeaderView({
  authors = [],
  variant = DEFAULT_VARIANT,
  ...props
}: CustomerStoryHeaderProps) {
  const company = companyLabelFromLogo(props.customerLogo);
  const shared = { ...props, authors, company };

  return (
    <header className="my-4 md:my-6">
      {variant === "masthead" ? (
        <MastheadHeader {...shared} />
      ) : variant === "centered" ? (
        <CenteredHeader {...shared} />
      ) : (
        <EditorialHeader {...shared} />
      )}
    </header>
  );
}

export function CustomerStoryHeader(props: CustomerStoryHeaderProps) {
  const searchParams = useSearchParams();
  const queryVariant = searchParams.get("header");
  const variant = isHeaderVariant(queryVariant)
    ? queryVariant
    : (props.variant ?? DEFAULT_VARIANT);

  return <CustomerStoryHeaderView {...props} variant={variant} />;
}
