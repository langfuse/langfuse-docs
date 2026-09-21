"use client";

import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useMemo, useRef } from "react";
import { useWrappedData, type PageData } from "./WrappedDataContext";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { WrappedSection } from "./components/WrappedSection";
import { SectionHeading } from "./components/SectionHeading";
import { HoverStars } from "./components/HoverStars";
import { wordmarkDisplaySize } from "@/components/shared/wordmark";
import { cn } from "@/lib/utils";
import canvaLogo from "../home/img/canva.svg";
import circlebackLogo from "../home/img/circleback.svg";
import freeeLogo from "../home/img/freee.svg";
import huggingfaceLogo from "../home/img/huggingface.svg";
import intuitLogo from "../home/img/intuit.svg";
import khanacademyLogo from "../home/img/khan.svg";
import magicPatternsLogo from "../home/img/magic.svg";
import merckLogo from "../home/img/merck.svg";
import pigmentLogo from "../home/img/pigment.svg";
import rampLogo from "../home/img/ramp.svg";
import samsaraLogo from "../home/img/samsara.svg";
import sumupLogo from "../home/img/sumup.svg";
import tradeRepublicLogo from "../home/img/trade-republic.svg";
import twilioLogo from "../home/img/twilio.svg";

interface CustomerStory {
  route: string;
  frontMatter: {
    title: string;
    customerLogo?: string;
    customerLogoDark?: string;
    customerQuote?: string;
    quoteAuthor?: string;
    quoteRole?: string;
    quoteCompany?: string;
    quoteAuthorImage?: string;
    showInCustomerIndex?: boolean;
  };
}

const companiesWithStories = [
  { name: "Ramp", path: "/users/ramp", logo: rampLogo },
  {
    name: "Trade Republic",
    path: "/users/trade-republic",
    logo: tradeRepublicLogo,
  },
  { name: "Canva", path: "/users/canva", logo: canvaLogo },
  { name: "SumUp", path: "/users/sumup", logo: sumupLogo },
  {
    name: "Khan Academy",
    path: "/users/khan-academy",
    logo: khanacademyLogo,
  },
  {
    name: "Magic Patterns",
    path: "/users/magic-patterns-ai-design-tools",
    logo: magicPatternsLogo,
  },
  {
    name: "Merck",
    path: "/users/merckgroup",
    logo: merckLogo,
  },
  { name: "Hugging Face", path: "/users/hugging-face", logo: huggingfaceLogo },
];

const companiesWithoutStories = [
  { name: "Samsara", logo: samsaraLogo },
  { name: "Twilio", logo: twilioLogo },
  { name: "Pigment", logo: pigmentLogo },
  {
    name: "Intuit",
    logo: intuitLogo,
  },
  {
    name: "Circleback",
    logo: circlebackLogo,
  },
  { name: "freee", logo: freeeLogo },
];

