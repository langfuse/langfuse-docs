import Image from "next/image";
import { Heading } from "@/components/ui/heading";
import { Authors } from "../Authors";
import {
  CustomerStoryBackNav,
  companyLabelFromLogo,
} from "./CustomerStoryBackNav";

function StoryLogo({
  src,
  srcDark,
  company,
}: {
  src: string;
  srcDark?: string;
  company: string;
}) {
  return (
    <div className="relative h-10 w-40">
      {srcDark ? (
        <>
          <Image
            src={src}
            alt={`${company} logo`}
            fill
            sizes="160px"
            className="object-contain object-left dark:hidden"
            unoptimized
          />
          <Image
            src={srcDark}
            alt={`${company} logo`}
            fill
            sizes="160px"
            className="hidden object-contain object-left dark:block"
            unoptimized
          />
        </>
      ) : (
        <Image
          src={src}
          alt={`${company} logo`}
          fill
          sizes="160px"
          className="object-contain object-left dark:invert dark:brightness-0 dark:contrast-200"
          unoptimized
        />
      )}
    </div>
  );
}

export type CustomerStoryHeaderProps = {
  title: string;
  description?: string;
  date?: string;
  customerLogo: string;
  customerLogoDark?: string;
  authors?: string[];
};

export function CustomerStoryHeader({
  authors = [],
  title,
  description,
  date,
  customerLogo,
  customerLogoDark,
}: CustomerStoryHeaderProps) {
  const company = companyLabelFromLogo(customerLogo);

  return (
    <header className="not-prose my-4 flex flex-col gap-6 md:my-6">
      <CustomerStoryBackNav current={company} />
      {date ? (
        <span className="font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-text-tertiary">
          {date}
        </span>
      ) : null}
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
          <p className="m-0 max-w-[46ch] text-[15px] leading-[1.5] text-pretty text-text-tertiary">
            {description}
          </p>
        ) : null}
      </div>
      {authors.length > 0 ? (
        <Authors authors={authors} className="max-w-none justify-start py-0" />
      ) : null}
    </header>
  );
}