function CustomerStoryCard({
  story,
  logo,
}: {
  story: CustomerStory;
  logo?: StaticImageData;
}) {
  const quote = story.frontMatter.customerQuote?.replace(/^"|"$/g, "");
  const displayLogo = logo ?? story.frontMatter.customerLogo;
  const wordmarkSize = logo ? wordmarkDisplaySize(logo, 32) : null;

  return (
    <Link
      href={story.route}
      className="group relative flex flex-col gap-3 p-5 lg:p-6 h-full min-h-[220px] overflow-hidden no-underline"
    >
      {displayLogo && (
        <div className="flex items-center h-8 shrink-0">
          {logo && wordmarkSize ? (
            <Image
              src={logo}
              alt={`${story.frontMatter.title} logo`}
              width={logo.width}
              height={logo.height}
              unoptimized
              className="h-auto w-auto object-contain"
              style={{
                width: wordmarkSize.width,
                height: wordmarkSize.height,
              }}
              quality={100}
            />
          ) : (
            <Image
              src={story.frontMatter.customerLogo!}
              alt={`${story.frontMatter.title} logo`}
              width={200}
              height={60}
              className="object-contain w-auto max-h-7"
              quality={100}
            />
          )}
        </div>
      )}

      {quote && (
        <blockquote
          className="flex-1 min-h-0 text-[14px] leading-[150%] text-text-secondary line-clamp-4"
          title={quote}
        >
          “{quote}”
        </blockquote>
      )}

      {(story.frontMatter.quoteAuthor ||
        story.frontMatter.quoteRole ||
        story.frontMatter.quoteCompany) && (
        <div className="flex gap-2.5 items-center mt-auto min-w-0">
          {story.frontMatter.quoteAuthorImage && (
            <div className="overflow-hidden shrink-0 w-8 h-8 rounded-full">
              <Image
                src={story.frontMatter.quoteAuthorImage}
                alt=""
                width={32}
                height={32}
                className="object-cover w-full h-full"
                quality={100}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {story.frontMatter.quoteAuthor && (
              <div className="text-[13px] font-medium truncate text-text-primary">
                {story.frontMatter.quoteAuthor}
              </div>
            )}
            {(story.frontMatter.quoteRole ||
              story.frontMatter.quoteCompany) && (
              <div className="text-[12px] truncate text-text-tertiary">
                {story.frontMatter.quoteRole}
                {story.frontMatter.quoteRole &&
                  story.frontMatter.quoteCompany && <span> at </span>}
                {story.frontMatter.quoteCompany}
              </div>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}

function CompanyLogo({ name, logo }: { name: string; logo: StaticImageData }) {
  const { width, height } = wordmarkDisplaySize(logo, 32);

  return (
    <div className="p-4 lg:p-5 flex items-center justify-center min-h-[100px]">
      <Image
        src={logo}
        alt={`${name} logo`}
        width={logo.width}
        height={logo.height}
        unoptimized
        className="h-auto w-auto object-contain"
        style={{ width, height }}
        quality={100}
      />
    </div>
  );
}

type CompanyWithStory = (typeof companiesWithStories)[number];

type CustomerItem =
  | { type: "story"; story: CustomerStory & { company: CompanyWithStory } }
  | { type: "logo"; company: (typeof companiesWithoutStories)[0] }
  | { type: "text"; text: string };

export function Customers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const allStories = useWrappedData().usersPages.filter(
    (page: PageData) => page.frontMatter?.showInCustomerIndex !== false,
  ) as Array<CustomerStory>;

  const customerStories = companiesWithStories
    .map((company) => {
      const story = allStories.find(
        (s) => s.route === company.path || s.route === `${company.path}/`,
      );
      return story ? { ...story, company } : null;
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  const orderedItems = useMemo(() => {
    const storyMap = new Map(
      customerStories.map((story) => [story.company.name, story]),
    );
    const logoMap = new Map(
      companiesWithoutStories.map((company) => [company.name, company]),
    );

    const order: Array<{ type: "story" | "logo" | "text"; name: string }> = [
      { type: "logo", name: "Intuit" },
      { type: "story", name: "Ramp" },
      { type: "story", name: "Canva" },
      { type: "story", name: "SumUp" },
      { type: "logo", name: "Samsara" },
      { type: "logo", name: "Twilio" },
      { type: "story", name: "Hugging Face" },
      { type: "logo", name: "Pigment" },
      { type: "logo", name: "freee" },
      { type: "story", name: "Khan Academy" },
      { type: "logo", name: "Circleback" },
      { type: "text", name: "And thousands more..." },
      { type: "story", name: "Merck" },
      { type: "story", name: "Magic Patterns" },
    ];

    const result: CustomerItem[] = [];
    for (const { type, name } of order) {
      if (type === "story") {
        const story = storyMap.get(name);
        if (story) {
          result.push({ type: "story", story });
        }
      } else if (type === "logo") {
        const company = logoMap.get(name);
        if (company) {
          result.push({ type: "logo", company });
        }
      } else if (type === "text") {
        result.push({ type: "text", text: name });
      }
    }

    return result;
  }, [customerStories]);

  return (
    <WrappedSection>
      <SectionHeading
        id="customers"
        title="Powering the greatest"
        subtitle="We couldn't be prouder to work with these companies."
      />

      <div ref={containerRef}>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-0 -mt-px">
          {orderedItems.map((item, index) => {
            const columns = 3;
            const row = Math.floor(index / columns);
            const col = index % columns;
            const delay = (row + col) * 0.08;

            const animationProps = {
              initial: { opacity: 0, y: 16 },
              animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
              transition: {
                duration: 0.4,
                delay,
                ease: [0.22, 1, 0.36, 1],
              },
            };

            const cellClass = cn(
              "relative border border-line-structure bg-surface-bg break-inside-avoid",
              index === 0 ? "" : "-mt-px -ml-px",
            );

            if (item.type === "story") {
              return (
                <motion.div
                  key={`story-${item.story.route || index}`}
                  className={cn(cellClass, "group")}
                  {...animationProps}
                >
                  <HoverStars />
                  <CustomerStoryCard
                    story={item.story}
                    logo={item.story.company.logo}
                  />
                </motion.div>
              );
            } else if (item.type === "logo") {
              return (
                <motion.div
                  key={`logo-${item.company.name || index}`}
                  className={cn(cellClass, "group")}
                  {...animationProps}
                >
                  <HoverStars />
                  <CompanyLogo {...item.company} />
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  key={`text-${index}`}
                  className={cellClass}
                  {...animationProps}
                >
                  <div className="p-4 lg:p-5 flex items-center justify-center min-h-[100px]">
                    <p className="text-[13px] text-center text-text-tertiary">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            }
          })}
        </div>
      </div>
    </WrappedSection>
  );
}
